# Kế Hoạch Công Việc (Task Breakdown) — Website Bán Ống Nước

> Phân rã chi tiết các đầu việc dựa trên [PHAN-TICH-NGHIEP-VU.md](PHAN-TICH-NGHIEP-VU.md).
> Đánh dấu `[x]` khi hoàn thành. Mỗi task gắn mức ưu tiên: 🔴 Cao · 🟡 Trung bình · 🟢 Thấp.
> Cập nhật: 2026-06-08

---

## GIAI ĐOẠN 0 — Chuẩn Bị & Khởi Tạo

### 0.1. Phân tích & tài liệu
- [ ] 🔴 Chốt danh sách nhóm sản phẩm và thông số kỹ thuật chuẩn
- [ ] 🔴 Thu thập dữ liệu mẫu: 30–50 sản phẩm thật (tên, mã, ảnh, giá)
- [ ] 🔴 Xác định chính sách giá: bậc giá sỉ, chiết khấu, loại khách
- [ ] 🟡 Chốt quy trình đặt hàng & báo giá nội bộ
- [ ] 🟡 Chọn nền tảng công nghệ (tự code vs WooCommerce/Sapo)

### 0.2. Thiết lập dự án
- [ ] 🔴 Khởi tạo repository (git)
- [ ] 🔴 Dựng khung dự án (frontend + backend hoặc nền tảng)
- [ ] 🔴 Thiết lập môi trường: dev / staging / production
- [ ] 🟡 Cấu hình CI/CD cơ bản
- [ ] 🟢 Mua tên miền + hosting/server

---

## GIAI ĐOẠN 1 — MVP (Bán hàng cơ bản)

### 1.1. Cơ sở dữ liệu (nền móng)
- [ ] 🔴 Thiết kế schema: `users`, `categories`, `brands`, `products`
- [ ] 🔴 Thiết kế schema: `product_prices`, `product_images`, `inventory`
- [ ] 🔴 Thiết kế schema: `carts`, `cart_items`, `orders`, `order_items`, `addresses`
- [ ] 🔴 Viết migration & seed dữ liệu mẫu

### 1.2. Xác thực & tài khoản
- [ ] 🔴 Đăng ký / Đăng nhập / Đăng xuất
- [ ] 🔴 Mã hóa mật khẩu, session/JWT
- [ ] 🟡 Quên mật khẩu / đặt lại qua email
- [ ] 🟡 Phân quyền cơ bản (khách / admin)

### 1.3. Sản phẩm (Frontend khách)
- [ ] 🔴 Trang danh mục + phân trang
- [ ] 🔴 Bộ lọc theo: vật liệu, đường kính, thương hiệu, giá
- [ ] 🔴 Tìm kiếm theo tên / mã SP (+ autocomplete)
- [ ] 🔴 Trang chi tiết SP: thông số, ảnh, bảng giá, đơn vị tính
- [ ] 🟡 Sản phẩm liên quan / gợi ý
- [ ] 🟢 Tải tài liệu kỹ thuật (PDF)

### 1.4. Giỏ hàng & Đặt hàng
- [ ] 🔴 Thêm / sửa / xóa sản phẩm trong giỏ
- [ ] 🔴 Chọn đơn vị tính & số lượng, tính tạm giá
- [ ] 🔴 Trang checkout: thông tin nhận hàng, địa chỉ
- [ ] 🔴 Đặt hàng COD (thanh toán khi nhận)
- [ ] 🔴 Email/thông báo xác nhận đơn hàng
- [ ] 🟡 Theo dõi trạng thái đơn (trang tài khoản)

### 1.5. Admin cơ bản
- [ ] 🔴 Đăng nhập admin + layout dashboard
- [ ] 🔴 CRUD sản phẩm (thông số, ảnh, giá)
- [ ] 🔴 CRUD danh mục & thương hiệu
- [ ] 🔴 Quản lý đơn hàng: xem, đổi trạng thái
- [ ] 🟡 Cập nhật tồn kho thủ công theo SKU
- [ ] 🟡 Dashboard tổng quan (số đơn, doanh thu cơ bản)

### 1.6. Giao diện & nội dung tối thiểu
- [ ] 🔴 Trang chủ: banner, SP nổi bật, danh mục
- [ ] 🔴 Responsive mobile
- [ ] 🟡 Trang: Giới thiệu, Liên hệ, FAQ
- [ ] 🟡 Header/Footer, menu điều hướng

---

## GIAI ĐOẠN 2 — B2B & Thanh Toán

### 2.1. Báo giá (RFQ)
- [ ] 🔴 Schema `quotations`, `quotation_items`
- [ ] 🔴 Khách: tạo danh sách & gửi yêu cầu báo giá
- [ ] 🔴 Admin/Sales: tiếp nhận, tạo & gửi báo giá
- [ ] 🟡 Theo dõi trạng thái báo giá (chờ/chốt/từ chối)
- [ ] 🟡 Chuyển báo giá đã chốt thành đơn hàng

### 2.2. Khách hàng sỉ / Nhà thầu
- [ ] 🔴 Phân loại khách lẻ / sỉ / nhà thầu
- [ ] 🔴 Bảng giá sỉ theo bậc số lượng + gán theo khách
- [ ] 🟡 Hiển thị giá sỉ khi khách B2B đăng nhập
- [ ] 🟡 Tài khoản doanh nghiệp (thông tin công ty, MST)

### 2.3. Thanh toán & Vận chuyển
- [ ] 🔴 Tích hợp cổng thanh toán (VNPay / Momo)
- [ ] 🟡 Tích hợp đơn vị vận chuyển (GHN / GHTK) — tính phí
- [ ] 🟡 Quản lý phương thức & trạng thái thanh toán
- [ ] 🟢 Hóa đơn điện tử (nếu cần)

---

## GIAI ĐOẠN 3 — Kho, Công Nợ, Báo Cáo

### 3.1. Quản lý kho nâng cao
- [ ] 🟡 Phiếu nhập / xuất kho
- [ ] 🟡 Cảnh báo tồn dưới định mức
- [ ] 🟢 Lịch sử biến động tồn kho

### 3.2. Công nợ (B2B)
- [ ] 🟡 Schema `debts` + ghi nhận công nợ theo đơn
- [ ] 🟡 Theo dõi công nợ, hạn thanh toán
- [ ] 🟢 Nhắc nợ tự động

### 3.3. Báo cáo & Thống kê
- [ ] 🟡 Báo cáo doanh thu theo thời gian / danh mục
- [ ] 🟡 Sản phẩm bán chạy
- [ ] 🟢 Báo cáo tồn kho & công nợ
- [ ] 🟢 Xuất Excel/PDF

### 3.4. Phân quyền nội bộ
- [ ] 🟡 Vai trò: Admin / Sales / Kho
- [ ] 🟢 Nhật ký hoạt động (audit log)

---

## GIAI ĐOẠN 4 — Marketing & Tối Ưu

### 4.1. SEO
- [ ] 🟡 URL thân thiện, meta title/description
- [ ] 🟡 Schema markup sản phẩm, sitemap.xml, robots.txt
- [ ] 🟢 Tối ưu ảnh (lazy load, nén)

### 4.2. Khuyến mãi & Nội dung
- [ ] 🟡 Mã giảm giá / chiết khấu theo chương trình
- [ ] 🟢 Blog / tin tức kỹ thuật
- [ ] 🟢 Hướng dẫn chọn ống

### 4.3. Tích hợp & Hỗ trợ
- [ ] 🟡 Chat/Zalo, hotline, form tư vấn
- [ ] 🟢 Google Analytics / theo dõi chuyển đổi

### 4.4. Tối ưu & Bảo mật
- [ ] 🔴 HTTPS, chống XSS/SQL injection
- [ ] 🟡 Tối ưu hiệu năng (cache, tải trang < 3s)
- [ ] 🟡 Sao lưu dữ liệu định kỳ
- [ ] 🟢 Kiểm thử & sửa lỗi tổng thể trước khi go-live

---

## Tổng Hợp Ưu Tiên Khởi Đầu (Sprint đầu tiên)

Nếu bắt tay vào làm ngay, thứ tự nên là:
1. **0.2** Thiết lập dự án → **1.1** Database → **1.2** Xác thực
2. **1.5** Admin CRUD sản phẩm (để có dữ liệu) → **1.3** Hiển thị SP cho khách
3. **1.4** Giỏ hàng + đặt hàng COD → **1.6** Trang chủ & responsive
4. Ra mắt MVP → tiếp tục Giai đoạn 2.
