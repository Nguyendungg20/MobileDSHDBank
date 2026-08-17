"use client";

import { useState } from "react";
import { Select, type SelectOption } from "@/components/ui/select";

const SIMPLE_OPTIONS: SelectOption[] = [
  { value: "vcb", label: "Vietcombank" },
  { value: "tcb", label: "Techcombank" },
  { value: "hdb", label: "HDBank" },
  { value: "mb", label: "MB Bank", disabled: true },
];

const RICH_OPTIONS: SelectOption[] = [
  {
    value: "checking",
    header: "0987 653 332",
    label: "Tài khoản thanh toán",
  },
  {
    value: "savings",
    header: "1992 000 8",
    label: "Tài khoản tiết kiệm",
    subText: "Bao gồm 3,000,000 VND hạn mức thấu chi",
  },
  {
    value: "visa",
    header: "VISA *1234",
    label: "Thẻ tín dụng",
  },
];

export default function SelectDevPage() {
  const [bank, setBank] = useState<string | undefined>(undefined);
  const [account, setAccount] = useState<string | undefined>("checking");
  const [disabledValue] = useState<string | undefined>("vcb");
  const [errorValue, setErrorValue] = useState<string | undefined>(undefined);

  return (
    <main className="mx-auto flex w-full max-w-[500px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">Select Dropdown</h1>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Default — placeholder / with label / selected
        </h2>
        <div className="flex flex-col gap-16 rounded-12 bg-neutral-1 p-16">
          <Select
            options={SIMPLE_OPTIONS}
            value={bank}
            onChange={setBank}
            placeholder="Chọn ngân hàng"
          />
          <Select
            options={SIMPLE_OPTIONS}
            value={bank}
            onChange={setBank}
            label="Ngân hàng"
            placeholder="Chọn ngân hàng"
          />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Rich options — icon slot, header/label/sub-text, Radio control (Figma
          &quot;Bottom-sheet / Select-source-account&quot; pattern)
        </h2>
        <div className="flex flex-col gap-16 rounded-12 bg-neutral-1 p-16">
          <Select
            options={RICH_OPTIONS}
            value={account}
            onChange={setAccount}
            label="Tài khoản trích tiền"
            icon={
              <span className="flex size-40 items-center justify-center rounded-full bg-orange-6 text-caption1 font-semibold text-brand-white">
                HD
              </span>
            }
          />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Disabled
        </h2>
        <div className="flex flex-col gap-16 rounded-12 bg-neutral-1 p-16">
          <Select
            options={SIMPLE_OPTIONS}
            value={disabledValue}
            label="Ngân hàng"
            disabled
          />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Error — not a traced Figma state, this DS&apos;s general convention
        </h2>
        <div className="flex flex-col gap-16 rounded-12 bg-neutral-1 p-16">
          <Select
            options={SIMPLE_OPTIONS}
            value={errorValue}
            onChange={setErrorValue}
            label="Ngân hàng"
            placeholder="Chọn ngân hàng"
            error
            errorText="Vui lòng chọn ngân hàng"
          />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Keyboard
        </h2>
        <p className="text-caption1 text-neutral-6">
          Tab to a trigger, Enter/Space or ↓/↑ to open, arrow keys to move
          between options, Enter/Space to pick, Escape to close.
        </p>
        <div className="flex flex-col gap-16 rounded-12 bg-neutral-1 p-16">
          <Select options={SIMPLE_OPTIONS} placeholder="Focus me, then press Enter" />
        </div>
      </section>
    </main>
  );
}
