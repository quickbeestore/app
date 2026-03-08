/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'cdn.shopify.com',
      'images.unsplash.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.shopify.com',
      },
    ],
  },
}

module.exports = nextConfig
