#!/usr/bin/env bash
# =====================================================================
# BƯỚC 2 — Deploy / cập nhật ứng dụng
# Chạy lần đầu để khởi chạy, và mỗi lần cập nhật code về sau.
# Tự động:
#   - Tạo .env + sinh AUTH_SECRET ngẫu nhiên (chỉ lần đầu, không ghi đè)
#   - Cài dependencies, tạo/cập nhật database, seed dữ liệu (chỉ lần đầu)
#   - Build và khởi động lại app bằng PM2
# Cách dùng:  bash deploy/2-deploy.sh
# =====================================================================
set -euo pipefail

cd "$(dirname "$0")/.."   # về thư mục gốc dự án
ROOT="$(pwd)"
echo "==> Thư mục dự án: $ROOT"

# --- 1. Tạo .env nếu chưa có (tự sinh AUTH_SECRET, KHÔNG ghi đè file cũ) ---
if [ ! -f .env ]; then
  echo "==> Chưa có .env → tạo mới với AUTH_SECRET ngẫu nhiên..."
  SECRET="$(openssl rand -base64 32)"
  cat > .env <<EOF
DATABASE_URL="file:./prod.db"
AUTH_SECRET="$SECRET"
EOF
  echo "    Đã tạo .env (AUTH_SECRET bí mật, không cần sửa)."
else
  echo "==> Đã có .env, giữ nguyên."
fi

# --- 2. Cài dependencies ---
echo "==> Cài dependencies..."
npm ci || npm install

# --- 3. Database: tạo bảng; seed dữ liệu mẫu nếu là DB mới ---
FIRST_RUN=false
if [ ! -f prod.db ]; then FIRST_RUN=true; fi

echo "==> Đồng bộ schema vào database (prisma db push)..."
npx prisma generate
npx prisma db push

if [ "$FIRST_RUN" = true ]; then
  echo "==> Database mới → nạp dữ liệu mẫu (seed)..."
  npm run db:seed || echo "    (Bỏ qua seed nếu không cần)"
else
  echo "==> Database đã tồn tại → KHÔNG seed lại (giữ dữ liệu thật)."
fi

# --- 4. Build production ---
echo "==> Build production..."
npm run build

# --- 5. Khởi động / nạp lại bằng PM2 ---
echo "==> Khởi động app bằng PM2..."
pm2 startOrReload ecosystem.config.js
pm2 save

# Đảm bảo PM2 tự chạy lại khi VM reboot (chỉ cần lần đầu)
pm2 startup systemd -u "$USER" --hp "$HOME" 2>/dev/null | grep -E '^sudo' | bash || true

echo ""
echo "✅ Deploy xong! App đang chạy ở cổng 3000."
echo "   Kiểm tra:  curl -I http://localhost:3000"
echo "   Lần đầu? Tiếp theo chạy:  bash deploy/3-setup-domain.sh TEN-MIEN-CUA-BAN.com"
