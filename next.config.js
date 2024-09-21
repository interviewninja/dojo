// /** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      JUDGE0_API_URL: process.env.JUDGE0_API_URL,
      GOOGLE_ANALYTICS_CODE: process.env.GOOGLE_ANALYTICS_CODE,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      RUNPOD_API_ID: process.env.RUNPOD_API_ID,
      RUNPOD_API_KEY: process.env.RUNPOD_API_KEY,
      REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
      GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY,
      ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
      GOOGLECOLAB_API_URL: process.env.GOOGLECOLAB_API_URL,
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID
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
  