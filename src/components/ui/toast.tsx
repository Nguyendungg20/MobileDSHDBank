"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Toast — mirrors the Figma component set "Toast" (page ❖ Toast, node 7355:38048).
 *
 * Figma axes → props:
 *   Type  → `variant` (success | warning | error | info; `type` is taken by the
 *           HTML attribute)
 *   Bold  → `bold`    (Figma Style axis, boolean: light tint vs. solid fill)
 *
 * Figma models this as three linked pieces, ported here as one component:
 *   "Toast" (COMPONENT_SET, Type × Bold)         → the container below
 *   ".Toast / Icon" (COMPONENT_SET, Type × Black) → the coloured glyph badge
 *   ".Toast/ Description" (COMPONENT, single variant) → icon + text row
 *
 * Scope: there is no State axis and no close/dismiss affordance anywhere on the
 * Toast page — every instance on the page (including the two-line wrap used as
 * an inline banner on "Confirm Infomation") is just Type × Bold with auto-height
 * text wrap. So this port does NOT add a close button or a size axis — neither
 * exists in the source. Width is intentionally `w-full` rather than Figma's
 * fixed 326: that value is just (390 mobile frame − 32×2 margin), not a token
 * the component should hard-code; the consumer positions/constrains it.
 */

export type ToastVariant = "success" | "warning" | "error" | "info";

/**
 * Every colour below was read off the Figma node fills, not inferred.
 * Container: Bold=false binds Semantic/<Hue>/2, Bold=true binds Semantic/<Hue>/6.
 * Icon pill: Bold=false binds Semantic/<Hue>/1, Bold=true binds Semantic/<Hue>/5.
 * Glyph: Bold=false is Semantic/<Hue>/6, Bold=true is flat Brand/Solid/Black
 *   (#333333) regardless of hue — Figma's own naming for this axis is "Black",
 *   not "Bold"; the *icon* subcomponent's variants are literally named
 *   `Black=True/False`, describing the glyph colour, while the *Toast* variant
 *   that consumes it is named `Bold=True/False`, describing the fill weight.
 * Text: Brand/Solid/Black when Bold=false, Brand/Solid/White when Bold=true —
 *   both confirmed identical across all four hues.
 *
 * Note: Figma's "warning" type binds Semantic/Orange styles throughout (its own
 * icon component instance is misleadingly named "Type=yellow"), so this ports
 * to the `orange` ramp, matching AGENTS.md's vocabulary — not `yellow`.
 */
const TOAST_COLOR: Record<
  ToastVariant,
  { container: string; containerBold: string; pill: string; pillBold: string; glyph: string }
> = {
  success: {
    container: "bg-green-2",
    containerBold: "bg-green-6",
    pill: "bg-green-1",
    pillBold: "bg-green-5",
    glyph: "text-green-6",
  },
  warning: {
    container: "bg-orange-2",
    containerBold: "bg-orange-6",
    pill: "bg-orange-1",
    pillBold: "bg-orange-5",
    glyph: "text-orange-6",
  },
  error: {
    container: "bg-red-2",
    containerBold: "bg-red-6",
    pill: "bg-red-1",
    pillBold: "bg-red-5",
    glyph: "text-red-6",
  },
  info: {
    container: "bg-blue-2",
    containerBold: "bg-blue-6",
    pill: "bg-blue-1",
    pillBold: "bg-blue-5",
    glyph: "text-blue-6",
  },
};

/**
 * Figma's glyph ("Core Solid / 24 / Check" and siblings) is a single solid
 * vector: a filled circle with the symbol cut out, sitting over a white 20×20
 * backing ellipse inset 2px inside the 24×24 pill — so the cutout reads as
 * white and a thin ring of the pill colour survives at the very edge. Redrawn
 * here as a currentColor circle plus a white glyph on top, which reproduces
 * the same result without an evenodd cutout path.
 */
function CheckGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <circle cx="10" cy="10" r="10" fill="currentColor" />
      <path
        d="M5.5 10.5l3 3 6-6.5"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WarningGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <circle cx="10" cy="10" r="10" fill="currentColor" />
      <path d="M10 5.5v5.25" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="10" cy="14" r="1" fill="white" />
    </svg>
  );
}

function ErrorGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <circle cx="10" cy="10" r="10" fill="currentColor" />
      <path
        d="M7 7l6 6M13 7l-6 6"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <circle cx="10" cy="10" r="10" fill="currentColor" />
      <circle cx="10" cy="6.25" r="1" fill="white" />
      <path d="M10 9.25v5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const GLYPH: Record<ToastVariant, (props: { className?: string }) => ReactNode> = {
  success: CheckGlyph,
  warning: WarningGlyph,
  error: ErrorGlyph,
  info: InfoGlyph,
};

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  variant?: ToastVariant;
  /** Figma Style="Bold" — solid Semantic/6 fill + white text vs. the default Semantic/2 tint. */
  bold?: boolean;
  children: ReactNode;
}

export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  {
    variant = "info",
    bold = false,
    role,
    "aria-live": ariaLive,
    className,
    children,
    ...props
  },
  ref,
) {
  const Glyph = GLYPH[variant];
  const colors = TOAST_COLOR[variant];

  // Figma has no State axis to key off; role/aria-live are semantics this port
  // adds (not a traced node) so the toast announces correctly — error is the
  // only type urgent enough to interrupt (assertive), the rest are polite.
  const resolvedRole = role ?? (variant === "error" ? "alert" : "status");
  const resolvedAriaLive = ariaLive ?? (variant === "error" ? "assertive" : "polite");

  return (
    <div
      ref={ref}
      role={resolvedRole}
      aria-live={resolvedAriaLive}
      className={cn(
        "flex w-full items-center gap-8 rounded-16 py-12 px-16",
        bold ? colors.containerBold : colors.container,
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "flex size-24 shrink-0 items-center justify-center rounded-full",
          bold ? colors.pillBold : colors.pill,
        )}
      >
        <Glyph className={cn("size-20", bold ? "text-brand-black" : colors.glyph)} />
      </span>
      <span
        className={cn(
          "min-w-0 flex-1 text-subheadline font-regular",
          bold ? "text-brand-white" : "text-brand-black",
        )}
      >
        {children}
      </span>
    </div>
  );
});

/* ---------------------------------------------------------------------------
 * useToast — a thin single-slot helper for wiring a Toast up in a prototype.
 * Not a traced Figma node, and deliberately not a queue: one toast at a time,
 * no portal, no stacking. Reach for local `useState` directly if this doesn't
 * fit; this exists only to save the same seven lines on every prototype page.
 * ------------------------------------------------------------------------ */

export interface ToastState {
  variant: ToastVariant;
  bold?: boolean;
  message: ReactNode;
  /** Auto-hide after this many ms. Omit to require a manual `hide()`. */
  duration?: number;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);

  const hide = useCallback(() => setToast(null), []);
  const show = useCallback((next: ToastState) => setToast(next), []);

  useEffect(() => {
    if (!toast?.duration) return;
    const id = setTimeout(hide, toast.duration);
    return () => clearTimeout(id);
  }, [toast, hide]);

  return { toast, show, hide };
}
