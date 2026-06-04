import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '@/lib/storage';
import {
  validateUploadPayload,
  PayloadError,
  MAX_PAYLOAD_BYTES,
} from '@/lib/design-payload';

/**
 * POST /api/upload-design
 *
 * Body (JSON):
 *   {
 *     designId: string,            // must match JS-CASE-XXXX
 *     previewDataUrl: string,      // data:image/png;base64,...
 *     printDataUrl:   string,      // data:image/png;base64,...
 *     designJson:     object       // { phoneModel, caseColor, objects, createdAt, ... }
 *   }
 *
 * Response:
 *   { designId, previewUrl, printFileUrl, designJsonUrl }
 *
 * Security:
 *   - Only POST is allowed (other verbs return 405).
 *   - Body size is capped (defense against memory abuse).
 *   - Payload is validated & sanitized before anything is stored.
 *   - Errors return safe messages — never internal stack traces.
 */

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    // 1. Size guard — check Content-Length when present.
    const contentLength = Number(req.headers.get('content-length') || 0);
    if (contentLength && contentLength > MAX_PAYLOAD_BYTES) {
      return NextResponse.json({ error: 'Payload too large.' }, { status: 413 });
    }

    // 2. Parse JSON (guarded).
    let raw: unknown;
    try {
      raw = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    // 3. Size guard — fallback when Content-Length is absent/spoofed.
    const approxBytes = JSON.stringify(raw).length;
    if (approxBytes > MAX_PAYLOAD_BYTES) {
      return NextResponse.json({ error: 'Payload too large.' }, { status: 413 });
    }

    // 4. Validate + sanitize.
    let payload;
    try {
      payload = validateUploadPayload(raw);
    } catch (e) {
      const msg = e instanceof PayloadError ? e.message : 'Invalid request.';
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    // 5. Persist via the storage adapter.
    const storage = getStorage();
    const [preview, print, json] = await Promise.all([
      storage.uploadPng(`${payload.designId}/preview.png`, payload.previewDataUrl),
      storage.uploadPng(`${payload.designId}/print.png`, payload.printDataUrl),
      storage.uploadJson(`${payload.designId}/design.json`, payload.designJson),
    ]);

    return NextResponse.json({
      designId: payload.designId,
      previewUrl: preview.url,
      printFileUrl: print.url,
      designJsonUrl: json.url,
    });
  } catch (err) {
    // Never expose internal error details to the client.
    console.error('[upload-design] error:', err);
    return NextResponse.json(
      { error: 'We couldn\u2019t save your design. Please try again.' },
      { status: 500 }
    );
  }
}

// Explicitly reject other methods with 405 + Allow header.
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed.' }, { status: 405, headers: { Allow: 'POST' } });
}
export const PUT = GET;
export const DELETE = GET;
export const PATCH = GET;
