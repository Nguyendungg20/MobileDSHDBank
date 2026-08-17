"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Progress bar — mirrors the Figma frame "Progress-bar" (id 3439:229400) on
 * page "❖ Progress bar" (nodeId 3439:229390). A linear determinate bar — NOT
 * the multi-step stepper in `progress-tracker.tsx` (a separate Figma page).
 *
 * Figma models exactly two standalone `COMPONENT` nodes — not a proper
 * variant set — named with this library's boolean-property convention (see
 * the porting checklist widget living on the same canvas: "name a boolean
 * True/False so it can be bound to a variable"): `Large=false`
 * (id 7416:77397) and `Large=true` (id 7416:86303). Mapped here to
 * `size="default" | "large"`.
 *
 * Both instances are baked examples of one specific HDBank use case (a
 * credit-limit / loan-balance meter: "Hạn mức" / "Dư nợ còn lại" + a VND
 * amount) rather than a bare bar — so the caption/value text nodes are
 * ported as optional `label` / `valueLabel` slots, not hard-coded copy.
 * There is no indeterminate/animated variant anywhere on this page — omitted.
 *
 * Anatomy read directly off the nodes (`fillStyleId`/`strokeStyleId` → style
 * NAME, not raw hex — see AGENTS.md):
 *
 *   - `default` track ("Container", 7416:77394): h4, cornerRadius 11 (over
 *     half the height, i.e. a true pill → `rounded-full`). Style "BG/Gray
 *     Medium" — `remote: true` (a foreign style, not one of this DS's named
 *     Styles), but its raw fill rgb(229,231,235) is an EXACT hex match to
 *     `--color-neutral-3` (#e5e7eb).
 *   - `default` fill ("Progress Bar" rect, 7416:77395): style "BG Gradient/
 *     Action" — `remote: true`, but its 5 gradient stops are pixel-identical
 *     to this DS's own `bg-brand-gradient-h` token (#da2128 0%→50%, #f9a61c
 *     75%, #f9c016 85%, ~#ffdd00 100%). No normalisation judgment call
 *     needed here — it already IS this design system's brand gradient,
 *     merely parented under a foreign style name in Figma.
 *   - `large` container (Large=true root, 7416:86303): h32, cornerRadius 8.
 *     Style "BG/Gray Light" — `remote: true`, raw rgb(243,244,246) is an
 *     EXACT match to `--color-neutral-2` (#f3f4f6). Border: style "Stroke/
 *     Dark O - Low" — `remote: true`, solid black at 5% opacity →
 *     `border-brand-black/5` (never bare `black` — it does not exist in this
 *     reset theme, see AGENTS.md).
 *   - `large` fill ("Active" rect, 7416:86295, `layoutPositioning: ABSOLUTE`
 *     so it ignores the root's own padding and bleeds full-height, clipped
 *     by the root's `rounded-8` + `clipsContent: true`): style "BG/liner" —
 *     `remote: true`. Its raw 2-stop gradient (~#F07676 → ~#FABA5C) is NOT a
 *     pixel match to any existing DS token — a genuinely different, lighter
 *     foreign gradient, with a second SOLID white-40%-opacity fill layered
 *     on top (a glossy sheen). Normalised to the SAME `bg-brand-gradient-h`
 *     token used by the default size, matching this component's own other
 *     variant (and Slider / Progress tracker / Pagination elsewhere in this
 *     port, per that convention). The white/40 sheen is kept as a real,
 *     independently-read design detail rather than folded into the
 *     normalisation. Flagged for the designer to wire up a real Style.
 *   - Text: "Text Black/Primary" (opacity 1, raw ~rgb(12,12,14)) and "Text
 *     Black/Secondary" (opacity 0.6, same raw color) — both `remote: true`.
 *     Normalised to `text-brand-black` / `text-brand-black/60` — this
 *     library's own primary-text convention is brand-black (#333333), "not
 *     pure black" (AGENTS.md), so the foreign near-pure-black raw value is
 *     not preserved.
 */

export type ProgressBarSize = "default" | "large";

export interface ProgressBarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** 0–100. Controlled — this component holds no internal state. */
  value: number;
  /** Figma: the component's own `Large` boolean. */
  size?: ProgressBarSize;
  /** Figma "Subtitle" (default) / "Label" (large) — caption text. */
  label?: ReactNode;
  /** Figma "Right Text" (default) / "Amount" (large) — value text. */
  valueLabel?: ReactNode;
}

// Determinate width transitions only — no indeterminate variant exists in
// Figma to animate, so this is the sole motion in the component.
const FILL_TRANSITION =
  "transition-[width] duration-300 ease-out motion-reduce:transition-none";

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  function ProgressBar(
    { value, size = "default", label, valueLabel, className, ...props },
    ref,
  ) {
    const clamped = Math.min(100, Math.max(0, value));
    const hasCaption = label != null || valueLabel != null;

    if (size === "large") {
      return (
        <div
          ref={ref}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          className={cn(
            "relative h-32 w-full overflow-hidden rounded-8",
            "border border-brand-black/5 bg-neutral-2",
            className,
          )}
          {...props}
        >
          <div
            aria-hidden
            className={cn(
              "absolute inset-y-0 left-0 overflow-hidden bg-brand-gradient-h",
              FILL_TRANSITION,
            )}
            style={{ width: `${clamped}%` }}
          >
            {/* Figma's second "BG/liner" fill layer: solid white, 40% opacity. */}
            <div className="absolute inset-0 bg-brand-white/40" />
          </div>
          {hasCaption && (
            <div className="relative z-10 flex h-full items-center justify-between gap-8 px-8">
              {label != null && (
                <span className="truncate text-caption1 font-semibold text-brand-black/60">
                  {label}
                </span>
              )}
              {valueLabel != null && (
                <span className="shrink-0 text-body font-semibold text-brand-black">
                  {valueLabel}
                </span>
              )}
            </div>
          )}
        </div>
      );
    }

    // default — Figma "Large=false": caption row above a 4px pill track.
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn("flex w-full flex-col gap-8", className)}
        {...props}
      >
        {hasCaption && (
          <div className="flex items-center justify-between gap-8">
            {label != null && (
              <span className="text-subheadline font-regular text-brand-black/60">
                {label}
              </span>
            )}
            {valueLabel != null && (
              <span className="shrink-0 text-subheadline font-regular text-brand-black">
                {valueLabel}
              </span>
            )}
          </div>
        )}
        <div aria-hidden className="h-4 w-full overflow-hidden rounded-full bg-neutral-3">
          <div
            className={cn("h-full rounded-full bg-brand-gradient-h", FILL_TRANSITION)}
            style={{ width: `${clamped}%` }}
          />
        </div>
      </div>
    );
  },
);
