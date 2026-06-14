/**
 * Phone model registry.
 *
 * Each iPhone model is wired to a mockup image in /public/phone-mockups/.
 * safeArea is inset from the detected case-body bbox of the mockup;
 * cameraCutout is the detected camera-bump bbox of the mockup, both
 * translated into canvas (CSS px) coordinates.
 *
 * Samsung models and the "Other / Not listed" placeholder have no mockup
 * yet — they fall back to the generic rounded-rect case rendering.
 *
 * NOTE — Shopify integration: phone model is NOT mapped to a Shopify
 * variant anymore. The cart redirect uses
 * NEXT_PUBLIC_DEFAULT_CUSTOM_CASE_VARIANT_ID (one shared variant for all
 * custom cases) and sends Phone Model as a Shopify line item property
 * instead. The `shopifyVariantId` field on each entry is now optional and
 * unused; the placeholder values can stay or be removed at will.
 *
 * To FINE-TUNE the safe area or camera cutout for a specific model: just
 * edit the numbers below. They’re in canvas pixel coordinates relative
 * to the top-left of the mockup.
 */

export interface PhoneModel {
  id: string;
  name: string;
  brand: 'iPhone' | 'Samsung' | 'Other';
  /**
   * @deprecated Phone model is no longer mapped to a Shopify variant. The
   * cart redirect uses NEXT_PUBLIC_DEFAULT_CUSTOM_CASE_VARIANT_ID (and
   * optionally NEXT_PUBLIC_SOLID_CASE_VARIANT_ID / NEXT_PUBLIC_TRANSPARENT_CASE_VARIANT_ID)
   * for the variant, and sends Phone Model as a line item property. This
   * field is kept optional for backwards compatibility — leaving the
   * placeholder values in existing entries is harmless.
   */
  shopifyVariantId?: string;
  mockupImage?: string;
  canvas: { width: number; height: number };
  print: { width: number; height: number };
  safeArea: { x: number; y: number; width: number; height: number; radius: number };
  cameraCutout: { x: number; y: number; width: number; height: number; radius: number };
  /** Marks the "Other / Not listed" placeholder; requires customPhoneModel. */
  isOther?: boolean;
}

// `shopifyVariantId` below is optional and unused — see file header.
export const PHONE_MODELS: PhoneModel[] = [
  {
    id: 'iphone-17-pro-max',
    name: "iPhone 17 Pro Max",
    brand: 'iPhone',
    shopifyVariantId: '54542835515714',
    mockupImage: '/phone-mockups/iphone-17-pro-max.png',
    canvas: { width: 420, height: 871 },
    print:  { width: 1260, height: 2613 },
    safeArea:     { x: 21, y: 35, width: 378, height: 801, radius: 42 },
    cameraCutout: { x: 52, y: 41, width: 322, height: 180, radius: 32 },
  },
  {
    id: 'iphone-17-pro',
    name: "iPhone 17 Pro",
    brand: 'iPhone',
    shopifyVariantId: '54542835515714',
    mockupImage: '/phone-mockups/iphone-17-pro.png',
    canvas: { width: 420, height: 845 },
    print:  { width: 1260, height: 2535 },
    safeArea:     { x: 21, y: 34, width: 378, height: 777, radius: 42 },
    cameraCutout: { x: 51, y: 40, width: 325, height: 179, radius: 32 },
  },
  {
    id: 'iphone-17',
    name: "iPhone 17",
    brand: 'iPhone',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    mockupImage: '/phone-mockups/iphone-17.png',
    canvas: { width: 420, height: 916 },
    print:  { width: 1260, height: 2748 },
    safeArea:     { x: 21, y: 37, width: 378, height: 842, radius: 42 },
    cameraCutout: { x: 1, y: 0, width: 205, height: 260, radius: 37 },
  },
  {
    id: 'iphone-16-pro-max',
    name: "iPhone 16 Pro Max",
    brand: 'iPhone',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    mockupImage: '/phone-mockups/iphone-16-pro-max.png',
    canvas: { width: 420, height: 909 },
    print:  { width: 1260, height: 2727 },
    safeArea:     { x: 21, y: 36, width: 378, height: 837, radius: 42 },
    cameraCutout: { x: 0, y: 0, width: 272, height: 284, radius: 49 },
  },
  {
    id: 'iphone-16-pro',
    name: "iPhone 16 Pro",
    brand: 'iPhone',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    mockupImage: '/phone-mockups/iphone-16-pro.png',
    canvas: { width: 420, height: 893 },
    print:  { width: 1260, height: 2679 },
    safeArea:     { x: 21, y: 36, width: 378, height: 821, radius: 42 },
    cameraCutout: { x: 0, y: 0, width: 279, height: 287, radius: 50 },
  },
  {
    id: 'iphone-16',
    name: "iPhone 16",
    brand: 'iPhone',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    mockupImage: '/phone-mockups/iphone-16.png',
    canvas: { width: 420, height: 874 },
    print:  { width: 1260, height: 2622 },
    safeArea:     { x: 21, y: 35, width: 378, height: 804, radius: 42 },
    cameraCutout: { x: 0, y: 0, width: 212, height: 266, radius: 38 },
  },
  {
    id: 'iphone-15-pro-max',
    name: "iPhone 15 Pro Max",
    brand: 'iPhone',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    mockupImage: '/phone-mockups/iphone-15-pro-max.png',
    canvas: { width: 420, height: 877 },
    print:  { width: 1260, height: 2631 },
    safeArea:     { x: 21, y: 35, width: 378, height: 807, radius: 42 },
    cameraCutout: { x: 0, y: 0, width: 282, height: 288, radius: 51 },
  },
  {
    id: 'iphone-15-pro',
    name: "iPhone 15 Pro",
    brand: 'iPhone',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    mockupImage: '/phone-mockups/iphone-15-pro.png',
    canvas: { width: 420, height: 873 },
    print:  { width: 1260, height: 2619 },
    safeArea:     { x: 21, y: 35, width: 378, height: 803, radius: 42 },
    cameraCutout: { x: 0, y: 0, width: 262, height: 273, radius: 47 },
  },
  {
    id: 'iphone-15',
    name: "iPhone 15",
    brand: 'iPhone',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    mockupImage: '/phone-mockups/iphone-15.png',
    canvas: { width: 420, height: 878 },
    print:  { width: 1260, height: 2634 },
    safeArea:     { x: 21, y: 35, width: 378, height: 808, radius: 42 },
    cameraCutout: { x: 0, y: 0, width: 236, height: 232, radius: 42 },
  },
  {
    id: 'iphone-14-pro-max',
    name: "iPhone 14 Pro Max",
    brand: 'iPhone',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    mockupImage: '/phone-mockups/iphone-14-pro-max.png',
    canvas: { width: 420, height: 886 },
    print:  { width: 1260, height: 2658 },
    safeArea:     { x: 21, y: 35, width: 378, height: 816, radius: 42 },
    cameraCutout: { x: 0, y: 0, width: 252, height: 261, radius: 45 },
  },
  {
    id: 'iphone-14-pro',
    name: "iPhone 14 Pro",
    brand: 'iPhone',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    mockupImage: '/phone-mockups/iphone-14-pro.png',
    canvas: { width: 420, height: 846 },
    print:  { width: 1260, height: 2538 },
    safeArea:     { x: 21, y: 34, width: 378, height: 778, radius: 42 },
    cameraCutout: { x: 0, y: 0, width: 228, height: 236, radius: 41 },
  },
  {
    id: 'iphone-14',
    name: "iPhone 14",
    brand: 'iPhone',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    mockupImage: '/phone-mockups/iphone-14.png',
    canvas: { width: 420, height: 819 },
    print:  { width: 1260, height: 2457 },
    safeArea:     { x: 21, y: 33, width: 378, height: 753, radius: 42 },
    cameraCutout: { x: 39, y: 26, width: 142, height: 141, radius: 25 },
  },
  {
    id: 'iphone-13-pro-max',
    name: "iPhone 13 Pro Max",
    brand: 'iPhone',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    mockupImage: '/phone-mockups/iphone-13-pro-max.png',
    canvas: { width: 420, height: 854 },
    print:  { width: 1260, height: 2562 },
    safeArea:     { x: 21, y: 34, width: 378, height: 786, radius: 42 },
    cameraCutout: { x: 0, y: 0, width: 272, height: 271, radius: 49 },
  },
  {
    id: 'iphone-13-pro',
    name: "iPhone 13 Pro",
    brand: 'iPhone',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    mockupImage: '/phone-mockups/iphone-13-pro.png',
    canvas: { width: 420, height: 896 },
    print:  { width: 1260, height: 2688 },
    safeArea:     { x: 21, y: 36, width: 378, height: 824, radius: 42 },
    cameraCutout: { x: 0, y: 0, width: 253, height: 255, radius: 46 },
  },
  {
    id: 'iphone-13',
    name: "iPhone 13",
    brand: 'iPhone',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    mockupImage: '/phone-mockups/iphone-13.png',
    canvas: { width: 420, height: 824 },
    print:  { width: 1260, height: 2472 },
    safeArea:     { x: 21, y: 33, width: 378, height: 758, radius: 42 },
    cameraCutout: { x: 0, y: 0, width: 213, height: 214, radius: 38 },
  },
  {
    id: 'iphone-12-pro-max',
    name: "iPhone 12 Pro Max",
    brand: 'iPhone',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    mockupImage: '/phone-mockups/iphone-12-pro-max.png',
    canvas: { width: 420, height: 799 },
    print:  { width: 1260, height: 2397 },
    safeArea:     { x: 21, y: 32, width: 378, height: 735, radius: 42 },
    cameraCutout: { x: 0, y: 0, width: 223, height: 242, radius: 40 },
  },
  {
    id: 'iphone-12-pro',
    name: "iPhone 12 Pro",
    brand: 'iPhone',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    mockupImage: '/phone-mockups/iphone-12-pro.png',
    canvas: { width: 420, height: 820 },
    print:  { width: 1260, height: 2460 },
    safeArea:     { x: 21, y: 33, width: 378, height: 754, radius: 42 },
    cameraCutout: { x: 0, y: 0, width: 235, height: 237, radius: 42 },
  },
  {
    id: 'iphone-12',
    name: "iPhone 12",
    brand: 'iPhone',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    mockupImage: '/phone-mockups/iphone-12.png',
    canvas: { width: 420, height: 820 },
    print:  { width: 1260, height: 2460 },
    safeArea:     { x: 21, y: 33, width: 378, height: 754, radius: 42 },
    cameraCutout: { x: 42, y: 45, width: 136, height: 140, radius: 24 },
  },
  {
    id: 'iphone-11-pro-max',
    name: "iPhone 11 Pro Max",
    brand: 'iPhone',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    mockupImage: '/phone-mockups/iphone-11-pro-max.png',
    canvas: { width: 420, height: 827 },
    print:  { width: 1260, height: 2481 },
    safeArea:     { x: 21, y: 33, width: 378, height: 761, radius: 42 },
    cameraCutout: { x: 2, y: 2, width: 208, height: 230, radius: 37 },
  },
  {
    id: 'iphone-11-pro',
    name: "iPhone 11 Pro",
    brand: 'iPhone',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    mockupImage: '/phone-mockups/iphone-11-pro.png',
    canvas: { width: 420, height: 799 },
    print:  { width: 1260, height: 2397 },
    safeArea:     { x: 21, y: 32, width: 378, height: 735, radius: 42 },
    cameraCutout: { x: 0, y: 0, width: 227, height: 239, radius: 41 },
  },
  {
    id: 'iphone-11',
    name: "iPhone 11",
    brand: 'iPhone',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    mockupImage: '/phone-mockups/iphone-11.png',
    canvas: { width: 420, height: 824 },
    print:  { width: 1260, height: 2472 },
    safeArea:     { x: 21, y: 33, width: 378, height: 758, radius: 42 },
    cameraCutout: { x: 43, y: 39, width: 120, height: 96, radius: 17 },
  },
  // Samsung models — no mockup yet, rendered as generic rounded-rect case.
  {
    id: 'samsung-s24-ultra',
    name: 'Samsung S24 Ultra',
    brand: 'Samsung',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    canvas: { width: 420, height: 820 },
    print:  { width: 1440, height: 3120 },
    safeArea:     { x: 24, y: 24, width: 372, height: 772, radius: 42 },
    cameraCutout: { x: 320, y: 34, width: 64, height: 64, radius: 32 },
  },
  {
    id: 'samsung-s24',
    name: 'Samsung S24',
    brand: 'Samsung',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    canvas: { width: 380, height: 780 },
    print:  { width: 1170, height: 2532 },
    safeArea:     { x: 22, y: 22, width: 336, height: 736, radius: 42 },
    cameraCutout: { x: 300, y: 30, width: 60, height: 60, radius: 30 },
  },
  {
    id: 'samsung-s23',
    name: 'Samsung S23',
    brand: 'Samsung',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    canvas: { width: 380, height: 780 },
    print:  { width: 1170, height: 2532 },
    safeArea:     { x: 22, y: 22, width: 336, height: 736, radius: 42 },
    cameraCutout: { x: 290, y: 30, width: 60, height: 60, radius: 30 },
  },
  // "Other / Not listed" — customer types their phone model into a text field.
  {
    id: 'other',
    name: 'Other / Not listed',
    brand: 'Other',
    shopifyVariantId: 'REPLACE_WITH_SHOPIFY_VARIANT_ID',
    canvas: { width: 380, height: 780 },
    print:  { width: 1170, height: 2532 },
    safeArea:     { x: 22, y: 22, width: 336, height: 736, radius: 42 },
    cameraCutout: { x: 34, y: 34, width: 130, height: 130, radius: 28 },
    isOther: true,
  },
];

export const DEFAULT_MODEL_ID = 'iphone-15-pro-max';

export function getModel(id: string): PhoneModel {
  return PHONE_MODELS.find((m) => m.id === id) ?? PHONE_MODELS[0];
}
