import { prisma } from "@/lib/prisma";
import { toggleRead, deleteMessage } from "./actions";
import ConfirmButton from "@/components/ConfirmButton";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  const unread = messages.filter((m) => !m.isRead).length;

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Tin nhắn liên hệ ({messages.length})</h1>
      <p className="mb-6 text-sm text-slate-500">
        Lời nhắn khách gửi từ trang Liên hệ. {unread > 0 && <span className="font-semibold text-amber-600">{unread} chưa đọc.</span>}
      </p>

      {messages.length === 0 ? (
        <p className="card p-8 text-center text-gray-400">Chưa có tin nhắn nào.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={`card p-5 ${m.isRead ? "" : "border-l-4 border-l-brand"}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{m.name}</span>
                    {!m.isRead && (
                      <span className="rounded-full bg-brand px-2 py-0.5 text-xs text-white">Mới</span>
                    )}
                  </div>
                  <div className="mt-0.5 text-sm text-gray-500">
                    📞 {m.phone}{m.email ? ` · ✉️ ${m.email}` : ""}
                  </div>
                </div>
                <div className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleString("vi-VN")}</div>
              </div>

              <p className="mt-3 whitespace-pre-wrap border-t pt-3 text-sm text-slate-700">{m.content}</p>

              <div className="mt-3 flex gap-3 border-t pt-3">
                <a href={`tel:${m.phone.replace(/[^0-9]/g, "")}`} className="btn-outline px-3 py-1 text-xs">📞 Gọi lại</a>
                <form action={toggleRead}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="isRead" value={String(m.isRead)} />
                  <button className="btn-outline px-3 py-1 text-xs">
                    {m.isRead ? "Đánh dấu chưa đọc" : "Đánh dấu đã đọc"}
                  </button>
                </form>
                <form action={deleteMessage}>
                  <input type="hidden" name="id" value={m.id} />
                  <ConfirmButton className="px-3 py-1 text-xs text-red-500 hover:underline" message="Xóa tin nhắn này?">Xóa</ConfirmButton>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
