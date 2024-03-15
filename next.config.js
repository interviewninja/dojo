// /** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      JUDGE0_API_URL: process.env.JUDGE0_API_URL,
      GOOGLE_ANALYTICS_CODE: process.env.GOOGLE_ANALYTICS_CODE
    },
    webpack: (config) => {
      config.module.rules.push({
        test: /\.(mov|mp4)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            publicPath: '/_next/static/videos/',
            outputPath: 'static/videos/',
          },
        },
      });
  
      return config;
    },
  };
  
  module.exports = nextConfig;
  