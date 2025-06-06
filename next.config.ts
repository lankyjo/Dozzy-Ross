import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ogaticket-cms.vercel.app',
        port: "",
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/api/media/file/**',
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.ogaticket.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "p-static.ogaticket.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "linx-stagin-bucket.s3.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "templates.lubnaloom.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
