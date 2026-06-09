import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getConfig } from "@/lib/settings";
import { formatVND } from "@/lib/format";
import PrintButton from "@/components/PrintButton";

export const dynamic = "force-dynamic";

export default async function OrderPrintPage({ params }: { params: { id: string } }) {
  const o = await prisma.order.findUnique({
    where: { id: Number(params.id) },
    include: { items: true },
  });
  if (!o) notFound();
  const site = await getConfig();

  return (
    <div className="mx-auto max-w-3xl px-4">
      <PrintButton />

      <div className="rounded-lg bg-white p-8 shadow-card print:rounded-none print:p-0 print:shadow-none">
        <div className="flex items-start justify-between border-b-2 border-brand pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-brand-dark">{site.name}</h1>
            <p className="mt-1 text-sm text-slate-500">{site.tagline}</p>
            <p className="mt-2 text-xs text-slate-500">
              {site.addressLine1}, {site.addressLine2}<br />
              ĐT: {site.hotlineSales}
            </p>
          </div>
          <div className="text-right text-sm">
            <div className="text-xl font-bold">HÓA ĐƠN BÁN HÀNG</div>
            <div className="mt-1 text-slate-500">Số: <strong>{o.code}</strong></div>
            <div className="text-slate-500">Ngày: {new Date(o.createdAt).toLocaleDateString("vi-VN")}</div>
          </div>
        </div>

        <div className="mt-4 text-sm">
          <p><span className="text-slate-500">Khách hàng:</span> <strong>{o.customerName}</strong></p>
          <p><span className="text-slate-500">Điện thoại:</span> {o.customerPhone}</p>
          <p><span className="text-slate-500">Địa chỉ giao:</span> {o.shippingAddress}</p>
        </div>

        <table className="mt-5 w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand text-white">
              <th className="border border-brand-dark px-2 py-2">STT</th>
              <th className="border border-brand-dark px-3 py-2 text-left">Sản phẩm</th>
              <th className="border border-brand-dark px-2 py-2">ĐVT</th>
              <th className="border border-brand-dark px-2 py-2">SL</th>
              <th className="border border-brand-dark px-3 py-2 text-right">Đơn giá</th>
              <th className="border border-brand-dark px-3 py-2 text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {o.items.map((it, i) => (
              <tr key={it.id}>
                <td className="border border-slate-300 px-2 py-1.5 text-center">{i + 1}</td>
                <td className="border border-slate-300 px-3 py-1.5">{it.productName}</td>
                <td className="border border-slate-300 px-2 py-1.5 text-center">{it.unit}</td>
                <td className="border border-slate-300 px-2 py-1.5 text-center">{it.quantity}</td>
                <td className="border border-slate-300 px-3 py-1.5 text-right">{formatVND(it.price)}</td>
                <td className="border border-slate-300 px-3 py-1.5 text-right">{formatVND(it.lineTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end">
          <table className="text-sm">
            <tbody>
              <tr><td className="py-0.5 pr-8 text-slate-500">Tạm tính:</td><td className="py-0.5 text-right">{formatVND(o.subtotal)}</td></tr>
              <tr><td className="py-0.5 pr-8 text-slate-500">Phí vận chuyển:</td><td className="py-0.5 text-right">{o.shippingFee === 0 ? "Miễn phí" : formatVND(o.shippingFee)}</td></tr>
              <tr className="border-t"><td className="py-1.5 pr-8 font-bold">TỔNG CỘNG:</td><td className="py-1.5 text-right text-lg font-bold text-brand">{formatVND(o.total)}</td></tr>
            </tbody>
          </table>
        </div>

        {o.note && <p className="mt-4 border-t pt-3 text-sm italic text-slate-600">Ghi chú: {o.note}</p>}

        <div className="mt-10 flex justify-between text-sm">
          <div className="text-center"><p className="font-semibold">Người mua hàng</p><p className="text-xs text-slate-400">(Ký, ghi rõ họ tên)</p></div>
          <div className="text-center"><p className="font-semibold">{site.name}</p><p className="text-xs text-slate-400">(Ký, đóng dấu)</p></div>
        </div>
      </div>
    </div>
  );
}
