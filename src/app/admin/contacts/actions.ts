"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function toggleRead(formData: FormData) {
  const id = Number(formData.get("id"));
  const isRead = formData.get("isRead") === "true";
  await prisma.contactMessage.update({ where: { id }, data: { isRead: !isRead } });
  revalidatePath("/admin/contacts");
}

export async function deleteMessage(formData: FormData) {
  await prisma.contactMessage.delete({ where: { id: Number(formData.get("id")) } });
  revalidatePath("/admin/contacts");
}
