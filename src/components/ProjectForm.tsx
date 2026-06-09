import Link from "next/link";
import { saveProjectItem } from "@/app/admin/projects/actions";
import ImageUploader from "@/components/ImageUploader";

type Project = {
  id: number;
  title: string;
  location: string;
  scope: string;
  year: string;
  tag: string;
  image: string | null;
  sortOrder: number;
  isActive: boolean;
};

export default function ProjectForm({ project }: { project?: Project }) {
  return (
    <form action={saveProjectItem} className="max-w-2xl space-y-4">
      {project && <input type="hidden" name="id" value={project.id} />}

      <div className="card space-y-4 p-6">
        <div>
          <label className="label">Tên công trình *</label>
          <input name="title" required defaultValue={project?.title} className="input" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Địa điểm *</label>
            <input name="location" required defaultValue={project?.location} className="input" placeholder="Quận 7, TP.HCM" />
          </div>
          <div>
            <label className="label">Loại (tag) *</label>
            <input name="tag" required defaultValue={project?.tag} className="input" placeholder="Chung cư, Biệt thự..." />
          </div>
        </div>
        <div>
          <label className="label">Quy mô / mô tả *</label>
          <input name="scope" required defaultValue={project?.scope} className="input" placeholder="Cấp thoát nước 3 block, 1.200 căn hộ" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Năm *</label>
            <input name="year" required defaultValue={project?.year} className="input" placeholder="2024" />
          </div>
          <div>
            <label className="label">Thứ tự hiển thị</label>
            <input name="sortOrder" type="number" defaultValue={project?.sortOrder ?? 0} className="input" />
          </div>
        </div>
        <div>
          <label className="label">Ảnh công trình</label>
          <ImageUploader name="image" defaultValue={project?.image} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isActive" defaultChecked={project?.isActive ?? true} />
          Hiển thị trên website
        </label>
      </div>

      <div className="flex gap-3">
        <button className="btn-primary">Lưu công trình</button>
        <Link href="/admin/projects" className="btn-outline">Hủy</Link>
      </div>
    </form>
  );
}
