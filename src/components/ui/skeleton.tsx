import { type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Skeleton — mirrors the Figma primitives on page ❖ Loading & Skeleton,
 * section "Skeleton" (node 9203:14575): `.skeleton-comps/img` (32px circle),
 * `.skeleton-comps/img-large` (96px square), and `.skeleton-item/title` (the
 * text-line bar), which Figma composes into `.skeleton/multiline-text-blok`
 * and full skeleton screens ("Skeleton 1"/"Skeleton 2", the "Danh sách sổ TK"
 * and "TD/Thông tin TK" mock screens).
 *
 * COLOUR — CONFIRMED CONTAMINATION: every primitive's fill resolves to a
 * Figma style with `remote: true` — "Gray/500" (#F2F2F4) for the line/img
 * fill, "Gray/600" (#E5E5E5) for the img-large icon glyph, and a *different*
 * remote "Neutral/3" (#F5F5F5) on internal width-adjuster helper layers. Per
 * AGENTS.md / the foreign-Colors-leak note, these are a foreign UI-kit
 * collection leaked via copy-paste, not real DS tokens. Mapped to the nearest
 * local token by hex distance (no exact match exists for either):
 *   Gray/500 #F2F2F4 → `neutral-2` (#F3F4F6, Δ≈5) — used for every fill below.
 *   Gray/600 #E5E5E5 → `neutral-3` (#E5E7EB, Δ≈8) — the img-large icon glyph,
 *     which is NOT reproduced (see below), so this mapping is documented but unused.
 *
 * RADIUS — every primitive reads cornerRadius 0 (flat rectangles) except the
 * circle (`.skeleton-comps/img`, cornerRadius 999). This DS's radius scale has
 * no 0 step ("never radius = 0", AGENTS.md) — 0 isn't expressible — so
 * `rounded-4`, the smallest token, is the default for line/rect shapes instead
 * of a literal (and disallowed) port of 0. The circle keeps Figma's own value:
 * 999 clamps to a true circle at this size, i.e. `rounded-full`.
 *
 * NOT REPRODUCED: `.skeleton-comps/img-large` is not a plain box in Figma — it
 * has a centred "photo" icon VECTOR glyph (the Gray/600 fill above) drawn on
 * top of the Gray/500 background square. Extracting that vector path is out of
 * scope for a decorative, `aria-hidden` placeholder; this port renders the
 * background box only (bounding size + colour), not the icon silhouette.
 *
 * ANIMATION: Figma shows flat solid fills — no shimmer/gradient baked into the
 * design — so the pulse below is this port's own CSS addition (as instructed),
 * not something read off the file. Disabled under prefers-reduced-motion.
 */

export type SkeletonRadius = "4" | "8" | "12" | "16" | "20" | "24" | "32";

const RADIUS: Record<SkeletonRadius, string> = {
  "4": "rounded-4",
  "8": "rounded-8",
  "12": "rounded-12",
  "16": "rounded-16",
  "20": "rounded-20",
  "24": "rounded-24",
  "32": "rounded-32",
};

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** CSS width. Figma's `.skeleton-item/title` line reads 325px; pass a
   *  percentage (e.g. "76%") for fluid layouts — see `SkeletonText`. */
  width?: number | string;
  /** CSS height. Figma's line reads ~12px (the default). */
  height?: number | string;
  /** Figma `.skeleton-comps/img` — renders as a circle (cornerRadius 999,
   *  i.e. `rounded-full`) and forces height to match width. Ignores `radius`. */
  circle?: boolean;
  /** Ignored when `circle`. Default "4" — the smallest DS token; Figma itself
   *  reads cornerRadius 0, which this scale has no step for (see file doc). */
  radius?: SkeletonRadius;
}

export function Skeleton({
  circle = false,
  width,
  height = 12,
  radius = "4",
  className,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        // Figma: "Gray/500" (remote, contaminated) → nearest local token neutral-2.
        "animate-pulse bg-neutral-2 motion-reduce:animate-none",
        circle ? "rounded-full" : RADIUS[radius],
        className,
      )}
      style={{ width, height: circle ? width : height, ...style }}
      {...props}
    />
  );
}

export interface SkeletonTextProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of lines. Figma's `.skeleton/multiline-text-blok` (VERTICAL
   *  auto-layout, itemSpacing 16) reads 3 visible rows: two full-width lines
   *  plus one shorter final line. */
  lines?: number;
  /** Width of the final line. Figma reads 262/342 ≈ 76%. */
  lastLineWidth?: string;
}

/** `.skeleton/multiline-text-blok` — a paragraph made of stacked `Skeleton` lines. */
export function SkeletonText({
  lines = 3,
  lastLineWidth = "76%",
  className,
  ...props
}: SkeletonTextProps) {
  return (
    <div className={cn("flex flex-col gap-16", className)} {...props}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          height={12}
          width={i === lines - 1 ? lastLineWidth : "100%"}
        />
      ))}
    </div>
  );
}
