"use client";

import { useState } from "react";

// Bọc nội dung bộ lọc: desktop hiển thị dạng sidebar, mobile thu vào nút "Bộ lọc" mở drawer.
export default function FilterPanel({
  children,
  activeCount,
}: {
  children: React.ReactNode;
  activeCount?: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Nút mở bộ lọc (chỉ mobile) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-outline w-full justify-between lg:hidden"
        aria-expanded={open}
      >
        <span>🎚️ Bộ lọc{activeCount ? ` (${activeCount})` : ""}</span>
        <span aria-hidden>▾</span>
      </button>

      {/* Desktop: sidebar luôn hiển thị */}
      <div className="hidden space-y-6 lg:block">{children}</div>

      {/* Mobile: drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 top-0 flex h-full w-80 max-w-[85%] flex-col bg-white shadow-xl">
            <div className="flex h-14 items-center justify-between border-b px-4">
              <span className="font-bold">Bộ lọc sản phẩm</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Đóng bộ lọc"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto p-4">{children}</div>
            <div className="border-t p-3">
              <button onClick={() => setOpen(false)} className="btn-primary w-full">
                Xem kết quả
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
