import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Badge — mirrors the Figma component set "Badge" (page ❖ Badge, node 4:192630).
 *
 * Figma axes → props:
 *   Bold (false | true) → `bold`    — false = light tint fill, true = solid fill
 *   Type (Grey/Green/Yellow/Red/Blue) → `variant`
 *
 * This is the colour-by-semantic labelled pill one might expect "Tags" to be
 * (see tag.tsx for what that component set actually models instead — a
 * removable/add-tag pill with no colour axis at all). Every one of the 10
 * Badge members resolves through a NAMED Figma Style (fillStyleId /
 * textStyleId all non-null, all `remote: false`) — this component is clean,
 * no contamination.
 *
 * Every combination carries a leading icon ("Core Line / 24 / Interface
 * Information") in Figma's demo instances, but no separate "show icon"
 * boolean exists on the component — only Bold × Type. Modeled here as an
 * optional `icon` slot (same convention as Button's iconLeft / Chip's
 * leadingIcon: present in every mock, but not force-rendered).
 *
 * Figma shows no dot/count/host-positioning variant for Badge — it is a
 * standalone label pill, not a notification-dot overlay. No wrapper/
 * positioning API was added since that would be invented, not read.
 *
 * Colour mapping (read via each node's resolved Style name, not just hex):
 *   bold=true  grey   → Neutral/6            + Brand/Solid/White text
 *   bold=true  green  → Semantic/Green/6     + Brand/Solid/White text
 *   bold=true  yellow → Semantic/ORANGE/6 (!) + Brand/Solid/Black text — the
 *              "Yellow" bold variant is actually painted with Orange/6, not
 *              Yellow/6 (#FFDD00); likely a contrast fix (true yellow-6 with
 *              white/black text at solid fill reads poorly). Read as-is, not
 *              corrected — flag if that seems wrong to the designer.
 *   bold=true  red    → Semantic/Red/6       + Brand/Solid/White text
 *   bold=true  blue   → Semantic/Blue/6      + Brand/Solid/White text
 *   bold=false grey   → Brand/Solid/White    + Brand/Solid/Black text (no
 *              tint, no border — distinguished only by icon/label content)
 *   bold=false green  → Semantic/Green/2     + Semantic/Green/10 text
 *   bold=false yellow → Semantic/Yellow/2    + Semantic/Yellow/10 text
 *   bold=false red    → Semantic/Red/2       + Semantic/Red/7 text
 *   bold=false blue   → Semantic/Blue/2      + Semantic/Blue/7 text
 *
 * Label is 10px/SemiBold in Figma — no exact 10px token exists in this DS's
 * type scale, so it's mapped to the nearest step, `text-caption2` (11px), a
 * 1px approximation. `cornerRadius: 10` is not on this DS's radius scale
 * (multiples of 4) but at Badge's 16px height it already renders as a full
 * pill in Figma (10 > height/2), so `rounded-full` reproduces it exactly.
 * Icon colour could not be read — the icon instance's descendants were
 * empty when queried (an unpopulated instance-swap slot) — so it is left to
 * inherit `currentColor` from the label text, matching how Button/Chip icon
 * slots behave.
 */

export type BadgeVariant = "grey" | "green" | "yellow" | "red" | "blue";

const SOLID: Record<BadgeVariant, string> = {
  grey: "bg-neutral-6 text-brand-white",
  green: "bg-green-6 text-brand-white",
  // Figma's "Yellow" bold variant is painted with Semantic/Orange/6, not
  // Yellow/6 — read verbatim, not corrected. See doc comment above.
  yellow: "bg-orange-6 text-brand-black",
  red: "bg-red-6 text-brand-white",
  blue: "bg-blue-6 text-brand-white",
};

const TINT: Record<BadgeVariant, string> = {
  grey: "bg-brand-white text-brand-black",
  green: "bg-green-2 text-green-10",
  yellow: "bg-yellow-2 text-yellow-10",
  red: "bg-red-2 text-red-7",
  blue: "bg-blue-2 text-blue-7",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  /** Figma "Bold" boolean — false (default) = light tint, true = solid fill. */
  bold?: boolean;
  /** Leading icon slot. Optional — see doc comment on why it isn't forced. */
  icon?: ReactNode;
}

export function Badge({
  variant = "grey",
  bold = false,
  icon,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-16 items-center gap-4 whitespace-nowrap rounded-full px-6",
        "text-caption2 font-semibold",
        bold ? SOLID[variant] : TINT[variant],
        className,
      )}
      {...props}
    >
      {icon && (
        <span aria-hidden className="shrink-0 leading-none">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}
