"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatVND } from "@/lib/format";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const shippingFee = subtotal >= 2000000 ? 0 : subtotal > 0 ? 50000 : 0;
  const total = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="container-main py-16 text-center">
        <p className="text-gray-500">Giỏ hàng trống.</p>
        <Link href="/san-pham" className="btn-primary mt-4">Xem sản phẩm</Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      customerName: fd.get("customerName"),
      customerPhone: fd.get("customerPhone"),
      customerEmail: fd.get("customerEmail"),
      shippingAddress: fd.get("shippingAddress"),
      note: fd.get("note"),
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Đặt hàng thất bại");
      clear();
      router.push(`/dat-hang-thanh-cong?code=${data.code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
      setSubmitting(false);
    }
  }

  return (
    <div className="container-main py-8">
      <h1 className="mb-6 text-2xl font-bold">Thanh toán</h1>
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card space-y-4 p-5">
          <h2 className="font-bold">Thông tin nhận hàng</h2>
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}
          <div>
            <label className="label">Họ tên người nhận *</label>
            <input name="customerName" required className="input" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Số điện thoại *</label>
              <input name="customerPhone" required className="input" />
            </div>
            <div>
              <label className="label">Email</label>
              <input name="customerEmail" type="email" className="input" />
            </div>
          </div>
          <div>
            <label className="label">Địa chỉ giao hàng *</label>
            <textarea name="shippingAddress" required rows={3} className="input" placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" />
          </div>
          <div>
            <label className="label">Ghi chú</label>
            <textarea name="note" rows={2} className="input" />
          </div>

          <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-700">
            💵 Phương thức thanh toán: <strong>COD (thanh toán khi nhận hàng)</strong>
          </div>
        </div>

        <div className="card h-fit p-5">
          <h2 className="mb-4 font-bold">Đơn hàng ({items.length} SP)</h2>
          <div className="space-y-2 text-sm">
            {items.map((i) => (
              <div key={i.productId} className="flex justify-between gap-2">
                <span className="text-gray-600">
                  {i.name} <span className="text-gray-400">×{i.quantity}</span>
                </span>
                <span className="whitespace-nowrap">{formatVND(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-1 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Tạm tính</span>
              <span>{formatVND(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phí vận chuyển</span>
              <span>{shippingFee === 0 ? "Miễn phí" : formatVND(shippingFee)}</span>
            </div>
          </div>
          <div className="mt-3 flex justify-between border-t pt-3 text-lg font-bold">
            <span>Tổng cộng</span>
            <span className="text-brand">{formatVND(total)}</span>
          </div>
          <button disabled={submitting} className="btn-primary mt-4 w-full disabled:opacity-60">
            {submitting ? "Đang xử lý..." : "Đặt hàng"}
          </button>
        </div>
      </form>
    </div>
  );
}
