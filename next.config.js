/** @type {import('next').NextConfig} */

const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: "/energyhub-celsia",
  assetPrefix: "/energyhub-celsia/",
};

module.exports = nextConfig;
