import { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**", // Allows any hostname with "http"
      },
      {
        protocol: "https",
        hostname: "**", // Allows any hostname with "https"
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false,
      dns: false,
      tls: false,
      fs: false,
      request: false,
    };
    return config;
  },
  transpilePackages: ['react-leaflet'],
};

export default nextConfig;
