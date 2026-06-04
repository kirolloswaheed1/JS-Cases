/**
 * Assets / stickers library.
 *
 * Stickers are PNG image files served from /public/stickers/{category}/.
 * Each entry just points to a static file — no inline SVG, no script injection,
 * no runtime tinting. This makes the library easy to update: add a file, add an
 * entry below.
 *
 * To add a sticker:
 *   1. Drop the PNG into /public/stickers/men/  or  /public/stickers/women/
 *   2. Add an entry to the matching `assets` array below.
 *
 * To remove a sticker:
 *   1. Delete the entry from the array below (this is the only required step —
 *      the file can stay on disk if you want, it just won't show in the picker).
 *   2. Optional: delete the PNG file from /public/stickers/.
 *
 * To rename a category: change the `name` field. The `id` should stay stable
 * because it's persisted in existing design JSON files.
 */

export interface AssetItem {
  id: string;
  name: string;
  /** Public path to the sticker image (PNG/JPG/WEBP). */
  src: string;
}

export interface AssetCategory {
  id: string;
  name: string;
  assets: AssetItem[];
}

export const ASSET_CATEGORIES: AssetCategory[] = [
  {
    id: 'women',
    name: 'Women',
    assets: [
    { id: "women-001", name: "Women sticker 001", src: "/stickers/women/women-001.png" },
    { id: "women-002", name: "Women sticker 002", src: "/stickers/women/women-002.png" },
    { id: "women-003", name: "Women sticker 003", src: "/stickers/women/women-003.png" },
    { id: "women-004", name: "Women sticker 004", src: "/stickers/women/women-004.png" },
    { id: "women-005", name: "Women sticker 005", src: "/stickers/women/women-005.png" },
    { id: "women-006", name: "Women sticker 006", src: "/stickers/women/women-006.png" },
    { id: "women-007", name: "Women sticker 007", src: "/stickers/women/women-007.png" },
    { id: "women-008", name: "Women sticker 008", src: "/stickers/women/women-008.png" },
    { id: "women-009", name: "Women sticker 009", src: "/stickers/women/women-009.png" },
    { id: "women-010", name: "Women sticker 010", src: "/stickers/women/women-010.png" },
    { id: "women-011", name: "Women sticker 011", src: "/stickers/women/women-011.png" },
    { id: "women-012", name: "Women sticker 012", src: "/stickers/women/women-012.png" },
    { id: "women-013", name: "Women sticker 013", src: "/stickers/women/women-013.png" },
    { id: "women-014", name: "Women sticker 014", src: "/stickers/women/women-014.png" },
    { id: "women-015", name: "Women sticker 015", src: "/stickers/women/women-015.png" },
    { id: "women-016", name: "Women sticker 016", src: "/stickers/women/women-016.png" },
    ],
  },
  {
    id: 'men',
    name: 'Men',
    assets: [
    { id: "men-001", name: "Men sticker 001", src: "/stickers/men/men-001.png" },
    { id: "men-002", name: "Men sticker 002", src: "/stickers/men/men-002.png" },
    { id: "men-003", name: "Men sticker 003", src: "/stickers/men/men-003.png" },
    { id: "men-004", name: "Men sticker 004", src: "/stickers/men/men-004.png" },
    { id: "men-005", name: "Men sticker 005", src: "/stickers/men/men-005.png" },
    { id: "men-006", name: "Men sticker 006", src: "/stickers/men/men-006.png" },
    { id: "men-007", name: "Men sticker 007", src: "/stickers/men/men-007.png" },
    { id: "men-008", name: "Men sticker 008", src: "/stickers/men/men-008.png" },
    { id: "men-009", name: "Men sticker 009", src: "/stickers/men/men-009.png" },
    { id: "men-010", name: "Men sticker 010", src: "/stickers/men/men-010.png" },
    { id: "men-011", name: "Men sticker 011", src: "/stickers/men/men-011.png" },
    { id: "men-012", name: "Men sticker 012", src: "/stickers/men/men-012.png" },
    { id: "men-013", name: "Men sticker 013", src: "/stickers/men/men-013.png" },
    { id: "men-014", name: "Men sticker 014", src: "/stickers/men/men-014.png" },
    { id: "men-015", name: "Men sticker 015", src: "/stickers/men/men-015.png" },
    { id: "men-016", name: "Men sticker 016", src: "/stickers/men/men-016.png" },
    { id: "men-017", name: "Men sticker 017", src: "/stickers/men/men-017.png" },
    { id: "men-018", name: "Men sticker 018", src: "/stickers/men/men-018.png" },
    { id: "men-019", name: "Men sticker 019", src: "/stickers/men/men-019.png" },
    { id: "men-020", name: "Men sticker 020", src: "/stickers/men/men-020.png" },
    { id: "men-021", name: "Men sticker 021", src: "/stickers/men/men-021.png" },
    { id: "men-022", name: "Men sticker 022", src: "/stickers/men/men-022.png" },
    { id: "men-023", name: "Men sticker 023", src: "/stickers/men/men-023.png" },
    { id: "men-024", name: "Men sticker 024", src: "/stickers/men/men-024.png" },
    { id: "men-025", name: "Men sticker 025", src: "/stickers/men/men-025.png" },
    { id: "men-026", name: "Men sticker 026", src: "/stickers/men/men-026.png" },
    { id: "men-027", name: "Men sticker 027", src: "/stickers/men/men-027.png" },
    { id: "men-028", name: "Men sticker 028", src: "/stickers/men/men-028.png" },
    { id: "men-029", name: "Men sticker 029", src: "/stickers/men/men-029.png" },
    { id: "men-030", name: "Men sticker 030", src: "/stickers/men/men-030.png" },
    { id: "men-031", name: "Men sticker 031", src: "/stickers/men/men-031.png" },
    { id: "men-032", name: "Men sticker 032", src: "/stickers/men/men-032.png" },
    { id: "men-033", name: "Men sticker 033", src: "/stickers/men/men-033.png" },
    { id: "men-034", name: "Men sticker 034", src: "/stickers/men/men-034.png" },
    { id: "men-035", name: "Men sticker 035", src: "/stickers/men/men-035.png" },
    { id: "men-036", name: "Men sticker 036", src: "/stickers/men/men-036.png" },
    { id: "men-037", name: "Men sticker 037", src: "/stickers/men/men-037.png" },
    { id: "men-038", name: "Men sticker 038", src: "/stickers/men/men-038.png" },
    { id: "men-039", name: "Men sticker 039", src: "/stickers/men/men-039.png" },
    { id: "men-040", name: "Men sticker 040", src: "/stickers/men/men-040.png" },
    { id: "men-041", name: "Men sticker 041", src: "/stickers/men/men-041.png" },
    { id: "men-042", name: "Men sticker 042", src: "/stickers/men/men-042.png" },
    { id: "men-043", name: "Men sticker 043", src: "/stickers/men/men-043.png" },
    ],
  },
];

/** Look up an asset by id across all categories. */
export function findAsset(id: string): AssetItem | undefined {
  for (const cat of ASSET_CATEGORIES) {
    const hit = cat.assets.find((a) => a.id === id);
    if (hit) return hit;
  }
  return undefined;
}

/** Find which category an asset belongs to. */
export function findAssetCategory(assetId: string): AssetCategory | undefined {
  return ASSET_CATEGORIES.find((c) => c.assets.some((a) => a.id === assetId));
}

