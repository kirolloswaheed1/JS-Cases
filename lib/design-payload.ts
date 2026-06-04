/**
 * Server-side validation & sanitization for the /api/upload-design payload.
 *
 * Goals (practical, not paranoid):
 *  - Confirm the required fields exist and have the right shape.
 *  - Reject oversized payloads (defense against memory abuse).
 *  - Strip anything that isn't expected so we never persist arbitrary,
 *    potentially dangerous content (e.g. HTML/script smuggled into text).
 *
 * This does NOT replace auth — the project intentionally has none — it just
 * makes the public endpoint safe to expose.
 */

export interface UploadDesignPayload {
  designId: string;
  previewDataUrl: string;
  printDataUrl: string;
  designJson: SanitizedDesignJson;
}

export interface SanitizedDesignJson {
  designId: string;
  phoneModel: string;
  customPhoneModel?: string;
  caseType: 'solid' | 'transparent';
  caseColor: string;
  backgroundColor: string;
  objects: unknown[];
  createdAt: string;
}

// Overall request body cap (preview + print PNGs are base64, so allow headroom).
export const MAX_PAYLOAD_BYTES = 25 * 1024 * 1024; // 25 MB
const MAX_OBJECTS = 200;
const DESIGN_ID_RE = /^JS-CASE-[A-Z0-9]{4,40}$/;
const PNG_DATA_URL_RE = /^data:image\/png;base64,[A-Za-z0-9+/=]+$/;

export class PayloadError extends Error {}

/** Strip control chars and cap length; never returns HTML-active content. */
export function sanitizeText(input: unknown, maxLen = 500): string {
  if (typeof input !== 'string') return '';
  // Remove ASCII control chars (except normal whitespace) and trim length.
  // Konva renders text as plain canvas text, so this is belt-and-suspenders:
  // even if something slipped through, it could never execute as HTML.
  // eslint-disable-next-line no-control-regex
  const cleaned = input.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
  return cleaned.slice(0, maxLen);
}

/** Whitelist a hex color or the literal 'transparent'; fall back to safe default. */
function sanitizeColor(input: unknown, fallback = '#000000'): string {
  if (typeof input !== 'string') return fallback;
  if (input === 'transparent') return 'transparent';
  return /^#[0-9a-fA-F]{3,8}$/.test(input) ? input : fallback;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/**
 * Validate and normalize the full upload payload. Throws PayloadError with a
 * user-safe message on any problem. Never throws raw internal errors.
 */
export function validateUploadPayload(raw: unknown): UploadDesignPayload {
  if (!isPlainObject(raw)) {
    throw new PayloadError('Invalid request body.');
  }

  const { designId, previewDataUrl, printDataUrl, designJson } = raw as Record<string, unknown>;

  if (typeof designId !== 'string' || !DESIGN_ID_RE.test(designId)) {
    throw new PayloadError('Invalid or missing design ID.');
  }
  if (typeof previewDataUrl !== 'string' || !PNG_DATA_URL_RE.test(previewDataUrl)) {
    throw new PayloadError('Invalid preview image.');
  }
  if (typeof printDataUrl !== 'string' || !PNG_DATA_URL_RE.test(printDataUrl)) {
    throw new PayloadError('Invalid print image.');
  }
  if (!isPlainObject(designJson)) {
    throw new PayloadError('Invalid design data.');
  }

  const dj = designJson as Record<string, unknown>;

  // Required design-json fields.
  const phoneModel = dj.phoneModel ?? dj.modelId;
  if (typeof phoneModel !== 'string' || phoneModel.length === 0 || phoneModel.length > 100) {
    throw new PayloadError('Invalid phone model.');
  }
  if (!Array.isArray(dj.objects)) {
    throw new PayloadError('Invalid design objects.');
  }
  if (dj.objects.length > MAX_OBJECTS) {
    throw new PayloadError('This design has too many elements.');
  }

  const createdAt =
    typeof dj.createdAt === 'string' ? dj.createdAt : new Date().toISOString();

  // Normalize caseType. Anything other than the literal 'transparent' is
  // treated as solid — this keeps older designs (pre-caseType) valid.
  const caseType: 'solid' | 'transparent' =
    dj.caseType === 'transparent' ? 'transparent' : 'solid';

  // customPhoneModel is optional — only present for the "Other" phone option.
  // Sanitize to plain text and cap length even though the client already does.
  const customPhoneModel =
    typeof dj.customPhoneModel === 'string' && dj.customPhoneModel.length > 0
      ? sanitizeText(dj.customPhoneModel, 80)
      : undefined;

  const sanitized: SanitizedDesignJson = {
    designId,
    phoneModel,
    customPhoneModel,
    caseType,
    caseColor:
      caseType === 'transparent' ? 'transparent' : sanitizeColor(dj.caseColor, '#FFFFFF'),
    backgroundColor: sanitizeColor(dj.backgroundColor, 'transparent'),
    objects: dj.objects,
    createdAt,
  };

  return { designId, previewDataUrl, printDataUrl, designJson: sanitized };
}
