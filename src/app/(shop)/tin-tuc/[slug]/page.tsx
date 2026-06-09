import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticles, parseBody } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const a = await getArticleBySlug(params.slug);
  return { title: a ? `${a.title} — Ống Nước Việt` : "Tin tức" };
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  if (!article || !article.isPublished) notFound();

  const image = article.image || "/news/tin1.jpg";
  const all = await getArticles();
  const related = all.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <article>
      {/* Hero */}
      <section className="relative isolate bg-slate-950 py-14 text-white">
        <div className="absolute inset-0 -z-10 opacity-25" aria-hidden>
          <img src={image} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950 to-slate-950/60" aria-hidden />
        <div className="container-main relative max-w-3xl">
          <nav className="mb-4 text-sm text-white/60">
            <Link href="/" className="hover:text-white">Trang chủ</Link> /{" "}
            <Link href="/tin-tuc" className="hover:text-white">Tin tức</Link>
          </nav>
          <span className="chip bg-white/15 text-white">{article.category}</span>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">{article.title}</h1>
          <p className="mt-4 text-sm text-white/70">
            {article.author} · {formatDate(article.publishedAt)}
          </p>
        </div>
      </section>

      {/* Nội dung */}
      <section className="container-main max-w-3xl py-12">
        <img
          src={image}
          alt={article.title}
          className="mb-8 aspect-[16/9] w-full rounded-2xl object-cover shadow-card"
        />
        <div className="space-y-5 text-lg leading-relaxed text-slate-700">
          {parseBody(article.body).map((p, i) =>
            p.startsWith("## ") ? (
              <h2 key={i} className="pt-2 text-2xl font-bold text-slate-900">
                {p.replace("## ", "")}
              </h2>
            ) : (
              <p key={i} className="whitespace-pre-line">{p}</p>
            )
          )}
        </div>

        <div className="mt-10 rounded-2xl bg-brand/5 p-6 text-center">
          <p className="font-semibold text-slate-800">Cần tư vấn vật tư cho công trình?</p>
          <div className="mt-3 flex justify-center gap-3">
            <Link href="/bao-gia" className="btn-primary">Yêu cầu báo giá</Link>
            <Link href="/lien-he" className="btn-outline">Liên hệ</Link>
          </div>
        </div>
      </section>

      {/* Bài liên quan */}
      {related.length > 0 && (
        <section className="container-main max-w-5xl pb-16">
          <h2 className="mb-5 text-xl font-bold">Bài viết liên quan</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {related.map((a) => (
              <Link
                key={a.slug}
                href={`/tin-tuc/${a.slug}`}
                className="lift group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={a.image || "/news/tin1.jpg"} alt={a.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold leading-snug group-hover:text-brand">{a.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
