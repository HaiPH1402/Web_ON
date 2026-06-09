"use client";

import { useRef, useState } from "react";

export default function ImageUploader({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string | null;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Tải lên thất bại");
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="flex items-start gap-4">
        {/* Preview */}
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="Xem trước" className="h-full w-full object-cover" />
          ) : (
            <span className="text-3xl text-slate-300">🖼️</span>
          )}
        </div>

        <div className="flex-1">
          {/* Nút tải ảnh từ máy */}
          <label className="btn-outline cursor-pointer">
            {uploading ? "⏳ Đang tải lên..." : "📁 Chọn ảnh từ máy"}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={handleFile}
            />
          </label>
          <p className="mt-1.5 text-xs text-slate-400">JPG, PNG, WebP, GIF · tối đa 5MB</p>

          {/* Ô URL (vẫn cho dán link ngoài; là field gửi lên server) */}
          <input
            type="text"
            name={name}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="hoặc dán đường dẫn ảnh: /uploads/... hay https://..."
            className="input mt-2"
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}
