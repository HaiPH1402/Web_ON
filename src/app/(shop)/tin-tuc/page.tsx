import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getArticles } from "@/lib/cms";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tin tức & Kiến thức ngành nước — Ống Nước Việt",
  description: "Hướng dẫn chọn ống, kỹ thuật thi công và xu hướng vật tư ngành nước.",
};

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function NewsPage() {
  const NEWS = await getArticles();
  if (NEWS.length === 0) {
    return (
      <div className="container-main py-20 text-center text-slate-500">
        Chưa có bài viết nào.
      </div>
    );
  }
  const [featured, ...rest] = NEWS;

  return (
    <div>
      {/* Hero */}
      <section className="relative isolate bg-slate-950 py-16 text-white">
        <div className="aurora opacity-70" aria-hidden />
        <div className="container-main relative text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-light">Tin tức</p>
          <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">Kiến thức ngành nước</h1>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Hướng dẫn chọn ống, kỹ thuật thi công và cập nhật xu hướng vật tư mới nhất.
          </p>
        </div>
      </section>

      <section className="container-main py-16">
        {/* Bài nổi bật */}
        <Reveal>
          <Link
            href={`/tin-tuc/${featured.slug}`}
            className="lift group grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card md:grid-cols-2"
          >
            <div className="aspect-[16/10] overflow-hidden md:aspect-auto">
              <img
                src={featured.image || "/news/tin1.jpg"}
                alt={featured.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center p-7">
              <span className="chip bg-brand/10 text-brand">{featured.category}</span>
              <h2 className="mt-3 text-2xl font-bold group-hover:text-brand">{featured.title}</h2>
              <p className="mt-3 text-slate-600">{featured.excerpt}</p>
              <div className="mt-5 text-sm text-slate-400">
                {featured.author} · {formatDate(featured.publishedAt)}
              </div>
            </div>
          </Link>
        </Reveal>

        {/* Lưới bài viết */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((a, i) => (
            <Reveal key={a.slug} delay={i * 80}>
              <Link
                href={`/tin-tuc/${a.slug}`}
                className="lift group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={a.image || "/news/tin1.jpg"}
                    alt={a.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="chip w-fit bg-brand/10 text-brand">{a.category}</span>
                  <h3 className="mt-2 font-bold leading-snug group-hover:text-brand">{a.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">{a.excerpt}</p>
                  <div className="mt-auto pt-4 text-xs text-slate-400">
                    {a.author} · {formatDate(a.publishedAt)}
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
