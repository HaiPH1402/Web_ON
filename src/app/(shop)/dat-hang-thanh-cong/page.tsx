import Link from "next/link";

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { code?: string };
}) {
  return (
    <div className="container-main py-16 text-center">
      <div className="text-6xl">✅</div>
      <h1 className="mt-4 text-2xl font-bold">Đặt hàng thành công!</h1>
      <p className="mt-2 text-gray-600">
        Cảm ơn bạn đã đặt hàng. Mã đơn hàng của bạn là:
      </p>
      <div className="mt-3 inline-block rounded-md bg-sky-50 px-6 py-3 text-xl font-bold text-brand">
        {searchParams.code ?? "—"}
      </div>
      <p className="mt-4 text-sm text-gray-500">
        Nhân viên sẽ liên hệ xác nhận đơn hàng trong thời gian sớm nhất.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/san-pham" className="btn-primary">Tiếp tục mua hàng</Link>
        <Link href="/" className="btn-outline">Về trang chủ</Link>
      </div>
    </div>
  );
}
