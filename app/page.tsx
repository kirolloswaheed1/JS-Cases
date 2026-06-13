'use client';

import dynamic from 'next/dynamic';
import CustomizerLoader from '@/components/CustomizerLoader';

// Konva touches the DOM — we must render the customizer client-side only.
const CustomizerApp = dynamic(() => import('@/components/CustomizerApp'), {
  ssr: false,
  loading: () => <CustomizerLoader />,
});

export default function Page() {
  return <CustomizerApp />;
}
