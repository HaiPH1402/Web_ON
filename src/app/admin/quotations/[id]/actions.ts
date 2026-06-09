"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function numOrNull(v: FormDataEntryValue | null): number | null {
  if (v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function saveQuote(formData: FormData) {
  const id = Number(formData.get("id"));

  // Lưu giá từng dòng (itemId -> price). Các input tên: price_<itemId>
  const items = await prisma.quotationItem.findMany({ where: { quotationId: id } });
  await Promise.all(
    items.map((it) =>
      prisma.quotationItem.update({
        where: { id: it.id },
        data: { quotedPrice: numOrNull(formData.get(`price_${it.id}`)) },
      })
    )
  );

  const vatPercent = Number(formData.get("vatPercent")) || 0;
  const discount = Number(formData.get("discount")) || 0;
  const status = String(formData.get("status") || "QUOTED");
  const note = String(formData.get("note") || "");

  await prisma.quotation.update({
    where: { id },
    data: { vatPercent, discount, status, note },
  });

  revalidatePath(`/admin/quotations/${id}`);
  revalidatePath("/admin/quotations");
}
