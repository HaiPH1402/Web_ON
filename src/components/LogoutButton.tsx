"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <button
      onClick={logout}
      className="w-full rounded-md px-2 py-1.5 text-left text-sm text-red-500 hover:bg-red-50"
    >
      ⏻ Đăng xuất
    </button>
  );
}
