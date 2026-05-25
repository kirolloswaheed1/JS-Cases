'use client';

import { useRef, useState } from 'react';

interface Props {
  onAddImage: (src: string, naturalWidth: number, naturalHeight: number) => void;
}

export default function ImageTools({ onAddImage }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      alert('Image is too large. Please choose a file under 15 MB.');
      return;
    }
    setLoading(true);
    try {
      const dataUrl = await readAsDataUrl(file);
      const { width, height } = await getImageDimensions(dataUrl);
      onAddImage(dataUrl, width, height);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white border border-brand-stroke rounded-card p-4 shadow-card">
      <h3 className="font-bold text-sm mb-3">Upload an image</h3>
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
            <div className="mx-auto w-10 h-10 rounded-pill bg-brand-primary-soft flex items-center justify-center mb-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FF4D8D"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
            </div>
            <p className="text-sm font-medium">Tap to upload</p>
            <p className="text-xs text-brand-muted mt-1">PNG, JPG up to 15 MB</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = '';
          }}
        />
      </div>
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
