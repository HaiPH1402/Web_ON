import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email().optional().or(z.literal("")),
  content: z.string().min(2),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Vui lòng điền đầy đủ họ tên, SĐT và nội dung." }, { status: 400 });
  }
  const d = parsed.data;
  await prisma.contactMessage.create({
    data: {
      name: d.name,
      phone: d.phone,
      email: d.email || null,
      content: d.content,
    },
  });
  return NextResponse.json({ ok: true });
}
