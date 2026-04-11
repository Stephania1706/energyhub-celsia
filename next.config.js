/** @type {import('next').NextConfig} */

const nextConfig = {
    output: 'export',
    trailingSlash: true,
    images: {
        unoptimized: true,
        domains: ['images.unsplash.com'],
    },
    assetPrefix: process.env.NODE_ENV === 'production' ? '/EnergyHub' : '',
    basePath: process.env.NODE_ENV === 'production' ? '/EnergyHub' : '',
};

module.exports = nextConfig;
