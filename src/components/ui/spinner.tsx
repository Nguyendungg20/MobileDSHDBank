import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Spinner — mirrors the Figma component set "Di-Bank Progress Spinner"
 * (page ❖ Loading & Skeleton, section "Loading", node 7367:22082).
 *
 * Figma does not draw this as a plain stroked circle: each size is a
 * COMPONENT_SET of two overlaid ELLIPSEs built from `arcData`, not a border —
 *   - "Circle": full ring (startingAngle 0 → 2π), innerRadius ~0.7-0.84 of the
 *     radius, filled Neutral/2, at 50% node opacity — the static track.
 *   - "Active": a quarter ring only (0 → -90°, same innerRadius) — the moving
 *     highlight. Figma can't export the rotation itself (a static file), so the
 *     spin is this port's CSS addition; the geometry (thickness, colour, arc
 *     span) is read, not guessed.
 * CSS has no direct partial-radial-arc primitive, so the quarter-turn is
 * rebuilt with the standard two-adjacent-sides border trick
 * (`border-t-*` + `border-r-*` coloured, the other two sides transparent,
 * `rounded-full`) — the closest CSS equivalent of the same 90° wedge, then
 * spun continuously with `animate-spin`.
 *
 * Sizes and stroke width, read directly off each of the 5 component variants
 * (`arcData.innerRadius` × radius, in px): 48→3.84, 32→3.84, 24→3.6, 20→3.4,
 * 16→2.4 — rounded to whole pixels since CSS border-width takes integers.
 *
 * Colour is NOT a free variable — Figma bakes it into the size axis:
 * only the 48px variant's "Active" arc uses Brand/Solid/Red (`brand-red`);
 * every other size (32/24/20/16) reads Neutral/5 grey. This is a deliberate
 * hierarchy (only the primary/large spinner carries the brand accent) — per
 * AGENTS.md, states/sizes are not extrapolated from a sibling, so the four
 * smaller sizes are NOT offered in red.
 *
 * Figma also shows a second, unrelated node on the same page — "DIBank loading
 * icon gif" (9203:14404): a branded animated loader baked as a raster IMAGE
 * fill (imageHash `ed117667…`), no vector data, no size axis. It cannot be
 * exported or reproduced from the read-only Figma MCP (this is exactly the
 * "Figma can't export the animation" case), so it is intentionally NOT ported —
 * flagged here and in the port report rather than invented.
 */

export type SpinnerSize = "48" | "32" | "24" | "20" | "16";

const BOX: Record<SpinnerSize, string> = {
  "48": "size-48",
  "32": "size-32",
  "24": "size-24",
  "20": "size-20",
  "16": "size-16",
};

// Figma arcData.innerRadius per size → ring thickness in px, rounded.
const STROKE: Record<SpinnerSize, string> = {
  "48": "border-[4px]",
  "32": "border-[4px]",
  "24": "border-[4px]",
  "20": "border-[3px]",
  "16": "border-[2px]",
};

// Figma: "Active" arc fill — brand-red only at 48px, Neutral/5 everywhere else.
const ACTIVE: Record<SpinnerSize, string> = {
  "48": "border-t-brand-red border-r-brand-red",
  "32": "border-t-neutral-5 border-r-neutral-5",
  "24": "border-t-neutral-5 border-r-neutral-5",
  "20": "border-t-neutral-5 border-r-neutral-5",
  "16": "border-t-neutral-5 border-r-neutral-5",
};

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  /** Screen-reader label. Figma has no copy for this (it's a visual-only
   *  indicator) — "Đang tải" ("Loading") is this port's accessible name. */
  label?: string;
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  function Spinner({ size = "48", label = "Đang tải", className, ...props }, ref) {
    return (
      <div
        ref={ref}
        role="status"
        aria-label={label}
        className={cn("relative inline-block shrink-0", BOX[size], className)}
        {...props}
      >
        {/* Figma "Circle" — full track ring, Neutral/2 @ 50% opacity */}
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 rounded-full border-neutral-2 opacity-50",
            STROKE[size],
          )}
        />
        {/* Figma "Active" — 90° wedge, spun via CSS since Figma can't export motion */}
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 animate-spin rounded-full border-transparent motion-reduce:animate-none",
            STROKE[size],
            ACTIVE[size],
          )}
        />
      </div>
    );
  },
);
