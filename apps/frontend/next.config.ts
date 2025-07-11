import type { NextConfig } from "next";
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

if (process.env.NODE_ENV === 'development') {
  setupDevPlatform();
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'journull.de78d66e79f088b038213c70f0bff2a1.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: 'originui.com',
      },
      {
        protocol: 'https',
        hostname: 'images.beta.cosmos.so',
      },
      {
        protocol: 'https',
        hostname: 'www.ghibli.jp',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      }
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
