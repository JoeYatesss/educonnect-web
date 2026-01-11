const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  images: {
    domains: [
      // Add Supabase storage domain when created
      // 'your-project.supabase.co'
    ],
    formats: ['image/avif', 'image/webp'],
  },

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  // Optimize package imports for better tree-shaking
  experimental: {
    optimizePackageImports: ['lucide-react', '@tiptap/react', '@tiptap/starter-kit'],
  },
}

module.exports = withMDX(nextConfig)
