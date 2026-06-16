'use client';

import { useLanguage } from './LanguageContext';

import { useRef, useState } from 'react';

interface Props {
  onAddImage: (src: string, naturalWidth: number, naturalHeight: number) => void;
}

// Security: strict allowlist. SVG is intentionally excluded — SVGs can carry
// scripts and are an XSS vector if rendered inline. Only raster photo formats.
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
// Guard against decompression-bomb / memory crashes from absurd dimensions.
const MAX_DIMENSION = 8000; // px on the longest side
const LOW_RES_WARN = 800; // warn (don't block) below this on the longest side

export default function ImageTools({ onAddImage }: Props) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setNotice(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(t('uploadErrorType'));
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(t('uploadErrorType'));
      return;
    }

    setLoading(true);
    try {
      const dataUrl = await readAsDataUrl(file);
      const { width, height } = await getImageDimensions(dataUrl);

      const longest = Math.max(width, height);
      if (longest > MAX_DIMENSION) {
        setError(
          `That image is very large (${width}×${height}px). Please use one no larger than ${MAX_DIMENSION}px on its longest side.`
        );
        return;
      }
      if (longest < LOW_RES_WARN) {
        // Warn but still allow — don't crash or block the customer.
        setNotice(t('uploadWarnLowRes'));
      }

      onAddImage(dataUrl, width, height);
    } catch {
      setError('We couldn\u2019t read that image. Please try a different file.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-brand-paper border border-brand-stroke rounded-card p-4 shadow-card">
      <h3 className="font-bold text-sm mb-3">{t('uploadTitle')}</h3>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition ${
          dragOver
            ? 'border-brand-primary bg-brand-primary-soft'
            : 'border-brand-stroke hover:border-brand-primary hover:bg-brand-primary-soft/40'
        }`}
      >
        {loading ? (
          <p className="text-sm text-brand-muted">Processing…</p>
        ) : (
          <>
            <div className="mx-auto w-12 h-12 rounded-pill bg-brand-primary-soft flex items-center justify-center mb-2">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#690001"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
            </div>
            <p className="text-sm font-semibold">Tap to upload</p>
            <p className="text-xs text-brand-muted mt-1">{t('uploadHelper')}</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = '';
          }}
        />
      </div>

      {error && (
        <p className="text-xs text-brand-primary font-semibold mt-3 bg-brand-primary-soft rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      {notice && (
        <p className="text-xs text-amber-700 mt-3 bg-amber-50 rounded-lg px-3 py-2">
          {notice}
        </p>
      )}

      <p className="text-xs text-brand-muted mt-3">
        Tip: use the highest-quality photo you have. Low-res images can look blurry
        when printed.
      </p>
    </div>
  );
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = src;
  });
}
