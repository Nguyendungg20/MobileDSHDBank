"use client";

import { useState } from "react";
import { Keyboard } from "@/components/ui/keyboard";

export default function KeyboardDevPage() {
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [typed, setTyped] = useState("");

  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">Keyboard</h1>
      <p className="text-caption1 text-neutral-6">
        Figma page &quot;❖ Keyboard&quot;, nodeId 1630:419002 — an on-screen
        iOS system-keyboard mockup. Only the numeric pad (Type=custom) is
        ported at full fidelity; QWERTY is best-effort, lowercase only, no
        Shift/Caps/Numbers/Symbols state switching. See the component&apos;s
        doc comment for the full list of foreign (non-DS) styles this page is
        built from and how each was mapped to a real token.
      </p>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Numeric — amount entry (custom grid + quick-add amount strip, iOS-blue
          action key)
        </h2>
        <div className="flex flex-col items-center gap-16 rounded-12 bg-neutral-1 p-16">
          <div className="text-title2 font-semibold">
            {amount ? Number(amount).toLocaleString("vi-VN") : "0"}
            <span className="text-neutral-6"> đ</span>
          </div>
          <Keyboard
            variant="numeric"
            quickAmounts={[
              { label: "100.000", value: "100000" },
              { label: "1.000.000", value: "1000000" },
              { label: "10.000.000", value: "10000000" },
            ]}
            actionLabel="Tiếp"
            onKeyPress={(k) => setAmount((v) => v + k)}
            onBackspace={() => setAmount((v) => v.slice(0, -1))}
            onAction={() => setAmount("")}
          />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Numeric — action disabled (Figma Enter-key State=Active?=no)
        </h2>
        <div className="flex flex-col items-center gap-16 rounded-12 bg-neutral-1 p-16">
          <Keyboard variant="numeric" actionEnabled={false} actionLabel="Xác nhận" />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Numeric — bare PIN pad (custom `keys` grid, blank corners)
        </h2>
        <div className="flex flex-col items-center gap-16 rounded-12 bg-neutral-1 p-16">
          <div className="flex gap-8">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="size-16 rounded-full border border-neutral-5"
                style={{
                  background: i < pin.length ? "var(--color-brand-red)" : "transparent",
                }}
              />
            ))}
          </div>
          <Keyboard
            variant="numeric"
            keys={[
              ["1", "2", "3"],
              ["4", "5", "6"],
              ["7", "8", "9"],
              ["", "0", ""],
            ]}
            actionLabel="OK"
            onKeyPress={(k) => setPin((v) => (v.length < 6 ? v + k : v))}
            onBackspace={() => setPin((v) => v.slice(0, -1))}
          />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          QWERTY (best-effort — lowercase only)
        </h2>
        <div className="flex flex-col items-center gap-16 overflow-x-auto rounded-12 bg-neutral-1 p-16">
          <div className="min-h-24 w-full max-w-[400px] rounded-8 border border-neutral-3 bg-brand-white px-12 py-8 text-body">
            {typed || <span className="text-neutral-5">Type something…</span>}
          </div>
          <Keyboard
            variant="qwerty"
            onKeyPress={(k) => setTyped((v) => v + k)}
            onBackspace={() => setTyped((v) => v.slice(0, -1))}
          />
        </div>
      </section>
    </main>
  );
}
