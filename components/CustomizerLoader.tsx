'use client';

import { useEffect, useState } from 'react';

/**
 * Loader shown while the customizer chunk is loading (it's a large client-only
 * bundle dynamic-imported by app/page.tsx). After 8 seconds of waiting it
 * surfaces a Reload button — useful on flaky mobile networks where a chunk
 * fetch can stall.
 *
 * Translations are inlined here so the loader doesn't import anything from
 * the (large) i18n module — the loader needs to render fast on the very
 * first paint of the page, before the main bundle resolves.
 */
const LOADER_COPY = {
  en: {
    body: 'Preparing your custom case designer…',
    slow: 'Taking longer than usual.',
    reload: 'Reload designer',
  },
  ar: {
    body: 'جاري تجهيز محرّر الجراب المخصص…',
    slow: 'يستغرق وقتاً أطول من المعتاد.',
    reload: 'إعادة تحميل المحرّر',
  },
} as const;

export default function CustomizerLoader() {
  const [showReload, setShowReload] = useState(false);
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('jscases:lang');
      if (stored === 'ar' || stored === 'en') setLang(stored);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowReload(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  const copy = LOADER_COPY[lang];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: '#CCC0B4' }}
      role="status"
      aria-live="polite"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/js-cases-logo-transparent.png"
        alt="JS Cases"
        className="h-14 md:h-16 w-auto mb-8"
      />

      {/* Spinner — pure CSS ring in brand maroon */}
      <div
        className="w-10 h-10 rounded-full mb-5"
        style={{
          border: '4px solid rgba(105, 0, 1, 0.18)',
          borderTopColor: '#690001',
          animation: 'js-spin 0.9s linear infinite',
        }}
      />

      <p className="text-sm md:text-base font-medium" style={{ color: '#000000' }}>
        {copy.body}
      </p>

      {showReload && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-xs text-black/60 text-center max-w-xs">
            {copy.slow}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 rounded-pill text-sm font-bold transition active:scale-95"
            style={{ backgroundColor: '#690001', color: '#FFFFFF' }}
          >
            {copy.reload}
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes js-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
