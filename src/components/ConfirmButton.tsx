"use client";

// Nút submit có hỏi xác nhận trước khi chạy (dùng cho nút Xóa trong admin).
// Đặt bên trong <form action={serverAction}>; nếu người dùng bấm Hủy thì chặn submit.
export default function ConfirmButton({
  children,
  message = "Bạn chắc chắn muốn xóa? Hành động này không thể hoàn tác.",
  className,
}: {
  children: React.ReactNode;
  message?: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
