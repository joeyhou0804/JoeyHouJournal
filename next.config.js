/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server-side mode to enable API routes for admin panel
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/joey-hou-homepage/**',
      },
    ],
  },
}
module.exports = nextConfig

