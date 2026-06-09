import Link from "next/link";
import { saveCategory } from "@/app/admin/categories/actions";
import ImageUploader from "@/components/ImageUploader";

type Category = { id: number; name: string; slug: string; image: string | null };

export default function CategoryForm({ category }: { category?: Category }) {
  return (
    <form action={saveCategory} className="max-w-xl space-y-4">
      {category && <input type="hidden" name="id" value={category.id} />}
      <div className="card space-y-4 p-6">
        <div>
          <label className="label">Tên danh mục *</label>
          <input name="name" required defaultValue={category?.name} className="input" placeholder="VD: Ống nhựa PVC" />
        </div>
        <div>
          <label className="label">Ảnh danh mục</label>
          <ImageUploader name="image" defaultValue={category?.image} />
        </div>
        <div>
          <label className="label">Đường dẫn (slug)</label>
          <input name="slug" defaultValue={category?.slug} className="input" placeholder="để trống = tự tạo từ tên" />
          <p className="mt-1 text-xs text-slate-400">
            Dùng trong liên kết lọc: <code>/san-pham?category=slug</code>
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <button className="btn-primary">Lưu danh mục</button>
        <Link href="/admin/categories" className="btn-outline">Hủy</Link>
      </div>
    </form>
  );
}
