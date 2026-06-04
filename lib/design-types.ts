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
  /**
   * Text layout mode:
   *   - 'horizontal': single-line, normal flow (default).
   *   - 'multiline':  honors line breaks the user typed (`\n`).
   *   - 'stacked':    one character per line, so "HELLO" reads vertically.
   * Original `text` is always preserved as the user typed it; the renderer
   * derives the displayed string from this layout flag at draw time.
   */
  textLayout: 'horizontal' | 'multiline' | 'stacked';
  lineHeight: number; // multiplier, e.g. 1.0, 1.2, 1.5
};

/**
 * Sticker = a PNG image asset from `lib/assets-library.ts`.
 * We persist the assetId + category so the design JSON stays portable across
 * catalog edits, and a snapshot of the `src` so old designs still render if
 * an asset is later removed from the catalog.
 */
export type StickerObject = DesignObjectBase & {
  type: 'sticker';
  assetId: string;
  categoryId: string;
  src: string;
  width: number;
  height: number;
};

export type DesignObject = ImageObject | TextObject | StickerObject;

export interface DesignState {
  modelId: string;
  /** 'solid' = use caseColor, 'transparent' = clear / no fill. */
  caseType: 'solid' | 'transparent';
  caseColor: string;       // hex (ignored when caseType === 'transparent')
  backgroundColor: string; // hex, transparent allowed via 'transparent'
  objects: DesignObject[];
  selectedId: string | null;
  /** Custom phone model name when modelId === 'other'. */
  customPhoneModel?: string;
}
