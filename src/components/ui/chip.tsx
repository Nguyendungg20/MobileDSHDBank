"use client";

import {
  forwardRef,
  type HTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Chip — mirrors the Figma component set "Chip" (page ❖ Chip).
 *
 * Figma description (kept verbatim, Vietnamese):
 *   "Chips giúp user chọn lựa, filter hoặc trigger action quan trọng
 *    Thường đi theo set/group
 *    Text trong chips ngắn gọn, hug theo nội dung
 *    Hay dùng trong: Filter & sorting, Selecting options, Information
 *    categorization, Suggestion screen"
 *
 * Figma axes → props:
 *   Size            → `size` ("small" pill / "large" card, radius differs: 999 vs 12)
 *   State           → derived: enabled is the base, `pressing` is :active, plus
 *                     `selected` and `disabled` props (see data-state note below).
 *   On White-bg?    → `onWhiteBg` — Chip is drawn twice in Figma, once for placement
 *                     over the brand gradient (false, the default) and once over a
 *                     plain white surface (true). Every non-selected/non-disabled
 *                     surface swaps a *filled* look for a *bordered* look; it is NOT
 *                     a uniform overlay — read every combination below.
 *   Show Icon >     → `trailingIcon` (small only) — a decorative affordance (e.g. a
 *                     dropdown chevron), hidden unless supplied, exactly like Figma's
 *                     boolean defaults to false.
 *   Change Icon >   → repurposed as `onRemove` — when supplied, the trailing icon
 *                     becomes a REAL, independently-focusable remove button instead
 *                     of a decorative glyph (see a11y note below).
 *   [L] Icon < /
 *   Header-txt /
 *   Sub-txt         → `leadingIcon` / `header` / `subtext` (large only) — the large
 *                     variant is a richer card: leading icon, header line, label,
 *                     sub line, stacked vertically. Header-txt and Sub-txt are
 *                     ALWAYS Neutral/5 regardless of state (confirmed by reading
 *                     every state, including disabled, where they stay Neutral/5)
 *                     — only the Label line's colour changes with state.
 *
 * Styling keys off `data-state` (default | selected | disabled), mirroring Figma's
 * State axis, rather than the `:disabled` pseudo-class — consistent with Button.
 * `pressing` stays as `:active`, which only fires on interactive elements.
 *
 * Accessibility note on remove: a <button> cannot contain another interactive
 * descendant (the HTML spec treats any `tabIndex`-bearing element as "interactive
 * content", which button's content model forbids). So when `onRemove` is passed,
 * the root is NOT a <button> — it's a non-interactive wrapper holding the label
 * plus one real <button ref={ref}> for the remove affordance, which MUST get its
 * own accessible name (`removeLabel`). Without `onRemove`, the whole chip is a
 * single <button> (a toggle — aria-pressed reflects `selected`), matching Figma's
 * single-shape chip and Button.tsx's pattern.
 */

export type ChipSize = "small" | "large";

const isLarge = (size: ChipSize) => size === "large";

/** Figma: small = 40 tall pill (cornerRadius 999); large = card (cornerRadius 12). */
const RADIUS: Record<ChipSize, string> = {
  small: "rounded-full",
  large: "rounded-12",
};

/**
 * Fill + border per (size, onWhiteBg, state). Read off every one of the 16 Figma
 * variants rather than assumed:
 *  - Disabled and pressing SHARE the same Neutral/2 fill in every combination —
 *    they differ only in text colour (and, on white-bg, not even that: the border
 *    is identical too).
 *  - onWhiteBg=false NEVER shows a border, in ANY state — including selected,
 *    where Figma still carries a strokeWeight of 2 but an empty stroke paint.
 *  - onWhiteBg=true ALWAYS shows a Neutral/3 border except when selected, where it
 *    becomes a 2px Brand/Solid/Red border. Large's "always" border is 1.5px
 *    (not 1 or 2) — an exact Figma value, hence the arbitrary value below.
 *  - Selected is white-fill with red border (white-bg) or borderless white-fill
 *    (gradient-bg) in both sizes; never a red fill.
 */
function surfaceClasses(size: ChipSize, onWhiteBg: boolean) {
  const restBorderWidth = isLarge(size) ? "border-[1.5px]" : "border";
  return cn(
    "bg-brand-white/50",
    "active:data-[state=default]:bg-neutral-2",
    "data-[state=selected]:bg-brand-white",
    "data-[state=disabled]:bg-neutral-2",
    onWhiteBg && [
      "bg-brand-white",
      restBorderWidth,
      "border-neutral-3",
      "data-[state=selected]:border-2 data-[state=selected]:border-brand-red",
    ],
  );
}

/** Label colour: black by default/pressing, red when selected, Neutral/5 when disabled. */
const LABEL_TEXT = cn(
  "text-brand-black",
  "data-[state=selected]:text-brand-red",
  "data-[state=disabled]:text-neutral-5",
);

/** Header-txt / Sub-txt are always Neutral/5 — confirmed across every state read. */
const MUTED_TEXT = "text-neutral-5";

/**
 * Note: the base is `HTMLAttributes<HTMLElement>` rather than
 * `ButtonHTMLAttributes<HTMLButtonElement>` — the root renders as a <button>
 * normally, but as a non-interactive <span> wrapper when `onRemove` is set (see
 * the a11y note above), so button-only attributes (`form`, `formAction`, …)
 * cannot be part of this contract.
 */
export interface ChipProps extends Omit<HTMLAttributes<HTMLElement>, "onClick"> {
  size?: ChipSize;
  /** Figma State=selected. Rendered as a toggle: sets `aria-pressed`. */
  selected?: boolean;
  disabled?: boolean;
  /** Figma "On White-bg?" — false (default) = drawn over the brand gradient. */
  onWhiteBg?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;

  /** Small only — Figma "Show Icon >", decorative (e.g. a dropdown chevron). */
  trailingIcon?: ReactNode;
  /**
   * Small only — repurposes the trailing icon slot as a remove control (Figma's
   * "Change Icon >" swapped to a close glyph). Requires `removeLabel`.
   */
  onRemove?: () => void;
  /** Accessible name for the remove button, e.g. "Remove Hà Nội". Required with `onRemove`. */
  removeLabel?: string;
  /** Glyph for the remove button. Defaults to a plain "×" so no icon asset is required. */
  removeIcon?: ReactNode;
  /** Extra props for the remove <button> when `onRemove` is set (e.g. `id`). */
  removeButtonProps?: HTMLAttributes<HTMLButtonElement>;

  /** Large only — Figma "[L] Icon <" / "Change Icon <". */
  leadingIcon?: ReactNode;
  /** Large only — Figma "Header-txt". */
  header?: ReactNode;
  /** Large only — Figma "Sub-txt". */
  subtext?: ReactNode;
}

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  {
    size = "small",
    selected = false,
    disabled = false,
    onWhiteBg = false,
    trailingIcon,
    onRemove,
    removeLabel,
    removeIcon = "×",
    removeButtonProps,
    leadingIcon,
    header,
    subtext,
    className,
    children,
    onClick,
    ...props
  },
  ref,
) {
  const state = disabled ? "disabled" : selected ? "selected" : "default";
  const large = isLarge(size);

  const rootClassName = cn(
    "relative inline-flex text-left transition-colors outline-none",
    "data-[state=disabled]:cursor-not-allowed",
    RADIUS[size],
    surfaceClasses(size, onWhiteBg),
    // Label colour lives HERE, on the element that actually carries `data-state`
    // (Tailwind's `data-[state=x]:` variant only matches the element with that
    // attribute, never an ancestor's — it does not cascade like `group-data-*`
    // would). The Label span below has no colour class of its own; it inherits
    // via `currentColor`, same as Button's icon/underline children do.
    LABEL_TEXT,
    large
      ? "items-start gap-8 p-16"
      : "h-40 items-center gap-4 px-16 py-8 data-[state=selected]:gap-8",
    className,
  );

  const content = large ? (
    <>
      {leadingIcon && (
        <span aria-hidden className="flex shrink-0 items-center justify-center self-stretch">
          {leadingIcon}
        </span>
      )}
      <span className="flex flex-col items-start gap-4">
        {header && <span className={cn("text-caption1 font-regular", MUTED_TEXT)}>{header}</span>}
        <span className="text-body font-medium">{children}</span>
        {subtext && <span className={cn("text-caption1 font-regular", MUTED_TEXT)}>{subtext}</span>}
      </span>
    </>
  ) : (
    <>
      <span className="text-subheadline font-medium whitespace-nowrap">{children}</span>
      {trailingIcon && (
        <span aria-hidden className="shrink-0">
          {trailingIcon}
        </span>
      )}
    </>
  );

  // Removable: the root cannot be a <button> (interactive content is not allowed
  // inside button's content model), so it becomes a static wrapper and the remove
  // affordance is the one real, independently focusable <button>.
  if (onRemove) {
    return (
      <span className={rootClassName} data-state={state} {...props}>
        {content}
        <button
          ref={ref}
          type="button"
          disabled={disabled}
          onClick={onRemove}
          aria-label={removeLabel}
          className={cn(
            "-mr-4 flex size-16 shrink-0 items-center justify-center rounded-full",
            "outline-none",
            "disabled:cursor-not-allowed",
            LABEL_TEXT,
          )}
          data-state={state}
          {...removeButtonProps}
        >
          {removeIcon}
        </button>
      </span>
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      data-state={state}
      aria-pressed={selected}
      onClick={onClick}
      className={rootClassName}
      {...props}
    >
      {content}
    </button>
  );
});
