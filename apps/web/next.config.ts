import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  cleanDistDir: false,
  outputFileTracingRoot: path.join(__dirname, '../../'),
  transpilePackages: ['@nexora/ui', '@nexora/shared'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
};

export default nextConfig;
