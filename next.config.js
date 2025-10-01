/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
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

