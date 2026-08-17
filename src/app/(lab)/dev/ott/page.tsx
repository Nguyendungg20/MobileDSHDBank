"use client";

import { OTT } from "@/components/ui/ott";

export default function OTTDevPage() {
  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <div className="flex flex-col gap-4">
        <h1 className="text-title2 font-semibold">
          OTT — mocked push notification
        </h1>
        <p className="text-caption1 text-neutral-6">
          &quot;Thông báo OTT&quot;: a Vietnamese banking term for a
          notification delivered via the app (over-the-top) rather than SMS.
          Single component, no variants — this preview is the real content
          from the Figma node plus a couple of usage shapes.
        </p>
      </div>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Default (Figma content)
        </h2>
        <div className="flex flex-col gap-16 rounded-12 bg-neutral-2 p-16">
          <OTT title="Thông báo Di-HDBank">
            Yêu cầu chuyển đổi trả góp đã được phê duyệt. Bạn có thể bắt đầu
            trả góp <span className="font-bold">1,223,000 VND</span> hàng
            tháng.
          </OTT>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Custom icon slot
        </h2>
        <p className="text-caption1 text-neutral-6">
          The built-in badge is a simplified placeholder (see doc comment in
          ott.tsx) — pass a real asset via `icon` when one is available.
        </p>
        <div className="flex flex-col gap-16 rounded-12 bg-neutral-2 p-16">
          <OTT
            title="Xác thực giao dịch"
            icon={
              <span
                aria-hidden
                className="flex size-40 shrink-0 items-center justify-center rounded-8 bg-blue-6 text-brand-white"
              >
                <svg viewBox="0 0 20 20" fill="none" className="size-20">
                  <path
                    d="M5.5 10.5l3 3 6-6.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            }
          >
            Mã OTP của bạn là <span className="font-bold">839201</span>, hết
            hạn sau 5 phút.
          </OTT>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Short body, embedded in a narrower column
        </h2>
        <div className="flex flex-col gap-16 rounded-12 bg-neutral-2 p-16">
          <div className="max-w-[343px]">
            <OTT title="Đi-HDBank">Giao dịch của bạn đã hoàn tất.</OTT>
          </div>
        </div>
      </section>
    </main>
  );
}
