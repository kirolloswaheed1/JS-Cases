/**
 * Design object types — everything the customer can place on a case.
 * Each object stores its position/size in the editor's canvas coordinate space.
 * Export scales by (print.width / canvas.width) to produce print-ready output.
 */

export type DesignObjectBase = {
  id: string;
  name: string;
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
  locked: boolean;
  visible: boolean;
};

export type ImageObject = DesignObjectBase & {
  type: 'image';
  src: string;        // data URL or hosted URL
  width: number;      // natural width (px)
  height: number;     // natural height (px)
  naturalWidth: number; // real source pixel width — used for resolution warning
  naturalHeight: number;
};

export type TextObject = DesignObjectBase & {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  fill: string;
  align: 'left' | 'center' | 'right';
  fontStyle: 'normal' | 'bold' | 'italic' | 'bold italic';
  letterSpacing: number;
  width: number;     // text box width
};

/**
 * Sticker = an inline SVG asset from `lib/assets-library.ts`.
 * We store the assetId + category so the design JSON is portable, and the
 * fill color so it can be re-tinted without re-loading the catalog.
 */
export type StickerObject = DesignObjectBase & {
  type: 'sticker';
  assetId: string;
  categoryId: string;
  width: number;
  height: number;
  fill: string;
};

export type DesignObject = ImageObject | TextObject | StickerObject;

export interface DesignState {
  modelId: string;
  caseColor: string;       // hex
  backgroundColor: string; // hex, transparent allowed via 'transparent'
  objects: DesignObject[];
  selectedId: string | null;
}
