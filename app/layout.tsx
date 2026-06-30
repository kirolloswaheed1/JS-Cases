import type { Metadata } from 'next';
import '../styles/globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://designer.jscases.co'
  ),
  title: 'JS Cases — Create Your Own Case',
  description:
    'Design your own phone case. Upload your photos, add text, play with colors, and build a case that feels completely yours.',
  openGraph: {
    title: 'JS Cases — Create Your Own Case',
    description:
      'Unique cases, built for you. Upload photos, add text and stickers, and design a case that feels completely yours.',
    images: ['/js-cases-logo.png'],
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Montserrat:wght@400;600;700&family=Playfair+Display:wght@400;700&family=Cairo:wght@400;700&family=Tajawal:wght@400;700&family=Amiri:wght@400;700&family=Reem+Kufi:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="font-sans">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}

