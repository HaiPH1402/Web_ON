import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CategoryForm from "@/components/CategoryForm";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const category = await prisma.category.findUnique({ where: { id: Number(params.id) } });
  if (!category) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Sửa danh mục</h1>
      <CategoryForm category={category} />
    </div>
  );
}
