# Hướng dẫn deploy lên Google Cloud (Compute Engine VM)

Mọi thứ đã được chuẩn bị sẵn trong thư mục `deploy/`. Bạn **không cần sửa code**,
chỉ chạy lệnh theo đúng thứ tự dưới đây.

---

## A. Tạo VM trên Google Cloud (làm 1 lần, trên trình duyệt)

1. Vào https://console.cloud.google.com → tạo **Project** mới → bật **Billing**.
2. **Compute Engine → VM instances → Create instance**:
   - Region: `asia-southeast1` (Singapore)
   - Máy: `e2-small` · Boot disk: **Ubuntu 22.04 LTS**, 20GB
   - Firewall: ✅ **Allow HTTP** và ✅ **Allow HTTPS**
3. (Khuyến nghị) **VPC network → IP addresses → Reserve** một IP tĩnh, gán cho VM
   để IP không đổi khi restart.
4. Ghi lại **External IP** của VM.

---

## B. Đưa code lên VM

Bấm nút **SSH** trên dòng VM (mở terminal trong trình duyệt), rồi:

```bash
# Cách 1 — nếu code đã ở GitHub/GitLab:
git clone <link-repo-cua-ban> ongnuoc-shop
cd ongnuoc-shop
```

> Chưa đẩy code lên Git? Có thể nén ở máy bạn (`zip -r web.zip . -x "node_modules/*" ".next/*"`)
> rồi dùng nút **Upload file** trong cửa sổ SSH để tải lên và giải nén.

---

## C. Chạy 3 lệnh (chỉ vậy thôi)

```bash
# 1) Cài môi trường (Node, Nginx, PM2, Certbot) — chạy 1 lần
bash deploy/1-setup-vm.sh

# 2) Deploy app (tự tạo .env + AUTH_SECRET, tạo DB, seed, build, chạy nền)
bash deploy/2-deploy.sh

# 3) Gắn tên miền + bật HTTPS  (sau khi đã trỏ DNS — xem mục D)
bash deploy/3-setup-domain.sh tenmien-cua-ban.com
```

Xong! Web chạy tại `https://tenmien-cua-ban.com`.

---

## D. Trỏ tên miền (làm trước bước C-3)

Sau khi mua tên miền (Namecheap, Cloudflare, Mắt Bão, Tenten...), vào phần
**DNS** của nhà cung cấp, tạo 2 bản ghi **A record** trỏ về **External IP** của VM:

| Type | Name  | Value (Giá trị) |
|------|-------|-----------------|
| A    | `@`   | `<External-IP>` |
| A    | `www` | `<External-IP>` |

Chờ 5–30 phút cho DNS cập nhật, rồi mới chạy lệnh `deploy/3-setup-domain.sh`.

---

## E. Cập nhật code về sau

Mỗi khi sửa code và muốn cập nhật bản chạy thật:

```bash
git pull            # lấy code mới (hoặc upload lại)
bash deploy/2-deploy.sh
```

Lệnh này **không** ghi đè `.env`, **không** seed lại, **không** mất dữ liệu —
chỉ build lại và khởi động lại app.

---

## F. Sao lưu (RẤT QUAN TRỌNG)

Dữ liệu (`prod.db` + `uploads/`) chỉ nằm trên VM này. Hãy bật sao lưu tự động:

```bash
# Sao lưu thủ công ngay:
bash deploy/backup.sh

# Tự động mỗi ngày lúc 2h sáng:
crontab -e
# rồi thêm dòng (đổi USER thành tên đăng nhập của bạn):
0 2 * * * /bin/bash /home/USER/ongnuoc-shop/deploy/backup.sh >> /home/USER/backup.log 2>&1
```

Bản sao lưu nằm trong `~/backups`, tự giữ 14 ngày gần nhất.

---

## Lệnh hữu ích khi vận hành

```bash
pm2 status          # xem app còn chạy không
pm2 logs ongnuoc    # xem log lỗi
pm2 restart ongnuoc # khởi động lại app
```
