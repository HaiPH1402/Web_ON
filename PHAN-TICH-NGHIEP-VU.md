# Phân Tích Nghiệp Vụ — Website Bán Ống Nước

> Tài liệu phân tích nghiệp vụ và đặc tả thiết kế cho dự án website thương mại điện tử
> chuyên kinh doanh ống nước, phụ kiện và vật tư ngành nước.
> Cập nhật: 2026-06-08

---

## 1. Tổng Quan Dự Án

### 1.1. Mục tiêu
Xây dựng một website bán hàng (e-commerce) cho doanh nghiệp kinh doanh **ống nước và vật tư ngành cấp – thoát nước**, phục vụ:
- Khách lẻ (hộ gia đình sửa chữa, lắp đặt nhỏ).
- Khách sỉ / nhà thầu / cửa hàng vật tư (mua số lượng lớn, cần báo giá).

### 1.2. Giá trị mang lại
- Trưng bày sản phẩm trực quan, có thông số kỹ thuật rõ ràng.
- Cho phép đặt hàng / yêu cầu báo giá online 24/7.
- Quản lý tồn kho, đơn hàng, khách hàng tập trung.
- Tăng độ phủ thương hiệu qua SEO và marketing online.

### 1.3. Đặc thù ngành cần lưu ý
Khác với bán quần áo/điện tử, ngành ống nước có đặc điểm:
- Sản phẩm có **nhiều thông số kỹ thuật** (đường kính DN, áp lực PN, vật liệu, tiêu chuẩn).
- Giá thường **biến động theo lô / theo khối lượng** → cần cơ chế báo giá.
- Đơn vị tính đa dạng: **cây / mét / cuộn / hộp / thùng / cái**.
- Khách B2B (nhà thầu) chiếm tỷ trọng lớn → cần công nợ, chiết khấu, hợp đồng.
- Vận chuyển hàng cồng kềnh, nặng → logistics đặc thù.

---

## 2. Phân Tích Sản Phẩm (Danh Mục Hàng Hóa)

### 2.1. Nhóm sản phẩm chính
| Nhóm | Ví dụ sản phẩm |
|------|----------------|
| Ống nhựa uPVC | Ống cấp nước, ống thoát nước |
| Ống HDPE | Ống cấp nước chịu áp, ống luồn cáp |
| Ống PPR | Ống nước nóng - lạnh |
| Ống thép / inox | Ống mạ kẽm, ống đen, ống inox 304 |
| Phụ kiện (co, nối, tê...) | Cút 90°, tê, măng sông, van, khớp nối |
| Van & thiết bị | Van bi, van cổng, van 1 chiều, đồng hồ nước |
| Vật tư phụ | Keo dán ống, băng tan, gioăng cao su |

### 2.2. Thuộc tính (attribute) của một sản phẩm
Mỗi sản phẩm cần các trường:
- **Mã SP (SKU)**, tên, thương hiệu (Bình Minh, Hoa Sen, Tiền Phong, Dekko...).
- **Đường kính danh nghĩa** (DN20, DN27, Ø60, Ø90, Ø114...).
- **Độ dày / Class áp lực** (PN10, PN16, Class 0, Class 1...).
- **Vật liệu** (uPVC, HDPE, PPR, inox...).
- **Tiêu chuẩn** (TCVN, ISO, ASTM...).
- **Đơn vị tính** + quy cách đóng gói.
- **Giá lẻ / giá sỉ** theo bậc số lượng.
- Hình ảnh, tài liệu kỹ thuật (catalogue PDF).
- Tồn kho, trạng thái (còn / hết / ngừng KD).

---

## 3. Đối Tượng Người Dùng (Actors)

| Vai trò | Mô tả | Nhu cầu chính |
|---------|-------|---------------|
| **Khách vãng lai** | Chưa đăng nhập | Xem sản phẩm, tìm kiếm, xem giá tham khảo |
| **Khách lẻ** | Đã đăng ký | Đặt hàng, theo dõi đơn, lưu địa chỉ |
| **Khách sỉ / Nhà thầu (B2B)** | Tài khoản doanh nghiệp | Xem giá sỉ, yêu cầu báo giá, công nợ, đặt số lượng lớn |
| **Nhân viên bán hàng** | Nội bộ | Xử lý đơn, tạo báo giá, chăm sóc KH |
| **Nhân viên kho** | Nội bộ | Cập nhật tồn kho, xác nhận xuất hàng |
| **Quản trị viên (Admin)** | Nội bộ | Quản lý toàn hệ thống, sản phẩm, báo cáo |

---

## 4. Các Chức Năng Nghiệp Vụ (Functional Requirements)

### 4.1. Phía khách hàng (Frontend)
1. **Trang chủ**: banner, sản phẩm nổi bật, danh mục, khuyến mãi.
2. **Danh mục & lọc sản phẩm**: lọc theo vật liệu, đường kính, thương hiệu, áp lực, giá.
3. **Tìm kiếm**: theo tên, mã SP, thông số (gợi ý autocomplete).
4. **Trang chi tiết sản phẩm**: thông số kỹ thuật, ảnh, bảng giá theo số lượng, sản phẩm liên quan, tài liệu kỹ thuật.
5. **Giỏ hàng**: thêm/sửa/xóa, chọn đơn vị tính, tính tạm giá.
6. **Đặt hàng / Checkout**: thông tin nhận hàng, phương thức vận chuyển & thanh toán.
7. **Yêu cầu báo giá (RFQ)**: cho đơn hàng lớn → gửi danh sách, nhận báo giá từ NV.
8. **Tài khoản cá nhân**: lịch sử đơn, theo dõi trạng thái, sổ địa chỉ, công nợ (B2B).
9. **Nội dung hỗ trợ**: hướng dẫn chọn ống, tin tức, blog kỹ thuật, FAQ.
10. **Liên hệ / Tư vấn**: form, chat, hotline, Zalo.

### 4.2. Phía quản trị (Admin / Backend)
1. **Quản lý sản phẩm & danh mục**: CRUD, nhập thông số, quản lý ảnh, bảng giá.
2. **Quản lý kho**: tồn kho theo SKU, cảnh báo hết hàng, nhập – xuất kho.
3. **Quản lý đơn hàng**: xác nhận, đổi trạng thái, in hóa đơn/phiếu giao.
4. **Quản lý báo giá (RFQ)**: tạo, gửi, theo dõi báo giá.
5. **Quản lý khách hàng**: phân loại lẻ/sỉ, gán bảng giá, quản lý công nợ.
6. **Quản lý khuyến mãi**: mã giảm giá, chiết khấu theo số lượng/khách.
7. **Quản lý nội dung**: banner, blog, trang tĩnh.
8. **Báo cáo & thống kê**: doanh thu, sản phẩm bán chạy, tồn kho, công nợ.
9. **Phân quyền người dùng nội bộ** (admin, sales, kho).

---

## 5. Quy Trình Nghiệp Vụ Chính (Business Flows)

### 5.1. Quy trình mua hàng (khách lẻ)
```
Tìm/duyệt SP → Xem chi tiết → Thêm giỏ → Checkout
→ Chọn vận chuyển & thanh toán → Đặt hàng
→ Admin xác nhận → Kho xuất hàng → Giao hàng → Hoàn tất
```

### 5.2. Quy trình báo giá (khách sỉ / nhà thầu)
```
Tạo danh sách SP → Gửi yêu cầu báo giá (RFQ)
→ Sales tiếp nhận → Tính giá sỉ/chiết khấu → Gửi báo giá
→ KH duyệt → Chốt đơn → Xuất hàng → Công nợ/Thanh toán
```

### 5.3. Quy trình quản lý tồn kho
```
Nhập hàng → Cập nhật tồn → Bán/Xuất → Trừ tồn
→ Cảnh báo khi dưới định mức → Đề xuất nhập thêm
```

---

## 6. Yêu Cầu Phi Chức Năng (Non-Functional)

- **Hiệu năng**: tải trang < 3s, chịu tải nhiều người dùng đồng thời.
- **Responsive**: hoạt động tốt trên mobile (nhiều khách dùng điện thoại).
- **SEO**: URL thân thiện, meta, schema sản phẩm, sitemap.
- **Bảo mật**: HTTPS, mã hóa mật khẩu, chống SQL injection/XSS, phân quyền.
- **Khả năng mở rộng**: dễ thêm danh mục, tích hợp cổng thanh toán/vận chuyển.
- **Sao lưu dữ liệu** định kỳ.
- **Đa ngôn ngữ** (tùy chọn, ưu tiên tiếng Việt).

---

## 7. Đề Xuất Kiến Trúc & Công Nghệ

### 7.1. Mô hình
- Kiến trúc tách **Frontend** (giao diện) và **Backend API** (nghiệp vụ).
- Hoặc dùng nền tảng có sẵn nếu cần triển khai nhanh.

### 7.2. Lựa chọn công nghệ (gợi ý)
| Thành phần | Phương án A (tự code) | Phương án B (nền tảng có sẵn) |
|------------|----------------------|-------------------------------|
| Frontend | React / Next.js, Tailwind | Theme WordPress |
| Backend | Node.js (NestJS) / Laravel | WooCommerce / Haravan / Sapo |
| Database | PostgreSQL / MySQL | (đi kèm nền tảng) |
| Lưu ảnh | S3 / Cloudinary | Media library |
| Thanh toán | VNPay, Momo, COD | Tích hợp sẵn |
| Vận chuyển | GHN, GHTK, Viettel Post | Tích hợp sẵn |

> **Khuyến nghị**: Nếu ưu tiên ra mắt nhanh và ngân sách hạn chế → dùng **WordPress + WooCommerce** hoặc nền tảng Việt (**Sapo / Haravan**). Nếu cần tùy biến sâu nghiệp vụ B2B (báo giá, công nợ) → **tự phát triển với Next.js + Laravel/NestJS**.

---

## 8. Thiết Kế Cơ Sở Dữ Liệu (Sơ Lược)

Các bảng chính:
- `users` — người dùng (khách, nhân viên), role, loại KH.
- `categories` — danh mục (có cấp cha/con).
- `brands` — thương hiệu.
- `products` — sản phẩm, thông số kỹ thuật, đơn vị tính.
- `product_prices` — bảng giá theo bậc số lượng / loại KH.
- `product_images` — ảnh sản phẩm.
- `inventory` — tồn kho theo SKU.
- `carts` / `cart_items` — giỏ hàng.
- `orders` / `order_items` — đơn hàng.
- `quotations` / `quotation_items` — báo giá (RFQ).
- `addresses` — địa chỉ giao hàng.
- `promotions` — khuyến mãi, mã giảm giá.
- `debts` — công nợ khách B2B.

---

## 9. Sơ Đồ Sitemap (Cấu Trúc Trang)

### 9.1. Trang phía khách hàng (Frontend)
```
Trang chủ
├── Sản phẩm
│   ├── Theo danh mục (uPVC, HDPE, PPR, Phụ kiện...)
│   ├── Theo thương hiệu
│   └── Chi tiết sản phẩm
├── Giỏ hàng / Thanh toán
├── Yêu cầu báo giá
├── Tài khoản
│   ├── Đơn hàng của tôi
│   ├── Sổ địa chỉ
│   └── Công nợ (B2B)
├── Tin tức / Blog kỹ thuật
├── Hướng dẫn chọn ống / FAQ
├── Giới thiệu
└── Liên hệ
```

### 9.2. Trang quản trị (Admin Panel) — `/admin`
```
Đăng nhập Admin
└── Bảng điều khiển (Dashboard)
    │   • Tổng quan: doanh thu, đơn mới, đơn chờ xử lý,
    │     báo giá chờ, cảnh báo hết hàng, công nợ đến hạn
    │
    ├── Sản phẩm
    │   ├── Danh sách sản phẩm (tìm/lọc/sửa nhanh tồn-giá)
    │   ├── Thêm / Sửa sản phẩm (thông số kỹ thuật, ảnh, tài liệu)
    │   ├── Bảng giá (giá lẻ / giá sỉ theo bậc số lượng)
    │   ├── Danh mục (cây cha–con)
    │   └── Thương hiệu
    │
    ├── Kho hàng
    │   ├── Tồn kho theo SKU
    │   ├── Phiếu nhập kho
    │   ├── Phiếu xuất kho
    │   └── Cảnh báo tồn dưới định mức
    │
    ├── Đơn hàng
    │   ├── Danh sách đơn (lọc theo trạng thái)
    │   ├── Chi tiết đơn → đổi trạng thái, in hóa đơn/phiếu giao
    │   └── Trả hàng / hủy đơn
    │
    ├── Báo giá (RFQ)
    │   ├── Yêu cầu báo giá đến
    │   ├── Tạo / gửi báo giá
    │   └── Theo dõi trạng thái (chờ / đã chốt / từ chối)
    │
    ├── Khách hàng
    │   ├── Danh sách (phân loại lẻ / sỉ / nhà thầu)
    │   ├── Gán bảng giá & chính sách chiết khấu
    │   └── Quản lý công nợ (B2B)
    │
    ├── Khuyến mãi
    │   ├── Mã giảm giá
    │   └── Chương trình chiết khấu theo số lượng / khách
    │
    ├── Nội dung
    │   ├── Banner / Trang chủ
    │   ├── Tin tức / Blog
    │   └── Trang tĩnh (Giới thiệu, FAQ, Hướng dẫn)
    │
    ├── Báo cáo & Thống kê
    │   ├── Doanh thu (theo thời gian / danh mục)
    │   ├── Sản phẩm bán chạy
    │   ├── Tồn kho
    │   └── Công nợ
    │
    └── Hệ thống
        ├── Người dùng nội bộ & phân quyền (admin / sales / kho)
        ├── Cấu hình (thanh toán, vận chuyển, thuế)
        └── Nhật ký hoạt động (log)
```

> **Phân quyền truy cập admin:**
> - **Admin**: toàn quyền.
> - **Sales**: đơn hàng, báo giá, khách hàng (không sửa cấu hình hệ thống).
> - **Kho**: kho hàng, cập nhật tồn, xác nhận xuất hàng.

---

## 10. Lộ Trình Triển Khai (Roadmap Đề Xuất)

| Giai đoạn | Nội dung | Ưu tiên |
|-----------|----------|---------|
| **GĐ1 – MVP** | Danh mục, chi tiết SP, giỏ hàng, đặt hàng COD, quản lý SP/đơn cơ bản | Cao |
| **GĐ2** | Báo giá RFQ, tài khoản B2B, bảng giá sỉ, tích hợp thanh toán online | Cao |
| **GĐ3** | Quản lý kho nâng cao, công nợ, báo cáo thống kê | Trung bình |
| **GĐ4** | SEO, blog, khuyến mãi, tích hợp vận chuyển tự động, tối ưu hiệu năng | Trung bình |

---

## 11. Tổng Kết — Cần Làm & Thiết Kế Gì

**Cần phân tích & chuẩn bị:**
- Danh sách sản phẩm + thông số kỹ thuật + bảng giá (lẻ/sỉ).
- Phân loại khách hàng và chính sách giá/chiết khấu.
- Quy trình bán hàng và báo giá nội bộ.

**Cần thiết kế:**
- Giao diện (UI/UX): trang chủ, danh mục, chi tiết SP, giỏ hàng, checkout, RFQ, tài khoản.
- Trang quản trị (admin): sản phẩm, kho, đơn hàng, báo giá, khách hàng, báo cáo.
- Cơ sở dữ liệu theo mục 8.
- Tích hợp: thanh toán (VNPay/Momo/COD), vận chuyển (GHN/GHTK), Zalo/chat.

**Ưu tiên đặc thù ngành**: bộ lọc theo thông số kỹ thuật, đơn vị tính linh hoạt, cơ chế báo giá & giá sỉ cho B2B.
