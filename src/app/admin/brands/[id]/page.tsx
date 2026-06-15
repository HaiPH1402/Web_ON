import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BrandForm from "@/components/BrandForm";

export const dynamic = "force-dynamic";

export default async function EditBrandPage({ params }: { params: { id: string } }) {
  const brand = await prisma.brand.findUnique({ where: { id: Number(params.id) } });
  if (!brand) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Sửa thương hiệu</h1>
      <BrandForm brand={brand} />
    </div>
  );
}
