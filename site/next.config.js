/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Commented out for development
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
  trailingSlash: false,
}
module.exports = nextConfig

