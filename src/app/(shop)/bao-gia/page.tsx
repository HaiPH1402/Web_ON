import { prisma } from "@/lib/prisma";
import QuotationForm from "@/components/QuotationForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Yêu cầu báo giá — Ống Nước Việt",
};

export default async function QuotationPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { name: true, unit: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="container-main py-8">
      <h1 className="text-2xl font-bold">Yêu cầu báo giá (cho nhà thầu / công trình)</h1>
      <p className="mt-2 max-w-2xl text-gray-500">
        Liệt kê các vật tư bạn cần (tên + số lượng), để lại thông tin liên hệ —
        chúng tôi sẽ gửi báo giá sỉ tốt nhất trong vòng 24 giờ. Không cần biết giá trước.
      </p>
      <QuotationForm products={products} />
    </div>
  );
}
