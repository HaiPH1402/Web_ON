import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getStorageClient, STORAGE_BUCKET } from "@/lib/storage";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: Request) {
  // Chỉ nhân viên (đã đăng nhập admin) mới được upload
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Thiếu file" }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: "Chỉ chấp nhận ảnh JPG, PNG, WebP hoặc GIF" },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Ảnh tối đa 5MB" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = (file.name.split(".").pop() || "jpg")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const filename = `sp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  // Tải ảnh lên Supabase Storage (hoạt động trên Vercel — không ghi xuống ổ đĩa)
  const supabase = getStorageClient();
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filename, bytes, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) {
    return NextResponse.json(
      { error: `Lỗi tải ảnh lên Storage: ${error.message}` },
      { status: 500 }
    );
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filename);

  return NextResponse.json({ url: publicUrl });
}
