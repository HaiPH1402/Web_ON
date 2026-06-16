"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export type AdminNavItem = { href: string; label: string; icon: string };

export default function AdminShell({
  nav,
  userName,
  userRole,
  children,
}: {
  nav: AdminNavItem[];
  userName: string;
  userRole: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const Sidebar = (
    <>
      <div className="flex h-16 items-center gap-2 border-b px-5 text-lg font-bold text-brand">
        💧 Quản trị
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {nav.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
              isActive(n.href)
                ? "bg-sky-50 text-brand"
                : "text-gray-600 hover:bg-sky-50 hover:text-brand"
            }`}
          >
            <span>{n.icon}</span>
            {n.label}
          </Link>
        ))}
      </nav>
      <div className="border-t p-3 text-sm">
        <div className="mb-2 px-2 text-gray-500">
          👤 {userName}
          <span className="ml-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs">{userRole}</span>
        </div>
        <LogoutButton />
        <Link href="/" className="mt-1 block px-2 text-xs text-gray-400 hover:text-brand">
          ← Về trang bán hàng
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar cố định trên desktop */}
      <aside className="hidden w-60 flex-col border-r border-gray-200 bg-white lg:flex">
        {Sidebar}
      </aside>

      {/* Drawer trên mobile */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} aria-hidden />
          <aside className="absolute left-0 top-0 flex h-full w-64 max-w-[80%] flex-col bg-white shadow-xl">
            {Sidebar}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Thanh trên cùng (chỉ mobile) */}
        <div className="flex h-14 items-center gap-3 border-b border-gray-200 bg-white px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Mở menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-2xl text-gray-700 hover:bg-gray-100"
          >
            ☰
          </button>
          <span className="font-bold text-brand">💧 Quản trị</span>
        </div>

        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
