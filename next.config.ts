import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  files: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io", //check here  hostname: "<APP_ID>.ufs.sh",
        pathname: "/f/*",
      },
    ],
  },
};

export default nextConfig;
