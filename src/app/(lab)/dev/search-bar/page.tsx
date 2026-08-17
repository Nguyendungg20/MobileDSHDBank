"use client";

import { useState } from "react";
import { SearchBar, type SearchBarVariant } from "@/components/ui/search-bar";

const VARIANTS: SearchBarVariant[] = ["solid", "outlined"];

export default function SearchBarDevPage() {
  const [controlled, setControlled] = useState("");

  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">Search Bar — states × styles</h1>

      {VARIANTS.map((variant) => (
        <section key={variant} className="flex flex-col gap-12">
          <h2 className="text-subheadline font-semibold text-neutral-7">
            {variant}
          </h2>
          <div className="flex flex-col gap-16 rounded-12 bg-neutral-1 p-16">
            <div className="flex flex-col gap-4">
              <span className="text-caption1 text-neutral-6">default</span>
              <SearchBar variant={variant} label="Search" className="max-w-[343px]" />
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-caption1 text-neutral-6">
                filled (has value, not focused)
              </span>
              <SearchBar
                variant={variant}
                label="Search"
                defaultValue="Hanoi"
                className="max-w-[343px]"
              />
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-caption1 text-neutral-6">disabled (inferred, not in Figma)</span>
              <SearchBar
                variant={variant}
                label="Search"
                disabled
                className="max-w-[343px]"
              />
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-caption1 text-neutral-6">
                disabled, filled (inferred, not in Figma)
              </span>
              <SearchBar
                variant={variant}
                label="Search"
                disabled
                defaultValue="Hanoi"
                className="max-w-[343px]"
              />
            </div>
          </div>
        </section>
      ))}

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Focus / typing — tab in, then type
        </h2>
        <p className="text-caption1 text-neutral-6">
          Focus with an empty value shows the orange caret (no value text yet,
          Figma state &quot;focus&quot;). Type a character to hit &quot;typing&quot;
          — typed text turns Brand/Solid/Black and the clear (×) button
          appears. Blur while filled to see the &quot;filled&quot; state: the
          clear button disappears again, matching Figma&apos;s visibility
          override exactly.
        </p>
        <div className="flex flex-col gap-16 rounded-12 bg-neutral-1 p-16">
          <SearchBar
            label="Search (uncontrolled)"
            placeholder="Search"
            className="max-w-[343px]"
          />
          <SearchBar
            variant="outlined"
            label="Search (uncontrolled, outlined)"
            placeholder="Search"
            className="max-w-[343px]"
          />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Controlled
        </h2>
        <div className="flex flex-col gap-8 rounded-12 bg-neutral-1 p-16">
          <SearchBar
            label="Controlled search"
            value={controlled}
            onChange={(e) => setControlled(e.target.value)}
            className="max-w-[343px]"
          />
          <p className="text-caption1 text-neutral-6">
            value: <span className="font-medium">{controlled || "(empty)"}</span>
          </p>
        </div>
      </section>
    </main>
  );
}
