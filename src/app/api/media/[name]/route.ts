import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { UPLOAD_DIR, isSafeFilename, CONTENT_TYPES } from "@/lib/uploads";

export async function GET(
  _req: Request,
  { params }: { params: { name: string } }
) {
  const name = params.name;
  if (!isSafeFilename(name)) {
    return NextResponse.json({ error: "Tên file không hợp lệ" }, { status: 400 });
  }

  try {
    const data = await readFile(path.join(UPLOAD_DIR, name));
    const ext = (name.split(".").pop() || "").toLowerCase();
    const contentType = CONTENT_TYPES[ext] || "application/octet-stream";
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Không tìm thấy ảnh" }, { status: 404 });
  }
}
