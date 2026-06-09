"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatVND } from "@/lib/format";

export default function CartPage() {
  const { items, setQty, remove, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-main py-16 text-center">
        <div className="text-6xl">🛒</div>
        <h1 className="mt-4 text-xl font-bold">Giỏ hàng trống</h1>
        <p className="mt-2 text-gray-500">Hãy thêm sản phẩm vào giỏ để tiếp tục.</p>
        <Link href="/san-pham" className="btn-primary mt-6">Xem sản phẩm</Link>
      </div>
    );
  }

  return (
    <div className="container-main py-8">
      <h1 className="mb-6 text-2xl font-bold">Giỏ hàng</h1>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card divide-y">
          {items.map((i) => (
            <div key={i.productId} className="flex items-center gap-4 p-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                <img
                  src={i.image || "/products/upvc.jpg"}
                  alt={i.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <Link href={`/san-pham/${i.slug}`} className="font-medium hover:text-brand">
                  {i.name}
                </Link>
                <div className="text-sm text-gray-500">
                  {formatVND(i.price)} /{i.unit}
                </div>
              </div>
              <div className="flex items-center rounded-md border border-gray-300">
                <button onClick={() => setQty(i.productId, i.quantity - 1)} className="px-2.5 py-1">−</button>
                <input
                  type="number"
                  value={i.quantity}
                  min={1}
                  onChange={(e) => setQty(i.productId, Number(e.target.value) || 1)}
                  className="w-12 border-x border-gray-300 py-1 text-center outline-none"
                />
                <button onClick={() => setQty(i.productId, i.quantity + 1)} className="px-2.5 py-1">+</button>
              </div>
              <div className="w-28 text-right font-semibold">
                {formatVND(i.price * i.quantity)}
              </div>
              <button
                onClick={() => remove(i.productId)}
                className="text-gray-400 hover:text-red-500"
                title="Xóa"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="card h-fit p-5">
          <h2 className="mb-4 font-bold">Tóm tắt đơn hàng</h2>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tạm tính</span>
            <span>{formatVND(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Phí vận chuyển</span>
            <span>Tính khi đặt hàng</span>
          </div>
          <div className="mt-4 flex justify-between border-t pt-4 text-lg font-bold">
            <span>Tổng tạm tính</span>
            <span className="text-brand">{formatVND(subtotal)}</span>
          </div>
          <Link href="/thanh-toan" className="btn-primary mt-4 w-full">
            Tiến hành đặt hàng
          </Link>
          <Link href="/san-pham" className="mt-2 block text-center text-sm text-brand hover:underline">
            ← Tiếp tục mua hàng
          </Link>
        </div>
      </div>
    </div>
  );
}
