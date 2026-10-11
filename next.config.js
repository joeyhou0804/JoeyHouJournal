/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server-side mode to enable API routes for admin panel
  experimental: {
    // Keep prettier out of the server bundle: @react-email/components requires
    // prettier/standalone at load time, and bundling it breaks the build
    // (swc minify turns a class's base into `extends null`).
    serverComponentsExternalPackages: ['prettier'],
  },
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

