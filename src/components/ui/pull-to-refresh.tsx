"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * PullToRefresh — mirrors the Figma component set "Pull to Refresh"
 * (page ❖ Pull to Refresh, node 4385:11367).
 *
 * The set has exactly ONE variant — `Property 1=Default` (node 4385:11366):
 * a 390×56 white bar holding a small loading ring + the label "Kéo xuống để
 * tải lại" ("Pull down to reload"). There is no separate pulling / armed /
 * arrow-rotate state anywhere on the page (checked: single variant, no hidden
 * arrow layers nearby) — Figma models only the moment refresh is IN PROGRESS.
 * This port therefore ships exactly two states, nothing invented in between:
 *   - idle:       indicator collapsed (height 0), children render normally.
 *   - refreshing: indicator revealed, `role="status"` announces it.
 *
 * The ring itself is not a real vector shape to read arc geometry off of: the
 * "Loading GIF" instance (component set 4300:22780/4300:22781, "Grey=true/
 * false") is a raster IMAGE fill wrapping a Lottie source file
 * ("lottiefiles.com/animations/red-loading-kevin…") — the exact same
 * unexportable-raster situation flagged for the "DIBank loading icon gif" in
 * `spinner.tsx`. No `arcData`, no stroke geometry, nothing to read off the
 * node beyond its rendered pixels. Rather than invent a fabricated arc span,
 * this port mirrors `Spinner`'s own construction (two overlaid CSS-border
 * rings — a static track + a spinning wedge) at the size actually used here
 * (20px) and the colour actually rendered by the default "Grey=false"
 * instance: sampled off the raster at ~#e63f40, which is not itself a design
 * token. Per AGENTS.md's foreign/raw-colour rule, that sample is mapped to
 * the nearest real DS token, `brand-red`, rather than hardcoded. Note this
 * deliberately diverges from `Spinner`'s own documented "brand-red only at
 * 48px, grey everywhere smaller" rule — that rule describes a different
 * component (the vector "Di-Bank Progress Spinner"). This raster loader is
 * red at 20px in Figma, so that is what's read off the node and ported, not
 * extrapolated from a Spinner sibling (AGENTS.md: don't guess a state's
 * styling from a sibling's).
 *
 * Label — SF Pro Medium 14 / fill rgb(0.2,0.2,0.2) = #333333, an exact match
 * for AGENTS.md's brand black → `text-subheadline font-medium text-brand-black`.
 * Bar — solid white fill + a 1px bottom hairline sampled at ~#e5e5e5, nearest
 * token `border-neutral-3` (#e5e7eb).
 *
 * Real touch-drag physics (pull distance, elastic overscroll, release
 * threshold) are OUT OF SCOPE for this port — it implements the visual idle/
 * refreshing states only, driven by the controlled `refreshing` prop. Wire a
 * real gesture (or the preview page's button) to flip it.
 */

function RefreshRing({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("relative inline-block size-20 shrink-0", className)}
    >
      {/* Figma "Circle" analogue — static track ring, mirrors Spinner's
          Neutral/2 @ 50% opacity convention (no equivalent style to read off
          this raster node, so the value is borrowed from the sibling DS
          component that does document it). */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full border-[3px] border-neutral-2 opacity-50"
      />
      {/* Figma "Grey=false" ring — sampled ~#e63f40 off the raster, mapped to
          the nearest real token, brand-red. Spun via CSS since the source is
          a static Lottie-derived image, not an animatable vector. */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 animate-spin rounded-full border-[3px]",
          "border-t-brand-red border-r-brand-red border-b-transparent border-l-transparent",
          "motion-reduce:animate-none",
        )}
      />
    </span>
  );
}

export interface PullToRefreshProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Whether the refreshing indicator is shown. Controlled — this port has no
   *  gesture of its own to flip it (see file doc comment), so the caller
   *  always decides when it goes true/false. */
  refreshing: boolean;
  /** The actual data-reload work. Not invoked internally by this port — there
   *  is no drag-release detection to call it from yet. Call it yourself
   *  around whatever sets `refreshing` (see the preview page for the
   *  button-driven example this is meant to support later being replaced by
   *  a real gesture handler). */
  onRefresh?: () => void | Promise<void>;
  /** Figma: "Kéo xuống để tải lại". */
  label?: string;
  children: ReactNode;
}

export const PullToRefresh = forwardRef<HTMLDivElement, PullToRefreshProps>(
  function PullToRefresh(
    {
      refreshing,
      onRefresh,
      label = "Kéo xuống để tải lại",
      className,
      children,
      ...props
    },
    ref,
  ) {
    // Intentionally unused here — see the `onRefresh` doc comment above: this
    // port has no internal gesture to call it from.
    void onRefresh;

    return (
      <div ref={ref} className={cn("flex flex-col", className)} {...props}>
        <div
          role="status"
          aria-label="Đang tải lại"
          className={cn(
            "overflow-hidden bg-brand-white transition-[height] duration-300 ease-out",
            refreshing ? "h-56" : "h-0",
          )}
        >
          <div className="flex h-56 items-center justify-center gap-4 border-b border-neutral-3">
            <RefreshRing />
            <span className="text-subheadline font-medium whitespace-nowrap text-brand-black">
              {label}
            </span>
          </div>
        </div>
        {children}
      </div>
    );
  },
);
