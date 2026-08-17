"use client";

import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Slider — mirrors the Figma page "❖ Slider" (fileKey 3wFivMDO6P0heqk4YPLJQF,
 * node 2678:220840). Figma component-set description (verbatim): "slider, drag,
 * handle".
 *
 * Anatomy, read off the actual nodes rather than guessed:
 *
 * The reusable primitive is the private component set `.Slider-item`
 * (node 2678:220848, dot-prefixed = internal per this library's convention),
 * with a single variant axis:
 *   range? = no  (2678:220855) → one thumb  → exported here as `Slider`
 *   range? = yes (2678:220849) → two thumbs → exported here as `SliderRange`
 * There is no Size or State axis on this component set — Figma ships exactly
 * one size, and no hover/pressed/focus/disabled variant is modelled at all.
 * `disabled` below is therefore this port's own defensive addition (existing
 * neutral tokens only, no new colour), not something read off Figma.
 *
 * Geometry (`range?=no`, 342×16 nominal, scales fluid in practice — the
 * separate "Slider" demo instance shrinks the same component to 286px wide):
 *   Track: full width, 4px tall, cornerRadius 4 (== half its own height, i.e.
 *     a pill) → `rounded-full`.
 *   Highlight (the filled portion): same 4px pill, drawn from the left edge to
 *     the thumb's centre.
 *   Thumb: 20×20 circle, vertically centred on the track's centreline (track
 *     top 6 + half of 4 == thumb top -2 + half of 20 == 8), white fill, a
 *     two-layer drop shadow (0 6px 13px black/12%, 0 0.5px 4px black/12%).
 *
 * Colour provenance — flagged, not guessed:
 *   The track's inactive grey (raw, unstyled #F2F2F4) has no named Figma style
 *   and doesn't exactly match any token, but sits within 1-2 units of
 *   `neutral-2` (#F3F4F6) on every channel — near-certainly a hand-picked value
 *   that was meant to be neutral-2 and mapped here accordingly.
 *   The active/filled colour is raw, unstyled #BE1128 — NOT this DS's
 *   `brand-red` (#DA2128). It exactly matches the outer component-set frame's
 *   selection-border colour, which DOES carry a named style: "Brand/Red",
 *   flagged `remote: true` by the Figma API — i.e. a foreign style leaked in
 *   from another file/library (see AGENTS.md "read-only workaround" +
 *   the project's "foreign Colors leak" note), not a token of this design
 *   system. Per that convention this is mapped to the DS's own `brand-red`
 *   (`red-6`, #DA2128) rather than reproduced as a literal #BE1128 or turned
 *   into a new token. Flag for the designer to purge/repaint in Figma.
 *   The thumb fill is plain white → `brand-white`.
 *   The thumb's two-layer shadow (0 6px 13px black/12%, 0 0.5px 4px black/12%)
 *   doesn't match any of this DS's shadow-1..5 elevation styles (same
 *   situation as Switch's thumb shadow) — kept as an arbitrary value rather
 *   than forced onto the wrong token.
 *
 * Optional value / min-max captions:
 *   The top-level "Slider" demo component (4827:2714, a compound example that
 *   also pairs a `.Slider-item` with a numeric "---Input" field for a
 *   loan-term picker — that Input pairing is out of scope for this port, not
 *   reproduced) exposes real, documented boolean component properties "Show
 *   value" and "Show min-max" (both default `true` in that demo). Modelled
 *   here as `showValue`/`showMinMax` — defaulted to `false` in code, since a
 *   bare track+thumb is the more common composition and the demo's `true`
 *   default reads as specific to that one loan-term usage, not a general
 *   Slider default. The value label read raw SF Pro Medium 14 in the same
 *   foreign red flagged above → mapped to `text-subheadline font-medium
 *   text-brand-red`. The min/max captions read raw SF Pro Regular 12, fill
 *   #333333 which IS an exact match for `brand-black` → mapped to
 *   `text-caption1 font-regular text-brand-black`. SF Pro itself is a foreign
 *   font (this DS is Be Vietnam Pro throughout) and is not carried over.
 *
 * Interaction: a native `<input type="range">` drives drag + keyboard (arrow
 * keys, Home/End, Page Up/Down) and the implicit ARIA slider role/
 * aria-valuemin/max/now for free. The visible track/fill/thumb are drawn via
 * `::-webkit-slider-runnable-track` / `::-webkit-slider-thumb` and their
 * Firefox equivalents (`::-moz-range-track` / `::-moz-range-progress` /
 * `::-moz-range-thumb`), fed by CSS custom properties set in the element's
 * inline `style` (custom properties inherit into pseudo-elements; regular
 * inline `style` does not reach them). No focus ring is added — Figma draws
 * none, and per this DS's convention (see Checkbox/Switch) the native input
 * is left un-hidden by `outline-none`, so the browser's own default
 * focus-visible ring simply draws around the control's real hit area, the
 * same "borrow the native affordance instead of inventing one" choice made
 * there.
 */

const THUMB_SHADOW =
  "shadow-[0_6px_13px_rgba(0,0,0,0.12),0_0.5px_4px_rgba(0,0,0,0.12)]";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const percentOf = (value: number, min: number, max: number) =>
  max === min ? 0 : ((clamp(value, min, max) - min) / (max - min)) * 100;

/** Shared pseudo-element recipe for the single-thumb `<input type="range">`.
 *  The visible fill is a `linear-gradient` on the WebKit runnable track,
 *  split at `var(--slider-percent)`; Firefox gets it for free via the real
 *  `::-moz-range-progress` pseudo-element. */
const TRACK_INPUT = cn(
  "relative z-10 h-20 w-full cursor-pointer touch-none appearance-none bg-transparent",
  "disabled:cursor-not-allowed",
  // WebKit runnable track — draws track + fill as one gradient.
  "[&::-webkit-slider-runnable-track]:h-4 [&::-webkit-slider-runnable-track]:rounded-full",
  "[&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,var(--slider-fill)_0%,var(--slider-fill)_var(--slider-percent),var(--slider-track)_var(--slider-percent),var(--slider-track)_100%)]",
  // WebKit thumb.
  "[&::-webkit-slider-thumb]:mt-[-8px] [&::-webkit-slider-thumb]:size-20",
  "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full",
  "[&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:bg-brand-white",
  "[&::-webkit-slider-thumb]:cursor-pointer",
  `[&::-webkit-slider-thumb]:${THUMB_SHADOW}`,
  "disabled:[&::-webkit-slider-thumb]:cursor-not-allowed disabled:[&::-webkit-slider-thumb]:opacity-70",
  // Firefox track/progress/thumb.
  "[&::-moz-range-track]:h-4 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-[var(--slider-track)]",
  "[&::-moz-range-progress]:h-4 [&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:bg-[var(--slider-fill)]",
  "[&::-moz-range-thumb]:size-20 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0",
  "[&::-moz-range-thumb]:bg-brand-white [&::-moz-range-thumb]:cursor-pointer",
  `[&::-moz-range-thumb]:${THUMB_SHADOW}`,
  "disabled:[&::-moz-range-thumb]:cursor-not-allowed disabled:[&::-moz-range-thumb]:opacity-70",
  // Firefox draws its own dotted focus box around the whole control by default.
  "[&::-moz-focus-outer]:border-0",
);

function cssVars(vars: Record<string, string>) {
  return vars as React.CSSProperties;
}

export interface SliderProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "defaultValue" | "size"
  > {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  /** Fires with the new value, alongside the native onChange. */
  onValueChange?: (value: number) => void;
  /** Figma: "Show value" boolean — the read-out above the track. Off by
   *  default here; see the doc comment above for why. */
  showValue?: boolean;
  /** Formats the value shown above the track. Defaults to the raw number. */
  formatValue?: (value: number) => ReactNode;
  /** Figma: "Show min-max" boolean — captions under the track's two ends. */
  showMinMax?: boolean;
  minLabel?: ReactNode;
  maxLabel?: ReactNode;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  function Slider(
    {
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue = min,
      onChange,
      onValueChange,
      showValue = false,
      formatValue,
      showMinMax = false,
      minLabel,
      maxLabel,
      disabled = false,
      className,
      ...props
    },
    ref,
  ) {
    // Mirrors Switch/Checkbox: track the value in React so the fill gradient
    // is deterministic for both controlled and uncontrolled usage.
    const [uncontrolled, setUncontrolled] = useState(defaultValue);
    const isControlled = value !== undefined;
    const current = isControlled ? value : uncontrolled;
    const percent = percentOf(current, min, max);

    return (
      <div className={cn("w-full", className)}>
        {showValue && (
          <div className="mb-8 text-center text-subheadline font-medium text-brand-red">
            {formatValue ? formatValue(current) : current}
          </div>
        )}
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={current}
          disabled={disabled}
          onChange={(e) => {
            const next = Number(e.target.value);
            if (!isControlled) setUncontrolled(next);
            onChange?.(e);
            onValueChange?.(next);
          }}
          className={TRACK_INPUT}
          style={cssVars({
            "--slider-percent": `${percent}%`,
            "--slider-fill": disabled
              ? "var(--color-neutral-4)"
              : "var(--color-brand-red)",
            "--slider-track": "var(--color-neutral-2)",
          })}
          {...props}
        />
        {showMinMax && (
          <div className="mt-8 flex items-center justify-between text-caption1 font-regular text-brand-black">
            <span>{minLabel ?? min}</span>
            <span>{maxLabel ?? max}</span>
          </div>
        )}
      </div>
    );
  },
);

/**
 * SliderRange — the `range?=yes` variant (2678:220849): the same track, with
 * a filled segment between two thumbs ("Knob Leading" / "Knob Trailing" in
 * Figma, both identical 20×20 circles) instead of one thumb from the edge.
 *
 * Built from two overlapping native `<input type="range">`s (the standard
 * accessible technique for a dual-handle slider — a single native input can
 * only ever report one value): each input is `pointer-events-none` except on
 * its own `::-webkit-slider-thumb`/`::-moz-range-thumb`, so clicks pass
 * through the transparent parts of whichever input is on top straight to the
 * thumb underneath, while each thumb keeps independent drag + keyboard
 * support. The shared track and the between-thumbs fill are drawn once, in
 * plain divs, behind both inputs.
 */
export interface SliderRangeProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "defaultValue" | "onChange" | "size"
  > {
  min?: number;
  max?: number;
  step?: number;
  value?: [number, number];
  defaultValue?: [number, number];
  onValueChange?: (value: [number, number]) => void;
  disabled?: boolean;
  className?: string;
}

const RANGE_THUMB_INPUT = cn(
  "pointer-events-none absolute inset-x-0 top-1/2 h-20 w-full -translate-y-1/2",
  "cursor-pointer touch-none appearance-none bg-transparent",
  "disabled:cursor-not-allowed",
  "[&::-webkit-slider-runnable-track]:bg-transparent",
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:mt-[-8px]",
  "[&::-webkit-slider-thumb]:size-20 [&::-webkit-slider-thumb]:appearance-none",
  "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-0",
  "[&::-webkit-slider-thumb]:bg-brand-white [&::-webkit-slider-thumb]:cursor-pointer",
  `[&::-webkit-slider-thumb]:${THUMB_SHADOW}`,
  "disabled:[&::-webkit-slider-thumb]:cursor-not-allowed disabled:[&::-webkit-slider-thumb]:opacity-70",
  "[&::-moz-range-track]:bg-transparent",
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-20",
  "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0",
  "[&::-moz-range-thumb]:bg-brand-white [&::-moz-range-thumb]:cursor-pointer",
  `[&::-moz-range-thumb]:${THUMB_SHADOW}`,
  "disabled:[&::-moz-range-thumb]:cursor-not-allowed disabled:[&::-moz-range-thumb]:opacity-70",
  "[&::-moz-focus-outer]:border-0",
);

export const SliderRange = forwardRef<HTMLDivElement, SliderRangeProps>(
  function SliderRange(
    {
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue = [min, max],
      onValueChange,
      disabled = false,
      className,
      ...props
    },
    ref,
  ) {
    const [uncontrolled, setUncontrolled] = useState(defaultValue);
    const isControlled = value !== undefined;
    const [lo, hi] = isControlled ? value : uncontrolled;

    const commit = (next: [number, number]) => {
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(next);
    };

    const loPercent = percentOf(lo, min, max);
    const hiPercent = percentOf(hi, min, max);

    return (
      <div ref={ref} className={cn("relative h-20 w-full", className)} {...props}>
        {/* Track — Figma: full width, 4px, pill. */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-4 -translate-y-1/2 rounded-full bg-neutral-2" />
        {/* Fill — between the two thumbs. */}
        <div
          className={cn(
            "pointer-events-none absolute top-1/2 h-4 -translate-y-1/2 rounded-full",
            disabled ? "bg-neutral-4" : "bg-brand-red",
          )}
          style={{ left: `${loPercent}%`, right: `${100 - hiPercent}%` }}
        />
        <input
          type="range"
          aria-label="Minimum"
          min={min}
          max={max}
          step={step}
          value={lo}
          disabled={disabled}
          onChange={(e) => {
            const next = Math.min(Number(e.target.value), hi);
            commit([next, hi]);
          }}
          className={RANGE_THUMB_INPUT}
        />
        <input
          type="range"
          aria-label="Maximum"
          min={min}
          max={max}
          step={step}
          value={hi}
          disabled={disabled}
          onChange={(e) => {
            const next = Math.max(Number(e.target.value), lo);
            commit([lo, next]);
          }}
          className={RANGE_THUMB_INPUT}
        />
      </div>
    );
  },
);
