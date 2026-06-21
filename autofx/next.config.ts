import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'one.exnessonelink.com' },
    ],
  },
}

export default nextConfig
