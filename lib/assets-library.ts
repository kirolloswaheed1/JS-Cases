/**
 * Assets / stickers library.
 *
 * Each sticker is an inline SVG string. Use `currentColor` for the fill where
 * you want the sticker to be tintable — at render time we wrap it in a
 * coloured group, and the color picker sets the fill.
 *
 * To add a new sticker: paste an SVG into the right category's `assets` array.
 * To add a new category: append a new entry to ASSET_CATEGORIES.
 *
 * Keep SVGs small and on a 24×24 viewBox so they render cleanly on the case.
 * The renderer scales them to whatever size the user drops them in at.
 */

export interface AssetItem {
  id: string;
  name: string;
  /** Raw SVG markup. Use currentColor for the recolorable parts. */
  svg: string;
  /** Default color when first added to the canvas. */
  defaultColor?: string;
}

export interface AssetCategory {
  id: string;
  name: string;
  assets: AssetItem[];
}

/* Helper: wraps a path/shape in a 24×24 viewBox SVG. */
const wrap = (inner: string, viewBox = '0 0 24 24') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="currentColor">${inner}</svg>`;

// ----------------------------- Hearts -------------------------------------

const HEARTS: AssetItem[] = [
  {
    id: 'heart-solid',
    name: 'Heart',
    defaultColor: '#FF4D8D',
    svg: wrap(
      `<path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6.5 5.5 5.5 0 0 1 21.5 12c-2.5 4.5-9.5 9-9.5 9z"/>`
    ),
  },
  {
    id: 'heart-outline',
    name: 'Heart Outline',
    defaultColor: '#FF4D8D',
    svg: wrap(
      `<path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M12 20s-6.5-4.2-9-8.2A5 5 0 0 1 12 7a5 5 0 0 1 9 4.8C18.5 15.8 12 20 12 20z"/>`
    ),
  },
  {
    id: 'heart-double',
    name: 'Double Heart',
    defaultColor: '#FF4D8D',
    svg: wrap(
      `<path d="M8 16s-5-3-5-7a3 3 0 0 1 5-2.2A3 3 0 0 1 13 9c0 4-5 7-5 7z"/><path opacity=".6" d="M16 20s-5-3-5-7a3 3 0 0 1 5-2.2A3 3 0 0 1 21 13c0 4-5 7-5 7z"/>`
    ),
  },
  {
    id: 'heart-cracked',
    name: 'Broken Heart',
    defaultColor: '#FF4D8D',
    svg: wrap(
      `<path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 11 6.4l-1 3 2 2-1.5 2.5L12 16l1-3-2-2 1.5-2.5L12 6.5A5.5 5.5 0 0 1 21.5 12c-2.5 4.5-9.5 9-9.5 9z"/>`
    ),
  },
  {
    id: 'heart-arrow',
    name: 'Heart Arrow',
    defaultColor: '#FF4D8D',
    svg: wrap(
      `<path d="M12 20s-7-4.5-9-8.5a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4-9 8.5-9 8.5z"/><path fill="none" stroke="#222" stroke-width="1.5" d="M3 5l18 14M3 5l3 .5M3 5l.5 3M21 19l-3-.5M21 19l-.5-3"/>`
    ),
  },
  {
    id: 'heart-pixel',
    name: 'Pixel Heart',
    defaultColor: '#FF4D8D',
    svg: wrap(
      `<path d="M6 6h3v3H6zM9 9h3v3H9zM12 9h3v3h-3zM15 6h3v3h-3zM6 9h3v3H6zM18 9h3v3h-3zM9 12h3v3H9zM12 12h3v3h-3zM15 12h3v3h-3zM6 12h3v3H6zM18 12h3v3h-3zM9 15h3v3H9zM12 15h3v3h-3zM15 15h3v3h-3z"/>`
    ),
  },
  {
    id: 'heart-small-cluster',
    name: 'Heart Cluster',
    defaultColor: '#FF4D8D',
    svg: wrap(
      `<path d="M6 10s-3-1.7-3-4a2 2 0 0 1 3-1.4A2 2 0 0 1 9 6c0 2.3-3 4-3 4z"/><path opacity=".7" d="M14 14s-3-1.7-3-4a2 2 0 0 1 3-1.4A2 2 0 0 1 17 10c0 2.3-3 4-3 4z"/><path opacity=".4" d="M10 22s-3-1.7-3-4a2 2 0 0 1 3-1.4A2 2 0 0 1 13 18c0 2.3-3 4-3 4z"/>`
    ),
  },
  {
    id: 'heart-eyes',
    name: 'Heart Beam',
    defaultColor: '#FF4D8D',
    svg: wrap(
      `<path d="M12 20s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6.5 5.5 5.5 0 0 1 21.5 11c-2.5 4.5-9.5 9-9.5 9z"/><circle cx="9" cy="10" r="1" fill="#fff"/><circle cx="15" cy="10" r="1" fill="#fff"/>`
    ),
  },
];

// ----------------------------- Stars --------------------------------------

const STARS: AssetItem[] = [
  {
    id: 'star-classic',
    name: 'Star',
    defaultColor: '#FFD84D',
    svg: wrap(
      `<path d="M12 2l2.8 6.5L22 9.3l-5.4 4.9 1.7 7L12 17.8 5.7 21.2l1.7-7L2 9.3l7.2-.8z"/>`
    ),
  },
  {
    id: 'star-sparkle',
    name: 'Sparkle',
    defaultColor: '#FFD84D',
    svg: wrap(
      `<path d="M12 2c1 5 5 9 10 10-5 1-9 5-10 10-1-5-5-9-10-10 5-1 9-5 10-10z"/>`
    ),
  },
  {
    id: 'star-4pt',
    name: '4-Point Star',
    defaultColor: '#FFD84D',
    svg: wrap(
      `<path d="M12 2l2 8 8 2-8 2-2 8-2-8-8-2 8-2z"/>`
    ),
  },
  {
    id: 'star-burst',
    name: 'Burst',
    defaultColor: '#FFD84D',
    svg: wrap(
      `<path d="M12 1l1.5 5L18 3l-1.5 5L21 7l-3.5 4L23 13l-5 1.5L21 19l-5-1.5L17 23l-4-3.5L12 23l-1-3.5L7 23l1-4.5L3 19l3.5-4L1 13l5-1.5L3 7l5 1L7 3l4 3z"/>`
    ),
  },
  {
    id: 'star-shooting',
    name: 'Shooting Star',
    defaultColor: '#FFD84D',
    svg: wrap(
      `<path d="M16 4l2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1z"/><path opacity=".5" d="M3 21l6-4-1 2z"/>`
    ),
  },
  {
    id: 'star-tiny-trio',
    name: 'Star Trio',
    defaultColor: '#FFD84D',
    svg: wrap(
      `<path d="M6 4l1 2 2 .3-1.4 1.4.3 2-1.9-1-1.9 1 .3-2L3 6.3 5 6z"/><path opacity=".7" d="M18 10l1 2 2 .3-1.4 1.4.3 2-1.9-1-1.9 1 .3-2L15 12.3l2-.3z"/><path opacity=".5" d="M10 16l1 2 2 .3-1.4 1.4.3 2-1.9-1-1.9 1 .3-2L7 18.3l2-.3z"/>`
    ),
  },
  {
    id: 'star-outline',
    name: 'Star Outline',
    defaultColor: '#FFD84D',
    svg: wrap(
      `<path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M12 3l2.6 6 6.4.6-5 4.4 1.5 6.4L12 17l-5.5 3.4L8 14l-5-4.4L9.4 9z"/>`
    ),
  },
  {
    id: 'star-glitter',
    name: 'Glitter',
    defaultColor: '#FFD84D',
    svg: wrap(
      `<path d="M12 3v6M12 15v6M3 12h6M15 12h6M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4"/><path d="M12 8c1 2 2 3 4 4-2 1-3 2-4 4-1-2-2-3-4-4 2-1 3-2 4-4z"/>`
    ),
  },
];

// ----------------------------- Bows ---------------------------------------

const BOWS: AssetItem[] = [
  {
    id: 'bow-classic',
    name: 'Ribbon Bow',
    defaultColor: '#FF4D8D',
    svg: wrap(
      `<path d="M12 12l-6-4c-2 0-3 1.5-3 4s1 4 3 4l6-4zm0 0l6-4c2 0 3 1.5 3 4s-1 4-3 4l-6-4z"/><rect x="10" y="10" width="4" height="4" rx="1"/>`
    ),
  },
  {
    id: 'bow-tied',
    name: 'Tied Bow',
    defaultColor: '#FF4D8D',
    svg: wrap(
      `<path d="M12 12L4 6v12zM12 12l8-6v12z"/><path d="M11 10h2v4h-2z"/><path opacity=".5" d="M10 16l-3 4M14 16l3 4"/>`
    ),
  },
  {
    id: 'bow-cute',
    name: 'Cute Bow',
    defaultColor: '#FF4D8D',
    svg: wrap(
      `<path d="M12 12C8 8 4 9 4 12s4 4 8 0c4 4 8 3 8 0s-4-4-8 0z"/><circle cx="12" cy="12" r="1.5" fill="#fff"/>`
    ),
  },
  {
    id: 'bow-coquette',
    name: 'Coquette Bow',
    defaultColor: '#FFC7DA',
    svg: wrap(
      `<path d="M12 12L3 9l1 6 8-3zm0 0l9-3-1 6-8-3z"/><path d="M11.2 11h1.6v2.4h-1.6z"/><path opacity=".7" d="M10 14l-2 5h2zM14 14l2 5h-2z"/>`
    ),
  },
  {
    id: 'bow-double',
    name: 'Double Bow',
    defaultColor: '#FF4D8D',
    svg: wrap(
      `<path opacity=".5" d="M12 10L5 7v6zM12 10l7-3v6z"/><path d="M12 14L7 12v4zM12 14l5-2v4z"/><circle cx="12" cy="13" r="1"/>`
    ),
  },
  {
    id: 'bow-mini',
    name: 'Mini Bow',
    defaultColor: '#FF4D8D',
    svg: wrap(
      `<path d="M12 12L7 10v4zM12 12l5-2v4z"/><circle cx="12" cy="12" r="1.2"/>`
    ),
  },
];

// ----------------------------- Butterflies --------------------------------

const BUTTERFLIES: AssetItem[] = [
  {
    id: 'butterfly-classic',
    name: 'Butterfly',
    defaultColor: '#C8B6FF',
    svg: wrap(
      `<path d="M12 12s-4-6-8-4 0 8 4 8c2 0 4-4 4-4zm0 0s4-6 8-4 0 8-4 8c-2 0-4-4-4-4z"/><path stroke="#000" stroke-width="1" d="M12 6v12"/>`
    ),
  },
  {
    id: 'butterfly-fly',
    name: 'Butterfly Fly',
    defaultColor: '#FF4D8D',
    svg: wrap(
      `<path d="M12 10C8 6 4 6 4 10s4 4 8 0c4 4 8 4 8 0s-4-4-8 0z"/><path d="M12 14c-3 4-7 4-7 0s3-3 7 0c4-3 7-3 7 0s-4 4-7 0z"/><circle cx="12" cy="12" r="1"/>`
    ),
  },
  {
    id: 'butterfly-mini',
    name: 'Mini Butterfly',
    defaultColor: '#A0D8F1',
    svg: wrap(
      `<path d="M12 12s-3-3-5-2 0 4 2 4 3-2 3-2zm0 0s3-3 5-2 0 4-2 4-3-2-3-2z"/>`
    ),
  },
  {
    id: 'butterfly-trio',
    name: 'Butterfly Trio',
    defaultColor: '#FF4D8D',
    svg: wrap(
      `<path d="M6 6s-2-2-3-1 0 2 1 2 2-1 2-1zm0 0s2-2 3-1 0 2-1 2-2-1-2-1z"/><path opacity=".6" d="M14 12s-2-2-3-1 0 2 1 2 2-1 2-1zm0 0s2-2 3-1 0 2-1 2-2-1-2-1z"/><path opacity=".3" d="M8 18s-2-2-3-1 0 2 1 2 2-1 2-1zm0 0s2-2 3-1 0 2-1 2-2-1-2-1z"/>`
    ),
  },
  {
    id: 'butterfly-outline',
    name: 'Outline Butterfly',
    defaultColor: '#C8B6FF',
    svg: wrap(
      `<path fill="none" stroke="currentColor" stroke-width="1.5" d="M12 12s-4-5-7-3 0 7 3 7c2 0 4-4 4-4zm0 0s4-5 7-3 0 7-3 7c-2 0-4-4-4-4zM12 6v12"/>`
    ),
  },
];

// ----------------------------- Flames -------------------------------------

const FLAMES: AssetItem[] = [
  {
    id: 'flame-classic',
    name: 'Flame',
    defaultColor: '#E63946',
    svg: wrap(
      `<path d="M12 2c2 4-2 6 0 9 2-1 2-3 2-3s2 3 2 6a6 6 0 1 1-12 0c0-4 4-5 4-9 0 2 2 2 4-3z"/>`
    ),
  },
  {
    id: 'flame-tall',
    name: 'Tall Flame',
    defaultColor: '#FFD84D',
    svg: wrap(
      `<path d="M12 1c1 3-2 5 0 8 3-1 2-4 2-4s3 4 3 8a5 5 0 1 1-10 0c0-4 3-5 3-8 0 2 1 2 2-4z"/>`
    ),
  },
  {
    id: 'flame-mini',
    name: 'Mini Flame',
    defaultColor: '#E63946',
    svg: wrap(
      `<path d="M12 6c1 2-1 3 0 5 1-1 1-1 1-1s1 2 1 3a3 3 0 1 1-6 0c0-2 2-2 2-4 0 1 1 1 2-3z"/>`
    ),
  },
  {
    id: 'flame-blue',
    name: 'Cool Flame',
    defaultColor: '#A0D8F1',
    svg: wrap(
      `<path d="M12 3c1 3-1 5 0 7 2-1 2-2 2-2s2 2 2 5a5 5 0 1 1-10 0c0-3 3-4 3-7 0 1 1 1 3-3z"/><path opacity=".5" fill="#fff" d="M12 11c1 2 0 4 0 6 1-1 1-3 1-3s1 2 0 4z"/>`
    ),
  },
  {
    id: 'flame-trio',
    name: 'Flame Trio',
    defaultColor: '#E63946',
    svg: wrap(
      `<path d="M6 8c.5 2-1 3 0 4 1-.5 1-1 1-1s1 1 1 3a2 2 0 1 1-4 0c0-2 1-2 1-3 0 1 .5 1 1-3z"/><path d="M12 4c1 3-1 5 0 7 2-1 2-2 2-2s2 2 2 5a4 4 0 1 1-8 0c0-3 3-4 3-7 0 1 1 1 1-3z"/><path opacity=".7" d="M18 9c.5 2-1 3 0 4 1-.5 1-1 1-1s1 1 1 3a2 2 0 1 1-4 0c0-2 1-2 1-3 0 1 .5 1 1-3z"/>`
    ),
  },
];

// ----------------------------- Sparkles -----------------------------------

const SPARKLES: AssetItem[] = [
  {
    id: 'sparkle-4pt',
    name: 'Sparkle',
    defaultColor: '#FFD84D',
    svg: wrap(
      `<path d="M12 2c1 5 5 9 10 10-5 1-9 5-10 10-1-5-5-9-10-10 5-1 9-5 10-10z"/>`
    ),
  },
  {
    id: 'sparkle-mini',
    name: 'Mini Sparkle',
    defaultColor: '#FFD84D',
    svg: wrap(
      `<path d="M12 6c.5 2.5 2.5 4.5 5 5-2.5.5-4.5 2.5-5 5-.5-2.5-2.5-4.5-5-5 2.5-.5 4.5-2.5 5-5z"/>`
    ),
  },
  {
    id: 'sparkle-cluster',
    name: 'Sparkle Cluster',
    defaultColor: '#FFD84D',
    svg: wrap(
      `<path d="M6 4c.5 2 2 3 4 3-2 .5-3.5 2-4 4-.5-2-2-3.5-4-4 2-.5 3.5-2 4-3z"/><path opacity=".7" d="M16 10c.5 2 2 3 4 3-2 .5-3.5 2-4 4-.5-2-2-3.5-4-4 2-.5 3.5-2 4-3z"/><path opacity=".5" d="M10 16c.3 1.5 1.5 2.5 3 3-1.5.3-2.7 1.5-3 3-.3-1.5-1.5-2.7-3-3 1.5-.3 2.7-1.5 3-3z"/>`
    ),
  },
  {
    id: 'sparkle-plus',
    name: 'Plus Sparkle',
    defaultColor: '#FF4D8D',
    svg: wrap(
      `<path d="M12 2v8M12 14v8M2 12h8M14 12h8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>`
    ),
  },
  {
    id: 'sparkle-dust',
    name: 'Dust',
    defaultColor: '#FFD84D',
    svg: wrap(
      `<circle cx="5" cy="5" r="1"/><circle cx="12" cy="3" r=".7"/><circle cx="19" cy="6" r="1.2"/><circle cx="4" cy="14" r=".8"/><circle cx="20" cy="15" r="1"/><circle cx="9" cy="20" r="1.1"/><circle cx="17" cy="21" r=".6"/><circle cx="13" cy="11" r="1.3"/>`
    ),
  },
  {
    id: 'sparkle-cross',
    name: 'Cross Sparkle',
    defaultColor: '#A0D8F1',
    svg: wrap(
      `<path d="M12 3l1 8 8 1-8 1-1 8-1-8-8-1 8-1z"/>`
    ),
  },
];

// ----------------------------- Smileys ------------------------------------

const SMILEYS: AssetItem[] = [
  {
    id: 'smile-classic',
    name: 'Happy',
    defaultColor: '#FFD84D',
    svg: wrap(
      `<circle cx="12" cy="12" r="10"/><circle cx="9" cy="10" r="1.3" fill="#000"/><circle cx="15" cy="10" r="1.3" fill="#000"/><path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="#000" stroke-width="1.5" fill="none" stroke-linecap="round"/>`
    ),
  },
  {
    id: 'smile-wink',
    name: 'Wink',
    defaultColor: '#FFD84D',
    svg: wrap(
      `<circle cx="12" cy="12" r="10"/><circle cx="9" cy="10" r="1.3" fill="#000"/><path d="M14 10c.7 0 1.3-.4 1.5-1M14.5 10.5c.5.3 1 .2 1.5-.2" stroke="#000" stroke-width="1.2" fill="none"/><path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="#000" stroke-width="1.5" fill="none" stroke-linecap="round"/>`
    ),
  },
  {
    id: 'smile-hearts',
    name: 'In Love',
    defaultColor: '#FFD84D',
    svg: wrap(
      `<circle cx="12" cy="12" r="10"/><path fill="#FF4D8D" d="M9 9s-1.5-1-2.5 0S6 11 9 12c3-1 3.5-2 2.5-3S9 9 9 9zM15 9s-1.5-1-2.5 0-.5 2 2.5 3c3-1 3.5-2 2.5-3S15 9 15 9z"/><path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="#000" stroke-width="1.5" fill="none" stroke-linecap="round"/>`
    ),
  },
  {
    id: 'smile-cool',
    name: 'Cool',
    defaultColor: '#FFD84D',
    svg: wrap(
      `<circle cx="12" cy="12" r="10"/><rect x="6" y="8" width="5" height="4" rx="1" fill="#000"/><rect x="13" y="8" width="5" height="4" rx="1" fill="#000"/><path d="M11 10h2" stroke="#000" stroke-width="1"/><path d="M9 15s1.5 1.5 3 1.5 3-1.5 3-1.5" stroke="#000" stroke-width="1.5" fill="none" stroke-linecap="round"/>`
    ),
  },
  {
    id: 'smile-cry',
    name: 'Tears of Joy',
    defaultColor: '#FFD84D',
    svg: wrap(
      `<circle cx="12" cy="12" r="10"/><path d="M6 10c1-1 3-1 4 0M14 10c1-1 3-1 4 0" stroke="#000" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M8 14h8a3 3 0 0 1-8 0z" fill="#000"/><path fill="#A0D8F1" d="M6 11s-1 3 0 4 2 0 1-4zM18 11s1 3 0 4-2 0-1-4z"/>`
    ),
  },
  {
    id: 'smile-blush',
    name: 'Blush',
    defaultColor: '#FFD84D',
    svg: wrap(
      `<circle cx="12" cy="12" r="10"/><circle cx="9" cy="10" r="1" fill="#000"/><circle cx="15" cy="10" r="1" fill="#000"/><circle cx="7" cy="14" r="1.5" fill="#FF4D8D" opacity=".7"/><circle cx="17" cy="14" r="1.5" fill="#FF4D8D" opacity=".7"/><path d="M10 15c.5.5 3 .5 4 0" stroke="#000" stroke-width="1.5" fill="none" stroke-linecap="round"/>`
    ),
  },
  {
    id: 'smile-melt',
    name: 'Melting',
    defaultColor: '#FFD84D',
    svg: wrap(
      `<path d="M2 12a10 10 0 1 1 20 0c0 4-2 7-4 7s-2-3-4-3-2 4-4 4-2-4-4-4-2 3-4 3v-7z"/><circle cx="9" cy="11" r="1" fill="#000"/><circle cx="15" cy="11" r="1" fill="#000"/><path d="M9 15c1 .8 4 1 6 0" stroke="#000" stroke-width="1.5" fill="none" stroke-linecap="round"/>`
    ),
  },
  {
    id: 'smile-star-eyes',
    name: 'Star Eyes',
    defaultColor: '#FFD84D',
    svg: wrap(
      `<circle cx="12" cy="12" r="10"/><path d="M8 9l.6 1.4L10 11l-1.4.6L8 13l-.6-1.4L6 11l1.4-.6zM16 9l.6 1.4L18 11l-1.4.6L16 13l-.6-1.4L14 11l1.4-.6z" fill="#000"/><path d="M9 15c1 1.5 4 1.5 6 0" stroke="#000" stroke-width="1.5" fill="none" stroke-linecap="round"/>`
    ),
  },
];

// ----------------------------- Flowers ------------------------------------

const FLOWERS: AssetItem[] = [
  {
    id: 'flower-daisy',
    name: 'Daisy',
    defaultColor: '#FFC7DA',
    svg: wrap(
      `<g><circle cx="12" cy="6" r="3"/><circle cx="12" cy="18" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="12" r="3"/><circle cx="8" cy="8" r="2.5"/><circle cx="16" cy="8" r="2.5"/><circle cx="8" cy="16" r="2.5"/><circle cx="16" cy="16" r="2.5"/></g><circle cx="12" cy="12" r="2.5" fill="#FFD84D"/>`
    ),
  },
  {
    id: 'flower-tulip',
    name: 'Tulip',
    defaultColor: '#FF4D8D',
    svg: wrap(
      `<path d="M12 3c-3 3-4 6-4 8 0 2 1 3 4 3s4-1 4-3c0-2-1-5-4-8z"/><path stroke="#5EA572" stroke-width="2" fill="none" d="M12 14v8"/>`
    ),
  },
  {
    id: 'flower-rose',
    name: 'Rose',
    defaultColor: '#E63946',
    svg: wrap(
      `<circle cx="12" cy="9" r="6"/><path fill="#fff" opacity=".5" d="M12 5a4 4 0 0 1 4 4M12 5a4 4 0 0 0-4 4M10 10c1-1 3-1 4 0M9 12c2-1 5-1 6 0"/><path stroke="#5EA572" stroke-width="2" fill="none" d="M12 15v7"/>`
    ),
  },
  {
    id: 'flower-simple',
    name: 'Simple Flower',
    defaultColor: '#FFC7DA',
    svg: wrap(
      `<circle cx="12" cy="6" r="4"/><circle cx="12" cy="18" r="4"/><circle cx="6" cy="12" r="4"/><circle cx="18" cy="12" r="4"/><circle cx="12" cy="12" r="3" fill="#FFD84D"/>`
    ),
  },
  {
    id: 'flower-five',
    name: 'Five Petal',
    defaultColor: '#FF4D8D',
    svg: wrap(
      `<path d="M12 3l3 5h6l-5 4 2 6-6-4-6 4 2-6-5-4h6z" opacity=".3"/><circle cx="12" cy="4" r="3"/><circle cx="20" cy="10" r="3"/><circle cx="17" cy="20" r="3"/><circle cx="7" cy="20" r="3"/><circle cx="4" cy="10" r="3"/><circle cx="12" cy="12" r="2.5" fill="#FFD84D"/>`
    ),
  },
  {
    id: 'flower-bud',
    name: 'Bud',
    defaultColor: '#FFC7DA',
    svg: wrap(
      `<path d="M12 4c-2 2-3 4-3 6s1 3 3 3 3-1 3-3-1-4-3-6z"/><path stroke="#5EA572" stroke-width="2" fill="none" d="M12 13v8M12 17c-3 0-4-2-4-3M12 19c3 0 4-2 4-3"/>`
    ),
  },
  {
    id: 'flower-sun',
    name: 'Sunflower',
    defaultColor: '#FFD84D',
    svg: wrap(
      `<g><ellipse cx="12" cy="4" rx="2" ry="3"/><ellipse cx="12" cy="20" rx="2" ry="3"/><ellipse cx="4" cy="12" rx="3" ry="2"/><ellipse cx="20" cy="12" rx="3" ry="2"/><ellipse cx="6" cy="6" rx="2.5" ry="2" transform="rotate(-45 6 6)"/><ellipse cx="18" cy="6" rx="2.5" ry="2" transform="rotate(45 18 6)"/><ellipse cx="6" cy="18" rx="2.5" ry="2" transform="rotate(45 6 18)"/><ellipse cx="18" cy="18" rx="2.5" ry="2" transform="rotate(-45 18 18)"/></g><circle cx="12" cy="12" r="3.5" fill="#3a2400"/>`
    ),
  },
];

// ----------------------------- Minimal Shapes -----------------------------

const MINIMAL: AssetItem[] = [
  {
    id: 'shape-circle',
    name: 'Circle',
    defaultColor: '#0A0A0A',
    svg: wrap(`<circle cx="12" cy="12" r="9"/>`),
  },
  {
    id: 'shape-circle-outline',
    name: 'Circle Outline',
    defaultColor: '#0A0A0A',
    svg: wrap(`<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/>`),
  },
  {
    id: 'shape-square',
    name: 'Square',
    defaultColor: '#0A0A0A',
    svg: wrap(`<rect x="3" y="3" width="18" height="18" rx="2"/>`),
  },
  {
    id: 'shape-triangle',
    name: 'Triangle',
    defaultColor: '#0A0A0A',
    svg: wrap(`<path d="M12 3l9 16H3z"/>`),
  },
  {
    id: 'shape-blob',
    name: 'Blob',
    defaultColor: '#FFC7DA',
    svg: wrap(
      `<path d="M12 3c5 0 9 4 9 9s-3 9-9 9-9-4-9-9 4-9 9-9z" transform="rotate(20 12 12)"/>`
    ),
  },
  {
    id: 'shape-arch',
    name: 'Arch',
    defaultColor: '#A0D8F1',
    svg: wrap(`<path d="M3 21V12a9 9 0 0 1 18 0v9z"/>`),
  },
  {
    id: 'shape-pill',
    name: 'Pill',
    defaultColor: '#C8B6FF',
    svg: wrap(`<rect x="2" y="8" width="20" height="8" rx="4"/>`),
  },
  {
    id: 'shape-ring',
    name: 'Ring',
    defaultColor: '#0A0A0A',
    svg: wrap(`<path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 5a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"/>`),
  },
];

// ----------------------------- Y2K ----------------------------------------

const Y2K: AssetItem[] = [
  {
    id: 'y2k-flower',
    name: 'Y2K Flower',
    defaultColor: '#FF4D8D',
    svg: wrap(
      `<g><circle cx="12" cy="5" r="3"/><circle cx="19" cy="12" r="3"/><circle cx="12" cy="19" r="3"/><circle cx="5" cy="12" r="3"/></g><circle cx="12" cy="12" r="3" fill="#0A0A0A"/>`
    ),
  },
  {
    id: 'y2k-checker',
    name: 'Checker',
    defaultColor: '#0A0A0A',
    svg: wrap(
      `<rect x="4" y="4" width="5" height="5"/><rect x="14" y="4" width="5" height="5"/><rect x="9" y="9" width="5" height="5"/><rect x="4" y="14" width="5" height="5"/><rect x="14" y="14" width="5" height="5"/>`
    ),
  },
  {
    id: 'y2k-yin-yang',
    name: 'Swirl',
    defaultColor: '#0A0A0A',
    svg: wrap(
      `<path d="M12 2a10 10 0 1 0 0 20 5 5 0 1 1 0-10 5 5 0 0 0 0-10z"/><circle cx="12" cy="7" r="1.5" fill="#fff"/><circle cx="12" cy="17" r="1.5"/>`
    ),
  },
  {
    id: 'y2k-butterfly',
    name: 'Y2K Butterfly',
    defaultColor: '#A0D8F1',
    svg: wrap(
      `<path d="M12 12s-5-5-8-3 1 7 4 7c3 0 4-4 4-4zm0 0s5-5 8-3-1 7-4 7c-3 0-4-4-4-4z"/><path stroke="#000" stroke-width="1" d="M12 6v12"/>`
    ),
  },
  {
    id: 'y2k-cd',
    name: 'CD',
    defaultColor: '#C8B6FF',
    svg: wrap(
      `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6" fill="#fff" opacity=".4"/><circle cx="12" cy="12" r="2" fill="#fff"/>`
    ),
  },
  {
    id: 'y2k-star',
    name: 'Y2K Star',
    defaultColor: '#FFD84D',
    svg: wrap(
      `<path d="M12 1c1 5 4 8 9 9-5 1-8 4-9 9-1-5-4-8-9-9 5-1 8-4 9-9z"/>`
    ),
  },
];

// ----------------------------- Cute Icons ---------------------------------

const CUTE: AssetItem[] = [
  {
    id: 'cute-cloud',
    name: 'Cloud',
    defaultColor: '#FFFFFF',
    svg: wrap(
      `<path stroke="#0A0A0A" stroke-width="1" d="M7 17a4 4 0 0 1 .5-8 5 5 0 0 1 9.7 1A3.5 3.5 0 0 1 17 17z"/>`
    ),
  },
  {
    id: 'cute-rainbow',
    name: 'Rainbow',
    defaultColor: '#FF4D8D',
    svg: wrap(
      `<path fill="none" stroke="#FF4D8D" stroke-width="2" d="M4 18a8 8 0 0 1 16 0"/><path fill="none" stroke="#FFD84D" stroke-width="2" d="M6 18a6 6 0 0 1 12 0"/><path fill="none" stroke="#A0D8F1" stroke-width="2" d="M8 18a4 4 0 0 1 8 0"/>`
    ),
  },
  {
    id: 'cute-cherry',
    name: 'Cherry',
    defaultColor: '#E63946',
    svg: wrap(
      `<circle cx="8" cy="17" r="4"/><circle cx="16" cy="17" r="4"/><path fill="#5EA572" d="M12 4s-2 5-4 9M12 4s2 5 4 9"/><circle cx="12" cy="4" r="1.5" fill="#5EA572"/>`
    ),
  },
  {
    id: 'cute-coffee',
    name: 'Coffee',
    defaultColor: '#7B4F2C',
    svg: wrap(
      `<path d="M5 8h14v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z"/><path fill="none" stroke="currentColor" stroke-width="1.5" d="M19 10h2a2 2 0 0 1 0 4h-2"/><path stroke="#fff" stroke-width="1" fill="none" d="M9 4c1 1 0 2 0 3M13 4c1 1 0 2 0 3"/>`
    ),
  },
  {
    id: 'cute-moon',
    name: 'Moon',
    defaultColor: '#FFD84D',
    svg: wrap(`<path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/>`),
  },
  {
    id: 'cute-sun',
    name: 'Sun',
    defaultColor: '#FFD84D',
    svg: wrap(
      `<circle cx="12" cy="12" r="5"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></g>`
    ),
  },
  {
    id: 'cute-ghost',
    name: 'Ghost',
    defaultColor: '#FFFFFF',
    svg: wrap(
      `<path stroke="#0A0A0A" stroke-width="1" d="M5 11a7 7 0 0 1 14 0v9l-2-2-2 2-2-2-2 2-2-2-2 2-2-2z"/><circle cx="9" cy="11" r="1" fill="#000"/><circle cx="15" cy="11" r="1" fill="#000"/>`
    ),
  },
  {
    id: 'cute-paw',
    name: 'Paw',
    defaultColor: '#0A0A0A',
    svg: wrap(
      `<ellipse cx="12" cy="16" rx="5" ry="4"/><circle cx="6" cy="10" r="2"/><circle cx="10" cy="6" r="2"/><circle cx="14" cy="6" r="2"/><circle cx="18" cy="10" r="2"/>`
    ),
  },
];

// ----------------------------- Arabic Style -------------------------------

const ARABIC: AssetItem[] = [
  {
    id: 'arabic-frame',
    name: 'Arabesque Frame',
    defaultColor: '#0A0A0A',
    svg: wrap(
      `<path fill="none" stroke="currentColor" stroke-width="1.5" d="M4 8c0-2 2-4 4-4M4 16c0 2 2 4 4 4M20 8c0-2-2-4-4-4M20 16c0 2-2 4-4 4M8 4h8M8 20h8M4 8v8M20 8v8"/><circle cx="12" cy="12" r="2"/>`
    ),
  },
  {
    id: 'arabic-star',
    name: '8-Point Star',
    defaultColor: '#FFD84D',
    svg: wrap(
      `<path d="M12 2l3 4 5-1-1 5 4 3-4 3 1 5-5-1-3 4-3-4-5 1 1-5-4-3 4-3-1-5 5 1z"/>`
    ),
  },
  {
    id: 'arabic-crescent',
    name: 'Crescent',
    defaultColor: '#FFD84D',
    svg: wrap(`<path d="M20 12a8 8 0 1 1-10-7.7 6 6 0 0 0 10 7.7z"/>`),
  },
  {
    id: 'arabic-medallion',
    name: 'Medallion',
    defaultColor: '#0A0A0A',
    svg: wrap(
      `<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 3v18M3 12h18M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width=".7"/>`
    ),
  },
  {
    id: 'arabic-tile',
    name: 'Geo Tile',
    defaultColor: '#A0D8F1',
    svg: wrap(
      `<path d="M12 2l10 10-10 10L2 12z"/><path fill="#fff" d="M12 6l6 6-6 6-6-6z"/><path d="M12 9l3 3-3 3-3-3z"/>`
    ),
  },
];

// ----------------------------- Music --------------------------------------

const MUSIC: AssetItem[] = [
  {
    id: 'music-note',
    name: 'Note',
    defaultColor: '#0A0A0A',
    svg: wrap(`<path d="M9 4v11a3 3 0 1 1-2-2.8V4h2zM9 4l8-2v10a3 3 0 1 1-2-2.8V6L9 7.5z"/>`),
  },
  {
    id: 'music-double-note',
    name: 'Double Note',
    defaultColor: '#0A0A0A',
    svg: wrap(
      `<path d="M6 6v10a2.5 2.5 0 1 1-2-2.5V6h2zM12 4v10a2.5 2.5 0 1 1-2-2.5V4h2z"/><path d="M6 4h6v2H6z"/>`
    ),
  },
  {
    id: 'music-headphones',
    name: 'Headphones',
    defaultColor: '#0A0A0A',
    svg: wrap(
      `<path fill="none" stroke="currentColor" stroke-width="2" d="M4 16v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="7" rx="1"/><rect x="17" y="14" width="4" height="7" rx="1"/>`
    ),
  },
  {
    id: 'music-cassette',
    name: 'Cassette',
    defaultColor: '#0A0A0A',
    svg: wrap(
      `<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8" cy="11" r="2" fill="#fff"/><circle cx="16" cy="11" r="2" fill="#fff"/><rect x="6" y="16" width="12" height="3" rx=".5" fill="#fff"/>`
    ),
  },
  {
    id: 'music-disc',
    name: 'Vinyl',
    defaultColor: '#0A0A0A',
    svg: wrap(
      `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4" fill="#fff"/><circle cx="12" cy="12" r="1"/>`
    ),
  },
];

// ----------------------------- Sport --------------------------------------

const SPORT: AssetItem[] = [
  {
    id: 'sport-football',
    name: 'Football',
    defaultColor: '#0A0A0A',
    svg: wrap(
      `<circle cx="12" cy="12" r="10" fill="#fff" stroke="currentColor" stroke-width="1.5"/><path d="M12 5l3 2-1 4-4 0-1-4z"/><path d="M5 11l3-1M19 11l-3-1M12 22v-4M8 17l-2-3M16 17l2-3"/>`
    ),
  },
  {
    id: 'sport-basketball',
    name: 'Basketball',
    defaultColor: '#E69632',
    svg: wrap(
      `<circle cx="12" cy="12" r="10"/><path fill="none" stroke="#0A0A0A" stroke-width="1.5" d="M2 12h20M12 2v20M5 5c2 2 3 5 3 7s-1 5-3 7M19 5c-2 2-3 5-3 7s1 5 3 7"/>`
    ),
  },
  {
    id: 'sport-trophy',
    name: 'Trophy',
    defaultColor: '#FFD84D',
    svg: wrap(
      `<path d="M7 4h10v4a5 5 0 0 1-10 0z"/><path d="M9 12h6v3H9z"/><rect x="7" y="15" width="10" height="3" rx="1"/><path stroke="currentColor" stroke-width="1.5" fill="none" d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3"/>`
    ),
  },
  {
    id: 'sport-medal',
    name: 'Medal',
    defaultColor: '#FFD84D',
    svg: wrap(
      `<path stroke="#FF4D8D" stroke-width="2" fill="none" d="M8 3l4 7M16 3l-4 7"/><circle cx="12" cy="15" r="6"/><circle cx="12" cy="15" r="3" fill="#fff" opacity=".4"/>`
    ),
  },
  {
    id: 'sport-flag',
    name: 'Flag',
    defaultColor: '#E63946',
    svg: wrap(
      `<path stroke="currentColor" stroke-width="2" d="M5 21V3"/><path d="M5 4h12l-3 4 3 4H5z"/>`
    ),
  },
];

// ----------------------------- Travel -------------------------------------

const TRAVEL: AssetItem[] = [
  {
    id: 'travel-plane',
    name: 'Airplane',
    defaultColor: '#0A0A0A',
    svg: wrap(`<path d="M2 12l9-2 4-7 2 1-2 7 7 2v2l-7-1-4 7-2-1 2-7-9-1z"/>`),
  },
  {
    id: 'travel-pin',
    name: 'Pin',
    defaultColor: '#E63946',
    svg: wrap(
      `<path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z"/><circle cx="12" cy="9" r="2.5" fill="#fff"/>`
    ),
  },
  {
    id: 'travel-camera',
    name: 'Camera',
    defaultColor: '#0A0A0A',
    svg: wrap(
      `<rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13" r="4" fill="#fff"/><circle cx="12" cy="13" r="2"/><rect x="8" y="4" width="8" height="3" rx="1"/>`
    ),
  },
  {
    id: 'travel-map',
    name: 'Map',
    defaultColor: '#A0D8F1',
    svg: wrap(
      `<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path stroke="#fff" stroke-width="1" d="M9 4v16M15 6v16"/>`
    ),
  },
  {
    id: 'travel-globe',
    name: 'Globe',
    defaultColor: '#A0D8F1',
    svg: wrap(
      `<circle cx="12" cy="12" r="10"/><path fill="none" stroke="#fff" stroke-width="1.5" d="M2 12h20M12 2c3 3 5 6 5 10s-2 7-5 10M12 2c-3 3-5 6-5 10s2 7 5 10"/>`
    ),
  },
];

// ----------------------------- Love ---------------------------------------

const LOVE: AssetItem[] = [
  {
    id: 'love-key',
    name: 'Heart Key',
    defaultColor: '#FF4D8D',
    svg: wrap(
      `<path d="M8 8a4 4 0 1 1 4.5 4l8 8-2 2-1-1-1 1-1-1-1 1-1.5-1.5L12 12A4 4 0 0 1 8 8z"/><circle cx="8" cy="8" r="1.5" fill="#fff"/>`
    ),
  },
  {
    id: 'love-lock',
    name: 'Heart Lock',
    defaultColor: '#FF4D8D',
    svg: wrap(
      `<rect x="5" y="11" width="14" height="10" rx="2"/><path fill="none" stroke="currentColor" stroke-width="2" d="M8 11V8a4 4 0 1 1 8 0v3"/><path fill="#fff" d="M12 14s-2-1.5-3-.5-1 2 0 2.5L12 18l3-1.5c1-.5 1-1.5 0-2.5s-3 .5-3 .5z"/>`
    ),
  },
  {
    id: 'love-envelope',
    name: 'Love Letter',
    defaultColor: '#FFC7DA',
    svg: wrap(
      `<rect x="3" y="5" width="18" height="14" rx="2"/><path fill="none" stroke="#fff" stroke-width="1.5" d="M3 7l9 6 9-6"/><path fill="#FF4D8D" d="M12 11s-2-1-3 0 0 2 1 2.5L12 15l2-1.5c1-.5 2-1.5 1-2.5s-3 0-3 0z"/>`
    ),
  },
  {
    id: 'love-cupid',
    name: 'Cupid Arrow',
    defaultColor: '#FF4D8D',
    svg: wrap(
      `<path d="M12 14s-6-3-6-7 4-3 6 0c2-3 6-2 6 2s-6 5-6 5z"/><path fill="none" stroke="#0A0A0A" stroke-width="1.5" d="M3 4l18 18M3 4l3 .5M3 4l.5 3M21 22l-3-.5M21 22l-.5-3"/>`
    ),
  },
  {
    id: 'love-hands',
    name: 'Heart Hands',
    defaultColor: '#FF4D8D',
    svg: wrap(
      `<path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6.5 5.5 5.5 0 0 1 21.5 12c-2.5 4.5-9.5 9-9.5 9z"/><path fill="#fff" opacity=".4" d="M12 10s-1.5-1-2.5 0S9 12 12 13c3-1 3.5-2 2.5-3S12 10 12 10z"/>`
    ),
  },
];

// ----------------------------- Abstract -----------------------------------

const ABSTRACT: AssetItem[] = [
  {
    id: 'abstract-wave',
    name: 'Wave',
    defaultColor: '#A0D8F1',
    svg: wrap(
      `<path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M2 12c3-6 6-6 10 0s7 6 10 0"/>`
    ),
  },
  {
    id: 'abstract-spiral',
    name: 'Spiral',
    defaultColor: '#FF4D8D',
    svg: wrap(
      `<path fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" d="M12 12a3 3 0 1 0 3 3 5 5 0 1 1-5-5 7 7 0 1 0 7 7"/>`
    ),
  },
  {
    id: 'abstract-zigzag',
    name: 'Zigzag',
    defaultColor: '#0A0A0A',
    svg: wrap(
      `<path fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round" d="M3 8l4 4-4 4M9 8l4 4-4 4M15 8l4 4-4 4"/>`
    ),
  },
  {
    id: 'abstract-dots',
    name: 'Dot Grid',
    defaultColor: '#0A0A0A',
    svg: wrap(
      `<circle cx="5" cy="5" r="1.5"/><circle cx="12" cy="5" r="1.5"/><circle cx="19" cy="5" r="1.5"/><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="19" r="1.5"/><circle cx="12" cy="19" r="1.5"/><circle cx="19" cy="19" r="1.5"/>`
    ),
  },
  {
    id: 'abstract-burst',
    name: 'Burst Lines',
    defaultColor: '#FFD84D',
    svg: wrap(
      `<g stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3"/></g>`
    ),
  },
  {
    id: 'abstract-squiggle',
    name: 'Squiggle',
    defaultColor: '#FF4D8D',
    svg: wrap(
      `<path fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" d="M2 12c2-3 4-3 5 0s3 3 5 0 4-3 5 0 3 3 5 0"/>`
    ),
  },
];

// ----------------------------- Catalog ------------------------------------

export const ASSET_CATEGORIES: AssetCategory[] = [
  { id: 'hearts', name: 'Hearts', assets: HEARTS },
  { id: 'stars', name: 'Stars', assets: STARS },
  { id: 'sparkles', name: 'Sparkles', assets: SPARKLES },
  { id: 'smileys', name: 'Smileys', assets: SMILEYS },
  { id: 'bows', name: 'Bows', assets: BOWS },
  { id: 'butterflies', name: 'Butterflies', assets: BUTTERFLIES },
  { id: 'flames', name: 'Flames', assets: FLAMES },
  { id: 'flowers', name: 'Flowers', assets: FLOWERS },
  { id: 'cute', name: 'Cute Icons', assets: CUTE },
  { id: 'y2k', name: 'Y2K', assets: Y2K },
  { id: 'minimal', name: 'Shapes', assets: MINIMAL },
  { id: 'love', name: 'Love', assets: LOVE },
  { id: 'arabic', name: 'Arabic', assets: ARABIC },
  { id: 'music', name: 'Music', assets: MUSIC },
  { id: 'sport', name: 'Sport', assets: SPORT },
  { id: 'travel', name: 'Travel', assets: TRAVEL },
  { id: 'abstract', name: 'Abstract', assets: ABSTRACT },
];

export function findAsset(assetId: string): AssetItem | null {
  for (const cat of ASSET_CATEGORIES) {
    const a = cat.assets.find((x) => x.id === assetId);
    if (a) return a;
  }
  return null;
}

/**
 * Returns an asset's SVG as a data URL with the given fill color substituted
 * in for `currentColor`. The result can be loaded as an HTMLImageElement and
 * drawn into Konva.
 */
export function svgToDataUrl(svg: string, color: string): string {
  const colored = svg.replace(/currentColor/g, color);
  // Use base64 to safely include special characters in the data URL.
  const b64 =
    typeof window !== 'undefined'
      ? window.btoa(unescape(encodeURIComponent(colored)))
      : Buffer.from(colored).toString('base64');
  return `data:image/svg+xml;base64,${b64}`;
}
