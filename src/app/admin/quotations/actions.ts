"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updateQuotationStatus(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  await prisma.quotation.update({ where: { id }, data: { status } });
  revalidatePath("/admin/quotations");
}

export async function setQuotedPrice(formData: FormData) {
  const itemId = Number(formData.get("itemId"));
  const price = Number(formData.get("quotedPrice"));
  await prisma.quotationItem.update({
    where: { id: itemId },
    data: { quotedPrice: Number.isFinite(price) ? price : null },
  });
  revalidatePath("/admin/quotations");
}
