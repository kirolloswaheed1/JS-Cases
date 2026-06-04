/** @type {import('next').NextConfig} */

// Content Security Policy.
// NOTE: this app uses the Canvas API, data: URLs for images/exports, inline
// styles (Tailwind), and Google Fonts. The policy below is deliberately
// practical so it won't break image loading or canvas export.
//
// If you later add a storage provider (Supabase/Cloudinary) or other API hosts,
// add their origins to `img-src` and `connect-src` below.
const ContentSecurityPolicy = [
  "default-src 'self'",
  // 'unsafe-inline' is needed for Tailwind's injected styles and Google Fonts.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  // data: + blob: are required for canvas image loading and PNG export.
  // https: kept broad so customer-hosted/Shopify images load; tighten if desired.
  "img-src 'self' data: blob: https:",
  // connect-src: same-origin API + add your storage/API hosts here later.
  "connect-src 'self' https:",
  // Next.js requires 'unsafe-inline'/'unsafe-eval' for its runtime in dev;
  // 'unsafe-eval' can be removed in production if you don't use eval-based libs.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Allow embedding only by the Shopify store + self (so it can live in an iframe on jscases.co).
  "frame-ancestors 'self' https://jscases.co https://*.jscases.co https://*.myshopify.com",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: ContentSecurityPolicy },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    // Lock down powerful features the app doesn't use.
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  // X-Frame-Options is the legacy equivalent of frame-ancestors. SAMEORIGIN is
  // a safe default; frame-ancestors (above) is what modern browsers honor and
  // it additionally allows the Shopify store to embed the app.
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
];

const nextConfig = {
  reactStrictMode: true,
  // Konva uses 'canvas' on the server; we render it client-only so we skip the dep.
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
