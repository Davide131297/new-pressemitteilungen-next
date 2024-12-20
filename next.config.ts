import type { NextConfig } from 'next';
import dotenv from 'dotenv';

dotenv.config();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/news',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
