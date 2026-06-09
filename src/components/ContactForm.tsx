"use client";

import { useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          phone: fd.get("phone"),
          email: fd.get("email"),
          content: fd.get("content"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gửi thất bại");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="mt-6 rounded-2xl bg-green-50 p-6 text-center">
        <div className="text-4xl">📩</div>
        <p className="mt-2 font-semibold text-green-700">Đã gửi lời nhắn thành công!</p>
        <p className="mt-1 text-sm text-slate-500">Cảm ơn bạn, chúng tôi sẽ phản hồi sớm nhất.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-4">
      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Họ tên *</label>
          <input name="name" required className="input" placeholder="Nguyễn Văn A" />
        </div>
        <div>
          <label className="label">Số điện thoại *</label>
          <input name="phone" required className="input" placeholder="09xx xxx xxx" />
        </div>
      </div>
      <div>
        <label className="label">Email</label>
        <input name="email" type="email" className="input" placeholder="email@example.com" />
      </div>
      <div>
        <label className="label">Nội dung *</label>
        <textarea name="content" required rows={4} className="input" placeholder="Tôi cần tư vấn về..." />
      </div>
      <button disabled={submitting} className="btn-primary w-full py-3 disabled:opacity-60">
        {submitting ? "Đang gửi..." : "Gửi lời nhắn →"}
      </button>
    </form>
  );
}
