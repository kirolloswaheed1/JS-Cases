'use client';

import dynamic from 'next/dynamic';

// Konva touches the DOM — we must render the customizer client-side only.
const CustomizerApp = dynamic(() => import('@/components/CustomizerApp'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-brand-primary/20 shimmer mx-auto mb-4" />
        <p className="text-brand-muted">Loading the customizer…</p>
      </div>
    </div>
  ),
});

export default function Page() {
  return <CustomizerApp />;
}
