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
      {
        protocol: 'https',
        hostname: 'www.merkur.de',
      },
      {
        protocol: 'https',
        hostname: 'image.stern.de',
      },
      {
        protocol: 'https',
        hostname: 'img.welt.de',
      },
      {
        protocol: 'https',
        hostname: 'www.hna.de',
      },
      {
        protocol: 'https',
        hostname: 'i.bytvi.com',
      },
      {
        protocol: 'https',
        hostname: 'apps-cloud.n-tv.de',
      },
      {
        protocol: 'https',
        hostname: 'www.freiepresse.de',
      },
    ],
  },
};

export default nextConfig;
