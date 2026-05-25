/** @type {import('next').NextConfig} */
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
};

module.exports = nextConfig;
