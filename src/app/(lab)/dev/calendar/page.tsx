"use client";

import { useState } from "react";
import { Calendar, type CalendarRangeValue } from "@/components/ui/calendar";

function formatDate(d: Date | null) {
  if (!d) return "—";
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function CalendarDevPage() {
  const [single, setSingle] = useState<Date | null>(new Date(2026, 7, 17));
  const [singleMonth, setSingleMonth] = useState<Date>(new Date(2026, 7, 1));

  const [range, setRange] = useState<CalendarRangeValue>({
    start: new Date(2026, 7, 4),
    end: new Date(2026, 7, 10),
  });
  const [rangeMonth, setRangeMonth] = useState<Date>(new Date(2026, 7, 1));

  const today = new Date();
  const [bounded, setBounded] = useState<Date | null>(null);
  const min = new Date(today.getFullYear(), today.getMonth(), 3);
  const max = new Date(today.getFullYear(), today.getMonth(), 24);

  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">Date Picker — calendar grid</h1>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Single date (controlled) — selected: {formatDate(single)}
        </h2>
        <p className="text-caption1 text-neutral-6">
          Click a day, use prev/next to cross a month boundary, or Tab in and use arrow keys +
          Enter.
        </p>
        <div className="w-fit rounded-12 bg-neutral-1 p-16">
          <Calendar
            value={single}
            onChange={setSingle}
            month={singleMonth}
            onMonthChange={setSingleMonth}
          />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Range (Figma &quot;Has Range?=true&quot;) — {formatDate(range.start)} →{" "}
          {formatDate(range.end)}
        </h2>
        <p className="text-caption1 text-neutral-6">
          First click sets the start, second sets the end (or restarts if before the start).
        </p>
        <div className="w-fit rounded-12 bg-neutral-1 p-16">
          <Calendar
            mode="range"
            rangeValue={range}
            onRangeChange={setRange}
            month={rangeMonth}
            onMonthChange={setRangeMonth}
          />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          min / max — selected: {formatDate(bounded)}
        </h2>
        <p className="text-caption1 text-neutral-6">
          Days before the 3rd or after the 24th of the current month are disabled (Neutral/4,
          inferred — not a Figma variant, see the component doc comment).
        </p>
        <div className="w-fit rounded-12 bg-neutral-1 p-16">
          <Calendar value={bounded} onChange={setBounded} min={min} max={max} />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">Uncontrolled month</h2>
        <p className="text-caption1 text-neutral-6">
          No <code>month</code>/<code>onMonthChange</code> passed — the component tracks its own
          displayed month, defaulting to the selection&apos;s (or today&apos;s) month.
        </p>
        <div className="w-fit rounded-12 bg-neutral-1 p-16">
          <Calendar />
        </div>
      </section>
    </main>
  );
}
