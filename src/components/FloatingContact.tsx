import type { SiteConfig } from "@/lib/site";

const digits = (s: string) => (s || "").replace(/[^0-9]/g, "");

// Nút liên hệ nổi cố định góc dưới-phải. Field trống thì ẩn nút đó.
export default function FloatingContact({ site }: { site: SiteConfig }) {
  const phone = digits(site.contactPhone);
  const zalo = digits(site.contactZalo);
  const messenger = (site.contactMessenger || "").trim();

  const buttons: {
    key: string;
    href: string;
    label: string;
    bg: string;
    icon: React.ReactNode;
    pulse?: boolean;
    external?: boolean;
  }[] = [];

  if (messenger) {
    buttons.push({
      key: "messenger",
      href: messenger,
      label: "Nhắn Messenger",
      bg: "bg-[#0084ff]",
      external: true,
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
          <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.19.16.14.26.35.27.57l.05 1.78c.04.57.62.94 1.14.71l1.98-.87c.17-.08.36-.09.54-.04 1.06.29 2.18.45 3.31.45 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm6 7.46l-2.93 4.66c-.47.74-1.47.93-2.18.4l-2.33-1.75a.6.6 0 0 0-.72 0l-3.15 2.39c-.42.32-.97-.18-.69-.63l2.93-4.66c.47-.74 1.47-.93 2.18-.4l2.33 1.75c.21.16.51.16.72 0l3.15-2.39c.42-.32.97.18.69.63z" />
        </svg>
      ),
    });
  }
  if (zalo) {
    buttons.push({
      key: "zalo",
      href: `https://zalo.me/${zalo}`,
      label: "Chat Zalo",
      bg: "bg-[#0068ff]",
      external: true,
      icon: <span className="text-[13px] font-extrabold tracking-tight">Zalo</span>,
    });
  }
  if (phone) {
    buttons.push({
      key: "phone",
      href: `tel:${phone}`,
      label: "Gọi điện",
      bg: "bg-green-500",
      pulse: true,
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
          <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z" />
        </svg>
      ),
    });
  }

  if (buttons.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col gap-3 print:hidden sm:bottom-6 sm:right-6">
      {buttons.map((b) => (
        <a
          key={b.key}
          href={b.href}
          {...(b.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          aria-label={b.label}
          className="group relative flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition hover:scale-110 sm:h-14 sm:w-14"
        >
          <span className={`absolute inset-0 rounded-full ${b.bg}`} />
          {b.pulse && (
            <span className={`absolute inset-0 animate-ping rounded-full ${b.bg} opacity-60`} aria-hidden />
          )}
          <span className="relative">{b.icon}</span>
          {/* Nhãn hiện khi hover (desktop) */}
          <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white opacity-0 shadow transition group-hover:opacity-100 md:block">
            {b.label}
          </span>
        </a>
      ))}
    </div>
  );
}
