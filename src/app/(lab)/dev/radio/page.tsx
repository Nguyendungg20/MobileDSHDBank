"use client";

import { useState } from "react";
import { Radio, type RadioSize } from "@/components/ui/radio";

const SIZES: RadioSize[] = ["small", "large"];

export default function RadioDevPage() {
  const [group, setGroup] = useState("a");

  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">Radio — states × sizes</h1>

      {SIZES.map((size) => (
        <section key={size} className="flex flex-col gap-12">
          <h2 className="text-subheadline font-semibold text-neutral-7">
            {size}
          </h2>
          <div className="flex flex-wrap items-center gap-24 rounded-12 bg-neutral-1 p-16">
            <Radio size={size} name={`static-${size}`} label="Unchecked" />
            <Radio
              size={size}
              name={`static-checked-${size}`}
              label="Checked"
              defaultChecked
            />
            <Radio size={size} name={`static-disabled-${size}`} label="Disabled" disabled />
            <Radio
              size={size}
              name={`static-disabled-checked-${size}`}
              label="Disabled checked"
              disabled
              defaultChecked
            />
          </div>
        </section>
      ))}

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Show Label = false
        </h2>
        <div className="flex flex-wrap items-center gap-24 rounded-12 bg-neutral-1 p-16">
          <Radio
            showLabel={false}
            name="no-label"
            aria-label="Unchecked, no label"
          />
          <Radio
            showLabel={false}
            name="no-label-checked"
            defaultChecked
            aria-label="Checked, no label"
          />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Group (shared `name` — arrow keys move selection natively)
        </h2>
        <div className="flex flex-wrap items-center gap-24 rounded-12 bg-neutral-1 p-16">
          <Radio
            name="fruit"
            label="Apple"
            checked={group === "a"}
            onChange={() => setGroup("a")}
          />
          <Radio
            name="fruit"
            label="Banana"
            checked={group === "b"}
            onChange={() => setGroup("b")}
          />
          <Radio
            name="fruit"
            label="Cherry"
            checked={group === "c"}
            onChange={() => setGroup("c")}
          />
        </div>
        <p className="text-caption1 text-neutral-6">Selected: {group}</p>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Keyboard focus
        </h2>
        <p className="text-caption1 text-neutral-6">
          Tab to the radio below to verify the focus-visible ring.
        </p>
        <div className="flex flex-wrap items-center gap-24 rounded-12 bg-neutral-1 p-16">
          <Radio name="focus-demo" label="Focus me" />
        </div>
      </section>
    </main>
  );
}
