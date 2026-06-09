import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [
    productCount,
    orderCount,
    pendingOrders,
    quotationCount,
    newQuotations,
    revenueAgg,
    lowStock,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.quotation.count(),
    prisma.quotation.count({ where: { status: "NEW" } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ["CONFIRMED", "SHIPPING", "COMPLETED"] } },
    }),
    prisma.product.findMany({
      where: { stock: { lt: 100 } },
      orderBy: { stock: "asc" },
      take: 5,
    }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const stats = [
    { label: "Doanh thu (đã xác nhận)", value: formatVND(revenueAgg._sum.total ?? 0), icon: "💰" },
    { label: "Đơn hàng", value: orderCount, sub: `${pendingOrders} chờ xử lý`, icon: "🧾" },
    { label: "Sản phẩm", value: productCount, icon: "📦" },
    { label: "Yêu cầu báo giá", value: quotationCount, sub: `${newQuotations} mới`, icon: "💬" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Tổng quan</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{s.label}</span>
              <span className="text-2xl">{s.icon}</span>
            </div>
            <div className="mt-2 text-2xl font-bold">{s.value}</div>
            {s.sub && <div className="text-xs text-amber-600">{s.sub}</div>}
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Đơn hàng gần đây */}
        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold">Đơn hàng gần đây</h2>
            <Link href="/admin/orders" className="text-sm text-brand hover:underline">Xem tất cả</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-400">Chưa có đơn hàng.</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-t">
                    <td className="py-2 font-medium">{o.code}</td>
                    <td className="py-2 text-gray-500">{o.customerName}</td>
                    <td className="py-2 text-right">{formatVND(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Cảnh báo tồn kho */}
        <div className="card p-5">
          <h2 className="mb-3 font-bold">⚠️ Cảnh báo tồn kho thấp (&lt; 100)</h2>
          {lowStock.length === 0 ? (
            <p className="text-sm text-gray-400">Tồn kho ổn định.</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {lowStock.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="py-2">{p.name}</td>
                    <td className="py-2 text-right font-bold text-red-500">{p.stock} {p.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
