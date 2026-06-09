"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fd.get("email"),
          password: fd.get("password"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Đăng nhập thất bại");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm p-6">
        <div className="mb-6 text-center">
          <div className="text-3xl">💧</div>
          <h1 className="mt-2 text-xl font-bold">Quản trị Ống Nước Việt</h1>
          <p className="text-sm text-gray-500">Đăng nhập hệ thống</p>
        </div>
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
        )}
        <div className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input name="email" type="email" required className="input" defaultValue="admin@ongnuoc.vn" />
          </div>
          <div>
            <label className="label">Mật khẩu</label>
            <input name="password" type="password" required className="input" defaultValue="admin123" />
          </div>
          <button disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </div>
        <p className="mt-4 text-center text-xs text-gray-400">
          Demo: admin@ongnuoc.vn / admin123
        </p>
      </form>
    </div>
  );
}
