"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Scrollbar / ScrollArea — mirrors the Figma component "Scrollbar" (page
 * ❖ Scrollbar, node 15465:302808).
 *
 * Unlike most ported components this is a single fixed-size component, not a
 * variant set — Figma has no Type/Size/State axis for it. It models exactly
 * two rectangles, both named "Scroll":
 *
 *   track (full length) — 4 × 126, cornerRadius 16, fill #FFFFFF @ 50% opacity
 *   thumb (partial)     — 4 × 41,  cornerRadius 16, fill #848484 @ 70% opacity
 *
 * Neither fill is a linked Figma Style (`fillStyleId` was null on both — raw
 * hex baked into the shape, not a token reference). The track's white is a
 * real DS token already (`brand-white`) so it maps cleanly. The thumb's
 * #848484 has no exact DS match; nearest neutral by channel distance is
 * `neutral-6` (#6c737f) — flagged here since it was inferred, not read as a
 * style name.
 *
 * The component only shows a vertical bar (4 wide, tall track) — there is no
 * horizontal variant in Figma. `orientation="horizontal"|"both"` below
 * extends the same tokens onto the cross-axis rather than inventing a new
 * Figma value.
 *
 * Shipped as a styled *native* scrollbar (an actual scrolling container),
 * not a presentational overlay, because Figma modelled both a track and a
 * thumb — exactly what `::-webkit-scrollbar-track` / `-thumb` represent.
 * WebKit/Blink get full track+thumb styling; Firefox only exposes
 * `scrollbar-width` + `scrollbar-color` (no separate track radius there).
 */

export type ScrollAreaOrientation = "vertical" | "horizontal" | "both";

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: ScrollAreaOrientation;
  children?: ReactNode;
}

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  function ScrollArea(
    { orientation = "vertical", className, style, children, ...props },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          "min-h-0 min-w-0",
          orientation === "vertical" && "overflow-y-auto overflow-x-hidden",
          orientation === "horizontal" && "overflow-x-auto overflow-y-hidden",
          orientation === "both" && "overflow-auto",
          // WebKit / Blink — Figma: track+thumb both 4px thick, cornerRadius 16.
          "[&::-webkit-scrollbar]:w-4 [&::-webkit-scrollbar]:h-4",
          "[&::-webkit-scrollbar-track]:rounded-16 [&::-webkit-scrollbar-track]:bg-brand-white/50",
          "[&::-webkit-scrollbar-thumb]:rounded-16 [&::-webkit-scrollbar-thumb]:bg-neutral-6/70",
          className,
        )}
        style={{
          // Firefox fallback: thumb then track, same two colours by formula.
          scrollbarWidth: "thin",
          scrollbarColor:
            "color-mix(in srgb, var(--color-neutral-6) 70%, transparent) " +
            "color-mix(in srgb, var(--color-brand-white) 50%, transparent)",
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);
