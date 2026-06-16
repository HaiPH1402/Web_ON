"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/format";

function str(v: FormDataEntryValue | null): string {
  return (v ?? "").toString().trim();
}

export async function saveCategory(formData: FormData) {
  const id = formData.get("id") ? Number(formData.get("id")) : null;
  const name = str(formData.get("name"));
  const image = str(formData.get("image")) || null;
  let slug = str(formData.get("slug")) || slugify(name);

  if (id) {
    await prisma.category.update({ where: { id }, data: { name, slug, image } });
  } else {
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString().slice(-4)}`;
    await prisma.category.create({ data: { name, slug, image } });
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteCategory(formData: FormData) {
  const id = Number(formData.get("id"));
  // Không xóa nếu còn sản phẩm thuộc danh mục (tránh lỗi khóa ngoại)
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) return;
  await prisma.category.delete({ where: { id } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/products");
}
