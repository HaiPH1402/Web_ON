"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/format";

function str(v: FormDataEntryValue | null): string {
  return (v ?? "").toString().trim();
}

export async function saveBrand(formData: FormData) {
  const id = formData.get("id") ? Number(formData.get("id")) : null;
  const name = str(formData.get("name"));
  let slug = str(formData.get("slug")) || slugify(name);

  if (id) {
    await prisma.brand.update({ where: { id }, data: { name, slug } });
  } else {
    const existing = await prisma.brand.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString().slice(-4)}`;
    await prisma.brand.create({ data: { name, slug } });
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/brands");
  redirect("/admin/brands");
}

export async function deleteBrand(formData: FormData) {
  const id = Number(formData.get("id"));
  // Không xóa nếu còn sản phẩm thuộc thương hiệu (tránh lỗi khóa ngoại)
  const count = await prisma.product.count({ where: { brandId: id } });
  if (count > 0) return;
  await prisma.brand.delete({ where: { id } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/brands");
}
