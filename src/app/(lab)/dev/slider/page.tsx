"use client";

import { useState } from "react";
import { Slider, SliderRange } from "@/components/ui/slider";

export default function SliderDevPage() {
  const [basic, setBasic] = useState(40);
  const [withLabels, setWithLabels] = useState(5);
  const [range, setRange] = useState<[number, number]>([2, 8]);
  const [disabledRange] = useState<[number, number]>([3, 7]);
  const [step, setStep] = useState(20);

  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">Slider — single &amp; range</h1>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Single thumb (range?=no) — controlled
        </h2>
        <div className="flex flex-col gap-8 rounded-12 bg-neutral-1 p-16">
          <Slider value={basic} onValueChange={setBasic} />
          <p className="text-caption1 text-neutral-6">value: {basic}</p>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Value label + min/max captions (Figma &quot;Show value&quot; /
          &quot;Show min-max&quot;)
        </h2>
        <div className="rounded-12 bg-neutral-1 p-16">
          <Slider
            min={1}
            max={10}
            value={withLabels}
            onValueChange={setWithLabels}
            showValue
            formatValue={(v) => `${v} năm`}
            showMinMax
            minLabel="1 năm"
            maxLabel="10 năm"
          />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Uncontrolled, default value, step 20
        </h2>
        <div className="rounded-12 bg-neutral-1 p-16">
          <Slider
            defaultValue={step}
            step={20}
            onValueChange={setStep}
          />
          <p className="mt-8 text-caption1 text-neutral-6">last committed: {step}</p>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Disabled
        </h2>
        <div className="rounded-12 bg-neutral-1 p-16">
          <Slider defaultValue={65} disabled />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Two thumbs (range?=yes) — controlled
        </h2>
        <div className="flex flex-col gap-8 rounded-12 bg-neutral-1 p-16">
          <SliderRange min={0} max={10} value={range} onValueChange={setRange} />
          <p className="text-caption1 text-neutral-6">
            value: [{range[0]}, {range[1]}]
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Two thumbs — disabled
        </h2>
        <div className="rounded-12 bg-neutral-1 p-16">
          <SliderRange min={0} max={10} value={disabledRange} disabled />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Keyboard focus
        </h2>
        <p className="text-caption1 text-neutral-6">
          Tab to the slider below and use the arrow keys / Home / End to verify
          keyboard support and the focus-visible ring.
        </p>
        <div className="rounded-12 bg-neutral-1 p-16">
          <Slider defaultValue={30} aria-label="Focus me" />
        </div>
      </section>
    </main>
  );
}
