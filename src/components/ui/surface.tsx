import {
  forwardRef,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Surface — a generic content container (white panel + radius + optional
 * elevation + padding).
 *
 * ⚠️ THIS IS NOT PORTED FROM FIGMA. The Figma library has no generic container
 * component — its "Cards" page is the physical bank-card visual (see `card.tsx`),
 * not a reusable surface. Prototypes need a plain content box constantly
 * (sections, grouped rows, sheets' inner blocks), so this is a deliberate,
 * DS-token-only invention added on the designer's request (2026-07). Every value
 * it can express is a real token; it invents no new colours, radii or shadows —
 * it only composes existing ones. If Figma later ships a real container, reconcile
 * this against it.
 */

type Elevation = "none" | "1" | "2" | "3" | "4" | "5";
type Radius = "8" | "12" | "16" | "20" | "24";
type Padding = "0" | "8" | "12" | "16" | "20" | "24";

// Written as literals so Tailwind's source scanner emits them (dynamic
// `shadow-${e}` etc. would generate no CSS — see AGENTS.md).
const ELEVATION: Record<Elevation, string> = {
  none: "",
  "1": "shadow-1",
  "2": "shadow-2",
  "3": "shadow-3",
  "4": "shadow-4",
  "5": "shadow-5",
};

const RADIUS: Record<Radius, string> = {
  "8": "rounded-8",
  "12": "rounded-12",
  "16": "rounded-16",
  "20": "rounded-20",
  "24": "rounded-24",
};

const PADDING: Record<Padding, string> = {
  "0": "p-0",
  "8": "p-8",
  "12": "p-12",
  "16": "p-16",
  "20": "p-20",
  "24": "p-24",
};

export interface SurfaceProps extends HTMLAttributes<HTMLElement> {
  /** Figma effect scale shadow-1..5, or "none" (default). */
  elevation?: Elevation;
  /** Corner radius token (multiples of 4). Default 16. */
  radius?: Radius;
  /** Uniform padding token. Default 16. */
  padding?: Padding;
  /** Draw a Neutral/3 hairline border. Default false. */
  bordered?: boolean;
  /** Render as a different element (e.g. "section", "article", "button"). */
  as?: ElementType;
  children?: ReactNode;
}

export const Surface = forwardRef<HTMLElement, SurfaceProps>(function Surface(
  {
    elevation = "none",
    radius = "16",
    padding = "16",
    bordered = false,
    as: Tag = "div",
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <Tag
      ref={ref}
      className={cn(
        "bg-brand-white",
        RADIUS[radius],
        PADDING[padding],
        ELEVATION[elevation],
        bordered && "border border-neutral-3",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
});
