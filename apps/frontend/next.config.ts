import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
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
    ],
  },
}

export default nextConfig;
