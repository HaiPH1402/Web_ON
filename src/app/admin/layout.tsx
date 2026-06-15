import Link from "next/link";
import { getSession } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";
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
    <div className="flex min-h-screen bg-gray-100">
      <aside className="flex w-60 flex-col border-r border-gray-200 bg-white">
        <div className="flex h-16 items-center gap-2 border-b px-5 text-lg font-bold text-brand">
          💧 Quản trị
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-sky-50 hover:text-brand"
            >
              <span>{n.icon}</span>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="border-t p-3 text-sm">
          <div className="mb-2 px-2 text-gray-500">
            👤 {session.name}
            <span className="ml-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs">{session.role}</span>
          </div>
          <LogoutButton />
          <Link href="/" className="mt-1 block px-2 text-xs text-gray-400 hover:text-brand">
            ← Về trang bán hàng
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
