"use client";

import { useState } from "react";
import {
  ProgressTracker,
  type ProgressTrackerStep,
} from "@/components/ui/progress-tracker";

const STEPS: ProgressTrackerStep[] = [
  { label: "Step name", description: "Status" },
  { label: "Step name", description: "Status" },
  { label: "Step name", description: "Status" },
  { label: "Step name", description: "Status" },
];

export default function ProgressTrackerDevPage() {
  const [current, setCurrent] = useState(2);

  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">Progress tracker — states × orientation</h1>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Horizontal — every position of `current`
        </h2>
        <div className="flex flex-col gap-24 rounded-12 bg-neutral-1 p-24">
          {STEPS.map((_, i) => (
            <ProgressTracker key={i} steps={STEPS} current={i} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Vertical — icon + label + description
        </h2>
        <div className="rounded-12 bg-neutral-1 p-24">
          <ProgressTracker steps={STEPS} current={2} orientation="vertical" />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Compact — Figma &quot;Line=true&quot;, horizontal only
        </h2>
        <div className="flex flex-col gap-24 rounded-12 bg-neutral-1 p-24">
          {STEPS.map((_, i) => (
            <ProgressTracker key={i} steps={STEPS} current={i} variant="compact" />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Controlled
        </h2>
        <div className="flex flex-col gap-16 rounded-12 bg-neutral-1 p-24">
          <ProgressTracker steps={STEPS} current={current} />
          <div className="flex gap-8">
            <button
              type="button"
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              className="rounded-8 border border-neutral-3 bg-brand-white px-16 py-8 text-caption1 font-medium text-brand-black"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setCurrent((c) => Math.min(STEPS.length - 1, c + 1))}
              className="rounded-8 border border-neutral-3 bg-brand-white px-16 py-8 text-caption1 font-medium text-brand-black"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
