import Link from "next/link";
import { saveBrand } from "@/app/admin/brands/actions";

type Brand = { id: number; name: string; slug: string };

export default function BrandForm({ brand }: { brand?: Brand }) {
  return (
    <form action={saveBrand} className="max-w-xl space-y-4">
      {brand && <input type="hidden" name="id" value={brand.id} />}
      <div className="card space-y-4 p-6">
        <div>
          <label className="label">Tên thương hiệu *</label>
          <input name="name" required defaultValue={brand?.name} className="input" placeholder="VD: Bình Minh, Tiền Phong..." />
        </div>
        <div>
          <label className="label">Đường dẫn (slug)</label>
          <input name="slug" defaultValue={brand?.slug} className="input" placeholder="để trống = tự tạo từ tên" />
          <p className="mt-1 text-xs text-slate-400">
            Dùng trong liên kết lọc: <code>/san-pham?brand=slug</code>
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <button className="btn-primary">Lưu thương hiệu</button>
        <Link href="/admin/brands" className="btn-outline">Hủy</Link>
      </div>
    </form>
  );
}
