"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updateOrderStatus(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
}
