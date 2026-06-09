import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/format";
import { computeQuoteTotals } from "@/lib/quote";
import { saveQuote } from "./actions";

export const dynamic = "force-dynamic";

const STATUS = { NEW: "Mới", QUOTED: "Đã báo giá", ACCEPTED: "Đã chốt", REJECTED: "Từ chối" };

export default async function QuotationDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const q = await prisma.quotation.findUnique({ where: { id }, include: { items: true } });
  if (!q) notFound();

  const totals = computeQuoteTotals(q.items, q.vatPercent, q.discount);

  return (
    <div className="max-w-4xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <Link href="/admin/quotations" className="text-sm text-brand hover:underline">← Danh sách báo giá</Link>
          <h1 className="mt-1 text-2xl font-bold">Báo giá {q.code}</h1>
        </div>
        <div className="flex gap-2">
          <a
            href={`/api/quotations/${id}/export`}
            className="btn-outline"
          >
            📥 Tải Excel
          </a>
          <a
            href={`/in/bao-gia/${id}`}
            target="_blank"
            className="btn-primary"
          >
            🖨️ Xem / In PDF
          </a>
        </div>
      </div>

      <div className="mb-4 card p-5 text-sm">
        <div className="grid gap-2 sm:grid-cols-2">
          <div><span className="text-slate-500">Khách hàng:</span> <strong>{q.customerName}</strong></div>
          <div><span className="text-slate-500">Điện thoại:</span> {q.customerPhone}</div>
          {q.customerEmail && <div><span className="text-slate-500">Email:</span> {q.customerEmail}</div>}
          <div><span className="text-slate-500">Ngày gửi:</span> {new Date(q.createdAt).toLocaleString("vi-VN")}</div>
        </div>
      </div>

      <form action={saveQuote}>
        <input type="hidden" name="id" value={id} />

        {/* Bảng điền giá kiểu Excel */}
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3 w-10">#</th>
                <th className="px-4 py-3">Sản phẩm</th>
                <th className="px-4 py-3 text-right w-24">SL</th>
                <th className="px-4 py-3 text-right w-44">Đơn giá (₫)</th>
                <th className="px-4 py-3 text-right w-36">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {q.items.map((it, i) => (
                <tr key={it.id} className="border-t">
                  <td className="px-4 py-2 text-gray-400">{i + 1}</td>
                  <td className="px-4 py-2">{it.productName}</td>
                  <td className="px-4 py-2 text-right">{it.quantity} {it.unit}</td>
                  <td className="px-4 py-2 text-right">
                    <input
                      name={`price_${it.id}`}
                      type="number"
                      min={0}
                      defaultValue={it.quotedPrice ?? ""}
                      placeholder="0"
                      className="input w-40 py-1 text-right"
                    />
                  </td>
                  <td className="px-4 py-2 text-right font-medium">
                    {it.quotedPrice ? formatVND(it.quotedPrice * it.quantity) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tổng tiền + tham số */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="card space-y-3 p-5">
            <div>
              <label className="label">Chiết khấu (₫)</label>
              <input name="discount" type="number" min={0} defaultValue={q.discount} className="input" />
            </div>
            <div>
              <label className="label">VAT (%)</label>
              <input name="vatPercent" type="number" min={0} max={100} defaultValue={q.vatPercent} className="input" placeholder="VD: 8 hoặc 10" />
            </div>
            <div>
              <label className="label">Trạng thái</label>
              <select name="status" defaultValue={q.status} className="input">
                {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Ghi chú / điều khoản</label>
              <textarea name="note" rows={3} defaultValue={q.note ?? ""} className="input" placeholder="VD: Báo giá có hiệu lực 15 ngày. Giao hàng tận công trình." />
            </div>
          </div>

          <div className="card h-fit space-y-2 p-5 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Tạm tính</span><span>{formatVND(totals.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Chiết khấu</span><span>-{formatVND(totals.discount)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">VAT ({q.vatPercent}%)</span><span>{formatVND(totals.vat)}</span></div>
            <div className="mt-2 flex justify-between border-t pt-2 text-lg font-bold">
              <span>Tổng cộng</span><span className="text-brand">{formatVND(totals.total)}</span>
            </div>
            <p className="pt-2 text-xs text-slate-400">* Bấm “Lưu” để cập nhật tổng tiền, sau đó tải Excel / in PDF.</p>
          </div>
        </div>

        <div className="mt-4">
          <button className="btn-primary">💾 Lưu báo giá</button>
        </div>
      </form>
    </div>
  );
}
