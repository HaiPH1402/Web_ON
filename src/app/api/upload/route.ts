import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getSession } from "@/lib/auth";
import { UPLOAD_DIR } from "@/lib/uploads";

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
  await mkdir(UPLOAD_DIR, { recursive: true });

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const filename = `sp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  await writeFile(path.join(UPLOAD_DIR, filename), bytes);

  // Phục vụ qua route động /api/media để hoạt động cả ở production
  return NextResponse.json({ url: `/api/media/${filename}` });
}
