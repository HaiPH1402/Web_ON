import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteCategory } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { id: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Danh mục sản phẩm ({categories.length})</h1>
          <p className="mt-1 text-sm text-slate-500">
            Danh mục sẽ tự hiển thị trong menu “Sản phẩm” và bộ lọc trên website.
          </p>
        </div>
        <Link href="/admin/categories/new" className="btn-primary">+ Thêm danh mục</Link>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3">Ảnh</th>
              <th className="px-4 py-3">Tên danh mục</th>
              <th className="px-4 py-3">Đường dẫn (slug)</th>
              <th className="px-4 py-3 text-right">Số sản phẩm</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image || "/products/upvc.jpg"} alt="" className="h-10 w-14 rounded object-cover" />
                </td>
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{c.slug}</td>
                <td className="px-4 py-3 text-right">{c._count.products}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/categories/${c.id}`} className="text-brand hover:underline">Sửa</Link>
                    {c._count.products === 0 ? (
                      <form action={deleteCategory}>
                        <input type="hidden" name="id" value={c.id} />
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
          </tbody>
        </table>
      </div>
    </div>
  );
}
