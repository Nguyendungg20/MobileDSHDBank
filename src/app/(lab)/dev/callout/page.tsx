"use client";

import { Callout, type CalloutVariant } from "@/components/ui/callout";

const VARIANTS: CalloutVariant[] = ["success", "error", "warning", "info"];

export default function CalloutDevPage() {
  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">Callout — variant × tinted × action</h1>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          tinted (default) — Figma &quot;BG trắng=True&quot;
        </h2>
        <div className="flex flex-col gap-12 rounded-12 bg-neutral-1 p-16">
          {VARIANTS.map((variant) => (
            <Callout key={variant} variant={variant}>
              This is a {variant} callout description.
            </Callout>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          tinted=false — Figma &quot;BG trắng=False&quot; (solid white, no border)
        </h2>
        <div className="flex flex-col gap-12 rounded-12 bg-neutral-1 p-16">
          {VARIANTS.map((variant) => (
            <Callout key={variant} variant={variant} tinted={false}>
              This is a {variant} callout description.
            </Callout>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          With action — Figma &quot;Show Action=true&quot;
        </h2>
        <div className="flex flex-col gap-12 rounded-12 bg-neutral-1 p-16">
          {VARIANTS.map((variant) => (
            <Callout
              key={variant}
              variant={variant}
              actionLabel="Action"
              onAction={() => alert(`${variant} action clicked`)}
            >
              This is a {variant} callout description.
            </Callout>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Long description (wraps to multiple lines, icon stays top-aligned)
        </h2>
        <div className="flex flex-col gap-12 rounded-12 bg-neutral-1 p-16">
          <Callout variant="warning" actionLabel="Xem thêm">
            Khoản vay của bạn sắp đến hạn thanh toán. Vui lòng chuẩn bị số dư
            trong tài khoản trước ngày đến hạn để tránh phát sinh phí phạt trả
            chậm.
          </Callout>
        </div>
      </section>
    </main>
  );
}
