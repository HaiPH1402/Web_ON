"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/format";

function num(v: FormDataEntryValue | null, def = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}
function str(v: FormDataEntryValue | null): string {
  return (v ?? "").toString().trim();
}

// Tự sinh SKU duy nhất khi admin để trống
async function generateSku(): Promise<string> {
  const count = await prisma.product.count();
  let candidate = "SP" + (1000 + count);
  // đảm bảo không trùng
  while (await prisma.product.findUnique({ where: { sku: candidate } })) {
    candidate = "SP" + Date.now().toString().slice(-6);
  }
  return candidate;
}

export async function saveProduct(formData: FormData) {
  const id = formData.get("id") ? Number(formData.get("id")) : null;
  const name = str(formData.get("name"));
  const sku = str(formData.get("sku")) || (await generateSku());

  const data = {
    name,
    sku,
    description: str(formData.get("description")) || null,
    material: str(formData.get("material")) || null,
    diameter: str(formData.get("diameter")) || null,
    pressure: str(formData.get("pressure")) || null,
    standard: str(formData.get("standard")) || null,
    unit: str(formData.get("unit")) || "cây",
    packaging: str(formData.get("packaging")) || null,
    imageUrl: str(formData.get("imageUrl")) || null,
    retailPrice: num(formData.get("retailPrice")),
    wholesalePrice: formData.get("wholesalePrice")
      ? num(formData.get("wholesalePrice"))
      : null,
    stock: num(formData.get("stock")),
    categoryId: num(formData.get("categoryId")),
    brandId: formData.get("brandId") ? num(formData.get("brandId")) : null,
    isActive: formData.get("isActive") === "on",
    isFeatured: formData.get("isFeatured") === "on",
  };

  if (id) {
    await prisma.product.update({ where: { id }, data });
  } else {
    await prisma.product.create({
      data: { ...data, slug: slugify(name) + "-" + Date.now().toString().slice(-5) },
    });
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  const id = Number(formData.get("id"));
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}
