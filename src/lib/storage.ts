import { createClient } from "@supabase/supabase-js";

// Tên bucket lưu ảnh upload trên Supabase Storage (bucket công khai)
export const STORAGE_BUCKET = "uploads";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Client server-side dùng service_role để có quyền ghi vào Storage.
// Chỉ import file này từ code chạy trên server (route handler), không dùng ở client.
export function getStorageClient() {
  if (!url || !serviceKey) {
    throw new Error(
      "Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong biến môi trường"
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
