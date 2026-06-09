import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(8),
  customerEmail: z.string().email().optional().or(z.literal("")),
  note: z.string().optional(),
  items: z
    .array(
      z.object({
        productName: z.string().min(1),
        quantity: z.number().min(1),
        productId: z.number().optional(),
        unit: z.string().optional(),
      })
    )
    .min(1),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }
  const data = parsed.data;
  const code = "BG" + Date.now().toString().slice(-8);

  // Chấp nhận mọi dòng có tên sản phẩm. Nếu khớp được sản phẩm trong kho thì gắn link
  // (productId) để tiện báo giá; nếu không khớp vẫn lưu dạng gõ tự do (productId = null).
  const itemsToCreate = [];
  for (const it of data.items) {
    if (!it.productName?.trim()) continue;
    let productId = it.productId ?? null;
    if (!productId) {
      const found = await prisma.product.findFirst({
        where: { name: { contains: it.productName } },
      });
      if (found) productId = found.id;
    }
    itemsToCreate.push({
      productId,
      productName: it.productName.trim(),
      unit: it.unit?.trim() || "cái",
      quantity: it.quantity,
    });
  }

  if (itemsToCreate.length === 0) {
    return NextResponse.json(
      { error: "Vui lòng nhập ít nhất 1 sản phẩm." },
      { status: 400 }
    );
  }

  const q = await prisma.quotation.create({
    data: {
      code,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || null,
      note: data.note,
      items: { create: itemsToCreate },
    },
  });

  return NextResponse.json({ ok: true, code: q.code });
}
