"use client";

import { useState } from "react";
import { Chip, type ChipSize } from "@/components/ui/chip";

const SIZES: ChipSize[] = ["small", "large"];

const ChevronDown = () => (
  <svg className="size-16" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StarIcon = () => (
  <svg className="size-40" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 3l2.6 5.8 6.4.6-4.8 4.3 1.4 6.3L12 16.9 6.4 20l1.4-6.3-4.8-4.3 6.4-.6L12 3z"
      fill="currentColor"
    />
  </svg>
);

export default function ChipDevPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1000px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">Chip — states × sizes × surfaces</h1>

      {SIZES.map((size) => (
        <section key={size} className="flex flex-col gap-24">
          <h2 className="text-subheadline font-semibold text-neutral-7">
            Size={size}
          </h2>

          <div className="flex flex-col gap-12">
            <span className="text-caption1 text-neutral-6">
              On White-bg?=false (over the brand gradient)
            </span>
            <div className="flex flex-wrap items-center gap-16 rounded-12 bg-brand-gradient-h p-16">
              <StateRow size={size} onWhiteBg={false} />
            </div>
          </div>

          <div className="flex flex-col gap-12">
            <span className="text-caption1 text-neutral-6">
              On White-bg?=true
            </span>
            <div className="flex flex-wrap items-center gap-16 rounded-12 bg-neutral-1 p-16">
              <StateRow size={size} onWhiteBg={true} />
            </div>
          </div>
        </section>
      ))}

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Trailing icon (dropdown affordance) — small
        </h2>
        <div className="flex flex-wrap items-center gap-12 rounded-12 bg-neutral-1 p-16">
          <Chip trailingIcon={<ChevronDown />}>Bộ lọc</Chip>
          <Chip selected trailingIcon={<ChevronDown />}>
            Bộ lọc
          </Chip>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Removable — small
        </h2>
        <div className="flex flex-wrap items-center gap-12 rounded-12 bg-neutral-1 p-16">
          <RemovableDemo />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Large with header / subtext / leading icon
        </h2>
        <div className="flex flex-wrap items-start gap-12 rounded-12 bg-neutral-1 p-16">
          <Chip
            size="large"
            leadingIcon={<StarIcon />}
            header="Hạng thành viên"
            subtext="Áp dụng đến 31/12"
          >
            Kim Cương
          </Chip>
          <Chip
            size="large"
            selected
            leadingIcon={<StarIcon />}
            header="Hạng thành viên"
            subtext="Áp dụng đến 31/12"
          >
            Kim Cương
          </Chip>
          <Chip
            size="large"
            disabled
            leadingIcon={<StarIcon />}
            header="Hạng thành viên"
            subtext="Áp dụng đến 31/12"
          >
            Kim Cương
          </Chip>
        </div>
      </section>
    </main>
  );
}

function StateRow({ size, onWhiteBg }: { size: ChipSize; onWhiteBg: boolean }) {
  if (size === "large") {
    const common = {
      size: "large" as const,
      onWhiteBg,
      leadingIcon: <StarIcon />,
      header: "Header-txt",
      subtext: "Sub-txt",
    };
    return (
      <>
        <Chip {...common}>Default</Chip>
        <Chip {...common} selected>
          Selected
        </Chip>
        <Chip {...common} disabled>
          Disabled
        </Chip>
      </>
    );
  }
  return (
    <>
      <Chip size={size} onWhiteBg={onWhiteBg}>
        Default
      </Chip>
      <Chip size={size} onWhiteBg={onWhiteBg} selected>
        Selected
      </Chip>
      <Chip size={size} onWhiteBg={onWhiteBg} disabled>
        Disabled
      </Chip>
    </>
  );
}

function RemovableDemo() {
  const [chips, setChips] = useState(["Hà Nội", "Hồ Chí Minh", "Đà Nẵng"]);
  return (
    <>
      {chips.map((label) => (
        <Chip
          key={label}
          onRemove={() =>
            setChips((prev) => prev.filter((c) => c !== label))
          }
          removeLabel={`Xóa ${label}`}
        >
          {label}
        </Chip>
      ))}
      {chips.length === 0 && (
        <span className="text-caption1 text-neutral-6">
          All chips removed — reload to reset.
        </span>
      )}
    </>
  );
}
