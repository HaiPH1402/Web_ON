import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getConfig } from "@/lib/settings";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Giới thiệu — Ống Nước Việt",
  description: "Đơn vị cung cấp ống nước và vật tư ngành nước uy tín cho nhà thầu và công trình.",
};

export default async function AboutPage() {
  const site = await getConfig();

  const VALUES = [
    { icon: site.aboutVal1Icon, title: site.aboutVal1Title, desc: site.aboutVal1Desc },
    { icon: site.aboutVal2Icon, title: site.aboutVal2Title, desc: site.aboutVal2Desc },
    { icon: site.aboutVal3Icon, title: site.aboutVal3Title, desc: site.aboutVal3Desc },
    { icon: site.aboutVal4Icon, title: site.aboutVal4Title, desc: site.aboutVal4Desc },
  ];
  const MILESTONES = [
    { year: site.aboutMile1Year, text: site.aboutMile1Text },
    { year: site.aboutMile2Year, text: site.aboutMile2Text },
    { year: site.aboutMile3Year, text: site.aboutMile3Text },
    { year: site.aboutMile4Year, text: site.aboutMile4Text },
  ];
  const STATS = [
    [site.aboutStat1Num, site.aboutStat1Label],
    [site.aboutStat2Num, site.aboutStat2Label],
    [site.aboutStat3Num, site.aboutStat3Label],
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative isolate bg-slate-950 py-20 text-white">
        <div className="aurora opacity-70" aria-hidden />
        <div className="absolute inset-0 -z-10 opacity-20" aria-hidden>
          <img src={site.aboutHeroImage} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="container-main relative max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-light">Về chúng tôi</p>
          <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">
            {site.aboutHeroTitle} <span className="text-gradient">{site.aboutHeroHighlight}</span>
          </h1>
          <p className="mx-auto mt-5 text-lg text-white/85">{site.aboutHeroSubtitle}</p>
        </div>
      </section>

      {/* Câu chuyện + ảnh */}
      <section className="container-main py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <Reveal>
            <div className="overflow-hidden rounded-3xl shadow-card">
              <img src={site.aboutStoryImage} alt="Công trình tiêu biểu" className="aspect-[4/3] w-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div>
              <h2 className="section-title">{site.aboutStoryHeading}</h2>
              <p className="mt-4 text-slate-600">{site.aboutStoryP1}</p>
              <p className="mt-3 text-slate-600">{site.aboutStoryP2}</p>
              <div className="mt-6 grid grid-cols-3 gap-4">
                {STATS.map(([n, l]) => (
                  <div key={l} className="rounded-2xl bg-brand/5 p-4 text-center">
                    <div className="text-2xl font-extrabold text-brand">{n}</div>
                    <div className="text-xs text-slate-500">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Giá trị cốt lõi */}
      <section className="bg-white py-16">
        <div className="container-main">
          <Reveal className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-brand">Giá trị cốt lõi</p>
            <h2 className="section-title mt-1">Điều làm nên sự khác biệt</h2>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className="lift h-full rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-card">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-3xl">
                    {v.icon}
                  </div>
                  <h3 className="mt-4 font-bold">{v.title}</h3>
                  <p className="mt-2 text-sm text-slate-500">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Lịch sử phát triển */}
      <section className="container-main py-16">
        <Reveal className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-brand">Hành trình</p>
          <h2 className="section-title mt-1">Chặng đường phát triển</h2>
        </Reveal>
        <div className="mx-auto max-w-2xl space-y-6">
          {MILESTONES.map((m, i) => (
            <Reveal key={m.year} delay={i * 70}>
              <div className="flex gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-white">
                  {m.year}
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                  <p className="text-slate-600">{m.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-main pb-20">
        <Reveal>
          <div className="rounded-3xl bg-gradient-to-br from-brand to-brand-dark px-8 py-12 text-center text-white">
            <h2 className="text-2xl font-extrabold md:text-3xl">Sẵn sàng đồng hành cùng công trình của bạn</h2>
            <p className="mt-2 text-white/85">Liên hệ ngay để được tư vấn và báo giá vật tư tốt nhất.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/san-pham" className="btn bg-white px-6 py-3 text-brand hover:bg-slate-100">Xem sản phẩm</Link>
              <Link href="/lien-he" className="glass btn px-6 py-3 text-white hover:bg-white/20">Liên hệ</Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
