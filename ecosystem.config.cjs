module.exports = {
  apps: [
    {
      name: "maktaba-jamaat",
      cwd: "./server",
      script: "src/index.js",
      instances: 1,
      autorestart: true,
      env: {
        NODE_ENV: "production",
        PORT: 5000,
      },
    },
  ],
};
