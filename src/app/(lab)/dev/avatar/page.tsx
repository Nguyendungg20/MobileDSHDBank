"use client";

import { useState } from "react";
import { Avatar, type AvatarSize, type ZodiacAnimal } from "@/components/ui/avatar";

const SIZES: AvatarSize[] = ["large", "medium", "normal", "small", "xsmall"];

const ZODIACS: ZodiacAnimal[] = [
  "mouse",
  "buffalo",
  "tiger",
  "cat",
  "dragon",
  "snake",
  "horse",
  "goat",
  "monkey",
  "rooster",
  "dog",
  "pig",
];

// 1x1 solid-colour PNG data URI — stands in for a real photo without making
// an external request (not allowed in this preview).
const SOLID_BLOCK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="%23DA2128"/></svg>'.replace(
      /%23/g,
      "#",
    ),
  );

export default function AvatarDevPage() {
  const [broken, setBroken] = useState(false);

  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">Avatar — variant × size</h1>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Placeholder (Figma Type=Empty) — no fill, no border, person icon
        </h2>
        <div className="flex flex-wrap items-end gap-24 rounded-12 bg-neutral-1 p-16">
          {SIZES.map((size) => (
            <Avatar key={size} size={size} variant="placeholder" aria-label="No avatar set" />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Photo (Figma Type=User) — circular image, graceful fallback on error
        </h2>
        <p className="text-caption1 text-neutral-6">
          No external image requests in this preview — a solid-colour SVG data
          URI stands in for a photo. The rightmost avatar has a deliberately
          broken `src` to demonstrate the fallback to initials.
        </p>
        <div className="flex flex-wrap items-end gap-24 rounded-12 bg-neutral-1 p-16">
          {SIZES.map((size) => (
            <Avatar key={size} size={size} src={SOLID_BLOCK} alt="Nguyễn Văn A" />
          ))}
          <Avatar
            size="large"
            src={broken ? "https://broken.invalid/no-such-image.png" : SOLID_BLOCK}
            initials="NA"
            alt="Nguyễn Văn A"
          />
          <button
            type="button"
            onClick={() => setBroken((v) => !v)}
            className="text-caption1 text-brand-red underline"
          >
            {broken ? "fix src" : "break src →"}
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Initials (not a Figma Type — added for the src fallback chain)
        </h2>
        <div className="flex flex-wrap items-end gap-24 rounded-12 bg-neutral-1 p-16">
          {SIZES.map((size) => (
            <Avatar key={size} size={size} variant="initials" initials="ĐH" />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Bank (Figma Type=Bank) — Neutral/3 border, swappable logo slot
        </h2>
        <div className="flex flex-wrap items-end gap-24 rounded-12 bg-neutral-1 p-16">
          {SIZES.map((size) => (
            <Avatar key={size} size={size} variant="bank" aria-label="HDBank" />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Zodiac (Figma Type=Zodiac) — Orange/1 fill + white ring, 12 animals
        </h2>
        <div className="flex flex-wrap items-end gap-24 rounded-12 bg-neutral-1 p-16">
          {SIZES.map((size) => (
            <Avatar key={size} size={size} variant="zodiac" aria-label="Zodiac: mouse" />
          ))}
        </div>
        <div className="flex flex-wrap items-end gap-16 rounded-12 bg-neutral-1 p-16">
          {ZODIACS.map((z) => (
            <Avatar key={z} size="normal" variant="zodiac" zodiac={z} aria-label={`Zodiac: ${z}`} />
          ))}
        </div>
      </section>
    </main>
  );
}
