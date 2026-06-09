import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteArticle } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tin tức ({articles.length})</h1>
        <Link href="/admin/articles/new" className="btn-primary">+ Thêm bài viết</Link>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3">Ảnh</th>
              <th className="px-4 py-3">Tiêu đề</th>
              <th className="px-4 py-3">Chuyên mục</th>
              <th className="px-4 py-3">Ngày đăng</th>
              <th className="px-4 py-3 text-center">Trạng thái</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.image || "/news/tin1.jpg"} alt="" className="h-12 w-16 rounded object-cover" />
                </td>
                <td className="px-4 py-3 font-medium">{a.title}</td>
                <td className="px-4 py-3 text-gray-500">{a.category}</td>
                <td className="px-4 py-3">{new Date(a.publishedAt).toLocaleDateString("vi-VN")}</td>
                <td className="px-4 py-3 text-center">
                  {a.isPublished ? (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Xuất bản</span>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">Nháp</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/articles/${a.id}`} className="text-brand hover:underline">Sửa</Link>
                    <form action={deleteArticle}>
                      <input type="hidden" name="id" value={a.id} />
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
