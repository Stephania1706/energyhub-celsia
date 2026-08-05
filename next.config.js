/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  // Elimina el assetPrefix y deja solo el basePath
  basePath: isProd ? '/energyhub-celsia' : '',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

