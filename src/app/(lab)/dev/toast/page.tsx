"use client";

import { Button } from "@/components/ui/button";
import { Toast, useToast, type ToastVariant } from "@/components/ui/toast";

const VARIANTS: ToastVariant[] = ["success", "warning", "error", "info"];

const MESSAGE: Record<ToastVariant, string> = {
  success: "Xác nhận thành công.",
  warning: "Vui lòng xác nhận Điều kiện và điều khoản trước khi tiếp tục.",
  error: "Thông tin xác thực chưa đúng. Vui lòng kiểm tra và thử lại.",
  info: "Thời hạn bảo hiểm 1 năm.",
};

export default function ToastDevPage() {
  const { toast, show, hide } = useToast();

  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">Toast — variant × bold</h1>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Bold = false (default)
        </h2>
        <div className="flex flex-col gap-12 rounded-12 bg-neutral-1 p-16">
          {VARIANTS.map((variant) => (
            <Toast key={variant} variant={variant}>
              {MESSAGE[variant]}
            </Toast>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">Bold = true</h2>
        <div className="flex flex-col gap-12 rounded-12 bg-neutral-1 p-16">
          {VARIANTS.map((variant) => (
            <Toast key={variant} variant={variant} bold>
              {MESSAGE[variant]}
            </Toast>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Two-line wrap (Figma&apos;s inline-banner usage on &quot;Confirm Infomation&quot;)
        </h2>
        <div className="flex flex-col gap-12 rounded-12 bg-neutral-1 p-16">
          <div className="max-w-[326px]">
            <Toast variant="warning">
              Vui lòng xác nhận Điều kiện và điều khoản trước khi tiếp tục.
            </Toast>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          useToast — single-slot helper
        </h2>
        <div className="flex flex-col gap-12 rounded-12 bg-neutral-1 p-16">
          <div className="flex flex-wrap gap-8">
            <Button
              size="small"
              onClick={() =>
                show({ variant: "success", message: "Đã lưu thay đổi.", duration: 3000 })
              }
            >
              Show success (3s)
            </Button>
            <Button size="small" variant="secondary" onClick={hide}>
              Hide
            </Button>
          </div>
          {toast && (
            <Toast variant={toast.variant} bold={toast.bold}>
              {toast.message}
            </Toast>
          )}
        </div>
      </section>
    </main>
  );
}
