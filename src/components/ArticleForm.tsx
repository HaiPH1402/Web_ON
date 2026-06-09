import Link from "next/link";
import { saveArticle } from "@/app/admin/articles/actions";
import ImageUploader from "@/components/ImageUploader";

type Article = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  image: string | null;
  body: string;
  isPublished: boolean;
  publishedAt: Date;
};

export default function ArticleForm({ article }: { article?: Article }) {
  const dateValue = article ? new Date(article.publishedAt).toISOString().slice(0, 10) : "";

  return (
    <form action={saveArticle} className="max-w-3xl space-y-4">
      {article && <input type="hidden" name="id" value={article.id} />}

      <div className="card space-y-4 p-6">
        <div>
          <label className="label">Tiêu đề bài viết *</label>
          <input name="title" required defaultValue={article?.title} className="input" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Đường dẫn (slug)</label>
            <input name="slug" defaultValue={article?.slug} className="input" placeholder="để trống = tự tạo từ tiêu đề" />
          </div>
          <div>
            <label className="label">Chuyên mục</label>
            <input name="category" defaultValue={article?.category ?? "Hướng dẫn"} className="input" />
          </div>
          <div>
            <label className="label">Tác giả</label>
            <input name="author" defaultValue={article?.author ?? "Ban biên tập"} className="input" />
          </div>
          <div>
            <label className="label">Ngày đăng</label>
            <input name="publishedAt" type="date" defaultValue={dateValue} className="input" />
          </div>
        </div>
        <div>
          <label className="label">Mô tả ngắn (excerpt) *</label>
          <textarea name="excerpt" required rows={2} defaultValue={article?.excerpt} className="input" />
        </div>
        <div>
          <label className="label">Ảnh đại diện</label>
          <ImageUploader name="image" defaultValue={article?.image} />
        </div>
      </div>

      <div className="card p-6">
        <label className="label">Nội dung bài viết *</label>
        <p className="mb-2 text-xs text-slate-400">
          Mỗi đoạn cách nhau bằng 1 dòng trống. Dòng bắt đầu bằng <code>## </code> sẽ là tiêu đề phụ.
        </p>
        <textarea name="body" required rows={16} defaultValue={article?.body} className="input font-mono text-sm" />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPublished" defaultChecked={article?.isPublished ?? true} />
        Xuất bản (hiển thị trên website)
      </label>

      <div className="flex gap-3">
        <button className="btn-primary">Lưu bài viết</button>
        <Link href="/admin/articles" className="btn-outline">Hủy</Link>
      </div>
    </form>
  );
}
