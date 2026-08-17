"use client";

import { useState } from "react";
import { Picker, type PickerOption } from "@/components/ui/picker";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { ListItem } from "@/components/ui/list-item";

const DISTRICTS: PickerOption[] = [
  "Quận 1",
  "Quận 3",
  "Quận 4",
  "Quận 5",
  "Quận 7",
  "Quận Phú Nhuận",
  "Quận Bình Thạnh",
  "Quận Tân Bình",
  "Quận Gò Vấp",
].map((label) => ({ value: label, label }));

const DAYS: PickerOption[] = Array.from({ length: 31 }, (_, i) => {
  const v = String(i + 1).padStart(2, "0");
  return { value: v, label: v };
});
const MONTHS: PickerOption[] = Array.from({ length: 12 }, (_, i) => {
  const v = `Tháng ${i + 1}`;
  return { value: String(i + 1), label: v };
});
const YEARS: PickerOption[] = Array.from({ length: 100 }, (_, i) => {
  const v = String(2026 - i);
  return { value: v, label: v };
});

const HOURS: PickerOption[] = Array.from({ length: 12 }, (_, i) => {
  const v = String(i + 1).padStart(2, "0");
  return { value: v, label: v };
});
const MINUTES: PickerOption[] = Array.from({ length: 60 }, (_, i) => {
  const v = String(i).padStart(2, "0");
  return { value: v, label: v };
});
const PERIODS: PickerOption[] = [
  { value: "AM", label: "SA" },
  { value: "PM", label: "CH" },
];

export default function PickerDevPage() {
  const [district, setDistrict] = useState("Quận 5");
  const [day, setDay] = useState("15");
  const [month, setMonth] = useState("8");
  const [year, setYear] = useState("2026");
  const [hour, setHour] = useState("09");
  const [minute, setMinute] = useState("30");
  const [period, setPeriod] = useState("AM");

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetDistrict, setSheetDistrict] = useState("Quận 1");

  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <div className="flex flex-col gap-4">
        <h1 className="text-title2 font-semibold">Picker — wheel column</h1>
        <p className="text-caption1 text-neutral-6">
          Figma&apos;s ❖ Pickers page models the wheel as a native scroll list —
          this port uses real <code>overflow-y-auto</code> + scroll-snap, so it
          responds to mouse wheel, drag, and touch, and is keyboard-operable
          (Tab to focus, Arrow Up/Down, Home/End). Only the single wheel column
          is a ported component; multi-column layouts below are plain
          compositions of it, matching how Figma itself reuses the same row
          instances across its Time/Date picker types.
        </p>
      </div>

      {/* Single column — mirrors Type=district */}
      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Single column (Figma &quot;Type=district&quot;)
        </h2>
        <div className="flex flex-col items-center gap-8 rounded-12 bg-neutral-1 p-16">
          <Picker
            aria-label="Chọn quận"
            options={DISTRICTS}
            value={district}
            onChange={setDistrict}
            className="w-[240px]"
          />
          <p className="text-caption1 text-neutral-6">
            Selected: <span className="text-brand-black">{district}</span>
          </p>
        </div>
      </section>

      {/* Multi-column — Day / Month / Year, mirrors Type=date */}
      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          3-column composition (Figma &quot;Type=date&quot;)
        </h2>
        <div className="flex flex-col items-center gap-8 rounded-12 bg-neutral-1 p-16">
          <div className="relative flex w-[300px]">
            <Picker
              aria-label="Ngày"
              options={DAYS}
              value={day}
              onChange={setDay}
              className="flex-1"
            />
            <Picker
              aria-label="Tháng"
              options={MONTHS}
              value={month}
              onChange={setMonth}
              className="flex-[1.4]"
            />
            <Picker
              aria-label="Năm"
              options={YEARS}
              value={year}
              onChange={setYear}
              className="flex-1"
            />
          </div>
          <p className="text-caption1 text-neutral-6">
            Selected:{" "}
            <span className="text-brand-black">
              {day}/{month}/{year}
            </span>
          </p>
        </div>
      </section>

      {/* Multi-column — Hour / Minute / AM-PM, mirrors Type=iOS Time Picker */}
      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          3-column composition (Figma &quot;Type=iOS Time Picker&quot;)
        </h2>
        <div className="flex flex-col items-center gap-8 rounded-12 bg-neutral-1 p-16">
          <div className="relative flex w-[240px]">
            <Picker
              aria-label="Giờ"
              options={HOURS}
              value={hour}
              onChange={setHour}
              className="flex-1"
            />
            <Picker
              aria-label="Phút"
              options={MINUTES}
              value={minute}
              onChange={setMinute}
              className="flex-1"
            />
            <Picker
              aria-label="Sáng/Chiều"
              options={PERIODS}
              value={period}
              onChange={setPeriod}
              visibleRows={7}
              className="flex-1"
            />
          </div>
          <p className="text-caption1 text-neutral-6">
            Selected:{" "}
            <span className="text-brand-black">
              {hour}:{minute} {period}
            </span>
          </p>
        </div>
      </section>

      {/* Row-count / item-height variants */}
      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          visibleRows — 5 vs Figma&apos;s default 7
        </h2>
        <div className="flex flex-wrap items-start justify-center gap-24 rounded-12 bg-neutral-1 p-16">
          <div className="flex flex-col items-center gap-4">
            <p className="text-caption1 text-neutral-6">visibleRows=7 (default)</p>
            <Picker
              aria-label="Quận (7 rows)"
              options={DISTRICTS}
              defaultValue="Quận 5"
              className="w-[200px]"
            />
          </div>
          <div className="flex flex-col items-center gap-4">
            <p className="text-caption1 text-neutral-6">visibleRows=5</p>
            <Picker
              aria-label="Quận (5 rows)"
              options={DISTRICTS}
              defaultValue="Quận 5"
              visibleRows={5}
              className="w-[200px]"
            />
          </div>
        </div>
      </section>

      {/* Composed inside a real Bottom-sheet — mirrors Figma's own
          "Template / Pickers" usage example (node 13935:16659): Header +
          List Item rows + a Picker column + a Button Group footer. */}
      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Composed in a Bottom-sheet (Figma &quot;Template / Pickers&quot;)
        </h2>
        <div className="flex flex-wrap gap-12 rounded-12 bg-neutral-1 p-16">
          <Button onClick={() => setSheetOpen(true)}>Chọn khu vực</Button>
        </div>
        <BottomSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          title="Khu vực"
        >
          <ListItem variant="input" label="Thành phố" value="TP. Hồ Chí Minh" />
          <Picker
            aria-label="Chọn quận"
            options={DISTRICTS}
            value={sheetDistrict}
            onChange={setSheetDistrict}
          />
          <div className="flex gap-8 pt-16">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setSheetDistrict("Quận 1")}
            >
              Đặt lại
            </Button>
            <Button fullWidth onClick={() => setSheetOpen(false)}>
              Lưu
            </Button>
          </div>
        </BottomSheet>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Keyboard focus
        </h2>
        <p className="text-caption1 text-neutral-6">
          Tab to the wheel below, then use Arrow Up/Down or Home/End. Figma
          draws no focus treatment for Picker, so this keeps the browser&apos;s
          own default focus ring rather than inventing one.
        </p>
        <div className="flex justify-center rounded-12 bg-neutral-1 p-16">
          <Picker
            aria-label="Focus me"
            options={DISTRICTS}
            defaultValue="Quận 1"
            className="w-[200px]"
          />
        </div>
      </section>
    </main>
  );
}
