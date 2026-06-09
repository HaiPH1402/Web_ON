"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, type CartItem } from "./CartProvider";

export default function AddToCart({ item }: { item: Omit<CartItem, "quantity"> }) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = (goToCart: boolean) => {
    add({ ...item, quantity: qty });
    if (goToCart) {
      router.push("/gio-hang");
    } else {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Số lượng:</span>
        <div className="flex items-center rounded-md border border-gray-300">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-1.5 text-lg"
          >
            −
          </button>
          <input
            type="number"
            value={qty}
            min={1}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            className="w-14 border-x border-gray-300 py-1.5 text-center outline-none"
          />
          <button onClick={() => setQty((q) => q + 1)} className="px-3 py-1.5 text-lg">
            +
          </button>
        </div>
        <span className="text-sm text-gray-500">{item.unit}</span>
      </div>

      <div className="flex gap-3">
        <button onClick={() => handleAdd(false)} className="btn-outline">
          {added ? "✓ Đã thêm" : "Thêm vào giỏ"}
        </button>
        <button onClick={() => handleAdd(true)} className="btn-primary">
          Mua ngay
        </button>
      </div>
    </div>
  );
}
