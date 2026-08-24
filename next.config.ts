import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/index.html",
        destination: "/",
        permanent: true,
      },
      {
        source: "/kamar.html",
        destination: "/kamar",
        permanent: true,
      },
      {
        source: "/penghuni.html",
        destination: "/penghuni",
        permanent: true,
      },
      {
        source: "/laporan.html",
        destination: "/laporan",
        permanent: true,
      },
      {
        source: "/pengaturan.html",
        destination: "/pengaturan",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
