'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

/**
 * Minimal i18n for the customizer.
 *
 * - Two languages: English (default) and Arabic.
 * - Selection persists in localStorage under 'js-cases-lang'.
 * - When Arabic is active we set `dir="rtl"` and `lang="ar"` on the
 *   document element so the whole UI flows right-to-left.
 * - The DESIGN CANVAS is intentionally never mirrored — the customer's
 *   layout on the case is a pixel composition, not text, and flipping it
 *   would distort their design. We force `dir="ltr"` on the canvas wrapper
 *   so its internal pointer math stays consistent.
 * - Shopify line item property KEYS stay in English regardless of UI
 *   language so the fulfillment team gets stable identifiers.
 *
 * To add a new translatable string: add a key to `Translations` below,
 * then provide en + ar values. Use `t('myKey')` in a component to read it.
 * Missing keys fall back to the English version (and log a console warning).
 */

export type Lang = 'en' | 'ar';

interface Translations {
  // Loading screen
  loadingTitle: string;
  reloadDesigner: string;
  takingLonger: string;

  // Hero / header
  designYourOwn: string;
  createYourOwnCase: string;
  subtitle: string;
  preview: string;
  resetDesign: string;
  resetConfirm: string;

  // Step indicator
  stepPhone: string;
  stepPhoneShort: string;
  stepDesign: string;
  stepDesignShort: string;
  stepPreview: string;
  stepPreviewShort: string;
  stepCart: string;
  stepCartShort: string;

  // Tabs
  tabPhone: string;
  tabUpload: string;
  tabText: string;
  tabStickers: string;
  tabColors: string;
  tabLayers: string;

  // Product options
  phoneModel: string;
  phoneModelHelper: string;
  otherNotListed: string;
  customPhoneModelLabel: string;
  customPhoneModelPlaceholder: string;
  customPhoneModelHelper: string;
  phoneColor: string;
  phoneColorHelper: string;
  customColor: string;
  caseType: string;
  solidColor: string;
  transparentCase: string;
  caseTypeHelper: string;
  caseColor: string;
  background: string;
  backgroundTransparent: string;

  // Phone color names
  colorBlack: string;
  colorWhite: string;
  colorSilver: string;
  colorGold: string;
  colorBlue: string;
  colorPink: string;
  colorNaturalTitanium: string;
  colorDesertTitanium: string;

  // Tools
  uploadImage: string;
  uploadHelper: string;
  uploadButton: string;
  uploadDragHere: string;
  uploadTooBig: string;
  uploadWrongType: string;
  uploadLowRes: string;

  addText: string;
  textPlaceholder: string;
  textAdd: string;
  textFontFamily: string;
  textFontSize: string;
  textColor: string;
  textAlign: string;
  textStyle: string;
  textLayout: string;
  textLayoutHorizontal: string;
  textLayoutMultiline: string;
  textLayoutStacked: string;
  textLetterSpacing: string;
  textLineHeight: string;

  stickers: string;
  stickersSearch: string;
  stickersCategoryAll: string;
  stickersCategoryMen: string;
  stickersCategoryWomen: string;
  stickersEmpty: string;

  layers: string;
  layersEmpty: string;
  layersHint: string;
  layerVisibility: string;
  layerForward: string;
  layerBackward: string;
  layerDelete: string;

  // Canvas chrome
  cameraInfo: string;
  showSafeArea: string;
  previewMode: string;
  backToEditing: string;

  // Mobile drawer
  tools: string;
  hideTools: string;

  // Add to cart
  addToCart: string;
  addCustomCaseToCart: string;
  addAtLeastOneElement: string;
  resolveErrorsFirst: string;
  typePhoneModelFirst: string;
  variantNotConfigured: string;

  // Summary modal
  reviewYourCase: string;
  reviewSubtitle: string;
  confirmAndCheckout: string;
  working: string;
  rowPhoneModel: string;
  rowCustomPhoneModel: string;
  rowPhoneColor: string;
  rowCaseType: string;
  rowCaseColor: string;
  rowCustomizedCase: string;
  rowYes: string;
  caseTypeSolidValue: string;
  caseTypeTransparentValue: string;

  // Status / errors
  statusExporting: string;
  statusUploading: string;
  statusRedirecting: string;
  statusError: string;

  // Validation messages
  validationOutsideSafeArea: string;
  validationOutsideCanvas: string;
  validationCameraOverlap: string;
  validationLowResImage: string;

  // Language toggle
  languageToggle: string;
  languageEnglish: string;
  languageArabic: string;
}

const en: Translations = {
  loadingTitle: 'Preparing your custom case designer…',
  reloadDesigner: 'Reload designer',
  takingLonger: 'Taking longer than usual.',

  designYourOwn: 'Design your own',
  createYourOwnCase: 'Create Your Own Case',
  subtitle:
    'Upload your photos, add text, add stickers, and design a case that feels completely yours.',
  preview: 'Preview',
  resetDesign: 'Reset',
  resetConfirm: 'Clear your current design? This cannot be undone.',

  stepPhone: 'Choose Phone',
  stepPhoneShort: 'Phone',
  stepDesign: 'Design',
  stepDesignShort: 'Design',
  stepPreview: 'Preview',
  stepPreviewShort: 'Preview',
  stepCart: 'Add to Cart',
  stepCartShort: 'Cart',

  tabPhone: 'Phone',
  tabUpload: 'Upload',
  tabText: 'Text',
  tabStickers: 'Stickers',
  tabColors: 'Colors',
  tabLayers: 'Layers',

  phoneModel: 'Phone Model',
  phoneModelHelper: 'Pick your phone so the case matches the right shape.',
  otherNotListed: 'Other / Not listed',
  customPhoneModelLabel: 'Your phone model',
  customPhoneModelPlaceholder: 'e.g. Xiaomi Redmi Note 13',
  customPhoneModelHelper:
    'Type the exact model name. Our team will confirm availability before printing.',
  phoneColor: 'Phone color',
  phoneColorHelper: 'Choose your phone color to preview how the case will look.',
  customColor: 'Custom color',
  caseType: 'Case type',
  solidColor: 'Solid Color',
  transparentCase: 'Transparent',
  caseTypeHelper: 'Solid prints onto a colored case. Transparent prints onto a clear case.',
  caseColor: 'Case color',
  background: 'Background',
  backgroundTransparent: 'Transparent',

  colorBlack: 'Black',
  colorWhite: 'White',
  colorSilver: 'Silver',
  colorGold: 'Gold',
  colorBlue: 'Blue',
  colorPink: 'Pink',
  colorNaturalTitanium: 'Natural Titanium',
  colorDesertTitanium: 'Desert Titanium',

  uploadImage: 'Upload an image',
  uploadHelper: 'JPEG, PNG, or WEBP. Up to 8 MB.',
  uploadButton: 'Choose file',
  uploadDragHere: 'Or drag a file here',
  uploadTooBig: 'That file is over 8 MB. Please pick a smaller one.',
  uploadWrongType: "We only accept JPEG, PNG, or WEBP. SVG isn't supported.",
  uploadLowRes:
    'This image is low resolution — it may look blurry when printed at full size.',

  addText: 'Add text',
  textPlaceholder: 'Type something…',
  textAdd: 'Add to design',
  textFontFamily: 'Font',
  textFontSize: 'Size',
  textColor: 'Color',
  textAlign: 'Align',
  textStyle: 'Style',
  textLayout: 'Layout',
  textLayoutHorizontal: 'Horizontal',
  textLayoutMultiline: 'Multiline',
  textLayoutStacked: 'Stacked',
  textLetterSpacing: 'Letter spacing',
  textLineHeight: 'Line height',

  stickers: 'Stickers',
  stickersSearch: 'Search stickers',
  stickersCategoryAll: 'All',
  stickersCategoryMen: 'Men',
  stickersCategoryWomen: 'Women',
  stickersEmpty: 'No stickers match that search.',

  layers: 'Layers',
  layersEmpty: 'Add an image, text, or sticker to start designing.',
  layersHint: 'Top of the list = on top of the design.',
  layerVisibility: 'Toggle visibility',
  layerForward: 'Bring forward',
  layerBackward: 'Send backward',
  layerDelete: 'Delete',

  cameraInfo:
    'Camera area — anything placed over the camera will be removed from the final print.',
  showSafeArea: 'Show safe area',
  previewMode: 'Preview',
  backToEditing: 'Back to editing',

  tools: 'Tools',
  hideTools: 'Hide tools',

  addToCart: 'Add to Cart',
  addCustomCaseToCart: 'Add Custom Case to Cart',
  addAtLeastOneElement: 'Add at least one element to your design first.',
  resolveErrorsFirst: 'Please resolve the errors before adding to cart.',
  typePhoneModelFirst: 'Please type your phone model before adding to cart.',
  variantNotConfigured:
    'The custom case Shopify variant ID is not configured yet. The store owner needs to set NEXT_PUBLIC_DEFAULT_CUSTOM_CASE_VARIANT_ID in the deployment environment.',

  reviewYourCase: 'Review your case',
  reviewSubtitle: 'Check the details below before we send you to checkout.',
  confirmAndCheckout: 'Confirm & checkout',
  working: 'Working…',
  rowPhoneModel: 'Phone Model',
  rowCustomPhoneModel: 'Custom Phone Model',
  rowPhoneColor: 'Phone Color',
  rowCaseType: 'Case Type',
  rowCaseColor: 'Case Color',
  rowCustomizedCase: 'Customized Case',
  rowYes: 'Yes',
  caseTypeSolidValue: 'Solid Color',
  caseTypeTransparentValue: 'Transparent',

  statusExporting: 'Preparing your design…',
  statusUploading: 'Uploading design…',
  statusRedirecting: 'Your custom case is ready. Redirecting you to checkout…',
  statusError: "We couldn't prepare your design. Please try again.",

  validationOutsideSafeArea: 'is outside the safe area and may be cropped.',
  validationOutsideCanvas: 'is off the case and will not print.',
  validationCameraOverlap:
    'Anything inside the camera area will be removed from the final print.',
  validationLowResImage:
    'is a low-resolution image and may look blurry when printed.',

  languageToggle: 'العربية',
  languageEnglish: 'English',
  languageArabic: 'العربية',
};

const ar: Translations = {
  loadingTitle: 'نُحضّر مصمم الجراب المخصص الخاص بك…',
  reloadDesigner: 'إعادة تحميل المصمم',
  takingLonger: 'الأمر يستغرق وقتاً أطول من المعتاد.',

  designYourOwn: 'صمّم بنفسك',
  createYourOwnCase: 'صمّم جرابك بنفسك',
  subtitle:
    'ارفع صورك، أضف نصوصاً واستيكرات، وصمّم جراباً يعبّر عنك بالكامل.',
  preview: 'معاينة',
  resetDesign: 'إعادة ضبط',
  resetConfirm: 'هل تريد مسح التصميم الحالي؟ لا يمكن التراجع عن هذه الخطوة.',

  stepPhone: 'اختر الموبايل',
  stepPhoneShort: 'الموبايل',
  stepDesign: 'صمّم',
  stepDesignShort: 'صمّم',
  stepPreview: 'معاينة',
  stepPreviewShort: 'معاينة',
  stepCart: 'أضف إلى السلة',
  stepCartShort: 'السلة',

  tabPhone: 'الموبايل',
  tabUpload: 'رفع صورة',
  tabText: 'نص',
  tabStickers: 'استيكرات',
  tabColors: 'الألوان',
  tabLayers: 'الطبقات',

  phoneModel: 'موديل الموبايل',
  phoneModelHelper: 'اختر موبايلك ليطابق الجراب الشكل الصحيح.',
  otherNotListed: 'موديل آخر / غير مدرج',
  customPhoneModelLabel: 'موديل موبايلك',
  customPhoneModelPlaceholder: 'مثال: Xiaomi Redmi Note 13',
  customPhoneModelHelper:
    'اكتب اسم الموديل بدقة. سيتأكد فريقنا من توفّره قبل الطباعة.',
  phoneColor: 'لون الموبايل',
  phoneColorHelper: 'اختر لون موبايلك لتشاهد كيف سيبدو الجراب عليه.',
  customColor: 'لون مخصص',
  caseType: 'نوع الجراب',
  solidColor: 'لون ثابت',
  transparentCase: 'شفاف',
  caseTypeHelper: 'اللون الثابت يُطبع على جراب ملوّن. الشفاف يُطبع على جراب شفاف.',
  caseColor: 'لون الجراب',
  background: 'الخلفية',
  backgroundTransparent: 'شفافة',

  colorBlack: 'أسود',
  colorWhite: 'أبيض',
  colorSilver: 'فضي',
  colorGold: 'ذهبي',
  colorBlue: 'أزرق',
  colorPink: 'وردي',
  colorNaturalTitanium: 'تيتانيوم طبيعي',
  colorDesertTitanium: 'تيتانيوم صحراوي',

  uploadImage: 'ارفع صورة',
  uploadHelper: 'JPEG أو PNG أو WEBP. حتى 8 ميغا بايت.',
  uploadButton: 'اختيار ملف',
  uploadDragHere: 'أو اسحب الملف هنا',
  uploadTooBig: 'حجم الملف أكبر من 8 ميغا بايت. اختر صورة أصغر.',
  uploadWrongType: 'نقبل فقط JPEG وPNG وWEBP. صيغة SVG غير مدعومة.',
  uploadLowRes: 'دقة هذه الصورة منخفضة — قد تبدو مشوّشة عند الطباعة بالحجم الكامل.',

  addText: 'أضف نصاً',
  textPlaceholder: 'اكتب شيئاً…',
  textAdd: 'أضف إلى التصميم',
  textFontFamily: 'الخط',
  textFontSize: 'الحجم',
  textColor: 'اللون',
  textAlign: 'المحاذاة',
  textStyle: 'النمط',
  textLayout: 'التخطيط',
  textLayoutHorizontal: 'أفقي',
  textLayoutMultiline: 'متعدد الأسطر',
  textLayoutStacked: 'عمودي',
  textLetterSpacing: 'تباعد الحروف',
  textLineHeight: 'تباعد الأسطر',

  stickers: 'استيكرات',
  stickersSearch: 'ابحث عن استيكر',
  stickersCategoryAll: 'الكل',
  stickersCategoryMen: 'رجال',
  stickersCategoryWomen: 'نساء',
  stickersEmpty: 'لا توجد استيكرات تطابق البحث.',

  layers: 'الطبقات',
  layersEmpty: 'أضف صورة أو نصاً أو استيكر لتبدأ التصميم.',
  layersHint: 'أعلى القائمة = فوق التصميم.',
  layerVisibility: 'إظهار / إخفاء',
  layerForward: 'إلى الأمام',
  layerBackward: 'إلى الخلف',
  layerDelete: 'حذف',

  cameraInfo:
    'منطقة الكاميرا — أي تصميم فوق الكاميرا سيتم إزالته من ملف الطباعة النهائي.',
  showSafeArea: 'إظهار المنطقة الآمنة',
  previewMode: 'معاينة',
  backToEditing: 'العودة للتعديل',

  tools: 'الأدوات',
  hideTools: 'إخفاء الأدوات',

  addToCart: 'أضف إلى السلة',
  addCustomCaseToCart: 'أضف الجراب المخصص إلى السلة',
  addAtLeastOneElement: 'أضف عنصراً واحداً على الأقل إلى التصميم أولاً.',
  resolveErrorsFirst: 'يرجى حلّ الأخطاء قبل الإضافة إلى السلة.',
  typePhoneModelFirst: 'يرجى كتابة موديل موبايلك قبل الإضافة إلى السلة.',
  variantNotConfigured:
    'لم يتم تكوين معرف متغير Shopify للجراب المخصص بعد. يحتاج المتجر إلى إعداد NEXT_PUBLIC_DEFAULT_CUSTOM_CASE_VARIANT_ID.',

  reviewYourCase: 'راجع جرابك',
  reviewSubtitle: 'تأكد من التفاصيل قبل الانتقال إلى الدفع.',
  confirmAndCheckout: 'تأكيد وإتمام الطلب',
  working: 'جارٍ المعالجة…',
  rowPhoneModel: 'موديل الموبايل',
  rowCustomPhoneModel: 'الموديل المخصص',
  rowPhoneColor: 'لون الموبايل',
  rowCaseType: 'نوع الجراب',
  rowCaseColor: 'لون الجراب',
  rowCustomizedCase: 'جراب مخصص',
  rowYes: 'نعم',
  caseTypeSolidValue: 'لون ثابت',
  caseTypeTransparentValue: 'شفاف',

  statusExporting: 'نُجهّز تصميمك…',
  statusUploading: 'يتم رفع التصميم…',
  statusRedirecting: 'جرابك المخصص جاهز. جاري تحويلك إلى الدفع…',
  statusError: 'لم نتمكّن من تجهيز تصميمك. حاول مرة أخرى.',

  validationOutsideSafeArea: 'خارج المنطقة الآمنة وقد يُقصّ من التصميم.',
  validationOutsideCanvas: 'خارج الجراب ولن يُطبع.',
  validationCameraOverlap:
    'أي عنصر داخل منطقة الكاميرا سيتم حذفه من ملف الطباعة النهائي.',
  validationLowResImage: 'صورة بدقة منخفضة وقد تبدو مشوّشة عند الطباعة.',

  languageToggle: 'English',
  languageEnglish: 'English',
  languageArabic: 'العربية',
};

const dictionaries: Record<Lang, Translations> = { en, ar };

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof Translations) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'js-cases-lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize with 'en' to match the server-rendered output and avoid
  // hydration mismatch. We read localStorage in a useEffect right after.
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'ar') setLangState(stored);
    } catch {
      /* localStorage can be blocked in private mode — ignore */
    }
  }, []);

  // Reflect language on the document element so RTL flows across the entire UI.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  };

  const dict = dictionaries[lang];
  const t = (key: keyof Translations): string => {
    const v = dict[key];
    if (v == null) {
      // Fall back to English and warn so missing keys are easy to spot in dev.
      if (typeof console !== 'undefined') {
        console.warn(`[i18n] missing translation for "${String(key)}" in "${lang}"`);
      }
      return dictionaries.en[key] || String(key);
    }
    return v;
  };

  const value: LanguageContextValue = {
    lang,
    setLang,
    t,
    isRTL: lang === 'ar',
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Safe fallback for components rendered outside the provider (shouldn't
    // happen in practice but prevents a crash during HMR or tests).
    return {
      lang: 'en',
      setLang: () => {},
      t: (k) => dictionaries.en[k] || String(k),
      isRTL: false,
    };
  }
  return ctx;
}

export type { Translations };
