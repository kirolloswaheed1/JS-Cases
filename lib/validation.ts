import type { DesignObject, ImageObject } from './design-types';
import type { PhoneModel } from './phone-models';

export type ValidationLevel = 'error' | 'warning' | 'info';

export interface ValidationIssue {
  level: ValidationLevel;
  code: string;
  message: string;
  objectId?: string;
}

/**
 * Axis-aligned bounding box of an object after scale + rotation.
 * For rotated objects we compute the bounding box of the rotated corners.
 */
function getBoundingBox(obj: DesignObject): { x: number; y: number; w: number; h: number } {
  let w: number;
  let h: number;
  if (obj.type === 'image' || obj.type === 'sticker') {
    w = obj.width * obj.scaleX;
    h = obj.height * obj.scaleY;
  } else {
    w = obj.width * obj.scaleX;
    h = obj.fontSize * 1.2 * obj.scaleY;
  }

  if (obj.rotation === 0) {
    return { x: obj.x, y: obj.y, w, h };
  }

  // Rotation around top-left (Konva default when offset = 0)
  const rad = (obj.rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const corners = [
    { x: 0, y: 0 },
    { x: w, y: 0 },
    { x: w, y: h },
    { x: 0, y: h },
  ].map((p) => ({
    x: obj.x + p.x * cos - p.y * sin,
    y: obj.y + p.x * sin + p.y * cos,
  }));
  const xs = corners.map((c) => c.x);
  const ys = corners.map((c) => c.y);
  return {
    x: Math.min(...xs),
    y: Math.min(...ys),
    w: Math.max(...xs) - Math.min(...xs),
    h: Math.max(...ys) - Math.min(...ys),
  };
}

function rectsIntersect(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number }
): boolean {
  return !(a.x + a.w < b.x || b.x + b.w < a.x || a.y + a.h < b.y || b.y + b.h < a.y);
}

function rectInside(
  inner: { x: number; y: number; w: number; h: number },
  outer: { x: number; y: number; w: number; h: number }
): boolean {
  return (
    inner.x >= outer.x &&
    inner.y >= outer.y &&
    inner.x + inner.w <= outer.x + outer.w &&
    inner.y + inner.h <= outer.y + outer.h
  );
}

export function validateDesign(
  objects: DesignObject[],
  model: PhoneModel
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const camera = {
    x: model.cameraCutout.x,
    y: model.cameraCutout.y,
    w: model.cameraCutout.width,
    h: model.cameraCutout.height,
  };
  const safe = {
    x: model.safeArea.x,
    y: model.safeArea.y,
    w: model.safeArea.width,
    h: model.safeArea.height,
  };

  for (const obj of objects) {
    if (!obj.visible) continue;
    const bb = getBoundingBox(obj);

    // Informational: camera cutout overlap is allowed.
    // The print export masks out the camera area automatically, so anything
    // inside it simply won't be printed — we let the customer know, but never block.
    if (rectsIntersect(bb, camera)) {
      issues.push({
        level: 'info',
        code: 'CAMERA_OVERLAP',
        message: 'Anything inside the camera area will be removed from the final print.',
        objectId: obj.id,
      });
    }

    // Warning: outside safe area
    if (!rectInside(bb, safe)) {
      issues.push({
        level: 'warning',
        code: 'OUTSIDE_SAFE_AREA',
        message: 'Keep important text and faces inside the safe area.',
        objectId: obj.id,
      });
    }

    // Warning: low-resolution image scaled too large
    if (obj.type === 'image') {
      const img = obj as ImageObject;
      // Rendered size at print scale should not exceed the natural pixel count by > 1.5x
      // (i.e. don't upscale a small image too aggressively)
      const renderedW = img.width * img.scaleX;
      const renderedH = img.height * img.scaleY;
      const upscale = Math.max(renderedW / img.naturalWidth, renderedH / img.naturalHeight);
      // Note: width/height stored are already display-sized; if naturalWidth equals
      // the stored width, upscale === scaleX. We flag when the original source is below
      // a reasonable DPI for the rendered area on print.
      if (img.naturalWidth < 800 && upscale > 1.2) {
        issues.push({
          level: 'warning',
          code: 'LOW_RESOLUTION',
          message: 'This image may look blurry when printed. Try uploading a higher quality version.',
          objectId: img.id,
        });
      }
    }
  }

  return issues;
}

export function hasBlockingErrors(issues: ValidationIssue[]): boolean {
  return issues.some((i) => i.level === 'error');
}
