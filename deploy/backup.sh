#!/usr/bin/env bash
# =====================================================================
# SAO LƯU database (prod.db) + thư mục uploads/
# Quan trọng: vì dữ liệu chỉ nằm trên 1 VM, nếu ổ hỏng là mất hết.
# Cách dùng thủ công:  bash deploy/backup.sh
# Tự động hằng ngày (2h sáng) — thêm vào crontab:
#   crontab -e
#   0 2 * * * /bin/bash /home/USER/ongnuoc-shop/deploy/backup.sh >> /home/USER/backup.log 2>&1
# =====================================================================
set -euo pipefail

cd "$(dirname "$0")/.."
ROOT="$(pwd)"
BACKUP_DIR="$HOME/backups"
STAMP="$(date +%Y%m%d-%H%M%S)"
KEEP_DAYS=14   # giữ lại 14 ngày gần nhất

mkdir -p "$BACKUP_DIR"

echo "==> Sao lưu lúc $STAMP ..."
# Dùng .backup của sqlite nếu có (an toàn khi DB đang chạy); nếu không thì copy thường
if command -v sqlite3 >/dev/null 2>&1 && [ -f prod.db ]; then
  sqlite3 prod.db ".backup '$BACKUP_DIR/db-$STAMP.db'"
elif [ -f prod.db ]; then
  cp prod.db "$BACKUP_DIR/db-$STAMP.db"
fi

# Nén thư mục uploads (nếu có)
if [ -d uploads ]; then
  tar -czf "$BACKUP_DIR/uploads-$STAMP.tar.gz" uploads
fi

# Xoá bản sao lưu cũ hơn KEEP_DAYS ngày
find "$BACKUP_DIR" -type f -mtime +$KEEP_DAYS -delete

echo "✅ Đã lưu vào: $BACKUP_DIR"
ls -lh "$BACKUP_DIR" | tail -n 5

# (Tuỳ chọn) Đẩy lên Google Cloud Storage để an toàn hơn — bỏ comment & sửa tên bucket:
# gsutil cp "$BACKUP_DIR/db-$STAMP.db" "gs://ten-bucket-cua-ban/backups/"
# gsutil cp "$BACKUP_DIR/uploads-$STAMP.tar.gz" "gs://ten-bucket-cua-ban/backups/"
