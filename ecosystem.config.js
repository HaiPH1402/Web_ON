// Cấu hình PM2 để chạy app Next.js 24/7 trên VM (Google Compute Engine).
// cwd: __dirname đảm bảo process.cwd() trỏ đúng thư mục dự án
// → thư mục uploads/ và file prod.db nằm đúng chỗ, không bị lạc.
module.exports = {
  apps: [
    {
      name: "ongnuoc",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
