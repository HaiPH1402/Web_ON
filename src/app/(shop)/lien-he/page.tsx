import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { getConfig } from "@/lib/settings";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Liên hệ — Ống Nước Việt",
};

export default async function ContactPage() {
  const site = await getConfig();

  // Bản đồ: dùng mapQuery nếu có, không thì lấy địa chỉ. Google Maps embed không cần API key.
  const mapLocation = site.mapQuery?.trim() || `${site.addressLine1}, ${site.addressLine2}`;
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(mapLocation)}&z=15&output=embed`;

  const INFO = [
    { icon: "📍", title: "Địa chỉ", lines: [site.addressLine1, site.addressLine2] },
    { icon: "📞", title: "Hotline", lines: [`${site.hotlineSales} (Bán hàng)`, `${site.hotlineProject} (Báo giá công trình)`] },
    { icon: "✉️", title: "Email", lines: [site.emailCskh, site.emailQuote] },
    { icon: "🕗", title: "Giờ làm việc", lines: [site.workingHours1, site.workingHours2] },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative isolate bg-slate-950 py-16 text-white">
        <div className="aurora opacity-70" aria-hidden />
        <div className="container-main relative text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-light">Liên hệ</p>
          <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">Kết nối với chúng tôi</h1>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Cần tư vấn sản phẩm hay báo giá công trình? Để lại lời nhắn, chúng tôi
            phản hồi trong vòng 24 giờ.
          </p>
        </div>
      </section>

      {/* Info cards */}
      <section className="container-main relative -mt-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INFO.map((it, i) => (
            <Reveal key={it.title} delay={i * 70}>
              <div className="lift h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-2xl">
                  {it.icon}
                </div>
                <h3 className="mt-4 font-bold">{it.title}</h3>
                {it.lines.map((l) => (
                  <p key={l} className="mt-1 text-sm text-slate-500">{l}</p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Form + Map */}
      <section className="container-main py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-card">
              <h2 className="text-xl font-bold">Gửi lời nhắn</h2>
              <p className="mt-1 text-sm text-slate-500">Điền thông tin, chúng tôi sẽ liên hệ lại ngay.</p>
              <ContactForm />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="h-full overflow-hidden rounded-3xl border border-slate-200 shadow-card">
              <iframe
                title="Bản đồ"
                src={mapSrc}
                className="h-full min-h-[420px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
