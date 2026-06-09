import { getConfig, SETTING_FIELDS } from "@/lib/settings";
import { saveSettingsForm } from "./actions";
import SettingsFields from "@/components/SettingsFields";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const config = await getConfig();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Cấu hình website</h1>
        <p className="mt-1 text-sm text-slate-500">
          Logo, thông tin liên hệ và nội dung banner trang chủ. Lưu xong cập nhật ngay trên website.
        </p>
      </div>

      <form action={saveSettingsForm} className="max-w-3xl space-y-6">
        <SettingsFields groups={SETTING_FIELDS} config={config} />
        <div className="sticky bottom-0 flex gap-3 border-t border-slate-200 bg-gray-100 py-4">
          <button className="btn-primary">Lưu cấu hình</button>
        </div>
      </form>
    </div>
  );
}
