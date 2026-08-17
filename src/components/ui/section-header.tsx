"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Section Header — mirrors the Figma component set "Section Header"
 * (page ❖ Section Header, fileKey 3wFivMDO6P0heqk4YPLJQF, node 7364:367263).
 *
 * The title row above a content block. Figma axes/properties → props:
 *   Size (x-large | large | medium | small)   → `size`
 *   Usage (default | "tất cả dịch vụ")         → `usage` ("default" | "inverted")
 *     "tất cả dịch vụ" ("All Services") is the name of the screen this
 *     white-on-colour variant debuted on — renamed to `inverted` here since the
 *     prop is about tone (for use on a coloured/gradient banner), not the
 *     screen it happened to ship with first.
 *   "👁️‍🗨️ Show Icon <" (default false)        → `icon` (rendered iff provided)
 *   Heading (always present)                    → `title`
 *   "💬 Show Sub-heading" (default true)        → `subtitle` (rendered iff provided)
 *   "💬 Show Date" (default false)               → folded into `subtitle`, see below
 *   ".Section Header / Action Group" instance,
 *     shown when "Has Action?"=true (default false) → `action` (ReactNode slot)
 *
 * "Show Date" swaps a timestamp into the *exact* same x/y slot as Sub-heading
 * in every size (they occupy identical bounds — verified on the raw nodes),
 * so it isn't modelled as a second prop: pass a formatted date string as
 * `subtitle` instead. For x-large/large/medium its Figma text style
 * ("Text/Body/Small") also resolves via `getStyleByIdAsync` as `remote: true`
 * — a style that isn't part of this design system (see AGENTS.md's Colors-leak
 * note). Only `small`'s Date uses a real DS style (Caption2/Regular). One more
 * reason not to bake a broken/foreign style into a dedicated prop.
 *
 * The trailing "Action Group" is a real component set with its own `Type`
 * axis (icon | switcher | button) — a row of 3 icon buttons, an iOS switch,
 * or a Reset/Save button pair. Three unrelated shapes, no single semantic
 * click target, so — matching `headerAction` on `bottom-sheet.tsx` — this is
 * a plain `ReactNode` slot rather than a built-in button + `onAction`
 * callback; compose real `<Button>` / `<Switch>` instances with their own
 * handlers. Figma's x-large variant has no Action Group in its node tree at
 * all (title+subtitle stack vertically, no horizontal room for one), so
 * `action` is ignored when `size="x-large"`.
 *
 * Every colour/type style below was read off the Figma nodes rather than
 * inferred. The `usage="inverted"` Heading fill resolves to "Foundation/White"
 * — also `remote: true`, i.e. not a real DS style — mapped here to the DS's
 * own `brand-white` token (the same token the Sub-heading fill already uses
 * correctly in the same component, via style "Brand/Solid/White").
 */

export type SectionHeaderSize = "x-large" | "large" | "medium" | "small";
export type SectionHeaderUsage = "default" | "inverted";

/** Figma: root layoutMode/itemSpacing. x-large stacks vertically (no Action
 *  Group in its node tree); large/medium/small lay out horizontally. */
const ROOT_LAYOUT: Record<SectionHeaderSize, string> = {
  "x-large": "flex-col items-start gap-8",
  large: "flex-row items-center gap-12",
  medium: "flex-row items-center gap-12",
  small: "flex-row items-center gap-12",
};

/** Figma: "Content" frame's itemSpacing — gap between Heading and Sub-heading. */
const CONTENT_GAP: Record<SectionHeaderSize, string> = {
  "x-large": "gap-8",
  large: "gap-4",
  medium: "gap-4",
  small: "gap-4",
};

/** Figma: Heading text style, per Size × Usage. `usage="inverted"` steps up a
 *  weight (Semibold→Bold) on large/medium/small — read off the nodes, not a
 *  rule to extrapolate; x-large keeps Semibold in both usages. */
const HEADING_STYLE: Record<SectionHeaderSize, Record<SectionHeaderUsage, string>> = {
  "x-large": {
    default: "text-title2 font-semibold text-brand-black",
    inverted: "text-title2 font-semibold text-brand-white",
  },
  large: {
    default: "text-title3 font-semibold text-brand-black",
    inverted: "text-title3 font-bold text-brand-white",
  },
  medium: {
    // Figma's own style name is "Subheadline/Body/Semibold" despite resolving
    // to 16px — the DS's `text-body` scale. Trusted the read metric over the
    // (misleading) style name, per this repo's rule to verify, not infer.
    default: "text-body font-semibold text-brand-black",
    inverted: "text-body font-bold text-brand-white",
  },
  small: {
    default: "text-subheadline font-semibold text-brand-black",
    inverted: "text-subheadline font-bold text-brand-white",
  },
};

/** Figma: Sub-heading text style, per Size × Usage. Note x-large's default
 *  Sub-heading is Brand/Solid/Black (not Neutral/6 like the other three
 *  sizes) — an asymmetry read directly off the node, not inferred. */
const SUBTITLE_STYLE: Record<SectionHeaderSize, Record<SectionHeaderUsage, string>> = {
  "x-large": {
    default: "text-subheadline font-regular text-brand-black",
    inverted: "text-subheadline font-semibold text-brand-white",
  },
  large: {
    default: "text-subheadline font-regular text-neutral-6",
    inverted: "text-subheadline font-semibold text-brand-white",
  },
  medium: {
    default: "text-caption1 font-regular text-neutral-6",
    inverted: "text-caption1 font-semibold text-brand-white",
  },
  small: {
    default: "text-caption1 font-regular text-neutral-6",
    inverted: "text-caption1 font-semibold text-brand-white",
  },
};

export interface SectionHeaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Figma: Size. */
  size?: SectionHeaderSize;
  /** Figma: Usage ("tất cả dịch vụ" renamed `inverted`) — white text for use
   *  on a coloured/gradient background. */
  usage?: SectionHeaderUsage;
  /** Figma: "👁️‍🗨️ Show Icon <" — leading icon/illustration slot, rendered iff provided. */
  icon?: ReactNode;
  /** Figma: Heading — the row's always-visible primary text. Omits the
   *  native `title` attribute (tooltip string) from the extended HTML props,
   *  the same collision `type` has on Button. */
  title: ReactNode;
  /** Figma: "💬 Show Sub-heading" (also covers the "💬 Show Date" slot — see
   *  file doc comment). Rendered iff provided. */
  subtitle?: ReactNode;
  /** Figma: ".Section Header / Action Group" instance, shown when "Has
   *  Action?"=true. Compose a real `<Button>`, `<Switch>`, or icon buttons —
   *  see file doc comment for why this isn't a single button + `onAction`.
   *  Ignored when `size="x-large"` (no Action Group exists on that variant). */
  action?: ReactNode;
}

export const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  function SectionHeader(
    {
      size = "x-large",
      usage = "default",
      icon,
      title,
      subtitle,
      action,
      className,
      ...props
    },
    ref,
  ) {
    const showAction = size !== "x-large" && action != null;

    return (
      <div
        ref={ref}
        className={cn("flex w-full", ROOT_LAYOUT[size], className)}
        {...props}
      >
        {icon && (
          <span className="flex shrink-0 items-center justify-center">
            {icon}
          </span>
        )}

        <div className={cn("flex min-w-0 flex-1 flex-col", CONTENT_GAP[size])}>
          <h2 className={cn("truncate", HEADING_STYLE[size][usage])}>
            {title}
          </h2>
          {subtitle && (
            <p className={cn("truncate", SUBTITLE_STYLE[size][usage])}>
              {subtitle}
            </p>
          )}
        </div>

        {showAction && (
          <div className="flex shrink-0 items-center">{action}</div>
        )}
      </div>
    );
  },
);
