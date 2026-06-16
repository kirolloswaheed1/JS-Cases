'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as i18n from '@/lib/translations';
import type { Lang, TranslationKey } from '@/lib/translations';

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Translate a key into the active language. */
  t: (key: TranslationKey) => string;
  /** True when the active language is right-to-left. */
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'jscases:lang';

function isValidLang(value: unknown): value is Lang {
  return typeof value === 'string' && (i18n.SUPPORTED_LANGS as string[]).includes(value);
}

/**
 * Wraps the app and provides the active language + a translate function.
 *
 * - Default language is English (matches the spec: English on first load).
 * - The chosen language persists in localStorage under `jscases:lang`.
 * - When the language changes we update `<html lang="…" dir="…">` so the
 *   browser flips text alignment and the page reads correctly with screen
 *   readers. The phone-design CANVAS is insulated separately
 *   (its wrapper sets dir="ltr") so the customer's design is never mirrored.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(i18n.DEFAULT_LANG);

  // Hydrate from localStorage on first client render. Anything invalid in
  // storage is ignored — we stay on the default.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isValidLang(stored)) setLangState(stored);
    } catch {
      /* localStorage can throw in private-browsing modes — safe to ignore */
    }
  }, []);

  // Reflect the active language on the document so CSS / a11y inherit it.
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore — preference just won't persist */
    }
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      t: (key) => i18n.translate(key, lang),
      isRTL: lang === 'ar',
    }),
    [lang, setLang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Fall back gracefully if a component is rendered outside the provider
    // (e.g. an isolated unit test) — return an English no-op so nothing
    // crashes at runtime.
    return {
      lang: i18n.DEFAULT_LANG,
      setLang: () => {},
      t: (key) => i18n.translate(key, i18n.DEFAULT_LANG),
      isRTL: false,
    };
  }
  return ctx;
}
