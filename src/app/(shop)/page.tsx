import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { categoryImage } from "@/lib/images";
import { TESTIMONIALS } from "@/lib/content";
import { getConfig } from "@/lib/settings";
import { getProjects } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredRaw, categories, site, projects] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: { brand: true },
      take: 8,
    }),
    prisma.category.findMany({ orderBy: { id: "asc" } }),
    getConfig(),
    getProjects(),
  ]);

  // Lấp đầy cho đủ bội số 4 (tránh hàng cuối bị trống) bằng SP mới nhất
  let featured = featuredRaw;
  if (featured.length % 4 !== 0) {
    const need = 4 - (featured.length % 4);
    const fillers = await prisma.product.findMany({
      where: { isActive: true, id: { notIn: featured.map((p) => p.id) } },
      include: { brand: true },
      orderBy: { createdAt: "desc" },
      take: need,
    });
    featured = [...featured, ...fillers];
  }

  // Dải thương hiệu — tách từ chuỗi cấu hình
  const BRANDS = (site.brands || "")
    .split(",")
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className="overflow-hidden">
      {/* ===== HERO ===== */}
      <section className="relative isolate bg-slate-950 text-white">
        <div className="aurora" aria-hidden />
        <div className="absolute inset-0 -z-10 opacity-20" aria-hidden>
          <img src={site.heroImage} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="container-main relative grid items-center gap-10 py-12 md:grid-cols-2 md:py-16">
          <div>
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold">
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
              {site.heroBadge}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight md:text-6xl">
              {site.heroTitleLine1} <span className="text-gradient">{site.heroTitleHighlight}</span>
              <br /> {site.heroTitleLine2}
            </h1>
            <p className="mt-5 max-w-md text-lg text-white/85">{site.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/san-pham" className="btn-accent px-7 py-3.5 text-base shadow-lg shadow-accent/30">
                Khám phá sản phẩm →
              </Link>
              <Link href="/bao-gia" className="glass btn px-7 py-3.5 text-base text-white hover:bg-white/20">
                Nhận báo giá
              </Link>
            </div>

            {/* Stat glass cards */}
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
              {[
                [site.heroStat1Num, site.heroStat1Label],
                [site.heroStat2Num, site.heroStat2Label],
                [site.heroStat3Num, site.heroStat3Label],
              ].map(([n, l]) => (
                <div key={l} className="glass rounded-2xl px-4 py-3 text-center">
                  <div className="text-2xl font-extrabold">{n}</div>
                  <div className="text-xs text-white/60">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bento ảnh nổi */}
          <div className="relative ml-auto hidden w-full max-w-md md:block">
            <div className="float grid grid-cols-2 gap-3">
              <img src={site.heroThumb1} alt="Thi công lắp đặt ống nước công trình" className="aspect-[3/4] w-full rounded-2xl object-cover shadow-2xl" />
              <div className="mt-8 space-y-3">
                <img src={site.heroThumb2} alt="Van và thiết bị ngành nước" className="aspect-square w-full rounded-2xl object-cover shadow-2xl" />
                <img src={site.heroThumb3} alt="Ống nước cho công trình" className="aspect-square w-full rounded-2xl object-cover shadow-2xl" />
              </div>
            </div>
            <div className="glass absolute -bottom-4 left-4 flex items-center gap-3 rounded-2xl px-5 py-3">
              <span className="text-2xl">✅</span>
              <div className="text-sm">
                <div className="font-bold">{site.heroBadgeTitle}</div>
                <div className="text-white/60">{site.heroBadgeSubtitle}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee thương hiệu (cụm lặp để chạy vô tận liền mạch) */}
        {BRANDS.length > 0 && (
          <div className="relative overflow-hidden border-t border-white/10 py-6">
            <div className="marquee gap-12 px-6">
              {BRANDS.map((b, i) => (
                <span key={i} className="whitespace-nowrap text-xl font-bold text-white/40">
                  {b}
                </span>
              ))}
              {/* Bản sao chỉ phục vụ hiệu ứng cuộn — ẩn với trình đọc màn hình */}
              {BRANDS.map((b, i) => (
                <span key={`dup-${i}`} aria-hidden className="whitespace-nowrap text-xl font-bold text-white/40">
                  {b}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ===== DANH MỤC (bento) ===== */}
      <section className="container-main py-16">
        <Reveal className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-brand">Danh mục</p>
            <h2 className="section-title mt-1">Đa dạng vật tư ngành nước</h2>
          </div>
          <Link href="/san-pham" className="hidden text-sm font-semibold text-brand hover:underline sm:block">
            Xem tất cả →
          </Link>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {/* Trang chủ chỉ hiển thị 6 danh mục cho gọn; xem hết ở trang Sản phẩm */}
          {categories.slice(0, 6).map((c, i) => (
            <Reveal key={c.id} delay={i * 40}>
              <Link
                href={`/san-pham?category=${c.slug}`}
                className="lift group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card"
              >
                <div className="relative aspect-square overflow-hidden sm:aspect-[4/3]">
                  <img
                    src={c.image || categoryImage(c.slug)}
                    alt={c.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
                  <span className="absolute bottom-3 left-4 right-4 text-base font-bold text-white">
                    {c.name}
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== SẢN PHẨM NỔI BẬT ===== */}
      <section className="bg-white py-16">
        <div className="container-main">
          <Reveal className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-brand">Bán chạy</p>
              <h2 className="section-title mt-1">Sản phẩm nổi bật</h2>
            </div>
            <Link href="/san-pham" className="text-sm font-semibold text-brand hover:underline">
              Xem tất cả →
            </Link>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 50}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CÔNG TRÌNH TIÊU BIỂU ===== */}
      <section className="relative bg-slate-950 py-20 text-white">
        <div className="aurora opacity-60" />
        <div className="container-main relative">
          <Reveal className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-brand-light">Dự án</p>
            <h2 className="mt-1 text-3xl font-extrabold md:text-4xl">Công trình tiêu biểu đã cung cấp</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/60">
              Hàng trăm công trình dân dụng, thương mại và hạ tầng trên toàn quốc
              đã tin dùng vật tư của chúng tôi.
            </p>
          </Reveal>

          {/* Dự án đầu chiếm ô rộng (col-span-2), 4 dự án còn lại lấp đầy 2 hàng cân đối */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 5).map((p, i) => (
              <Reveal
                key={p.id}
                delay={i * 50}
                className={i === 0 ? "md:col-span-2 lg:col-span-2" : ""}
              >
                <div className="group lift relative h-full min-h-[230px] overflow-hidden rounded-3xl">
                  <img
                    src={p.image || "/projects/duan1.jpg"}
                    alt={`Công trình ${p.title} tại ${p.location}`}
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" aria-hidden />
                  <div className="relative flex h-full flex-col justify-end p-5">
                    <span className="glass mb-2 w-fit rounded-full px-3 py-1 text-xs font-semibold">
                      {p.tag} · {p.year}
                    </span>
                    <h3 className={`font-bold ${i === 0 ? "text-2xl" : "text-lg"}`}>{p.title}</h3>
                    <p className="mt-1 text-sm text-white/80">📍 {p.location}</p>
                    <p className="mt-0.5 text-sm text-white/70">{p.scope}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CẢM NHẬN KHÁCH HÀNG ===== */}
      <section className="container-main py-20">
        <Reveal className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-brand">Đánh giá</p>
          <h2 className="section-title mt-1">Khách hàng nói gì về chúng tôi</h2>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 60}>
              <div className="lift flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
                <div className="mb-3 text-accent">★★★★★</div>
                <p className="flex-1 text-slate-600">“{t.content}”</p>
                <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-lg font-bold text-brand">
                    {t.name.split(" ").pop()?.[0]}
                  </div>
                  <div>
                    <div className="text-sm font-bold">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.role}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="container-main pb-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-brand-dark px-8 py-12 text-white sm:px-14">
            <div className="aurora opacity-40" />
            <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-extrabold md:text-3xl">Cần báo giá cho công trình?</h2>
                <p className="mt-2 max-w-md text-white/80">
                  Gửi danh sách vật tư — nhận ngay báo giá sỉ tốt nhất kèm tư vấn kỹ thuật miễn phí.
                </p>
              </div>
              <div className="flex gap-3">
                <Link href="/bao-gia" className="btn bg-white px-6 py-3.5 text-base text-brand hover:bg-slate-100">
                  Yêu cầu báo giá
                </Link>
                <Link href="/lien-he" className="glass btn px-6 py-3.5 text-base text-white hover:bg-white/20">
                  Liên hệ
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
