import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Button } from "./button";

/**
 * Callout — mirrors the Figma component set "Callout" (page ❖ Callout,
 * node 10299:377227).
 *
 * Figma axes → props:
 *   Meaning     → `variant`  (positive/negative/warning/Info in Figma — renamed
 *                 success/error/warning/info to match this codebase's existing
 *                 Toast vocabulary, which the same four hues already use)
 *   BG trắng    → `tinted`   (boolean; see note below — the raw axis name is
 *                 the opposite of what it renders)
 *   Show Action → `actionLabel`/`onAction` (boolean in Figma, bound only to the
 *                 nested Button's `visible`; modelled here as "pass a label or
 *                 don't" rather than a redundant boolean + label pair)
 *
 * Unlike Toast, Callout has no Bold/solid-fill state and no title — just an
 * icon, one line of description (fontSize 12 "Regular" — Caption1, not the
 * Subheadline Toast uses), and an optional inline action. There is no
 * dismiss/close affordance anywhere on the Callout page, and no State axis —
 * this is a static, presentational, always-inline surface (see AGENTS.md:
 * Toast floats, Callout sits in the page flow), so this port adds neither.
 *
 * `BG trắng` ("white background", read literally) is confirmed BACKWARDS by
 * the actual computed fills: `BG trắng=True` (Figma's default, and what real
 * usages on the "kết quả mua" screen bind) renders the TINTED Semantic/<hue>/1
 * fill; `BG trắng=False` (used once, on "LSGD") renders solid Brand/Solid/White
 * with no border. Read off the nodes rather than inferred — see AGENTS.md's
 * warning that an unread axis name can mislead. This port names the prop
 * `tinted` and keeps `true` (tinted) as the default to match Figma's default
 * and its far more common real usage, rather than propagating the confusing
 * `whiteBg`-that-isn't-white polarity into the API.
 *
 * The nested Action is a real instance of this codebase's own Button
 * (variant="secondary" size="x-small") — confirmed by its fill (Neutral/2),
 * border (Neutral/3), text (Brand/Solid/Black), cornerRadius 1000 and padding
 * [0,16,0,16], all identical to Button's secondary/x-small styling — so it is
 * composed here rather than re-implemented.
 *
 * Icon badge: same "Core Solid / 24 / …" glyph set Toast uses, at the same
 * size-24 pill / size-20 glyph proportions. The warning glyph instance is
 * again named "Type=yellow" in Figma (variantProperties: {Type: "yellow",
 * Black: "False"}) despite its fills resolving to Semantic/Orange/1 (container
 * + pill) and Semantic/Orange/6 (glyph) throughout both `tinted` states —
 * the exact same Toast mislabeling AGENTS.md calls out, confirmed again here
 * rather than assumed. Ports to the `orange` ramp, not `yellow`.
 *
 * Confirmed foreign ref: the Description text's fillStyleId resolves to a
 * style literally named "Black" with `remote: true` — not a style local to
 * this file. Its computed value (#333333) is identical to `Brand/Solid/Black`
 * / `brand-black`, so it maps to `text-brand-black` here; flagged for the
 * designer to swap to the local style in Figma.
 */

export type CalloutVariant = "success" | "error" | "warning" | "info";

const CALLOUT_COLOR: Record<
  CalloutVariant,
  { tint: string; pill: string; glyph: string }
> = {
  success: { tint: "bg-green-1", pill: "bg-green-1", glyph: "text-green-6" },
  error: { tint: "bg-red-1", pill: "bg-red-1", glyph: "text-red-6" },
  // Figma names this hue "yellow" on the nested icon instance, but every
  // fill it resolves to is Semantic/Orange — see doc comment above.
  warning: { tint: "bg-orange-1", pill: "bg-orange-1", glyph: "text-orange-6" },
  info: { tint: "bg-blue-1", pill: "bg-blue-1", glyph: "text-blue-6" },
};

/** Redrawn from Figma's "Core Solid / 24 / …" vectors — see Toast for the
 * identical shapes; duplicated here rather than shared since neither file
 * exports an icon module today. */
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

function WarningGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <circle cx="10" cy="10" r="10" fill="currentColor" />
      <path d="M10 5.5v5.25" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="10" cy="14" r="1" fill="white" />
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

const GLYPH: Record<CalloutVariant, (props: { className?: string }) => ReactNode> = {
  success: CheckGlyph,
  error: ErrorGlyph,
  warning: WarningGlyph,
  info: InfoGlyph,
};

export interface CalloutProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CalloutVariant;
  /** Figma Style="BG trắng" — see doc comment: `true` (default) is the tinted
   * Semantic/<hue>/1 fill Figma calls `BG trắng=True`; `false` is the solid
   * white, borderless fill Figma calls `BG trắng=False`. */
  tinted?: boolean;
  /** Figma Style="Show Action" — renders a secondary x-small Button when set. */
  actionLabel?: ReactNode;
  onAction?: () => void;
  children: ReactNode;
}

export function Callout({
  variant = "info",
  tinted = true,
  actionLabel,
  onAction,
  role,
  className,
  children,
  ...props
}: CalloutProps) {
  const Glyph = GLYPH[variant];
  const colors = CALLOUT_COLOR[variant];
  const resolvedRole = role ?? (variant === "error" ? "alert" : "status");

  return (
    <div
      role={resolvedRole}
      className={cn(
        "flex w-full items-start gap-8 rounded-16 py-12 px-16",
        tinted ? colors.tint : "bg-brand-white",
        className,
      )}
      {...props}
    >
      <span className="flex h-32 w-24 shrink-0 items-center justify-center">
        <span
          className={cn(
            "flex size-24 items-center justify-center rounded-full",
            colors.pill,
          )}
        >
          <Glyph className={cn("size-20", colors.glyph)} />
        </span>
      </span>
      <span className="flex min-h-32 min-w-0 flex-1 items-center gap-8">
        <span className="min-w-0 flex-1 text-caption1 font-regular text-brand-black">
          {children}
        </span>
        {actionLabel != null && (
          <Button variant="secondary" size="x-small" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </span>
    </div>
  );
}
