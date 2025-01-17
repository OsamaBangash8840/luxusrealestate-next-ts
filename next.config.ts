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
};

export default nextConfig;
