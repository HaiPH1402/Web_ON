import path from "path";

// Thư mục lưu ảnh upload (ngoài public để phục vụ ổn định ở production qua /api/media)
export const UPLOAD_DIR = path.join(process.cwd(), "uploads");

// Tên file an toàn: chỉ chữ/số/gạch/chấm, không có dấu / hay .. (chống path traversal)
export function isSafeFilename(name: string): boolean {
  return /^[a-zA-Z0-9._-]+$/.test(name) && !name.includes("..");
}

export const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};
