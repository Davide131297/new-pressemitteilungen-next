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
  // async redirects() {
  //   return [
  //     {
  //       source: '/umfragen',
  //       destination: '/',
  //       permanent: true,
  //     },
  //     {
  //       source: '/news',
  //       destination: '/',
  //       permanent: true,
  //     },
  //   ];
  // },
};

export default nextConfig;
