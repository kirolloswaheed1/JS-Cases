/**
 * Light-weight i18n for the JS Cases customizer.
 *
 * No dependency on i18next or react-intl — this app is small enough that a
 * single typed dictionary + a tiny React context (see LanguageContext.tsx)
 * are the right call. The dictionary is structured as keys → { en, ar }.
 *
 * Add new keys in BOTH languages. If `ar` is missing or empty at runtime the
 * `t()` helper falls back to `en` so an oversight never breaks the UI.
 *
 * Shopify line item property KEYS stay English forever — fulfillment must be
 * able to read orders regardless of the customer's UI language. Only the
 * customer-facing labels here are translated.
 */

export type Lang = 'en' | 'ar';

export const SUPPORTED_LANGS: Lang[] = ['en', 'ar'];
export const DEFAULT_LANG: Lang = 'en';

export const translations = {
  // ─── App chrome ─────────────────────────────────────────────────────────
  reset:                    { en: 'Reset',                ar: 'إعادة ضبط' },
  preview:                  { en: 'Preview',              ar: 'معاينة' },
  backToEditing:            { en: 'Back to editing',      ar: 'العودة للتعديل' },
  designYourOwn:            { en: 'Design your own',      ar: 'صمّمه بنفسك' },
  createYourOwnCase:        { en: 'Create Your Own Case', ar: 'صمّم جرابك بنفسك' },
  heroSubtitle: {
    en: 'Upload your photos, add text, add stickers, and design a case that feels completely yours.',
    ar: 'ارفع صورك، أضف نصوصاً وملصقات، وصمّم جراباً يعبّر عنك بالكامل.',
  },

  // ─── Step indicator ─────────────────────────────────────────────────────
  stepPhone:    { en: 'Choose Phone', ar: 'اختر الموبايل' },
  stepDesign:   { en: 'Design',       ar: 'صمّم' },
  stepPreview:  { en: 'Preview',      ar: 'معاينة' },
  stepCart:     { en: 'Add to Cart',  ar: 'أضف للسلة' },
  stepPhoneShort:   { en: 'Phone',    ar: 'موبايل' },
  stepDesignShort:  { en: 'Design',   ar: 'تصميم' },
  stepPreviewShort: { en: 'Preview',  ar: 'معاينة' },
  stepCartShort:    { en: 'Cart',     ar: 'السلة' },

  // ─── Tabs ───────────────────────────────────────────────────────────────
  tabPhone:    { en: 'Phone',    ar: 'الموبايل' },
  tabUpload:   { en: 'Upload',   ar: 'رفع صورة' },
  tabText:     { en: 'Text',     ar: 'نص' },
  tabStickers: { en: 'Stickers', ar: 'ملصقات' },
  tabColors:   { en: 'Colors',   ar: 'الألوان' },
  tabLayers:   { en: 'Layers',   ar: 'الطبقات' },

  // ─── Mobile drawer ──────────────────────────────────────────────────────
  tools:     { en: 'Tools',      ar: 'الأدوات' },
  hideTools: { en: 'Hide tools', ar: 'إخفاء الأدوات' },

  // ─── Product options ────────────────────────────────────────────────────
  phoneModel:        { en: 'Phone model',        ar: 'موديل الموبايل' },
  phoneModelOther:   { en: 'Other / Not listed', ar: 'موديل آخر / غير مدرج' },
  customPhoneModelPlaceholder: {
    en: 'Type your phone model, e.g. Pixel 8 Pro',
    ar: 'اكتب موديل موبايلك، مثال: Pixel 8 Pro',
  },
  customPhoneModelHelper: {
    en: 'Our team confirms availability before printing.',
    ar: 'سيقوم فريقنا بالتأكد من توفر الموديل قبل الطباعة.',
  },
  phoneColor: { en: 'Phone color', ar: 'لون الموبايل' },
  phoneColorHelper: {
    en: 'Choose your phone color to preview how the case will look.',
    ar: 'اختر لون موبايلك لمعاينة شكل الجراب على موبايلك.',
  },
  custom:      { en: 'Custom',        ar: 'مخصص' },
  caseType:    { en: 'Case type',     ar: 'نوع الجراب' },
  transparent: { en: 'Transparent',   ar: 'شفاف' },
  solidColor:  { en: 'Solid Color',   ar: 'لون ثابت' },
  caseColor:   { en: 'Case color',    ar: 'لون الجراب' },
  background:  { en: 'Background',    ar: 'الخلفية' },
  noBackground:{ en: 'No background', ar: 'بدون خلفية' },

  // ─── Phone color preset names ──────────────────────────────────────────
  colorBlack:           { en: 'Black',            ar: 'أسود' },
  colorWhite:           { en: 'White',            ar: 'أبيض' },
  colorSilver:          { en: 'Silver',           ar: 'فضي' },
  colorGold:            { en: 'Gold',             ar: 'ذهبي' },
  colorBlue:            { en: 'Blue',             ar: 'أزرق' },
  colorPink:            { en: 'Pink',             ar: 'وردي' },
  colorNaturalTitanium: { en: 'Natural Titanium', ar: 'تيتانيوم طبيعي' },
  colorDesertTitanium:  { en: 'Desert Titanium',  ar: 'تيتانيوم صحراوي' },

  // ─── Text tool ──────────────────────────────────────────────────────────
  addText:            { en: 'Add text',                ar: 'إضافة نص' },
  textPlaceholder:    { en: 'Type your text…',         ar: 'اكتب نصك هنا…' },
  textLayout:         { en: 'Layout',                  ar: 'الترتيب' },
  textLayoutHorizontal: { en: 'Horizontal',            ar: 'أفقي' },
  textLayoutMultiline:  { en: 'Multi-line',            ar: 'متعدد الأسطر' },
  textLayoutStacked:    { en: 'Stacked',               ar: 'عمودي' },
  textAlign:          { en: 'Alignment',               ar: 'محاذاة' },
  textAlignLeft:      { en: 'Left',                    ar: 'يسار' },
  textAlignCenter:    { en: 'Center',                  ar: 'وسط' },
  textAlignRight:     { en: 'Right',                   ar: 'يمين' },
  textFont:           { en: 'Font',                    ar: 'الخط' },
  textSize:           { en: 'Size',                    ar: 'الحجم' },
  textColor:          { en: 'Text color',              ar: 'لون النص' },
  textLineHeight:     { en: 'Line height',             ar: 'تباعد الأسطر' },
  textLetterSpacing:  { en: 'Letter spacing',          ar: 'تباعد الحروف' },
  textStyle:          { en: 'Style',                   ar: 'النمط' },
  textStyleNormal:    { en: 'Normal',                  ar: 'عادي' },
  textStyleBold:      { en: 'Bold',                    ar: 'عريض' },
  textStyleItalic:    { en: 'Italic',                  ar: 'مائل' },

  // ─── Image upload tool ──────────────────────────────────────────────────
  uploadTitle:        { en: 'Upload your photo',  ar: 'ارفع صورتك' },
  uploadHelper: {
    en: 'JPEG, PNG, or WEBP. Up to 8 MB.',
    ar: 'JPEG أو PNG أو WEBP. حتى 8 ميجا.',
  },
  uploadChooseFile:   { en: 'Choose file',             ar: 'اختر ملف' },
  uploadDrop:         { en: 'or drag and drop here',   ar: 'أو اسحب الملف هنا' },
  uploadErrorType: {
    en: 'Only JPEG, PNG, or WEBP images are supported.',
    ar: 'الصور المدعومة فقط: JPEG و PNG و WEBP.',
  },
  uploadErrorTooBig: {
    en: 'That file is over 8 MB. Please pick a smaller image.',
    ar: 'حجم الملف أكبر من 8 ميجا. اختر صورة أصغر.',
  },
  uploadErrorTooLarge: {
    en: 'That image is over 8000 pixels — please resize it first.',
    ar: 'الصورة أكبر من 8000 بكسل — يرجى تصغيرها أولاً.',
  },
  uploadWarnLowRes: {
    en: 'Heads up — this image is low resolution and may look blurry when printed.',
    ar: 'تنبيه — جودة هذه الصورة منخفضة وقد تظهر مشوّشة عند الطباعة.',
  },

  // ─── Stickers tool ─────────────────────────────────────────────────────
  stickersSearchPlaceholder: { en: 'Search stickers…', ar: 'ابحث في الملصقات…' },
  stickersMen:               { en: 'Men',              ar: 'رجالي' },
  stickersWomen:             { en: 'Women',            ar: 'نسائي' },
  stickersAll:               { en: 'All',              ar: 'الكل' },
  stickersEmpty:             { en: 'No stickers match.', ar: 'لا توجد ملصقات مطابقة.' },

  // ─── Layers panel ───────────────────────────────────────────────────────
  layersTitle:    { en: 'Layers',                                  ar: 'الطبقات' },
  layersCount:    { en: 'items',                                   ar: 'عنصر' },
  layersEmpty:    { en: 'Add an image, text, or sticker to start designing.',
                    ar: 'أضف صورة أو نصاً أو ملصقاً للبدء.' },
  layersHint:     { en: 'Top of the list = on top of the design.',
                    ar: 'الأعلى في القائمة = الأعلى في التصميم.' },
  layerImage:     { en: 'Image',    ar: 'صورة' },
  layerText:      { en: 'Text',     ar: 'نص' },
  layerSticker:   { en: 'Sticker',  ar: 'ملصق' },

  // ─── Add to Cart panel ─────────────────────────────────────────────────
  addToCart:            { en: 'Add Custom Case to Cart',  ar: 'أضف الجراب المخصص إلى السلة' },
  yourDesignReady:      { en: 'Your custom case is ready.', ar: 'جرابك المخصص جاهز.' },
  redirectingToCheckout:{ en: 'Redirecting you to checkout…',
                          ar: 'يتم تحويلك إلى صفحة الدفع…' },
  uploadingDesign:      { en: 'Uploading design…',         ar: 'جاري رفع التصميم…' },
  exportingDesign:      { en: 'Preparing your design…',    ar: 'جاري تجهيز التصميم…' },
  errorPreparingDesign: {
    en: "We couldn't prepare your design. Please try again.",
    ar: 'تعذّر تجهيز التصميم. يرجى المحاولة مرة أخرى.',
  },

  // ─── Cart summary modal ────────────────────────────────────────────────
  summaryTitle:   { en: 'Review your case',                   ar: 'مراجعة الجراب' },
  summarySubtitle:{ en: 'Check the details below before we send you to checkout.',
                    ar: 'راجع التفاصيل قبل إتمام الطلب.' },
  summaryConfirm: { en: 'Confirm & checkout',     ar: 'تأكيد وإتمام الشراء' },
  summaryWorking: { en: 'Working…',               ar: 'جاري المعالجة…' },
  // Row labels in the summary modal (mirror Shopify property names but in
  // the user's language for display only):
  rowPhoneModel:       { en: 'Phone Model',         ar: 'موديل الموبايل' },
  rowCustomPhoneModel: { en: 'Custom Phone Model',  ar: 'موديل الموبايل المخصص' },
  rowPhoneColor:       { en: 'Phone Color',         ar: 'لون الموبايل' },
  rowCaseType:         { en: 'Case Type',           ar: 'نوع الجراب' },
  rowCaseColor:        { en: 'Case Color',          ar: 'لون الجراب' },
  rowCustomizedCase:   { en: 'Customized Case',     ar: 'جراب مخصص' },
  yes:                 { en: 'Yes',                 ar: 'نعم' },
  other:               { en: 'Other',               ar: 'موديل آخر' },

  // ─── Validation messages ───────────────────────────────────────────────
  validationOutsideSafeArea: {
    en: 'Some of your design extends outside the printable area.',
    ar: 'بعض عناصر التصميم خارج منطقة الطباعة.',
  },
  validationCameraOverlap: {
    en: 'Anything inside the camera area will be removed from the final print.',
    ar: 'أي عناصر داخل منطقة الكاميرا سيتم حذفها من ملف الطباعة النهائي.',
  },
  cameraInfo: {
    en: 'Camera area — anything placed over the camera will be removed from the final print.',
    ar: 'منطقة الكاميرا — أي تصميم فوق الكاميرا سيتم حذفه من ملف الطباعة النهائي.',
  },

  // ─── Loader ────────────────────────────────────────────────────────────
  loaderText: {
    en: 'Preparing your custom case designer…',
    ar: 'جاري تجهيز محرّر الجراب المخصص…',
  },
  loaderSlow: { en: 'Taking longer than usual.',  ar: 'يستغرق وقتاً أطول من المعتاد.' },
  reloadDesigner: { en: 'Reload designer',         ar: 'إعادة تحميل المحرّر' },

  // ─── Validation prerequisites for cart ─────────────────────────────────
  errorAddElementsFirst: {
    en: 'Add at least one element to your design first.',
    ar: 'أضف عنصراً واحداً على الأقل للتصميم أولاً.',
  },
  errorResolveErrors: {
    en: 'Please resolve the errors before adding to cart.',
    ar: 'يرجى حل الأخطاء قبل الإضافة إلى السلة.',
  },
  errorTypePhoneModel: {
    en: 'Please type your phone model before adding to cart.',
    ar: 'يرجى كتابة موديل موبايلك قبل الإضافة إلى السلة.',
  },
  errorVariantNotConfigured: {
    en: 'The custom case Shopify variant ID is not configured yet. The store owner needs to set NEXT_PUBLIC_DEFAULT_CUSTOM_CASE_VARIANT_ID in the deployment environment.',
    ar: 'لم يتم إعداد متغيّر منتج الجراب المخصص في Shopify بعد. يجب على المالك ضبط NEXT_PUBLIC_DEFAULT_CUSTOM_CASE_VARIANT_ID في بيئة النشر.',
  },

  // ─── Language toggle ───────────────────────────────────────────────────
  languageEnglish: { en: 'English',  ar: 'English' },
  languageArabic:  { en: 'العربية', ar: 'العربية' },
};

export type TranslationKey = keyof typeof translations;

/** Resolve a translation key to a string in the active language. */
export function translate(key: TranslationKey, lang: Lang): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[lang] || entry.en || key;
}
