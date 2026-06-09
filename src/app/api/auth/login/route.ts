import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

const STAFF_ROLES = ["ADMIN", "SALES", "WAREHOUSE"];

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Thiếu thông tin đăng nhập" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: "Email hoặc mật khẩu không đúng" }, { status: 401 });
  }
  if (!STAFF_ROLES.includes(user.role)) {
    return NextResponse.json({ error: "Tài khoản không có quyền truy cập" }, { status: 403 });
  }

  await createSession({ userId: user.id, role: user.role, name: user.name });
  return NextResponse.json({ ok: true });
}
