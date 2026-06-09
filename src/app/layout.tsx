import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { SITE } from "@/lib/site";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${SITE.name} — Ống nước, phụ kiện & vật tư ngành nước`,
  description: SITE.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={beVietnam.className}>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
