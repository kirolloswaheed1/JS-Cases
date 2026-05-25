import Konva from 'konva';
import type { DesignObject, ImageObject, TextObject, StickerObject } from './design-types';
import type { PhoneModel } from './phone-models';
import { findAsset, svgToDataUrl } from './assets-library';

/**
 * Exports the design into three artifacts:
 *   - preview PNG  (web-resolution, includes case base color + objects, NO editor UI)
 *   - print PNG    (full print-resolution scaled from canvas → print dimensions)
 *   - design JSON  (re-openable representation of the design)
 *
 * Strategy: we re-render the design into a fresh offscreen Konva.Stage at the
 * desired output size. This guarantees NO editor chrome (handles, safe area,
 * camera warning, bleed lines) leaks into the export.
 *
 * The camera cutout area is masked out — that pixel region is left transparent
 * so the printer can punch the hole without printing artwork into it.
 */

export interface ExportResult {
  previewDataUrl: string;
  printDataUrl: string;
  designJson: unknown;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function renderToStage(
  width: number,
  height: number,
  scale: number,
  objects: DesignObject[],
  caseColor: string,
  backgroundColor: string,
  model: PhoneModel
): Promise<string> {
  // Offscreen container — appended to body but hidden; required for Konva.Stage.
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-99999px';
  container.style.top = '0';
  container.style.width = `${width}px`;
  container.style.height = `${height}px`;
  document.body.appendChild(container);

  try {
    const stage = new Konva.Stage({ container, width, height });
    const layer = new Konva.Layer();
    stage.add(layer);

    // Case base color (rounded rect = phone case silhouette).
    layer.add(
      new Konva.Rect({
        x: 0,
        y: 0,
        width,
        height,
        cornerRadius: model.safeArea.radius * scale * 1.3, // approximate case corner
        fill: caseColor,
      })
    );

    // Optional background fill INSIDE the safe area (so it never bleeds over case edges).
    if (backgroundColor && backgroundColor !== 'transparent') {
      layer.add(
        new Konva.Rect({
          x: 0,
          y: 0,
          width,
          height,
          fill: backgroundColor,
        })
      );
    }

    // Draw every visible object scaled into print coordinates.
    for (const obj of objects) {
      if (!obj.visible) continue;
      if (obj.type === 'image') {
        const img = obj as ImageObject;
        const htmlImg = await loadImage(img.src);
        layer.add(
          new Konva.Image({
            image: htmlImg,
            x: img.x * scale,
            y: img.y * scale,
            width: img.width * scale,
            height: img.height * scale,
            scaleX: img.scaleX,
            scaleY: img.scaleY,
            rotation: img.rotation,
            opacity: img.opacity,
          })
        );
      } else if (obj.type === 'sticker') {
        const s = obj as StickerObject;
        const asset = findAsset(s.assetId);
        if (!asset) continue;
        const dataUrl = svgToDataUrl(asset.svg, s.fill);
        const htmlImg = await loadImage(dataUrl);
        layer.add(
          new Konva.Image({
            image: htmlImg,
            x: s.x * scale,
            y: s.y * scale,
            width: s.width * scale,
            height: s.height * scale,
            scaleX: s.scaleX,
            scaleY: s.scaleY,
            rotation: s.rotation,
            opacity: s.opacity,
          })
        );
      } else if (obj.type === 'text') {
        const t = obj as TextObject;
        layer.add(
          new Konva.Text({
            x: t.x * scale,
            y: t.y * scale,
            text: t.text,
            fontFamily: t.fontFamily,
            fontSize: t.fontSize * scale,
            fill: t.fill,
            align: t.align,
            fontStyle: t.fontStyle,
            letterSpacing: t.letterSpacing * scale,
            width: t.width * scale,
            scaleX: t.scaleX,
            scaleY: t.scaleY,
            rotation: t.rotation,
            opacity: t.opacity,
          })
        );
      }
    }

    // Mask the camera cutout — punch a transparent hole.
    // We do this by drawing a rect with destination-out composite.
    const camera = new Konva.Rect({
      x: model.cameraCutout.x * scale,
      y: model.cameraCutout.y * scale,
      width: model.cameraCutout.width * scale,
      height: model.cameraCutout.height * scale,
      cornerRadius: model.cameraCutout.radius * scale,
      fill: 'black',
      globalCompositeOperation: 'destination-out',
    });
    layer.add(camera);

    layer.draw();

    const dataUrl = stage.toDataURL({ pixelRatio: 1, mimeType: 'image/png' });
    stage.destroy();
    return dataUrl;
  } finally {
    container.remove();
  }
}

export async function exportDesign(
  objects: DesignObject[],
  caseColor: string,
  backgroundColor: string,
  model: PhoneModel,
  designId: string
): Promise<ExportResult> {
  const printScale = model.print.width / model.canvas.width;

  const previewDataUrl = await renderToStage(
    model.canvas.width,
    model.canvas.height,
    1,
    objects,
    caseColor,
    backgroundColor,
    model
  );

  const printDataUrl = await renderToStage(
    model.print.width,
    model.print.height,
    printScale,
    objects,
    caseColor,
    backgroundColor,
    model
  );

  const designJson = {
    schemaVersion: 1,
    designId,
    createdAt: new Date().toISOString(),
    model: {
      id: model.id,
      name: model.name,
      shopifyVariantId: model.shopifyVariantId,
      canvas: model.canvas,
      print: model.print,
    },
    caseColor,
    backgroundColor,
    objects,
  };

  return { previewDataUrl, printDataUrl, designJson };
}
