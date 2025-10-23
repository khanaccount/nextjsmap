import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/map-data",
        destination: "http://217.170.194.44:3341/map-data",
      },
      {
        source: "/api/map-data-alt",
        destination: "http://217.170.194.44:3137/map-data",
      },
      {
        source: "/api/network-data",
        destination: "http://217.170.194.44:3341/network-data",
      },
    ];
  },
};

export default nextConfig;
