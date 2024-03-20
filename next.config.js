// /** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      JUDGE0_API_URL: process.env.JUDGE0_API_URL,
      GOOGLE_ANALYTICS_CODE: process.env.GOOGLE_ANALYTICS_CODE,
      RUNPOD_API_ID: process.env.RUNPOD_API_ID,
      RUNPOD_API_KEY: process.env.RUNPOD_API_KEY
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
  