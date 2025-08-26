import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  ...(process.env.NODE_ENV !== 'production' && {
    cacheMaxMemorySize: 0,
  }),

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'hsjbtgctzfkncwianizn.supabase.co',
      },
    ],
  },

  compiler: {
    emotion: {
      sourceMap: process.env.NODE_ENV !== 'production',
      autoLabel: 'dev-only',
      labelFormat: '[local]',
      importMap: {
        '@emotion/react': {
          styled: {
            canonicalImport: ['@emotion/styled', 'default'],
          },
        },
      },
    },
  },
}

export default nextConfig
