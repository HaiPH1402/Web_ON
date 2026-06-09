import Link from "next/link";
import type { SiteConfig } from "@/lib/site";

export default function Footer({ site }: { site: SiteConfig }) {
  return (
    <footer className="mt-20 bg-slate-900 text-slate-300">
      <div className="container-main grid gap-10 py-12 text-sm md:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2.5">
            {site.logoImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={site.logoImage} alt={site.name} className="h-9 w-9 rounded-lg object-cover" />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-lg text-white">
                💧
              </span>
            )}
            <span className="text-lg font-extrabold text-white">{site.name}</span>
          </div>
          <p className="leading-relaxed text-slate-400">
            Chuyên cung cấp ống nước, phụ kiện và vật tư ngành cấp – thoát nước.
            Giá sỉ cho nhà thầu & công trình, hàng chính hãng đầy đủ CO/CQ.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Sản phẩm</h4>
          <ul className="space-y-2.5 text-slate-400">
            <li><Link href="/san-pham?material=uPVC" className="hover:text-white">Ống uPVC</Link></li>
            <li><Link href="/san-pham?material=HDPE" className="hover:text-white">Ống HDPE</Link></li>
            <li><Link href="/san-pham?material=PPR" className="hover:text-white">Ống PPR</Link></li>
            <li><Link href="/san-pham?category=phu-kien" className="hover:text-white">Phụ kiện & Van</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Hỗ trợ</h4>
          <ul className="space-y-2.5 text-slate-400">
            <li><Link href="/gioi-thieu" className="hover:text-white">Giới thiệu</Link></li>
            <li><Link href="/bao-gia" className="hover:text-white">Yêu cầu báo giá</Link></li>
            <li><Link href="/du-an" className="hover:text-white">Công trình tiêu biểu</Link></li>
            <li><Link href="/tin-tuc" className="hover:text-white">Tin tức</Link></li>
            <li><Link href="/lien-he" className="hover:text-white">Liên hệ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Liên hệ</h4>
          <ul className="space-y-2.5 text-slate-400">
            <li>📞 Hotline: {site.hotlineSales}</li>
            <li>✉️ {site.emailCskh}</li>
            <li>📍 {site.addressLine1}, {site.addressLine2}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 py-5 text-center text-xs text-slate-500">
        {site.copyright}
      </div>
    </footer>
  );
}
