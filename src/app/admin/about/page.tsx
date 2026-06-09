import { getConfig, ABOUT_FIELDS } from "@/lib/settings";
import { saveSettingsForm } from "../settings/actions";
import SettingsFields from "@/components/SettingsFields";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const config = await getConfig();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Trang Giới thiệu</h1>
          <p className="mt-1 text-sm text-slate-500">
            Chỉnh sửa toàn bộ nội dung trang “Giới thiệu”. Lưu xong cập nhật ngay trên website.
          </p>
        </div>
        <a href="/gioi-thieu" target="_blank" className="btn-outline">Xem trang ↗</a>
      </div>

      <form action={saveSettingsForm} className="max-w-3xl space-y-6">
        <SettingsFields groups={ABOUT_FIELDS} config={config} />
        <div className="sticky bottom-0 flex gap-3 border-t border-slate-200 bg-gray-100 py-4">
          <button className="btn-primary">Lưu nội dung</button>
        </div>
      </form>
    </div>
  );
}
