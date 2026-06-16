import Link from "next/link";
import { saveProduct } from "@/app/admin/products/actions";
import ImageUploader from "@/components/ImageUploader";

type Category = { id: number; name: string };
type Brand = { id: number; name: string };
type Product = {
  id: number;
  sku: string;
  name: string;
  description: string | null;
  material: string | null;
  diameter: string | null;
  pressure: string | null;
  standard: string | null;
  unit: string;
  packaging: string | null;
  imageUrl: string | null;
  retailPrice: number;
  wholesalePrice: number | null;
  stock: number;
  categoryId: number;
  brandId: number | null;
  brand?: { name: string } | null;
  isActive: boolean;
  isFeatured: boolean;
};

export default function ProductForm({
  product,
  categories,
  brands,
}: {
  product?: Product;
  categories: Category[];
  brands: Brand[];
}) {
  return (
    <form action={saveProduct} className="max-w-3xl">
      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="card space-y-5 p-6">
        <h2 className="font-bold">Thông tin cơ bản</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tên sản phẩm *">
            <input name="name" required defaultValue={product?.name} className="input" />
          </Field>
          <Field label="Mã SKU">
            <input name="sku" defaultValue={product?.sku} className="input" placeholder="Để trống = tự sinh (VD: SP1015)" />
          </Field>
        </div>

        <Field label="Mô tả">
          <textarea name="description" rows={3} defaultValue={product?.description ?? ""} className="input" />
        </Field>

        <Field label="Ảnh sản phẩm">
          <ImageUploader name="imageUrl" defaultValue={product?.imageUrl} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Danh mục *">
            <select name="categoryId" required defaultValue={product?.categoryId} className="input">
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Thương hiệu">
            <input
              name="brandName"
              list="brand-options"
              defaultValue={product?.brand?.name ?? ""}
              className="input"
              placeholder="Chọn hãng có sẵn hoặc gõ hãng mới..."
            />
            <datalist id="brand-options">
              {brands.map((b) => (
                <option key={b.id} value={b.name} />
              ))}
            </datalist>
            <p className="mt-1 text-xs text-slate-400">
              Gõ tên hãng mới → tự tạo. Để trống = không có thương hiệu.
            </p>
          </Field>
        </div>
      </div>

      <div className="card mt-4 space-y-5 p-6">
        <h2 className="font-bold">Thông số kỹ thuật</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Vật liệu">
            <input name="material" defaultValue={product?.material ?? ""} className="input" placeholder="uPVC, HDPE..." />
          </Field>
          <Field label="Đường kính">
            <input name="diameter" defaultValue={product?.diameter ?? ""} className="input" placeholder="DN20, Ø90..." />
          </Field>
          <Field label="Áp lực / Class">
            <input name="pressure" defaultValue={product?.pressure ?? ""} className="input" placeholder="PN10..." />
          </Field>
          <Field label="Tiêu chuẩn">
            <input name="standard" defaultValue={product?.standard ?? ""} className="input" placeholder="TCVN, ISO..." />
          </Field>
          <Field label="Đơn vị tính">
            <input name="unit" defaultValue={product?.unit ?? "cây"} className="input" placeholder="cây, mét, cái..." />
          </Field>
          <Field label="Quy cách đóng gói">
            <input name="packaging" defaultValue={product?.packaging ?? ""} className="input" placeholder="Cây 4m..." />
          </Field>
        </div>
      </div>

      <div className="card mt-4 space-y-5 p-6">
        <h2 className="font-bold">Giá & Kho</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Giá lẻ (₫) *">
            <input name="retailPrice" type="number" required defaultValue={product?.retailPrice} className="input" />
          </Field>
          <Field label="Giá sỉ (₫)">
            <input name="wholesalePrice" type="number" defaultValue={product?.wholesalePrice ?? ""} className="input" />
          </Field>
          <Field label="Tồn kho">
            <input name="stock" type="number" defaultValue={product?.stock ?? 0} className="input" />
          </Field>
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isActive" defaultChecked={product?.isActive ?? true} />
            Đang bán
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured ?? false} />
            Sản phẩm nổi bật
          </label>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button className="btn-primary">Lưu sản phẩm</button>
        <Link href="/admin/products" className="btn-outline">Hủy</Link>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
