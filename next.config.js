/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // 解决 crypto 模块问题
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false
      };
    }
    
    // 解决 undici 库解析问题
    config.module.rules.push({
      test: /node_modules\/undici\//,
      type: 'javascript/auto'
    });
    
    // 避免在客户端构建时解析爬虫相关模块
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/lib/job-crawler': false,
        '@/lib/ai-job-matching-complete': false
      };
    }
    
    return config;
  }
};

module.exports = nextConfig;
