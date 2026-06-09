"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartProvider";
import type { SiteConfig } from "@/lib/site";

export type NavCategory = { id: number; name: string; slug: string };

export default function Header({
  site,
  categories,
}: {
  site: SiteConfig;
  categories: NavCategory[];
}) {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);

  // Menu "Sản phẩm" dựng động từ danh mục trong DB
  const productMenu = [
    { href: "/san-pham", label: "Tất cả sản phẩm" },
    ...categories.map((c) => ({ href: `/san-pham?category=${c.slug}`, label: c.name })),
  ];

  const NAV = [
    { href: "/", label: "Trang chủ", children: undefined as { href: string; label: string }[] | undefined },
    { href: "/gioi-thieu", label: "Giới thiệu", children: undefined },
    { href: "/san-pham", label: "Sản phẩm", children: productMenu },
    { href: "/du-an", label: "Công trình tiêu biểu", children: undefined },
    { href: "/tin-tuc", label: "Tin tức", children: undefined },
    { href: "/lien-he", label: "Liên hệ", children: undefined },
  ];

  return (
    <header className="sticky top-0 z-40">
      {/* Top bar — ẩn trên mobile */}
      <div className="hidden bg-brand-dark text-white sm:block">
        <div className="container-main flex h-9 items-center justify-between text-xs">
          <span className="flex items-center gap-1.5">
            🚚 Giao hàng toàn quốc · Hỗ trợ nhà thầu & công trình
          </span>
          <span className="flex items-center gap-4">
            <span>📞 Hotline: {site.hotlineSales}</span>
            <span>🕗 8:00 – 18:00</span>
          </span>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="container-main flex h-16 items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Mở menu"
            aria-expanded={open}
            className="-ml-1 flex h-10 w-10 items-center justify-center rounded-lg text-2xl text-slate-700 hover:bg-slate-100 lg:hidden"
          >
            ☰
          </button>

          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            {site.logoImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={site.logoImage}
                alt={site.name}
                className="h-9 w-9 rounded-lg object-cover shadow-sm sm:h-10 sm:w-10"
              />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-lg text-white shadow-sm sm:h-10 sm:w-10 sm:text-xl">
                💧
              </span>
            )}
            <span className="leading-tight">
              <span className="block text-base font-extrabold tracking-tight text-brand-dark sm:text-lg">
                {site.name}
              </span>
              <span className="hidden text-[11px] font-medium text-slate-400 sm:block">
                {site.tagline}
              </span>
            </span>
          </Link>

          {/* Search (desktop) */}
          <form action="/san-pham" role="search" className="ml-2 hidden flex-1 md:block">
            <div className="relative max-w-xl">
              <label htmlFor="header-search" className="sr-only">Tìm kiếm sản phẩm</label>
              <input
                id="header-search"
                name="q"
                type="search"
                aria-label="Tìm kiếm sản phẩm"
                placeholder="Tìm ống uPVC, HDPE, phụ kiện, van..."
                className="input pl-10"
              />
              <span aria-hidden className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            </div>
          </form>

          <div className="ml-auto flex items-center gap-2">
            <Link href="/bao-gia" className="btn-outline hidden sm:inline-flex">📋 Báo giá</Link>
            <Link href="/gio-hang" aria-label="Giỏ hàng" className="btn-primary relative px-3 sm:px-4">
              🛒
              <span className="hidden sm:inline">Giỏ hàng</span>
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-white ring-2 ring-white">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search (mobile) */}
        <div className="border-t border-slate-100 px-4 py-2 md:hidden">
          <form action="/san-pham" role="search" className="relative">
            <label htmlFor="header-search-mobile" className="sr-only">Tìm kiếm sản phẩm</label>
            <input
              id="header-search-mobile"
              name="q"
              type="search"
              aria-label="Tìm kiếm sản phẩm"
              placeholder="Tìm sản phẩm..."
              className="input pl-10"
            />
            <span aria-hidden className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          </form>
        </div>

        {/* Nav ngang (desktop) */}
        <nav aria-label="Danh mục chính" className="hidden border-t border-slate-100 bg-white lg:block">
          <div className="container-main flex h-[52px] items-center gap-1 text-[15px] font-semibold">
            {NAV.map((n) =>
              n.children ? (
                <div key={n.label} className="group relative">
                  <Link
                    href={n.href}
                    className="flex items-center gap-1 whitespace-nowrap rounded-lg px-4 py-2 text-slate-700 transition hover:bg-brand-50 hover:text-brand group-hover:text-brand"
                  >
                    {n.label}
                    <span aria-hidden className="text-[10px]">▾</span>
                  </Link>
                  {/* Dropdown */}
                  <div className="invisible absolute left-0 top-full z-50 w-56 translate-y-1 rounded-xl border border-slate-200 bg-white p-2 opacity-0 shadow-hover transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {n.children.map((c) => (
                      <Link
                        key={c.label}
                        href={c.href}
                        className="block rounded-lg px-3 py-2 text-slate-600 hover:bg-brand-50 hover:text-brand"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={n.label}
                  href={n.href}
                  className="whitespace-nowrap rounded-lg px-4 py-2 text-slate-700 transition hover:bg-brand-50 hover:text-brand"
                >
                  {n.label}
                </Link>
              )
            )}
          </div>
        </nav>
      </div>

      {/* Drawer menu (mobile) */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[80%] overflow-y-auto bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between border-b px-4">
              <span className="font-extrabold text-brand-dark">{site.name}</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Đóng menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <nav aria-label="Danh mục chính" className="flex flex-col p-3">
              {NAV.map((n) =>
                n.children ? (
                  <div key={n.label}>
                    <button
                      onClick={() => setSubOpen((v) => !v)}
                      aria-expanded={subOpen}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-slate-700 hover:bg-brand-50 hover:text-brand"
                    >
                      {n.label}
                      <span aria-hidden>{subOpen ? "▾" : "▸"}</span>
                    </button>
                    {subOpen && (
                      <div className="ml-3 border-l border-slate-200 pl-2">
                        {n.children.map((c) => (
                          <Link
                            key={c.label}
                            href={c.href}
                            onClick={() => setOpen(false)}
                            className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-brand-50 hover:text-brand"
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={n.label}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-slate-700 hover:bg-brand-50 hover:text-brand"
                  >
                    {n.label}
                  </Link>
                )
              )}
              <Link href="/bao-gia" onClick={() => setOpen(false)} className="btn-accent mt-3">
                📋 Yêu cầu báo giá
              </Link>
              <div className="mt-4 border-t pt-4 text-sm text-slate-500">
                <p>📞 {site.hotlineSales}</p>
                <p className="mt-1">✉️ {site.emailCskh}</p>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
