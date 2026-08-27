import type { NextConfig } from 'next';

const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isGitHubPagesBuild ? '/seoul' : '',
  assetPrefix: isGitHubPagesBuild ? '/seoul/' : undefined,
};

export default nextConfig;
