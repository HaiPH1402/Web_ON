#!/usr/bin/env bash
# =====================================================================
# BƯỚC 1 — Cài môi trường trên VM (chỉ chạy MỘT LẦN khi tạo VM mới)
# Cài: Node.js 20, Git, Nginx, PM2, Certbot (HTTPS miễn phí)
# Cách dùng:  bash deploy/1-setup-vm.sh
# =====================================================================
set -euo pipefail

echo "==> Cập nhật hệ thống..."
sudo apt-get update -y

echo "==> Cài Node.js 20..."
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

echo "==> Cài Git, Nginx, Certbot..."
sudo apt-get install -y git nginx certbot python3-certbot-nginx

echo "==> Cài PM2 (giữ app chạy nền 24/7)..."
sudo npm install -g pm2

echo ""
echo "✅ Xong bước 1. Phiên bản đã cài:"
echo "   Node:  $(node -v)"
echo "   npm:   $(npm -v)"
echo "   Nginx: $(nginx -v 2>&1)"
echo "   PM2:   $(pm2 -v)"
echo ""
echo "Tiếp theo: chạy  bash deploy/2-deploy.sh"
