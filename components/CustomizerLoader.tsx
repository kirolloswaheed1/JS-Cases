'use client';

import { useEffect, useState } from 'react';

/**
 * Loader shown while the customizer chunk is loading (it's a large client-only
 * bundle dynamic-imported by app/page.tsx). After 8 seconds of waiting it
 * surfaces a Reload button — useful on flaky mobile networks where a chunk
 * fetch can stall.
 */
export default function CustomizerLoader() {
  const [showReload, setShowReload] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowReload(true), 8000);
    return () => clearTimeout(t);
  }, []);

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
        Preparing your custom case designer…
      </p>

      {showReload && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-xs text-black/60 text-center max-w-xs">
            Taking longer than usual.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 rounded-pill text-sm font-bold transition active:scale-95"
            style={{ backgroundColor: '#690001', color: '#FFFFFF' }}
          >
            Reload designer
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
