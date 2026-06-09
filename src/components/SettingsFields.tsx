import ImageUploader from "@/components/ImageUploader";
import type { SiteConfig } from "@/lib/site";

type FieldDef = { key: keyof SiteConfig; label: string; type?: "text" | "textarea" | "image" };
type Group = { group: string; fields: FieldDef[] };

// Render các nhóm field cấu hình (dùng chung cho trang Cấu hình & Giới thiệu)
export default function SettingsFields({
  groups,
  config,
}: {
  groups: Group[];
  config: SiteConfig;
}) {
  return (
    <>
      {groups.map((group) => (
        <div key={group.group} className="card p-6">
          <h2 className="mb-4 font-bold">{group.group}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {group.fields.map((f) => {
              const value = config[f.key] ?? "";
              const full = f.type === "textarea" || f.type === "image";
              return (
                <div key={f.key} className={full ? "sm:col-span-2" : ""}>
                  <label className="label">{f.label}</label>
                  {f.type === "image" ? (
                    <ImageUploader name={f.key} defaultValue={value} />
                  ) : f.type === "textarea" ? (
                    <textarea name={f.key} rows={3} defaultValue={value} className="input" />
                  ) : (
                    <input name={f.key} defaultValue={value} className="input" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}
