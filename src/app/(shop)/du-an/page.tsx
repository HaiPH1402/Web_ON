import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getProjects } from "@/lib/cms";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Công trình tiêu biểu — Ống Nước Việt",
};

export default async function ProjectsPage() {
  const PROJECTS = await getProjects();
  return (
    <div>
      {/* Hero */}
      <section className="relative isolate bg-slate-950 py-20 text-white">
        <div className="aurora opacity-70" />
        <div className="container-main relative text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-light">Dự án</p>
          <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">Công trình tiêu biểu</h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            Chúng tôi tự hào là đơn vị cung cấp vật tư ngành nước cho hàng trăm
            công trình dân dụng, thương mại và hạ tầng trên khắp cả nước.
          </p>
          <div className="mt-8 flex justify-center gap-10">
            {[
              ["500+", "Công trình"],
              ["63", "Tỉnh thành"],
              ["12", "Năm kinh nghiệm"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="text-3xl font-extrabold text-gradient">{n}</div>
                <div className="text-sm text-white/60">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Danh sách dự án */}
      <section className="container-main py-16">
        <div className="space-y-10">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.id}>
              <div
                className={`grid items-center gap-8 md:grid-cols-2 ${
                  i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="lift overflow-hidden rounded-3xl shadow-card">
                  <img src={p.image || "/projects/duan1.jpg"} alt={p.title} className="aspect-[4/3] w-full object-cover" />
                </div>
                <div>
                  <span className="chip bg-brand/10 text-brand">{p.tag} · {p.year}</span>
                  <h2 className="mt-3 text-2xl font-bold">{p.title}</h2>
                  <p className="mt-2 text-slate-500">📍 {p.location}</p>
                  <p className="mt-3 text-slate-600">{p.scope}</p>
                  <div className="mt-5 flex flex-wrap gap-2 text-sm">
                    {["Tư vấn kỹ thuật", "Cung cấp vật tư", "Giao tận công trình"].map((s) => (
                      <span key={s} className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 text-center">
          <div className="rounded-3xl bg-gradient-to-br from-brand to-brand-dark px-8 py-12 text-white">
            <h2 className="text-2xl font-extrabold">Dự án của bạn cần báo giá vật tư?</h2>
            <p className="mt-2 text-white/80">Đội ngũ kỹ thuật sẵn sàng tư vấn và báo giá trong 24 giờ.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/bao-gia" className="btn bg-white px-6 py-3 text-brand hover:bg-slate-100">
                Yêu cầu báo giá
              </Link>
              <Link href="/lien-he" className="glass btn px-6 py-3 text-white hover:bg-white/20">
                Liên hệ ngay
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
