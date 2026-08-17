"use client";

import { ScrollArea } from "@/components/ui/scrollbar";

const ROWS = Array.from({ length: 30 }, (_, i) => i + 1);
const COLS = Array.from({ length: 20 }, (_, i) => i + 1);

export default function ScrollbarDevPage() {
  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <div>
        <h1 className="text-title2 font-semibold">Scrollbar</h1>
        <p className="mt-8 text-caption1 text-neutral-6">
          Figma models a single fixed-size component (no variant axes): a
          full-length track (white @ 50%) and a shorter thumb (grey @ 70%),
          both 4px thick with a 16px corner radius. Shipped as a styled
          native scrollbar via <code>ScrollArea</code>, not a presentational
          overlay, so it actually scrolls.
        </p>
      </div>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Vertical (default)
        </h2>
        <ScrollArea className="h-[240px] w-[280px] rounded-16 bg-neutral-8 p-16">
          <div className="flex flex-col gap-12">
            {ROWS.map((n) => (
              <div
                key={n}
                className="rounded-8 bg-neutral-7/50 px-12 py-8 text-body text-brand-white"
              >
                Row {n}
              </div>
            ))}
          </div>
        </ScrollArea>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Horizontal
        </h2>
        <ScrollArea
          orientation="horizontal"
          className="w-[560px] rounded-16 bg-neutral-8 p-16"
        >
          <div className="flex gap-12">
            {COLS.map((n) => (
              <div
                key={n}
                className="flex h-[80px] w-[96px] shrink-0 items-center justify-center rounded-8 bg-neutral-7/50 text-body text-brand-white"
              >
                {n}
              </div>
            ))}
          </div>
        </ScrollArea>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Both axes
        </h2>
        <ScrollArea
          orientation="both"
          className="h-[240px] w-[400px] rounded-16 bg-neutral-8 p-16"
        >
          <div
            className="grid gap-12"
            style={{
              gridTemplateColumns: `repeat(${COLS.length}, 96px)`,
            }}
          >
            {ROWS.flatMap((r) =>
              COLS.map((c) => (
                <div
                  key={`${r}-${c}`}
                  className="flex h-[64px] items-center justify-center rounded-8 bg-neutral-7/50 text-caption1 text-brand-white"
                >
                  {r}-{c}
                </div>
              )),
            )}
          </div>
        </ScrollArea>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          On a light surface
        </h2>
        <p className="text-caption1 text-neutral-6">
          The track is a raw white 50%-opacity fill — over light content it
          reads faint by design. Figma only shows this bar over the dark
          card body demo, so light-surface contrast is not modelled.
        </p>
        <ScrollArea className="h-[160px] w-[280px] rounded-16 border border-neutral-3 bg-neutral-1 p-16">
          <div className="flex flex-col gap-12">
            {ROWS.slice(0, 12).map((n) => (
              <div
                key={n}
                className="rounded-8 bg-neutral-2 px-12 py-8 text-body text-brand-black"
              >
                Row {n}
              </div>
            ))}
          </div>
        </ScrollArea>
      </section>
    </main>
  );
}
