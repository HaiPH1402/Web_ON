import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteProjectItem } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Công trình tiêu biểu ({projects.length})</h1>
        <Link href="/admin/projects/new" className="btn-primary">+ Thêm công trình</Link>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3">Ảnh</th>
              <th className="px-4 py-3">Tên công trình</th>
              <th className="px-4 py-3">Địa điểm</th>
              <th className="px-4 py-3">Năm</th>
              <th className="px-4 py-3 text-center">Hiển thị</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image || "/projects/duan1.jpg"} alt="" className="h-12 w-16 rounded object-cover" />
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-gray-400">{p.tag}</div>
                </td>
                <td className="px-4 py-3 text-gray-500">{p.location}</td>
                <td className="px-4 py-3">{p.year}</td>
                <td className="px-4 py-3 text-center">
                  {p.isActive ? (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Hiện</span>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">Ẩn</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/projects/${p.id}`} className="text-brand hover:underline">Sửa</Link>
                    <form action={deleteProjectItem}>
                      <input type="hidden" name="id" value={p.id} />
                      <button className="text-red-500 hover:underline">Xóa</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
