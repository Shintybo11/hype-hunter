import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        pathname: '/images.kicksfinder.com/**',
      },
      {
        protocol: 'https',
        hostname: 'images.solecollector.com',
      },
      {
        protocol: 'https',
        hostname: 'sneakernews.com',
      },
      {
        protocol: 'https',
        hostname: '*.sneakernews.com',
      },
      {
        protocol: 'https',
        hostname: 'thesolesupplier.co.uk',
      },
      {
        protocol: 'https',
        hostname: '*.thesolesupplier.co.uk',
      },
      {
        protocol: 'https',
        hostname: 'i1.adis.ws',
      },
      {
        protocol: 'https',
        hostname: 'static.nike.com',
      },
    ],
  },
};

export default nextConfig;
