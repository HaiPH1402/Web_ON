"use client";

export default function PrintButton() {
  return (
    <div className="print:hidden mb-4 flex justify-end gap-2">
      <button onClick={() => window.print()} className="btn-primary">
        🖨️ In / Lưu PDF
      </button>
      <button onClick={() => window.close()} className="btn-outline">
        Đóng
      </button>
    </div>
  );
}
