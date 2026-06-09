import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/format";
import { computeQuoteTotals } from "@/lib/quote";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  NEW: "Mới",
  QUOTED: "Đã báo giá",
  ACCEPTED: "Đã chốt",
  REJECTED: "Từ chối",
};
const STATUS_COLOR: Record<string, string> = {
  NEW: "bg-amber-100 text-amber-700",
  QUOTED: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default async function AdminQuotationsPage() {
  const quotations = await prisma.quotation.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Yêu cầu báo giá ({quotations.length})</h1>

      {quotations.length === 0 ? (
        <p className="card p-8 text-center text-gray-400">Chưa có yêu cầu báo giá nào.</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3">Mã</th>
                <th className="px-4 py-3">Khách hàng</th>
                <th className="px-4 py-3 text-right">Số dòng</th>
                <th className="px-4 py-3 text-right">Tổng báo giá</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((q) => {
                const t = computeQuoteTotals(q.items, q.vatPercent, q.discount);
                const priced = q.items.every((i) => i.quotedPrice != null);
                return (
                  <tr key={q.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{q.code}</td>
                    <td className="px-4 py-3">
                      <div>{q.customerName}</div>
                      <div className="text-xs text-gray-400">{q.customerPhone} · {new Date(q.createdAt).toLocaleDateString("vi-VN")}</div>
                    </td>
                    <td className="px-4 py-3 text-right">{q.items.length}</td>
                    <td className="px-4 py-3 text-right">
                      {priced ? formatVND(t.total) : <span className="text-amber-600">Chưa nhập giá</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_COLOR[q.status]}`}>
                        {STATUS_LABEL[q.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/quotations/${q.id}`} className="btn-primary px-3 py-1.5 text-xs">
                        Nhập giá / Xuất file
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
