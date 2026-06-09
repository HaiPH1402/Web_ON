import { prisma } from "./prisma";
import { SITE, type SiteConfig } from "./site";

// Đọc cấu hình site: lấy mặc định từ SITE rồi ghi đè bằng giá trị trong DB (bảng Setting).
export async function getConfig(): Promise<SiteConfig> {
  let overrides: Record<string, string> = {};
  try {
    const rows = await prisma.setting.findMany();
    overrides = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  } catch {
    // DB chưa sẵn sàng → dùng mặc định
  }
  return { ...SITE, ...overrides } as SiteConfig;
}

// Lưu nhiều cặp key/value (dùng trong server action của admin)
export async function saveSettings(entries: Record<string, string>) {
  await Promise.all(
    Object.entries(entries).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );
}

// Danh sách field để render form admin (nhóm + nhãn + loại)
export const SETTING_FIELDS: {
  group: string;
  fields: { key: keyof SiteConfig; label: string; type?: "text" | "textarea" | "image" }[];
}[] = [
  {
    group: "Thông tin doanh nghiệp",
    fields: [
      { key: "logoImage", label: "Logo (để trống = dùng icon 💧 mặc định)", type: "image" },
      { key: "name", label: "Tên doanh nghiệp" },
      { key: "tagline", label: "Khẩu hiệu (tagline)" },
      { key: "description", label: "Mô tả (SEO)", type: "textarea" },
      { key: "hotlineSales", label: "Hotline bán hàng" },
      { key: "hotlineProject", label: "Hotline báo giá công trình" },
      { key: "emailCskh", label: "Email CSKH" },
      { key: "emailQuote", label: "Email báo giá" },
      { key: "addressLine1", label: "Địa chỉ - dòng 1" },
      { key: "addressLine2", label: "Địa chỉ - dòng 2" },
      { key: "workingHours1", label: "Giờ làm việc - dòng 1" },
      { key: "workingHours2", label: "Giờ làm việc - dòng 2" },
      { key: "copyright", label: "Dòng bản quyền (footer)" },
      { key: "mapQuery", label: "Bản đồ — địa chỉ/toạ độ (để trống = dùng địa chỉ trên)", type: "textarea" },
    ],
  },
  {
    group: "Nút liên hệ nổi (góc màn hình)",
    fields: [
      { key: "contactPhone", label: "Số gọi điện (để trống = ẩn nút Gọi)" },
      { key: "contactZalo", label: "Số Zalo (để trống = ẩn nút Zalo)" },
      { key: "contactMessenger", label: "Link Messenger m.me/... (để trống = ẩn nút)" },
    ],
  },
  {
    group: "Trang chủ — Banner (Hero)",
    fields: [
      { key: "heroImage", label: "Ảnh nền banner", type: "image" },
      { key: "heroThumb1", label: "Ảnh minh hoạ 1 (ô lớn bên trái)", type: "image" },
      { key: "heroThumb2", label: "Ảnh minh hoạ 2 (trên-phải)", type: "image" },
      { key: "heroThumb3", label: "Ảnh minh hoạ 3 (dưới-phải)", type: "image" },
      { key: "heroBadgeTitle", label: "Thẻ nổi - dòng đậm (vd: Chính hãng 100%)" },
      { key: "heroBadgeSubtitle", label: "Thẻ nổi - dòng phụ (vd: Đầy đủ CO/CQ)" },
      { key: "heroBadge", label: "Nhãn nhỏ phía trên tiêu đề" },
      { key: "heroTitleLine1", label: "Tiêu đề - phần 1" },
      { key: "heroTitleHighlight", label: "Tiêu đề - phần nổi bật (màu)" },
      { key: "heroTitleLine2", label: "Tiêu đề - phần 2" },
      { key: "heroSubtitle", label: "Mô tả dưới tiêu đề", type: "textarea" },
      { key: "heroStat1Num", label: "Số liệu 1 - con số" },
      { key: "heroStat1Label", label: "Số liệu 1 - nhãn" },
      { key: "heroStat2Num", label: "Số liệu 2 - con số" },
      { key: "heroStat2Label", label: "Số liệu 2 - nhãn" },
      { key: "heroStat3Num", label: "Số liệu 3 - con số" },
      { key: "heroStat3Label", label: "Số liệu 3 - nhãn" },
      { key: "brands", label: "Dải thương hiệu chạy ngang (cách nhau bằng dấu phẩy)", type: "textarea" },
    ],
  },
];

// Field cho trang Giới thiệu (admin /admin/about)
export const ABOUT_FIELDS: {
  group: string;
  fields: { key: keyof SiteConfig; label: string; type?: "text" | "textarea" | "image" }[];
}[] = [
  {
    group: "Phần đầu (Hero)",
    fields: [
      { key: "aboutHeroImage", label: "Ảnh nền hero", type: "image" },
      { key: "aboutHeroTitle", label: "Tiêu đề" },
      { key: "aboutHeroHighlight", label: "Phần nổi bật (màu)" },
      { key: "aboutHeroSubtitle", label: "Mô tả", type: "textarea" },
    ],
  },
  {
    group: "Câu chuyện",
    fields: [
      { key: "aboutStoryImage", label: "Ảnh câu chuyện", type: "image" },
      { key: "aboutStoryHeading", label: "Tiêu đề" },
      { key: "aboutStoryP1", label: "Đoạn 1", type: "textarea" },
      { key: "aboutStoryP2", label: "Đoạn 2", type: "textarea" },
      { key: "aboutStat1Num", label: "Số liệu 1 - con số" },
      { key: "aboutStat1Label", label: "Số liệu 1 - nhãn" },
      { key: "aboutStat2Num", label: "Số liệu 2 - con số" },
      { key: "aboutStat2Label", label: "Số liệu 2 - nhãn" },
      { key: "aboutStat3Num", label: "Số liệu 3 - con số" },
      { key: "aboutStat3Label", label: "Số liệu 3 - nhãn" },
    ],
  },
  {
    group: "Giá trị cốt lõi (4 mục)",
    fields: [
      { key: "aboutVal1Icon", label: "Giá trị 1 - icon" },
      { key: "aboutVal1Title", label: "Giá trị 1 - tiêu đề" },
      { key: "aboutVal1Desc", label: "Giá trị 1 - mô tả" },
      { key: "aboutVal2Icon", label: "Giá trị 2 - icon" },
      { key: "aboutVal2Title", label: "Giá trị 2 - tiêu đề" },
      { key: "aboutVal2Desc", label: "Giá trị 2 - mô tả" },
      { key: "aboutVal3Icon", label: "Giá trị 3 - icon" },
      { key: "aboutVal3Title", label: "Giá trị 3 - tiêu đề" },
      { key: "aboutVal3Desc", label: "Giá trị 3 - mô tả" },
      { key: "aboutVal4Icon", label: "Giá trị 4 - icon" },
      { key: "aboutVal4Title", label: "Giá trị 4 - tiêu đề" },
      { key: "aboutVal4Desc", label: "Giá trị 4 - mô tả" },
    ],
  },
  {
    group: "Mốc lịch sử (4 mốc)",
    fields: [
      { key: "aboutMile1Year", label: "Mốc 1 - năm" },
      { key: "aboutMile1Text", label: "Mốc 1 - nội dung" },
      { key: "aboutMile2Year", label: "Mốc 2 - năm" },
      { key: "aboutMile2Text", label: "Mốc 2 - nội dung" },
      { key: "aboutMile3Year", label: "Mốc 3 - năm" },
      { key: "aboutMile3Text", label: "Mốc 3 - nội dung" },
      { key: "aboutMile4Year", label: "Mốc 4 - năm" },
      { key: "aboutMile4Text", label: "Mốc 4 - nội dung" },
    ],
  },
];
