"use client";

import { useState } from "react";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";

/** Stand-in for a campaign illustration/photo — Figma's Graphic/Image slots
 * hold raster assets this port doesn't have; a flat swatch keeps the slot's
 * size honest without inventing artwork. */
function IllustrationPlaceholder({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={className}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        background:
          "repeating-linear-gradient(45deg, rgba(0,0,0,0.06), rgba(0,0,0,0.06) 6px, transparent 6px, transparent 12px)",
      }}
    />
  );
}

export default function BannerDevPage() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">Banner — default × promo</h1>
      <p className="text-caption1 text-neutral-6">
        Figma page &quot;❖ Banner&quot; (node 2139:220757). `default` generalizes
        Banner-home&apos;s `01` variant; `promo` ports the standalone &quot;1Click
        Banner&quot; component. See banner.tsx&apos;s doc comment for why the other
        five Banner-home variants (td/bill/card/IPP/Variant6) aren&apos;t
        reproduced as component variants — they&apos;re one-off campaign content,
        not tokens.
      </p>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          default — no illustration (Figma &quot;01&quot;)
        </h2>
        <div className="flex flex-col gap-12 rounded-12 bg-neutral-1 p-16">
          <Banner
            cta={
              <Button variant="primary" size="x-small">
                Mở thẻ ngay
              </Button>
            }
          >
            Quý khách có thể mở thẻ tín dụng HDBank Petrolimex 4in1 với hạn mức
            đến 50 triệu đồng!
          </Banner>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          default — with illustration (shape borrowed from &quot;bill&quot;/&quot;card&quot;)
        </h2>
        <div className="flex flex-col gap-12 rounded-12 bg-neutral-1 p-16">
          <Banner
            illustration={
              <IllustrationPlaceholder className="rounded-12" />
            }
            cta={
              <Button variant="primary" size="x-small">
                Thanh toán ngay
              </Button>
            }
          >
            Hoá đơn tiền điện Tháng 7 đã đến hạn thanh toán!
          </Banner>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          default — dismissible
        </h2>
        <div className="flex flex-col gap-12 rounded-12 bg-neutral-1 p-16">
          {dismissed ? (
            <button
              type="button"
              className="text-caption1 text-neutral-6 underline"
              onClick={() => setDismissed(false)}
            >
              Reset dismissed banner
            </button>
          ) : (
            <Banner
              onDismiss={() => setDismissed(true)}
              dismissLabel="Đóng thông báo"
              cta={
                <Button variant="primary" size="x-small">
                  Mở thẻ ngay
                </Button>
              }
            >
              Quý khách có thể mở thẻ tín dụng HDBank Petrolimex 4in1 với hạn mức
              đến 50 triệu đồng!
            </Banner>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          promo — brand gradient (Figma &quot;1Click Banner&quot;)
        </h2>
        <div className="flex flex-col gap-12 rounded-12 bg-neutral-1 p-16">
          <Banner
            variant="promo"
            illustration={<IllustrationPlaceholder />}
            cta={
              <Button variant="underline-white" size="x-small">
                Khám phá ngay
              </Button>
            }
          >
            Tài khoản sinh lời cùng Đi HDBank
          </Banner>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          promo — no illustration
        </h2>
        <div className="flex flex-col gap-12 rounded-12 bg-neutral-1 p-16">
          <Banner
            variant="promo"
            cta={
              <Button variant="underline-white" size="x-small">
                Khám phá ngay
              </Button>
            }
          >
            Tài khoản sinh lời cùng Đi HDBank
          </Banner>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Narrow container (text wrap)
        </h2>
        <div className="max-w-[320px] rounded-12 bg-neutral-1 p-16">
          <Banner
            cta={
              <Button variant="primary" size="small">
                Mở thẻ ngay
              </Button>
            }
          >
            Quý khách có thể mở thẻ tín dụng HDBank Petrolimex 4in1 với hạn mức
            đến 50 triệu đồng!
          </Banner>
        </div>
      </section>
    </main>
  );
}
