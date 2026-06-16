import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import FilterPanel from "@/components/FilterPanel";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

type SearchParams = {
  category?: string;
  material?: string;
  brand?: string;
  q?: string;
  sort?: string;
  page?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const where: Prisma.ProductWhereInput = { isActive: true };

  if (searchParams.category) {
    where.category = { slug: searchParams.category };
  }
  if (searchParams.material) {
    where.material = { contains: searchParams.material };
  }
  if (searchParams.brand) {
    where.brand = { slug: searchParams.brand };
  }
  if (searchParams.q) {
    where.OR = [
      { name: { contains: searchParams.q } },
      { sku: { contains: searchParams.q } },
    ];
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (searchParams.sort === "price-asc") orderBy = { retailPrice: "asc" };
  if (searchParams.sort === "price-desc") orderBy = { retailPrice: "desc" };

  const page = Math.max(1, Number(searchParams.page) || 1);

  const [total, products, categories, brands, materials] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: { brand: true },
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.category.findMany({ orderBy: { id: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: { isActive: true, material: { not: null } },
      distinct: ["material"],
      select: { material: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Đổi bộ lọc / sắp xếp -> luôn quay về trang 1
  const buildQuery = (patch: Partial<SearchParams>) => {
    const params = new URLSearchParams();
    const merged = { ...searchParams, ...patch, page: undefined };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    return "/san-pham?" + params.toString();
  };

  // Link chuyển trang — giữ nguyên bộ lọc hiện tại
  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    Object.entries({ ...searchParams, page: String(p) }).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    return "/san-pham?" + params.toString();
  };

  return (
    <div className="container-main py-8">
      <h1 className="mb-6 text-2xl font-bold">Sản phẩm</h1>

      {/* Tìm kiếm */}
      <form action="/san-pham" className="mb-6 flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={searchParams.q}
          placeholder="Tìm theo tên hoặc mã sản phẩm..."
          className="input max-w-md"
        />
        <button className="btn-primary">Tìm</button>
      </form>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Bộ lọc — desktop là sidebar, mobile gom vào nút mở drawer */}
        <FilterPanel
          activeCount={
            (searchParams.category ? 1 : 0) +
            (searchParams.material ? 1 : 0) +
            (searchParams.brand ? 1 : 0)
          }
        >
          <FilterGroup title="Danh mục">
            <FilterLink href={buildQuery({ category: undefined })} active={!searchParams.category}>
              Tất cả
            </FilterLink>
            {categories.map((c) => (
              <FilterLink
                key={c.id}
                href={buildQuery({ category: c.slug })}
                active={searchParams.category === c.slug}
              >
                {c.name}
              </FilterLink>
            ))}
          </FilterGroup>

          <FilterGroup title="Vật liệu">
            <FilterLink href={buildQuery({ material: undefined })} active={!searchParams.material}>
              Tất cả
            </FilterLink>
            {materials
              .map((m) => m.material!)
              .filter(Boolean)
              .map((m) => (
                <FilterLink
                  key={m}
                  href={buildQuery({ material: m })}
                  active={searchParams.material === m}
                >
                  {m}
                </FilterLink>
              ))}
          </FilterGroup>

          <FilterGroup title="Thương hiệu">
            <FilterLink href={buildQuery({ brand: undefined })} active={!searchParams.brand}>
              Tất cả
            </FilterLink>
            {brands.map((b) => (
              <FilterLink
                key={b.id}
                href={buildQuery({ brand: b.slug })}
                active={searchParams.brand === b.slug}
              >
                {b.name}
              </FilterLink>
            ))}
          </FilterGroup>
        </FilterPanel>

        {/* Kết quả */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">{total} sản phẩm</span>
            <div className="flex gap-2 text-sm">
              <Link href={buildQuery({ sort: "price-asc" })} className="btn-outline py-1">Giá ↑</Link>
              <Link href={buildQuery({ sort: "price-desc" })} className="btn-outline py-1">Giá ↓</Link>
            </div>
          </div>

          {products.length === 0 ? (
            <p className="rounded-md bg-white p-8 text-center text-gray-500">
              Không tìm thấy sản phẩm phù hợp.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2 text-sm">
              {page > 1 ? (
                <Link href={pageHref(page - 1)} className="btn-outline px-3 py-1.5">← Trước</Link>
              ) : (
                <span className="btn-outline cursor-not-allowed px-3 py-1.5 opacity-40">← Trước</span>
              )}
              <span className="px-3 text-gray-500">Trang {page}/{totalPages}</span>
              {page < totalPages ? (
                <Link href={pageHref(page + 1)} className="btn-outline px-3 py-1.5">Sau →</Link>
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

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-4">
      <h3 className="mb-2 text-sm font-semibold">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`block rounded px-2 py-1 text-sm ${
        active ? "bg-brand text-white" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {children}
    </Link>
  );
}
