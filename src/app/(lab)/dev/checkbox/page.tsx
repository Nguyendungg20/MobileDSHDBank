"use client";

import { useState } from "react";
import { Checkbox, type CheckboxSize } from "@/components/ui/checkbox";

const SIZES: CheckboxSize[] = ["small", "large"];

export default function CheckboxDevPage() {
  const [controlled, setControlled] = useState(false);

  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">Checkbox — states × sizes</h1>

      {SIZES.map((size) => (
        <section key={size} className="flex flex-col gap-12">
          <h2 className="text-subheadline font-semibold text-neutral-7">
            {size}
          </h2>
          <div className="flex flex-wrap items-center gap-24 rounded-12 bg-neutral-1 p-16">
            <Checkbox size={size} label="Unchecked" />
            <Checkbox size={size} label="Checked" defaultChecked />
            <Checkbox size={size} label="Indeterminate" indeterminate />
            <Checkbox size={size} label="Disabled" disabled />
            <Checkbox size={size} label="Disabled checked" disabled defaultChecked />
            <Checkbox size={size} label="Disabled indeterminate" disabled indeterminate />
          </div>
        </section>
      ))}

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Show Label = false
        </h2>
        <div className="flex flex-wrap items-center gap-24 rounded-12 bg-neutral-1 p-16">
          <Checkbox showLabel={false} aria-label="Unchecked, no label" />
          <Checkbox showLabel={false} defaultChecked aria-label="Checked, no label" />
          <Checkbox
            showLabel={false}
            indeterminate
            aria-label="Indeterminate, no label"
          />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Controlled (&quot;Select all&quot;-style indeterminate)
        </h2>
        <div className="flex flex-wrap items-center gap-24 rounded-12 bg-neutral-1 p-16">
          <Checkbox
            label={controlled ? "Checked" : "Click me"}
            checked={controlled}
            onChange={(e) => setControlled(e.target.checked)}
          />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Keyboard focus
        </h2>
        <p className="text-caption1 text-neutral-6">
          Tab to the checkbox below to verify the focus-visible ring.
        </p>
        <div className="flex flex-wrap items-center gap-24 rounded-12 bg-neutral-1 p-16">
          <Checkbox label="Focus me" />
        </div>
      </section>
    </main>
  );
}
