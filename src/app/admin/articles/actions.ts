"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/format";

function str(v: FormDataEntryValue | null): string {
  return (v ?? "").toString().trim();
}

export async function saveArticle(formData: FormData) {
  const id = formData.get("id") ? Number(formData.get("id")) : null;
  const title = str(formData.get("title"));
  let slug = str(formData.get("slug")) || slugify(title);

  const dateStr = str(formData.get("publishedAt"));
  const publishedAt = dateStr ? new Date(dateStr) : new Date();

  const data = {
    title,
    excerpt: str(formData.get("excerpt")),
    category: str(formData.get("category")) || "Tin tức",
    author: str(formData.get("author")) || "Ban biên tập",
    image: str(formData.get("image")) || null,
    body: str(formData.get("body")),
    isPublished: formData.get("isPublished") === "on",
    publishedAt,
  };

  if (id) {
    await prisma.article.update({ where: { id }, data: { ...data, slug } });
  } else {
    // Đảm bảo slug không trùng
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString().slice(-5)}`;
    await prisma.article.create({ data: { ...data, slug } });
  }

  revalidatePath("/tin-tuc");
  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

export async function deleteArticle(formData: FormData) {
  await prisma.article.delete({ where: { id: Number(formData.get("id")) } });
  revalidatePath("/tin-tuc");
  revalidatePath("/admin/articles");
}
