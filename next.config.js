/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  // Solo aplica el prefijo si estamos en producción (GitHub)
  basePath: isProd ? '/energyhub-celsia' : '',
  assetPrefix: isProd ? '/energyhub-celsia/' : '',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
