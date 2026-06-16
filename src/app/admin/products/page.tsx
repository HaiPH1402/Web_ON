import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/format";
import { deleteProduct } from "./actions";
import { deleteCategory } from "../categories/actions";
import ConfirmButton from "@/components/ConfirmButton";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string; cat?: string };
}) {
  const q = searchParams.q?.trim();
  const catId = Number(searchParams.cat) || undefined;
  const page = Math.max(1, Number(searchParams.page) || 1);
  const where = {
    ...(q ? { OR: [{ name: { contains: q } }, { sku: { contains: q } }] } : {}),
    ...(catId ? { categoryId: catId } : {}),
  };

  const [total, products, categories] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: { category: true, brand: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.category.findMany({
      orderBy: { id: "asc" },
      include: { _count: { select: { products: true } } },
    }),
  ]);

  const allCount = categories.reduce((s, c) => s + c._count.products, 0);
  const activeCat = categories.find((c) => c.id === catId);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  // Giữ nguyên danh mục đang lọc + từ khoá khi đổi trang
  const baseParams = { ...(q ? { q } : {}), ...(catId ? { cat: String(catId) } : {}) };
  const qs = (p: number) =>
    `?${new URLSearchParams({ ...baseParams, page: String(p) })}`;
  // Link "Thêm sản phẩm": chọn sẵn danh mục đang xem
  const newHref = catId ? `/admin/products/new?cat=${catId}` : "/admin/products/new";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Sản phẩm{activeCat ? <span className="text-gray-400"> · {activeCat.name}</span> : ""} ({total})
        </h1>
        <Link href={newHref} className="btn-primary">+ Thêm sản phẩm</Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Cột trái: danh mục (lọc + quản lý) */}
        <aside className="card h-fit p-2">
          <div className="flex items-center justify-between px-2 py-2">
            <span className="text-sm font-semibold text-gray-700">Danh mục</span>
            <Link href="/admin/categories/new" className="text-xs text-brand hover:underline">+ Thêm</Link>
          </div>
          <nav className="space-y-0.5">
            <CatLink href="/admin/products" active={!catId} label="Tất cả sản phẩm" count={allCount} />
            {categories.map((c) => (
              <CatLink
                key={c.id}
                href={`/admin/products?cat=${c.id}`}
                active={c.id === catId}
                label={c.name}
                count={c._count.products}
                editHref={`/admin/categories/${c.id}`}
                deleteId={c._count.products === 0 ? c.id : undefined}
              />
            ))}
          </nav>
        </aside>

        {/* Cột phải: tìm kiếm + bảng sản phẩm */}
        <div>
          <form className="mb-4">
            {catId ? <input type="hidden" name="cat" value={catId} /> : null}
            <input
              name="q"
              defaultValue={q}
              placeholder="Tìm theo tên / mã SP..."
              className="input max-w-xs"
            />
          </form>

          <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
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
                      <ConfirmButton
                        className="text-red-500 hover:underline"
                        message={`Xóa sản phẩm "${p.name}"? Hành động này không thể hoàn tác.`}
                      >
                        Xóa
                      </ConfirmButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  Không có sản phẩm nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          {page > 1 ? (
            <Link href={qs(page - 1)} className="btn-outline px-3 py-1.5">← Trước</Link>
          ) : (
            <span className="btn-outline cursor-not-allowed px-3 py-1.5 opacity-40">← Trước</span>
          )}
          <span className="px-2 text-gray-500">Trang {page}/{totalPages}</span>
          {page < totalPages ? (
            <Link href={qs(page + 1)} className="btn-outline px-3 py-1.5">Sau →</Link>
          ) : (
            <span className="btn-outline cursor-not-allowed px-3 py-1.5 opacity-40">Sau →</span>
          )}
        </div>
      )}
        </div>
      </div>
    </div>
  );
}

function CatLink({
  href,
  active,
  label,
  count,
  editHref,
  deleteId,
}: {
  href: string;
  active: boolean;
  label: string;
  count: number;
  editHref?: string;
  deleteId?: number;
}) {
  return (
    <div
      className={`group flex items-center justify-between rounded-lg px-2 py-1.5 text-sm ${
        active ? "bg-brand/10 font-semibold text-brand" : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      <Link href={href} className="flex-1 truncate">
        {label}
      </Link>
      <div className="flex shrink-0 items-center gap-2 pl-2">
        {editHref && (
          <Link
            href={editHref}
            className="text-xs text-gray-300 opacity-0 hover:text-brand group-hover:opacity-100"
            title="Sửa danh mục"
          >
            ✎
          </Link>
        )}
        {deleteId && (
          <form action={deleteCategory}>
            <input type="hidden" name="id" value={deleteId} />
            <ConfirmButton
              className="text-xs text-gray-300 opacity-0 hover:text-red-500 group-hover:opacity-100"
              message={`Xóa danh mục "${label}"?`}
            >
              ✕
            </ConfirmButton>
          </form>
        )}
        <span className={`text-xs ${active ? "text-brand" : "text-gray-400"}`}>{count}</span>
      </div>
    </div>
  );
}
