// Giá trị MẶC ĐỊNH cho cấu hình site & nội dung trang chủ.
// Khi admin chưa chỉnh trong DB thì dùng các giá trị này (fallback).
// Đọc cấu hình thực tế (đã merge DB) qua getConfig() trong lib/settings.ts.

export const SITE = {
  // Thông tin doanh nghiệp
  name: "Ống Nước Việt",
  tagline: "Vật tư ngành cấp – thoát nước",
  logoImage: "", // để trống = dùng icon 💧 mặc định; có ảnh = hiện logo upload
  description:
    "Cung cấp ống uPVC, HDPE, PPR, ống thép/inox, phụ kiện và van. Giá lẻ và giá sỉ cho nhà thầu, công trình.",
  hotlineSales: "0900 000 000",
  hotlineProject: "0900 111 222",
  emailCskh: "cskh@ongnuocviet.vn",
  emailQuote: "baogia@ongnuocviet.vn",
  addressLine1: "123 Đường Ống Nước, P. Tân Phú",
  addressLine2: "Quận 7, TP. Hồ Chí Minh",
  workingHours1: "Thứ 2 – Thứ 7: 8:00 – 18:00",
  workingHours2: "Chủ nhật: 8:00 – 12:00",
  copyright: "© 2026 Ống Nước Việt. Mọi quyền được bảo lưu.",
  mapQuery: "", // địa chỉ/toạ độ cho bản đồ; để trống = dùng địa chỉ ở trên

  // Nút liên hệ nổi (để trống = ẩn nút tương ứng)
  contactPhone: "0900000000", // số gọi điện
  contactZalo: "0900000000", // số Zalo (zalo.me/<số>)
  contactMessenger: "", // link Messenger đầy đủ, vd https://m.me/tenpage

  // Nội dung trang chủ (hero)
  heroBadge: "⭐ Đối tác tin cậy của 500+ nhà thầu & công trình",
  heroTitleLine1: "Giải pháp",
  heroTitleHighlight: "ống nước",
  heroTitleLine2: "cho mọi công trình",
  heroSubtitle:
    "uPVC · HDPE · PPR · ống thép/inox · phụ kiện · van. Hàng chính hãng, giá sỉ tốt nhất, báo giá công trình trong 24 giờ.",
  heroImage: "/banner/hero.jpg",
  // 3 ảnh minh hoạ nhỏ bên phải banner + thẻ badge
  heroThumb1: "/products/hdpe.jpg",
  heroThumb2: "/products/van.jpg",
  heroThumb3: "/products/ppr.jpg",
  heroBadgeTitle: "Chính hãng 100%",
  heroBadgeSubtitle: "Đầy đủ CO/CQ",
  heroStat1Num: "15+",
  heroStat1Label: "Dòng sản phẩm",
  heroStat2Num: "500+",
  heroStat2Label: "Công trình",
  heroStat3Num: "63",
  heroStat3Label: "Tỉnh thành",
  // Dải thương hiệu chạy ngang (cách nhau bằng dấu phẩy)
  brands: "Bình Minh, Tiền Phong, Hoa Sen, Dekko, Đệ Nhất, SCG, Vesbo, Sino",

  // ===== Trang Giới thiệu =====
  aboutHeroTitle: "Đối tác vật tư ngành nước",
  aboutHeroHighlight: "đáng tin cậy",
  aboutHeroSubtitle:
    "Ống Nước Việt chuyên cung cấp ống uPVC, HDPE, PPR, ống thép/inox, phụ kiện và van cho hàng trăm công trình dân dụng, thương mại và hạ tầng trên cả nước.",
  aboutHeroImage: "/projects/duan3.jpg",

  aboutStoryHeading: "Hơn 12 năm đồng hành cùng công trình Việt",
  aboutStoryP1:
    "Khởi đầu từ một cửa hàng vật tư nhỏ, đến nay chúng tôi đã trở thành nhà cung cấp uy tín với hệ thống kho hàng lớn, đảm bảo nguồn hàng dồi dào và giao nhanh trên toàn quốc.",
  aboutStoryP2:
    "Chúng tôi tin rằng vật tư chất lượng và dịch vụ tận tâm là nền tảng cho mọi công trình bền vững. Đó là lý do khách hàng — từ hộ gia đình đến nhà thầu lớn — luôn tin tưởng lựa chọn.",
  aboutStoryImage: "/projects/duan1.jpg",
  aboutStat1Num: "500+",
  aboutStat1Label: "Công trình",
  aboutStat2Num: "12",
  aboutStat2Label: "Năm KN",
  aboutStat3Num: "63",
  aboutStat3Label: "Tỉnh thành",

  aboutVal1Icon: "🏆", aboutVal1Title: "Chính hãng", aboutVal1Desc: "100% sản phẩm có CO/CQ, đúng tiêu chuẩn TCVN/ISO.",
  aboutVal2Icon: "🤝", aboutVal2Title: "Tận tâm", aboutVal2Desc: "Tư vấn kỹ thuật miễn phí, đồng hành cùng công trình.",
  aboutVal3Icon: "⚡", aboutVal3Title: "Nhanh chóng", aboutVal3Desc: "Báo giá trong 24h, giao hàng đúng tiến độ.",
  aboutVal4Icon: "💎", aboutVal4Title: "Giá tốt", aboutVal4Desc: "Giá sỉ cạnh tranh, chiết khấu theo số lượng.",

  aboutMile1Year: "2014", aboutMile1Text: "Thành lập, khởi đầu là cửa hàng vật tư ngành nước.",
  aboutMile2Year: "2018", aboutMile2Text: "Trở thành đại lý cấp 1 của các thương hiệu lớn.",
  aboutMile3Year: "2022", aboutMile3Text: "Mở rộng cung cấp cho công trình & nhà thầu toàn quốc.",
  aboutMile4Year: "2026", aboutMile4Text: "Ra mắt nền tảng đặt hàng & báo giá trực tuyến.",
} as const;

export type SiteConfig = { [K in keyof typeof SITE]: string };
