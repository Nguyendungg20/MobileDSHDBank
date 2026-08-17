"use client";

import { useState } from "react";
import { Rating, type RatingValue } from "@/components/ui/rating";

const APP_RATING_LABELS: [string, string, string, string, string] = [
  "Không sẵn sàng",
  "Chưa sẵn sàng",
  "Phân vân",
  "Sẵn sàng",
  "Rất sẵn sàng",
];

export default function RatingDevPage() {
  const [controlled, setControlled] = useState<RatingValue | undefined>(undefined);

  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">Rating — states × usage</h1>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Default labels (Figma placeholder)
        </h2>
        <p className="text-caption1 text-neutral-6">
          Every position defaults to Figma&apos;s own literal &quot;Label&quot; text —
          only the selected face&apos;s label is ever visible (transparent
          otherwise, to avoid layout shift on selection).
        </p>
        <div className="rounded-12 bg-neutral-1 p-16">
          <Rating aria-label="Rate your experience" />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Uncontrolled — defaultValue
        </h2>
        <div className="rounded-12 bg-neutral-1 p-16">
          <Rating
            aria-label="Rate your experience"
            defaultValue={3}
            labels={APP_RATING_LABELS}
          />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Controlled
        </h2>
        <p className="text-caption1 text-neutral-6">
          Current value: {controlled ?? "none"}
        </p>
        <div className="rounded-12 bg-neutral-1 p-16">
          <Rating
            aria-label="Rate your experience"
            value={controlled}
            onChange={setControlled}
            labels={APP_RATING_LABELS}
          />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Every fixed value 1–5 (readOnly, for visual QA of each face)
        </h2>
        <div className="flex flex-wrap gap-24 rounded-12 bg-neutral-1 p-16">
          {([1, 2, 3, 4, 5] as RatingValue[]).map((v) => (
            <div key={v} className="w-64">
              <Rating
                aria-label={`Fixed rating ${v}`}
                value={v}
                readOnly
                labels={APP_RATING_LABELS}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          readOnly — no interaction
        </h2>
        <div className="rounded-12 bg-neutral-1 p-16">
          <Rating
            aria-label="Past rating, read only"
            value={5}
            readOnly
            labels={APP_RATING_LABELS}
          />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Usage context — on a card (Figma &quot;Rating Widget&quot;, ported
          loosely for preview; the card chrome itself isn&apos;t part of this
          component)
        </h2>
        <div className="flex flex-wrap gap-16">
          <div className="w-[343px] rounded-16 border border-neutral-3 bg-brand-white p-12">
            <p className="px-16 pb-24 text-subheadline font-semibold text-brand-black">
              Bạn có hài lòng với trải nghiệm trên ứng dụng Đi-HDBank?
            </p>
            <div className="px-16">
              <Rating aria-label="Rate your experience" labels={APP_RATING_LABELS} />
            </div>
          </div>
          <div className="w-[343px] rounded-16 bg-yellow-1 p-12">
            <p className="px-16 pb-24 text-subheadline font-semibold text-brand-black">
              Bạn có hài lòng với trải nghiệm trên ứng dụng Đi-HDBank?
            </p>
            <div className="px-16">
              <Rating
                aria-label="Rate your experience"
                defaultValue={4}
                labels={APP_RATING_LABELS}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Keyboard focus
        </h2>
        <p className="text-caption1 text-neutral-6">
          Tab to the row below, then use the arrow keys to move + select
          (WAI-ARIA radiogroup: automatic activation).
        </p>
        <div className="rounded-12 bg-neutral-1 p-16">
          <Rating aria-label="Keyboard test" labels={APP_RATING_LABELS} />
        </div>
      </section>
    </main>
  );
}
