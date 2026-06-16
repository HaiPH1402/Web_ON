import { redirect } from "next/navigation";

// Quản lý danh mục đã được gộp vào trang Sản phẩm (cột danh mục bên trái).
export default function AdminCategoriesPage() {
  redirect("/admin/products");
}
