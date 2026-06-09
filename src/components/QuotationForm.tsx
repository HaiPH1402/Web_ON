"use client";

import { useState } from "react";

type ProductOption = { name: string; unit: string };
type Row = { productName: string; quantity: number; unit: string };

export default function QuotationForm({ products }: { products: ProductOption[] }) {
  const [rows, setRows] = useState<Row[]>([{ productName: "", quantity: 1, unit: "cây" }]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState("");

  const addRow = () => setRows((r) => [...r, { productName: "", quantity: 1, unit: "cây" }]);
  const removeRow = (idx: number) =>
    setRows((r) => (r.length > 1 ? r.filter((_, i) => i !== idx) : r));

  const update = (idx: number, patch: Partial<Row>) =>
    setRows((r) => r.map((row, i) => (i === idx ? { ...row, ...patch } : row)));

  // Khi gõ/chọn tên sản phẩm, nếu khớp sản phẩm trong kho thì tự điền đơn vị
  const onNameChange = (idx: number, value: string) => {
    const match = products.find((p) => p.name === value);
    update(idx, match ? { productName: value, unit: match.unit } : { productName: value });
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const validRows = rows.filter((r) => r.productName.trim());
    if (validRows.length === 0) {
      setError("Vui lòng nhập ít nhất 1 sản phẩm vào bảng bên trái.");
      return;
    }
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: fd.get("customerName"),
          customerPhone: fd.get("customerPhone"),
          customerEmail: fd.get("customerEmail"),
          note: fd.get("note"),
          items: validRows,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gửi yêu cầu thất bại");
      setDone(data.code);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="py-16 text-center">
        <div className="text-6xl">📩</div>
        <h1 className="mt-4 text-2xl font-bold">Đã gửi yêu cầu báo giá!</h1>
        <p className="mt-2 text-gray-600">
          Mã yêu cầu: <strong className="text-brand">{done}</strong>
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Bộ phận kinh doanh sẽ liên hệ gửi báo giá cho bạn trong thời gian sớm nhất.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* Danh sách SP cần báo giá */}
      <div className="card p-5">
        <h2 className="font-bold">Bảng sản phẩm cần báo giá</h2>
        <p className="mt-1 text-sm text-slate-500">
          Gõ tên sản phẩm (gõ vài chữ sẽ hiện gợi ý để chọn), nhập số lượng và đơn vị.
          Không có trong danh sách gợi ý vẫn gõ tự do được.
        </p>

        {/* Tiêu đề cột */}
        <div className="mt-4 hidden grid-cols-[1fr_80px_88px_32px] gap-2 px-1 text-xs font-semibold text-slate-500 sm:grid">
          <span>Tên sản phẩm</span>
          <span className="text-center">Số lượng</span>
          <span className="text-center">Đơn vị</span>
          <span></span>
        </div>

        <datalist id="product-options">
          {products.map((p) => (
            <option key={p.name} value={p.name} />
          ))}
        </datalist>

        <div className="mt-2 space-y-2">
          {rows.map((row, idx) => (
            <div key={idx} className="grid grid-cols-[1fr_80px_88px_32px] gap-2">
              <input
                list="product-options"
                className="input"
                placeholder="VD: Ống uPVC Bình Minh Ø90"
                value={row.productName}
                onChange={(e) => onNameChange(idx, e.target.value)}
              />
              <input
                type="number"
                min={1}
                className="input text-center"
                value={row.quantity}
                onChange={(e) => update(idx, { quantity: Number(e.target.value) || 1 })}
              />
              <input
                className="input text-center"
                placeholder="cây"
                value={row.unit}
                onChange={(e) => update(idx, { unit: e.target.value })}
              />
              <button
                type="button"
                onClick={() => removeRow(idx)}
                className="text-gray-400 hover:text-red-500"
                aria-label="Xóa dòng"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button type="button" onClick={addRow} className="btn-outline mt-3">
          + Thêm dòng
        </button>

        <div className="mt-4 rounded-lg bg-sky-50 p-3 text-xs text-slate-600">
          💡 <strong>Ví dụ:</strong> “Ống HDPE DN63 PN10” — SL <strong>500</strong> — đơn vị <strong>mét</strong>.
          Bạn cứ liệt kê tất cả vật tư cần, nhân viên sẽ báo giá sỉ trọn gói.
        </div>
      </div>

      {/* Thông tin liên hệ */}
      <div className="card h-fit p-5">
        <h2 className="mb-3 font-bold">Thông tin liên hệ</h2>
        {error && (
          <div className="mb-3 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
        )}
        <div className="space-y-3">
          <div>
            <label className="label">Họ tên *</label>
            <input name="customerName" required className="input" placeholder="Nguyễn Văn A" />
          </div>
          <div>
            <label className="label">Số điện thoại *</label>
            <input name="customerPhone" required className="input" placeholder="09xx xxx xxx" />
          </div>
          <div>
            <label className="label">Email</label>
            <input name="customerEmail" type="email" className="input" placeholder="email@example.com" />
          </div>
          <div>
            <label className="label">Ghi chú (địa điểm, tiến độ...)</label>
            <textarea name="note" rows={2} className="input" placeholder="VD: Giao công trình tại Q.7, cần trong tháng 7" />
          </div>
          <button disabled={submitting} className="btn-primary w-full disabled:opacity-60">
            {submitting ? "Đang gửi..." : "Gửi yêu cầu báo giá"}
          </button>
        </div>
      </div>
    </form>
  );
}
