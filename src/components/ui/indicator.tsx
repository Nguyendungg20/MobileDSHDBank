"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Indicator — mirrors Figma page "❖ Indicator" (node 3645:230662, fileKey
 * 3wFivMDO6P0heqk4YPLJQF). The page holds THREE component sets, not one:
 *
 *   1. "Dot indicator" (7223:151958, 8×8)      ← built here
 *      Variants: "isActive=Off, Color=Default" | "isActive=On, Color=Red" |
 *      "isActive=On, Color=White". A single circular page-dot, always 8×8 —
 *      unlike an iOS page control the active dot does NOT elongate into a pill.
 *   2. "Dot indicators" (7223:151963, 176×112) — NOT built. A page-level
 *      *example composition*: "Theme=Color" / "Theme=Landscape", each a static
 *      5-dot row (72w, itemSpacing 8, exactly 5×8 + 4×8 = 72) plus a pair of
 *      "Overflow end"/"Overflow mid" fragment vectors (1×1 and 4×4) bleeding
 *      past both edges of the row — a peeking-next-dot fade affordance for
 *      when there are more pages than fit. Only ONE static frame of that
 *      affordance was ever read (no distance-based scale/opacity states exist
 *      to read), so it is NOT reproduced here — flagged, not invented.
 *   3. "Progress indicator" (7223:151978, 50×6) — NOT built, out of scope.
 *      A different shape entirely: a pill track (white @ 40%) with an inset
 *      "Active" bar, "Color" (gradient fill) / "Theme=White" (solid
 *      Brand/Solid/Red fill) variants. This is a bar-style page indicator,
 *      not a dot — a sibling component, not a variant of this one.
 *
 * Figma axis → prop:
 *   isActive (boolean, per-dot) → derived from `current === n`, rendered as
 *     `data-state="active" | "inactive"` per the Button/Tabs/Pagination
 *     convention (never a11y-only state).
 *   Color (Red | White, active dots only) → `activeColor` prop. Renamed from
 *     the composed examples' "Theme" axis: "Theme=Color" example actually uses
 *     the White active dot, "Theme=Landscape" uses the Red one — the reverse
 *     of what the theme names suggest. Read directly off both example rows'
 *     instance `mainComponent`, not inferred; exposed here as `activeColor`
 *     bound straight to the atom's own "Color" property instead of carrying
 *     the confusing "Theme" naming forward.
 *
 * `activeColor="red"` is the default: it is Pagination's active-page accent
 * too (`bg-red-6`, i.e. `brand-red`), so the two components read as one
 * family. Unlike Pagination's chip fill (raw `#BE1128`, a foreign hex mapped
 * onto `brand-red`), this component's red is NOT contamination — `Circle`'s
 * fill resolves via a real, non-remote style "Brand/Solid/Red" to the exact
 * value `#DA2128`, matching `--color-brand-red` in tokens.css to the bit.
 *
 * Colour/style provenance:
 *   inactive dot  → fillStyle "Neutral/1" (#F9FAFB) → `bg-neutral-1`, exact.
 *   active, red   → fillStyle "Brand/Solid/Red" (#DA2128) → `bg-brand-red`,
 *                    exact — plus a solid 1px white stroke, reproduced as
 *                    `border border-brand-white`.
 *   active, white → fill is NOT a flat colour: a 6-stop diagonal linear
 *                    gradient from white (0%) through a barely-warm off-white
 *                    to a faint pink-white (100%), stroke is the same
 *                    gradient at 80% opacity. Every stop sits between
 *                    RGB(253,246,246) and pure white — imperceptible at an
 *                    8px dot. Approximated here as solid `bg-brand-white`
 *                    with no stroke (the read stroke is functionally
 *                    invisible against the matching-white fill at this size).
 *                    Flagged as an approximation, not a re-measurement.
 */

export type IndicatorActiveColor = "red" | "white";

export interface IndicatorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onClick"> {
  /** Total number of dots/pages. */
  total: number;
  /** Active page, 1-indexed — matches Pagination's `page` prop convention. */
  current: number;
  /** Figma "Color" variant of the active dot. Default "red" — see doc comment
   * above for why "white" is NOT what Figma's "Theme=Color" example uses. */
  activeColor?: IndicatorActiveColor;
  /** Omit for a purely decorative indicator (dots are `aria-hidden`, the
   * group carries the state via `aria-label`). Pass to make each dot a
   * tap target that jumps to that page (1-indexed). Figma does not model a
   * pressed/hover state for dots — no click affordance was read, so this is
   * an extension, not a ported state. */
  onDotClick?: (page: number) => void;
  "aria-label"?: string;
}

export const Indicator = forwardRef<HTMLDivElement, IndicatorProps>(
  function Indicator(
    {
      total,
      current,
      activeColor = "red",
      onDotClick,
      className,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) {
    const interactive = Boolean(onDotClick);
    const pages = Array.from({ length: Math.max(0, total) }, (_, i) => i + 1);

    return (
      <div
        ref={ref}
        role={interactive ? "tablist" : "img"}
        aria-label={ariaLabel ?? `Trang ${current} trên ${total}`}
        className={cn("inline-flex items-center gap-8", className)}
        {...props}
      >
        {pages.map((page) => {
          const active = page === current;
          const Dot = interactive ? "button" : "span";
          return (
            <Dot
              key={page}
              type={interactive ? "button" : undefined}
              data-state={active ? "active" : "inactive"}
              role={interactive ? "tab" : undefined}
              aria-selected={interactive ? active : undefined}
              aria-hidden={interactive ? undefined : true}
              aria-label={interactive ? `Trang ${page}` : undefined}
              tabIndex={interactive ? 0 : undefined}
              onClick={interactive ? () => onDotClick!(page) : undefined}
              className={cn(
                "size-8 shrink-0 rounded-full transition-colors",
                "data-[state=inactive]:bg-neutral-1",
                activeColor === "white"
                  ? "data-[state=active]:bg-brand-white"
                  : cn(
                      "data-[state=active]:border data-[state=active]:border-brand-white",
                      "data-[state=active]:bg-brand-red",
                    ),
              )}
            />
          );
        })}
      </div>
    );
  },
);
