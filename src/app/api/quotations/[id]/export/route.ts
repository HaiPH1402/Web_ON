import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";
import { getConfig } from "@/lib/settings";
import { computeQuoteTotals } from "@/lib/quote";
import { getSession } from "@/lib/auth";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const id = Number(params.id);
  const q = await prisma.quotation.findUnique({ where: { id }, include: { items: true } });
  if (!q) return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  const site = await getConfig();
  const totals = computeQuoteTotals(q.items, q.vatPercent, q.discount);

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Báo giá");
  ws.columns = [
    { width: 6 },
    { width: 48 },
    { width: 10 },
    { width: 10 },
    { width: 16 },
    { width: 18 },
  ];
  const money = '#,##0" ₫"';

  // Tiêu đề công ty
  ws.mergeCells("A1:F1");
  ws.getCell("A1").value = site.name;
  ws.getCell("A1").font = { bold: true, size: 16, color: { argb: "FF0F4C85" } };
  ws.mergeCells("A2:F2");
  ws.getCell("A2").value = `${site.addressLine1}, ${site.addressLine2} · ĐT: ${site.hotlineSales} · ${site.emailQuote}`;
  ws.getCell("A2").font = { size: 9, color: { argb: "FF666666" } };

  ws.mergeCells("A4:F4");
  ws.getCell("A4").value = "BẢNG BÁO GIÁ";
  ws.getCell("A4").font = { bold: true, size: 14 };
  ws.getCell("A4").alignment = { horizontal: "center" };

  ws.getCell("A5").value = `Số: ${q.code}`;
  ws.getCell("E5").value = `Ngày: ${new Date(q.createdAt).toLocaleDateString("vi-VN")}`;
  ws.getCell("A6").value = `Khách hàng: ${q.customerName}`;
  ws.getCell("A7").value = `Điện thoại: ${q.customerPhone}`;
  if (q.customerEmail) ws.getCell("E7").value = `Email: ${q.customerEmail}`;

  // Header bảng
  const headerRow = ws.addRow([]);
  void headerRow;
  const hr = ws.getRow(9);
  hr.values = ["STT", "Sản phẩm", "ĐVT", "SL", "Đơn giá", "Thành tiền"];
  hr.font = { bold: true, color: { argb: "FFFFFFFF" } };
  hr.alignment = { vertical: "middle", horizontal: "center" };
  hr.eachCell((c) => {
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1769B8" } };
    c.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
  });

  let r = 10;
  q.items.forEach((it, i) => {
    const row = ws.getRow(r);
    const line = (it.quotedPrice ?? 0) * it.quantity;
    row.values = [i + 1, it.productName, it.unit, it.quantity, it.quotedPrice ?? 0, line];
    row.getCell(5).numFmt = money;
    row.getCell(6).numFmt = money;
    row.getCell(1).alignment = { horizontal: "center" };
    row.getCell(3).alignment = { horizontal: "center" };
    row.getCell(4).alignment = { horizontal: "center" };
    row.eachCell((c) => {
      c.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
    });
    r++;
  });

  // Tổng
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
  addTotal("Tạm tính:", totals.subtotal);
  if (q.discount) addTotal("Chiết khấu:", -totals.discount);
  if (q.vatPercent) addTotal(`VAT (${q.vatPercent}%):`, totals.vat);
  addTotal("TỔNG CỘNG:", totals.total, true);

  if (q.note) {
    r++;
    ws.mergeCells(`A${r}:F${r}`);
    ws.getCell(`A${r}`).value = `Ghi chú: ${q.note}`;
    ws.getCell(`A${r}`).font = { italic: true, size: 10 };
  }

  const buf = await wb.xlsx.writeBuffer();
  const filename = `BaoGia-${q.code}.xlsx`;
  return new NextResponse(buf as ArrayBuffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
