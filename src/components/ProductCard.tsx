import Link from "next/link";
import { formatVND } from "@/lib/format";
import { FALLBACK_IMAGE } from "@/lib/images";

type Props = {
  product: {
    slug: string;
    name: string;
    material: string | null;
    diameter: string | null;
    pressure: string | null;
    unit: string;
    retailPrice: number;
    wholesalePrice?: number | null;
    stock: number;
    imageUrl?: string | null;
    brand?: { name: string } | null;
  };
};

export default function ProductCard({ product }: Props) {
  const inStock = product.stock > 0;
  return (
    <Link
      href={`/san-pham/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-hover"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.imageUrl || FALLBACK_IMAGE}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        {product.brand && (
          <span className="absolute left-2 top-2 rounded-md bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-brand shadow-sm backdrop-blur">
            {product.brand.name}
          </span>
        )}
        {!inStock && (
          <span className="absolute right-2 top-2 rounded-md bg-slate-900/80 px-2 py-0.5 text-[11px] font-semibold text-white">
            Hết hàng
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="line-clamp-2 min-h-[2.6rem] text-sm font-semibold text-slate-800 group-hover:text-brand">
          {product.name}
        </h3>
        <div className="mt-2 flex flex-wrap gap-1">
          {product.material && <span className="chip">{product.material}</span>}
          {product.diameter && <span className="chip">{product.diameter}</span>}
          {product.pressure && product.pressure !== "—" && (
            <span className="chip">{product.pressure}</span>
          )}
        </div>
        <div className="mt-auto pt-3">
          <div className="text-lg font-extrabold text-brand">
            {formatVND(product.retailPrice)}
            <span className="text-xs font-medium text-slate-400"> /{product.unit}</span>
          </div>
          {product.wholesalePrice ? (
            <div className="text-xs text-slate-500">
              Giá sỉ: <span className="font-semibold text-accent">{formatVND(product.wholesalePrice)}</span>
            </div>
          ) : (
            <div className="text-xs text-slate-400">
              {inStock ? `Còn hàng (${product.stock})` : "Tạm hết"}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
