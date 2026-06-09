// Ảnh đại diện cho từng danh mục (đã tải về /public/products)
export const CATEGORY_IMAGE: Record<string, string> = {
  "ong-upvc": "/products/upvc.jpg",
  "ong-hdpe": "/products/hdpe.jpg",
  "ong-ppr": "/products/ppr.jpg",
  "ong-thep-inox": "/products/thep.jpg",
  "phu-kien": "/products/phukien.jpg",
  "van-thiet-bi": "/products/van.jpg",
};

export function categoryImage(slug: string): string {
  return CATEGORY_IMAGE[slug] ?? "/products/upvc.jpg";
}

export const FALLBACK_IMAGE = "/products/upvc.jpg";
