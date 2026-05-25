/**
 * Phone model registry.
 *
 * Each model defines:
 *  - canvas: the on-screen editor dimensions (logical px)
 *  - print: the high-res output dimensions (actual print px @ ~300dpi equivalent)
 *  - safeArea: where important design content should live
 *  - cameraCutout: NO printable artwork is allowed here
 *
 * To add a new model: append an entry below and set its Shopify variant ID.
 * To change the Shopify variant: edit `shopifyVariantId` for the model.
 * Variant IDs are the numeric IDs from Shopify Admin (e.g. 41234567890123).
 */

export interface PhoneModel {
  id: string;
  name: string;
  brand: 'iPhone' | 'Samsung';
  shopifyVariantId: string;
  canvas: { width: number; height: number };
  print: { width: number; height: number };
  safeArea: { x: number; y: number; width: number; height: number; radius: number };
  cameraCutout: { x: number; y: number; width: number; height: number; radius: number };
}

// NOTE for the store owner:
// Replace each `shopifyVariantId` with the real numeric variant ID from the Shopify product.
// Find it under: Shopify Admin → Products → [Product] → Variants → click variant → URL contains the ID.
export const PHONE_MODELS: PhoneModel[] = [
  {
    id: 'iphone-13',
    name: 'iPhone 13',
    brand: 'iPhone',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    canvas: { width: 380, height: 780 },
    print: { width: 1170, height: 2532 },
    safeArea: { x: 22, y: 22, width: 336, height: 736, radius: 42 },
    cameraCutout: { x: 34, y: 34, width: 120, height: 120, radius: 26 },
  },
  {
    id: 'iphone-13-pro',
    name: 'iPhone 13 Pro',
    brand: 'iPhone',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    canvas: { width: 380, height: 780 },
    print: { width: 1170, height: 2532 },
    safeArea: { x: 22, y: 22, width: 336, height: 736, radius: 42 },
    cameraCutout: { x: 34, y: 34, width: 130, height: 130, radius: 28 },
  },
  {
    id: 'iphone-14',
    name: 'iPhone 14',
    brand: 'iPhone',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    canvas: { width: 390, height: 800 },
    print: { width: 1170, height: 2532 },
    safeArea: { x: 22, y: 22, width: 346, height: 756, radius: 44 },
    cameraCutout: { x: 36, y: 36, width: 120, height: 120, radius: 26 },
  },
  {
    id: 'iphone-14-pro',
    name: 'iPhone 14 Pro',
    brand: 'iPhone',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    canvas: { width: 390, height: 800 },
    print: { width: 1179, height: 2556 },
    safeArea: { x: 22, y: 22, width: 346, height: 756, radius: 44 },
    cameraCutout: { x: 36, y: 36, width: 134, height: 134, radius: 28 },
  },
  {
    id: 'iphone-15',
    name: 'iPhone 15',
    brand: 'iPhone',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    canvas: { width: 400, height: 810 },
    print: { width: 1179, height: 2556 },
    safeArea: { x: 22, y: 22, width: 356, height: 766, radius: 44 },
    cameraCutout: { x: 36, y: 36, width: 130, height: 130, radius: 28 },
  },
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    brand: 'iPhone',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    canvas: { width: 400, height: 810 },
    print: { width: 1179, height: 2556 },
    safeArea: { x: 22, y: 22, width: 356, height: 766, radius: 44 },
    cameraCutout: { x: 36, y: 36, width: 134, height: 134, radius: 28 },
  },
  {
    id: 'iphone-15-pro-max',
    name: 'iPhone 15 Pro Max',
    brand: 'iPhone',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    canvas: { width: 420, height: 820 },
    print: { width: 1290, height: 2796 },
    safeArea: { x: 24, y: 24, width: 372, height: 772, radius: 46 },
    cameraCutout: { x: 38, y: 38, width: 130, height: 130, radius: 28 },
  },
  {
    id: 'samsung-s23',
    name: 'Samsung S23',
    brand: 'Samsung',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    canvas: { width: 380, height: 800 },
    print: { width: 1080, height: 2340 },
    safeArea: { x: 22, y: 22, width: 336, height: 756, radius: 40 },
    cameraCutout: { x: 280, y: 32, width: 70, height: 130, radius: 16 },
  },
  {
    id: 'samsung-s24',
    name: 'Samsung S24',
    brand: 'Samsung',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    canvas: { width: 380, height: 800 },
    print: { width: 1080, height: 2340 },
    safeArea: { x: 22, y: 22, width: 336, height: 756, radius: 40 },
    cameraCutout: { x: 280, y: 32, width: 70, height: 130, radius: 16 },
  },
  {
    id: 'samsung-s24-ultra',
    name: 'Samsung S24 Ultra',
    brand: 'Samsung',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    canvas: { width: 420, height: 820 },
    print: { width: 1440, height: 3120 },
    safeArea: { x: 24, y: 24, width: 372, height: 772, radius: 42 },
    cameraCutout: { x: 320, y: 34, width: 64, height: 64, radius: 32 },
  },
];

export const DEFAULT_MODEL_ID = 'iphone-15-pro-max';

export function getModel(id: string): PhoneModel {
  return PHONE_MODELS.find((m) => m.id === id) ?? PHONE_MODELS[0];
}
