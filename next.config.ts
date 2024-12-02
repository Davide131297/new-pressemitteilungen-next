import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.zeit.de',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'tagesspiegel.de',
      },
      {
        protocol: 'https',
        hostname: 'www.tagesspiegel.de',
      },
    ],
  },
};

export default nextConfig;
