import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/format";
import { deleteProduct } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q?.trim();
  const products = await prisma.product.findMany({
    where: q
      ? { OR: [{ name: { contains: q } }, { sku: { contains: q } }] }
      : undefined,
    include: { category: true, brand: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sản phẩm ({products.length})</h1>
        <Link href="/admin/products/new" className="btn-primary">+ Thêm sản phẩm</Link>
      </div>

      <form className="mb-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Tìm theo tên / mã SP..."
          className="input max-w-xs"
        />
      </form>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3">Mã</th>
              <th className="px-4 py-3">Tên sản phẩm</th>
              <th className="px-4 py-3">Danh mục</th>
              <th className="px-4 py-3 text-right">Giá lẻ</th>
              <th className="px-4 py-3 text-right">Tồn</th>
              <th className="px-4 py-3 text-center">Trạng thái</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs">{p.sku}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-gray-400">
                    {[p.material, p.diameter, p.pressure].filter((x) => x && x !== "—").join(" · ")}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{p.category.name}</td>
                <td className="px-4 py-3 text-right">{formatVND(p.retailPrice)}</td>
                <td className={`px-4 py-3 text-right ${p.stock < 100 ? "font-bold text-red-500" : ""}`}>
                  {p.stock}
                </td>
                <td className="px-4 py-3 text-center">
                  {p.isActive ? (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Bán</span>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">Ẩn</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/products/${p.id}`} className="text-brand hover:underline">Sửa</Link>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <button className="text-red-500 hover:underline">Xóa</button>
                    </form>
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
