import { getSession } from "@/lib/auth";
import AdminShell from "@/components/AdminShell";
import "../globals.css";

const NAV = [
  { href: "/admin", label: "Tổng quan", icon: "📊" },
  { href: "/admin/products", label: "Sản phẩm", icon: "📦" },
  { href: "/admin/categories", label: "Danh mục", icon: "🗂️" },
  { href: "/admin/brands", label: "Thương hiệu", icon: "🏷️" },
  { href: "/admin/orders", label: "Đơn hàng", icon: "🧾" },
  { href: "/admin/quotations", label: "Báo giá (RFQ)", icon: "💬" },
  { href: "/admin/contacts", label: "Tin nhắn liên hệ", icon: "📨" },
  { href: "/admin/projects", label: "Công trình", icon: "🏗️" },
  { href: "/admin/articles", label: "Tin tức", icon: "📰" },
  { href: "/admin/about", label: "Trang Giới thiệu", icon: "🏢" },
  { href: "/admin/settings", label: "Cấu hình website", icon: "⚙️" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Trang đăng nhập: không có sidebar
  if (!session) {
    return <>{children}</>;
  }

  return (
    <AdminShell nav={NAV} userName={session.name} userRole={session.role}>
      {children}
    </AdminShell>
  );
}
