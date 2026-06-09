"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function str(v: FormDataEntryValue | null): string {
  return (v ?? "").toString().trim();
}

export async function saveProjectItem(formData: FormData) {
  const id = formData.get("id") ? Number(formData.get("id")) : null;
  const data = {
    title: str(formData.get("title")),
    location: str(formData.get("location")),
    scope: str(formData.get("scope")),
    year: str(formData.get("year")),
    tag: str(formData.get("tag")),
    image: str(formData.get("image")) || null,
    sortOrder: Number(formData.get("sortOrder")) || 0,
    isActive: formData.get("isActive") === "on",
  };

  if (id) {
    await prisma.project.update({ where: { id }, data });
  } else {
    await prisma.project.create({ data });
  }

  revalidatePath("/du-an");
  revalidatePath("/");
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function deleteProjectItem(formData: FormData) {
  await prisma.project.delete({ where: { id: Number(formData.get("id")) } });
  revalidatePath("/du-an");
  revalidatePath("/admin/projects");
}
