"use client";

import { useState } from "react";
import { Indicator, type IndicatorActiveColor } from "@/components/ui/indicator";

const ACTIVE_COLORS: IndicatorActiveColor[] = ["red", "white"];

export default function IndicatorDevPage() {
  const [page, setPage] = useState(2);
  const total = 5;

  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">Indicator — dots</h1>
      <p className="text-caption1 text-neutral-6">
        Figma &quot;Dot indicator&quot; (isActive × Color). Inactive fill is
        Neutral/1 (#F9FAFB) — near-invisible on a plain white page, so every
        swatch below sits on a dark/tinted surface, matching how the
        component is used over photo/carousel backgrounds in Figma.
      </p>

      {ACTIVE_COLORS.map((activeColor) => (
        <section key={activeColor} className="flex flex-col gap-12">
          <h2 className="text-subheadline font-semibold text-neutral-7">
            activeColor=&quot;{activeColor}&quot;
          </h2>
          <div className="flex flex-wrap items-center gap-24 rounded-12 bg-neutral-9 p-16">
            {[1, 3, 5, 8].map((n) => (
              <div key={n} className="flex flex-col items-center gap-8">
                <Indicator
                  total={n}
                  current={Math.min(2, n)}
                  activeColor={activeColor}
                />
                <span className="text-caption2 text-neutral-4">total={n}</span>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Controlled — tap a dot to jump (onDotClick)
        </h2>
        <div className="flex flex-col items-center gap-16 rounded-12 bg-neutral-9 p-24">
          <Indicator total={total} current={page} onDotClick={setPage} />
          <div className="flex items-center gap-16">
            <button
              type="button"
              className="text-caption1 text-brand-white underline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <span className="text-caption1 text-neutral-3">
              {page} / {total}
            </span>
            <button
              type="button"
              className="text-caption1 text-brand-white underline"
              onClick={() => setPage((p) => Math.min(total, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Non-interactive (decorative, aria-hidden dots)
        </h2>
        <div className="flex flex-wrap items-center gap-24 rounded-12 bg-neutral-9 p-16">
          <Indicator total={4} current={3} />
        </div>
      </section>
    </main>
  );
}
