"use server";

import { revalidatePath } from "next/cache";
import { saveSettings } from "@/lib/settings";

// Lưu mọi cặp key/value có trong form (mỗi trang form chỉ chứa các field của nó).
export async function saveSettingsForm(formData: FormData) {
  const entries: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") entries[key] = value;
  }
  await saveSettings(entries);
  revalidatePath("/", "layout");
}
