"use client";

import { useState, type ButtonHTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, type TooltipSide } from "@/components/ui/tooltip";

const SIDES: TooltipSide[] = ["bottom", "top", "left", "right"];

/**
 * Stand-in for the round "i" trigger the Figma doc frame describes as living
 * next to a field label — not itself a ported component.
 *
 * Spreads the rest of its props (`onMouseEnter`/`onFocus`/`aria-describedby`/…)
 * onto the underlying button — `Tooltip` reaches its trigger via `cloneElement`,
 * so any wrapper that doesn't forward those props silently breaks hover/focus.
 */
function InfoTrigger({
  label,
  ...props
}: { label: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label={label}
      className={
        "flex size-20 shrink-0 items-center justify-center rounded-full " +
        "bg-neutral-3 text-caption1 font-semibold text-neutral-7 outline-none " +
        "focus-visible:bg-neutral-4"
      }
      {...props}
    >
      i
    </button>
  );
}

export default function TooltipDevPage() {
  const [controlledOpen, setControlledOpen] = useState(false);

  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">
        Tooltip — Figma models one look, no variant axis
      </h1>
      <p className="max-w-[600px] text-caption1 text-neutral-6">
        The Figma page holds a single COMPONENT (no Type/Size/State axes).
        There is no arrow/pointer graphic anywhere on the page, and only one
        documented position: &quot;right below the info icon&quot;.
        `side` below is this port&apos;s own addition for the other three
        directions.
      </p>

      <section className="flex flex-col gap-16">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          side — hover or focus the trigger
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-64 rounded-12 bg-neutral-1 p-64">
          {SIDES.map((side) => (
            <Tooltip key={side} side={side} content={`Tooltip on the ${side}`}>
              <InfoTrigger label={`Info, ${side} tooltip`} />
            </Tooltip>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-16">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Real Figma copy — long text wraps at maxWidth 358
        </h2>
        <div className="flex flex-wrap items-center gap-12 rounded-12 bg-neutral-1 p-24">
          <span className="text-body text-brand-black">Sổ tiết kiệm</span>
          <Tooltip content="Lưu ý: Sổ tiết kiệm đến ngày đáo hạn sẽ được tự động tất toán để thu hồi nợ vay">
            <InfoTrigger label="Thông tin sổ tiết kiệm" />
          </Tooltip>
        </div>
      </section>

      <section className="flex flex-col gap-16">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          icon — Figma always shows it; `false` is this port&apos;s own option
        </h2>
        <div className="flex flex-wrap items-center gap-24 rounded-12 bg-neutral-1 p-24">
          <Tooltip content="This is a tooltip! With the default Info icon.">
            <InfoTrigger label="With icon" />
          </Tooltip>
          <Tooltip content="No icon variant — not modelled in Figma." icon={false}>
            <InfoTrigger label="Without icon" />
          </Tooltip>
        </div>
      </section>

      <section className="flex flex-col gap-16">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Trigger can be any focusable element
        </h2>
        <div className="flex flex-wrap items-center gap-24 rounded-12 bg-neutral-1 p-24">
          <Tooltip content="Works on a Button trigger too.">
            <Button size="small" variant="secondary">
              Hover me
            </Button>
          </Tooltip>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Controlled
        </h2>
        <div className="flex flex-wrap items-center gap-16 rounded-12 bg-neutral-1 p-24">
          <Tooltip
            content="Controlled open state."
            open={controlledOpen}
            onOpenChange={setControlledOpen}
          >
            <InfoTrigger label="Controlled tooltip" />
          </Tooltip>
          <Button size="x-small" variant="tertiary" onClick={() => setControlledOpen((o) => !o)}>
            Toggle
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Keyboard — Tab to focus, Escape to dismiss
        </h2>
        <p className="text-caption1 text-neutral-6">
          Tab to the trigger below to open via focus; press Escape to close
          and return focus to the trigger.
        </p>
        <div className="flex flex-wrap items-center gap-24 rounded-12 bg-neutral-1 p-24">
          <Tooltip content="Focus-visible tooltip.">
            <InfoTrigger label="Focus me" />
          </Tooltip>
        </div>
      </section>
    </main>
  );
}
