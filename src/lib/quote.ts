// Tính toán tổng tiền báo giá dùng chung cho admin, export Excel, phiếu in.

export type QuoteItemLike = { quantity: number; quotedPrice: number | null };

export function computeQuoteTotals(
  items: QuoteItemLike[],
  vatPercent: number,
  discount: number
) {
  const subtotal = items.reduce(
    (s, i) => s + (i.quotedPrice ?? 0) * i.quantity,
    0
  );
  const afterDiscount = Math.max(0, subtotal - discount);
  const vat = (afterDiscount * vatPercent) / 100;
  const total = afterDiscount + vat;
  return { subtotal, discount, vat, total };
}
