// Lưu ảnh upload lên Supabase Storage qua REST API (dùng fetch).
// Không dùng @supabase/supabase-js để tránh lệ thuộc Node/WebSocket — chạy ổn trên Vercel.

export const STORAGE_BUCKET = "uploads";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Tải file lên Storage, trả về URL công khai của ảnh.
export async function uploadToStorage(
  filename: string,
  bytes: Buffer,
  contentType: string
): Promise<string> {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    throw new Error(
      "Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong biến môi trường"
    );
  }

  const endpoint = `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${filename}`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SERVICE_KEY}`,
      apikey: SERVICE_KEY,
      "Content-Type": contentType,
      "Cache-Control": "31536000",
    },
    body: new Uint8Array(bytes),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Storage trả về ${res.status}: ${detail}`);
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${filename}`;
}
