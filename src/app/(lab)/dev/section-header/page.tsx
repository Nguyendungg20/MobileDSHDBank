"use client";

import {
  SectionHeader,
  type SectionHeaderSize,
} from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";

const SIZES: SectionHeaderSize[] = ["x-large", "large", "medium", "small"];

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-24" aria-hidden>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SectionHeaderDevPage() {
  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">
        Section Header — size × usage
      </h1>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          usage=&quot;default&quot; — title + subtitle
        </h2>
        <div className="flex flex-col gap-24 rounded-12 bg-neutral-1 p-16">
          {SIZES.map((size) => (
            <SectionHeader
              key={size}
              size={size}
              title={`Heading (${size})`}
              subtitle="Sub-heading"
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          usage=&quot;inverted&quot; — on a coloured background
        </h2>
        <div className="flex flex-col gap-24 rounded-12 bg-brand-gradient-h p-16">
          {SIZES.map((size) => (
            <SectionHeader
              key={size}
              size={size}
              usage="inverted"
              title={`Heading (${size})`}
              subtitle="Sub-heading"
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Title only (no subtitle)
        </h2>
        <div className="flex flex-col gap-24 rounded-12 bg-neutral-1 p-16">
          {SIZES.map((size) => (
            <SectionHeader key={size} size={size} title={`Heading (${size})`} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          action — composed Button (ignored on x-large)
        </h2>
        <div className="flex flex-col gap-24 rounded-12 bg-neutral-1 p-16">
          {SIZES.map((size) => (
            <SectionHeader
              key={size}
              size={size}
              title={`Heading (${size})`}
              subtitle="Sub-heading"
              action={
                <Button variant="tertiary" size="x-small">
                  Xem tất cả
                </Button>
              }
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          action — chevron-only icon button
        </h2>
        <div className="flex flex-col gap-24 rounded-12 bg-neutral-1 p-16">
          {SIZES.map((size) => (
            <SectionHeader
              key={size}
              size={size}
              title={`Heading (${size})`}
              subtitle="Sub-heading"
              action={
                <button
                  type="button"
                  aria-label="See all"
                  className="flex size-32 items-center justify-center text-neutral-6"
                >
                  <ChevronRightIcon />
                </button>
              }
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          icon slot (leading)
        </h2>
        <div className="flex flex-col gap-24 rounded-12 bg-neutral-1 p-16">
          <SectionHeader
            size="large"
            title="Term Deposit"
            subtitle="Matures 08/08/2026"
            icon={
              <span className="flex size-40 items-center justify-center rounded-full bg-neutral-3 text-caption1 font-semibold text-neutral-7">
                TD
              </span>
            }
          />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Long title — truncation
        </h2>
        <div className="max-w-[280px] rounded-12 bg-neutral-1 p-16">
          <SectionHeader
            size="medium"
            title="A very long section heading that should truncate with an ellipsis"
            subtitle="And a subtitle that is also quite long and should truncate too"
          />
        </div>
      </section>
    </main>
  );
}
