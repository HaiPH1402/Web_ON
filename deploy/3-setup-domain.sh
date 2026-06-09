#!/usr/bin/env bash
# =====================================================================
# BƯỚC 3 — Gắn tên miền + bật HTTPS (chỉ chạy MỘT LẦN)
# Điều kiện: đã trỏ DNS (A record) của tên miền về IP của VM trước đó.
# Cách dùng:  bash deploy/3-setup-domain.sh tenmien.com
#   (tự động thêm cả www.tenmien.com)
# =====================================================================
set -euo pipefail

DOMAIN="${1:-}"
if [ -z "$DOMAIN" ]; then
  echo "❌ Thiếu tên miền. Ví dụ:  bash deploy/3-setup-domain.sh ongnuoc.com"
  exit 1
fi

EMAIL="phamhuuquang196@gmail.com"   # email nhận thông báo gia hạn HTTPS
CONF="/etc/nginx/sites-available/ongnuoc"

echo "==> Tạo cấu hình Nginx cho $DOMAIN ..."
sudo tee "$CONF" >/dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    client_max_body_size 20M;   # cho phép upload ảnh lớn

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -sf "$CONF" /etc/nginx/sites-enabled/ongnuoc
sudo rm -f /etc/nginx/sites-enabled/default   # bỏ trang mặc định của Nginx

echo "==> Kiểm tra cấu hình Nginx..."
sudo nginx -t
sudo systemctl reload nginx

echo "==> Xin chứng chỉ HTTPS (Let's Encrypt) cho $DOMAIN ..."
sudo certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" \
  --non-interactive --agree-tos -m "$EMAIL" --redirect

echo ""
echo "✅ Xong! Mở thử:  https://$DOMAIN"
echo "   Chứng chỉ HTTPS sẽ tự gia hạn (certbot timer)."
