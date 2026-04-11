/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/energyhub-celsia",
  assetPrefix: "/energyhub-celsia/",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;