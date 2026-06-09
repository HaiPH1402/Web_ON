import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import { getConfig } from "@/lib/settings";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [site, categories] = await Promise.all([
    getConfig(),
    prisma.category.findMany({
      orderBy: { id: "asc" },
      select: { id: true, name: true, slug: true },
    }),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header site={site} categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer site={site} />
      <FloatingContact site={site} />
    </div>
  );
}
