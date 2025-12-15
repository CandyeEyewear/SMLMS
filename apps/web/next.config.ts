import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@sm-lms/shared', '@sm-lms/database'],
};

export default nextConfig;
