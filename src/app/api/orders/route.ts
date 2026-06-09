import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(8),
  customerEmail: z.string().email().optional().or(z.literal("")),
  shippingAddress: z.string().min(5),
  note: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.number(),
        quantity: z.number().min(1),
      })
    )
    .min(1),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;

  // Lấy giá thực tế từ DB (không tin giá client gửi lên)
  const ids = data.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: ids }, isActive: true },
  });

  const orderItems = data.items
    .map((i) => {
      const p = products.find((x) => x.id === i.productId);
      if (!p) return null;
      return {
        productId: p.id,
        productName: p.name,
        unit: p.unit,
        price: p.retailPrice,
        quantity: i.quantity,
        lineTotal: p.retailPrice * i.quantity,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  if (orderItems.length === 0) {
    return NextResponse.json({ error: "Không có sản phẩm hợp lệ" }, { status: 400 });
  }

  const subtotal = orderItems.reduce((s, i) => s + i.lineTotal, 0);
  const shippingFee = subtotal >= 2000000 ? 0 : 50000; // free ship đơn từ 2 triệu
  const total = subtotal + shippingFee;
  const code = "DH" + Date.now().toString().slice(-8);

  const order = await prisma.order.create({
    data: {
      code,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || null,
      shippingAddress: data.shippingAddress,
      note: data.note,
      paymentMethod: "COD",
      subtotal,
      shippingFee,
      total,
      items: { create: orderItems },
    },
  });

  // Trừ tồn kho
  await Promise.all(
    orderItems.map((i) =>
      prisma.product.update({
        where: { id: i.productId },
        data: { stock: { decrement: i.quantity } },
      })
    )
  );

  return NextResponse.json({ ok: true, code: order.code });
}
