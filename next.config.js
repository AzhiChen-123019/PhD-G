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
    return config;
  }
};

module.exports = nextConfig;
