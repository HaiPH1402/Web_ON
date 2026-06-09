import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { id: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Thêm sản phẩm mới</h1>
      <ProductForm categories={categories} brands={brands} />
    </div>
  );
}
