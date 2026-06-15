import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteBrand } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminBrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Thương hiệu ({brands.length})</h1>
          <p className="mt-1 text-sm text-slate-500">
            Thương hiệu sẽ hiện trong ô chọn khi thêm sản phẩm và bộ lọc trên website.
          </p>
        </div>
        <Link href="/admin/brands/new" className="btn-primary">+ Thêm thương hiệu</Link>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3">Tên thương hiệu</th>
              <th className="px-4 py-3">Đường dẫn (slug)</th>
              <th className="px-4 py-3 text-right">Số sản phẩm</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((b) => (
              <tr key={b.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{b.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{b.slug}</td>
                <td className="px-4 py-3 text-right">{b._count.products}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/brands/${b.id}`} className="text-brand hover:underline">Sửa</Link>
                    {b._count.products === 0 ? (
                      <form action={deleteBrand}>
                        <input type="hidden" name="id" value={b.id} />
                        <button className="text-red-500 hover:underline">Xóa</button>
                      </form>
                    ) : (
                      <span className="cursor-not-allowed text-gray-300" title="Còn sản phẩm, không thể xóa">
                        Xóa
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {brands.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  Chưa có thương hiệu nào. Bấm “+ Thêm thương hiệu” để tạo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
