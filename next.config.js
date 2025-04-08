/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'files.cdn.printful.com'],
  },
}

module.exports = nextConfig 