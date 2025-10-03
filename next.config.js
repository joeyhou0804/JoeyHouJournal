/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to enable server-side API routes for admin panel
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/joey-hou-homepage/**',
      },
    ],
  },
  trailingSlash: true,
}
module.exports = nextConfig

