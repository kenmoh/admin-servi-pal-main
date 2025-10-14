import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      new URL(
        "https://mohdelivery.s3.us-east-1.amazonaws.com/servipalicon/AppIcon.png",
      ),
    ],
  },
};

export default nextConfig;
