import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";
import { getConfig } from "@/lib/settings";
import { getSession } from "@/lib/auth";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const id = Number(params.id);
  const o = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!o) return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  const site = await getConfig();

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Hóa đơn");
  ws.columns = [{ width: 6 }, { width: 48 }, { width: 10 }, { width: 10 }, { width: 16 }, { width: 18 }];
  const money = '#,##0" ₫"';

  ws.mergeCells("A1:F1");
  ws.getCell("A1").value = site.name;
  ws.getCell("A1").font = { bold: true, size: 16, color: { argb: "FF0F4C85" } };
  ws.mergeCells("A2:F2");
  ws.getCell("A2").value = `${site.addressLine1}, ${site.addressLine2} · ĐT: ${site.hotlineSales}`;
  ws.getCell("A2").font = { size: 9, color: { argb: "FF666666" } };

  ws.mergeCells("A4:F4");
  ws.getCell("A4").value = "HÓA ĐƠN BÁN HÀNG";
  ws.getCell("A4").font = { bold: true, size: 14 };
  ws.getCell("A4").alignment = { horizontal: "center" };

  ws.getCell("A5").value = `Số: ${o.code}`;
  ws.getCell("E5").value = `Ngày: ${new Date(o.createdAt).toLocaleDateString("vi-VN")}`;
  ws.getCell("A6").value = `Khách hàng: ${o.customerName}`;
  ws.getCell("A7").value = `Điện thoại: ${o.customerPhone}`;
  ws.getCell("A8").value = `Địa chỉ: ${o.shippingAddress}`;

  const hr = ws.getRow(10);
  hr.values = ["STT", "Sản phẩm", "ĐVT", "SL", "Đơn giá", "Thành tiền"];
  hr.font = { bold: true, color: { argb: "FFFFFFFF" } };
  hr.alignment = { horizontal: "center" };
  hr.eachCell((c) => {
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1769B8" } };
    c.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
  });

  let r = 11;
  o.items.forEach((it, i) => {
    const row = ws.getRow(r);
    row.values = [i + 1, it.productName, it.unit, it.quantity, it.price, it.lineTotal];
    row.getCell(5).numFmt = money;
    row.getCell(6).numFmt = money;
    [1, 3, 4].forEach((c) => (row.getCell(c).alignment = { horizontal: "center" }));
    row.eachCell((c) => {
      c.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
    });
    r++;
  });

  const addTotal = (label: string, value: number, bold = false) => {
    ws.mergeCells(`A${r}:E${r}`);
    ws.getCell(`A${r}`).value = label;
    ws.getCell(`A${r}`).alignment = { horizontal: "right" };
    ws.getCell(`F${r}`).value = value;
    ws.getCell(`F${r}`).numFmt = money;
    if (bold) {
      ws.getCell(`A${r}`).font = { bold: true };
      ws.getCell(`F${r}`).font = { bold: true, color: { argb: "FF0F4C85" } };
    }
    r++;
  };
  addTotal("Tạm tính:", o.subtotal);
  addTotal("Phí vận chuyển:", o.shippingFee);
  addTotal("TỔNG CỘNG:", o.total, true);

  const buf = await wb.xlsx.writeBuffer();
  return new NextResponse(buf as ArrayBuffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="HoaDon-${o.code}.xlsx"`,
    },
  });
}
