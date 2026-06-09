import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/format";
import AddToCart from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      brand: true,
      category: true,
      priceTiers: { orderBy: { minQty: "asc" } },
      images: true,
    },
  });

  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    include: { brand: true },
    take: 4,
  });

  const specs: [string, string | null][] = [
    ["Mã sản phẩm", product.sku],
    ["Thương hiệu", product.brand?.name ?? null],
    ["Vật liệu", product.material],
    ["Đường kính", product.diameter],
    ["Áp lực / Class", product.pressure],
    ["Tiêu chuẩn", product.standard],
    ["Đơn vị tính", product.unit],
    ["Quy cách", product.packaging],
  ];

  return (
    <div className="container-main py-8">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/" className="hover:text-brand">Trang chủ</Link> /{" "}
        <Link href={`/san-pham?category=${product.category.slug}`} className="hover:text-brand">
          {product.category.name}
        </Link>{" "}
        / <span className="text-gray-700">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Ảnh */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
          <img
            src={product.imageUrl || "/products/upvc.jpg"}
            alt={product.name}
            className="aspect-square w-full object-cover"
          />
        </div>

        {/* Thông tin */}
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          {product.brand && (
            <p className="mt-1 text-sm text-brand">{product.brand.name}</p>
          )}

          <div className="mt-4 rounded-lg bg-sky-50 p-4">
            <div className="text-3xl font-bold text-brand">
              {formatVND(product.retailPrice)}
              <span className="text-base font-normal text-gray-500"> /{product.unit}</span>
            </div>
            {product.wholesalePrice && (
              <p className="mt-1 text-sm text-gray-600">
                Giá sỉ từ: <strong>{formatVND(product.wholesalePrice)}</strong> /{product.unit}
              </p>
            )}
          </div>

          {/* Bảng giá theo số lượng */}
          {product.priceTiers.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-semibold">Bảng giá theo số lượng</h3>
              <table className="w-full overflow-hidden rounded-md border border-gray-200 text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-3 py-2 text-left">Số lượng</th>
                    <th className="px-3 py-2 text-right">Đơn giá</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-3 py-2">1 – 49 {product.unit}</td>
                    <td className="px-3 py-2 text-right">{formatVND(product.retailPrice)}</td>
                  </tr>
                  {product.priceTiers.map((t) => (
                    <tr key={t.id} className="border-t">
                      <td className="px-3 py-2">Từ {t.minQty} {product.unit}</td>
                      <td className="px-3 py-2 text-right font-medium text-brand">
                        {formatVND(t.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-5">
            {product.stock > 0 ? (
              <AddToCart
                item={{
                  productId: product.id,
                  name: product.name,
                  slug: product.slug,
                  unit: product.unit,
                  price: product.retailPrice,
                  image: product.imageUrl,
                }}
              />
            ) : (
              <p className="font-medium text-red-500">Sản phẩm tạm hết hàng</p>
            )}
            <Link href="/bao-gia" className="mt-3 inline-block text-sm text-brand hover:underline">
              Mua số lượng lớn? Yêu cầu báo giá →
            </Link>
          </div>
        </div>
      </div>

      {/* Thông số kỹ thuật */}
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-3 text-lg font-bold">Thông số kỹ thuật</h2>
          <table className="w-full overflow-hidden rounded-md border border-gray-200 text-sm">
            <tbody>
              {specs
                .filter(([, v]) => v && v !== "—")
                .map(([k, v]) => (
                  <tr key={k} className="border-t first:border-t-0 even:bg-gray-50">
                    <td className="w-1/3 px-3 py-2 font-medium text-gray-600">{k}</td>
                    <td className="px-3 py-2">{v}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div>
          <h2 className="mb-3 text-lg font-bold">Mô tả</h2>
          <p className="text-sm leading-relaxed text-gray-600">{product.description}</p>
        </div>
      </div>

      {/* Sản phẩm liên quan */}
      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-bold">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
