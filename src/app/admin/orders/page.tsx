import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/format";
import { updateOrderStatus } from "./actions";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã hủy",
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPING: "bg-purple-100 text-purple-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Đơn hàng ({orders.length})</h1>

      {orders.length === 0 ? (
        <p className="card p-8 text-center text-gray-400">Chưa có đơn hàng nào.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{o.code}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_COLOR[o.status]}`}>
                      {STATUS_LABEL[o.status]}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {o.customerName} · {o.customerPhone}
                  </div>
                  <div className="text-sm text-gray-500">{o.shippingAddress}</div>
                  {o.note && <div className="text-sm text-gray-400">Ghi chú: {o.note}</div>}
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-brand">{formatVND(o.total)}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(o.createdAt).toLocaleString("vi-VN")}
                  </div>
                </div>
              </div>

              <div className="mt-3 border-t pt-3 text-sm">
                {o.items.map((it) => (
                  <div key={it.id} className="flex justify-between py-0.5">
                    <span className="text-gray-600">
                      {it.productName} <span className="text-gray-400">×{it.quantity} {it.unit}</span>
                    </span>
                    <span>{formatVND(it.lineTotal)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                <form action={updateOrderStatus} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={o.id} />
                  <span className="text-sm text-gray-500">Trạng thái:</span>
                  <select name="status" defaultValue={o.status} className="input w-44 py-1">
                    {Object.entries(STATUS_LABEL).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                  <button className="btn-primary py-1">Lưu</button>
                </form>
                <div className="flex gap-2">
                  <a href={`/api/orders/${o.id}/export`} className="btn-outline py-1 text-xs">📥 Excel</a>
                  <a href={`/in/don-hang/${o.id}`} target="_blank" className="btn-outline py-1 text-xs">🖨️ In/PDF</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
