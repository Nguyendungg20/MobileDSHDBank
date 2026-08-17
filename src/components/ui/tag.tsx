"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Tag — mirrors the Figma component set "Tag" (page ❖ Tags, node 202:215536).
 *
 * Figma axis → prop:
 *   "New tag" (false | true) → `variant` ("default" | "new")
 *
 * This is NOT a colour-by-semantic status label — that's what Badge models
 * (see badge.tsx). This component set has exactly TWO members, no Size or
 * State axis at all:
 *   - default (New tag=false): an existing, removable tag pill — leading
 *     "local_offer" icon, a label ("Tag 1" in Figma), and a close (×)
 *     affordance.
 *   - new     (New tag=true):  a "+ New Tag" trigger pill — leading plus
 *     icon ("icon-add"), a label ("New Tag" in Figma), no close. Modeled
 *     here as a real <button> since the whole pill is the add-tag action.
 *
 * CONTAMINATION NOTE (flag for the designer to purge in Figma): every fill /
 * text / icon colour on this component set reads back with `fillStyleId` /
 * `textStyleId` = null — no named Paint/Text Style is applied — and the
 * label's `fontName.family` is "SF Pro", Apple's iOS system font, not this
 * DS's Be Vietnam Pro. This matches the known "iOS UI kit" leak documented
 * for this file: raw hex pasted in from a foreign kit rather than this DS's
 * styles. Colours below are mapped to the NEAREST real DS token (close, not
 * pixel-exact):
 *   fill   #F2F2F4 (default) → neutral-2 (#F3F4F6)
 *   fill   #FFFFFF (new)     → brand-white (exact)
 *   border #E5E5E5 (both)    → neutral-3 (#E5E7EB)
 *   text   #333333 (both)    → brand-black (EXACT — the one value that is
 *                              already a real DS colour)
 *   icon   #999999 (both)    → neutral-5 (#9DA4AE, nearest ramp step)
 * Font size 14 / Regular maps cleanly onto `text-subheadline font-regular`
 * (14px is an exact match; only the family/weight pairing was contaminated).
 */

export type TagVariant = "default" | "new";

const SURFACE: Record<TagVariant, string> = {
  default: "bg-neutral-2 border-neutral-3 text-brand-black",
  new: "bg-brand-white border-neutral-3 text-brand-black",
};

export interface TagProps extends Omit<HTMLAttributes<HTMLElement>, "onClick"> {
  variant?: TagVariant;
  /** Leading icon slot. Figma: "local_offer" for default, a plus glyph for new. */
  icon?: ReactNode;

  /** `default` only — shows a real, independently-focusable remove button. */
  onRemove?: () => void;
  /** Accessible name for the remove button, e.g. "Remove Tag 1". Required with `onRemove`. */
  removeLabel?: string;
  /** Glyph for the remove button. Defaults to a plain "×" so no icon asset is required. */
  removeIcon?: ReactNode;

  /** `new` only — the whole pill is the add-tag trigger action. */
  onClick?: () => void;
}

/**
 * Base is `HTMLAttributes<HTMLElement>` rather than a button-only type: the
 * `new` variant renders as `<button>`, but `default` renders as a plain
 * `<span>` unless `onRemove` is supplied, in which case it becomes a static
 * wrapper holding one real `<button>` for the remove affordance — a button
 * cannot contain another interactive descendant (same accessibility
 * constraint as Chip's `onRemove`).
 */
export const Tag = forwardRef<HTMLElement, TagProps>(function Tag(
  {
    variant = "default",
    icon,
    onRemove,
    removeLabel,
    removeIcon = "×",
    onClick,
    className,
    children,
    ...props
  },
  ref,
) {
  const rootClassName = cn(
    "inline-flex h-24 items-center gap-4 whitespace-nowrap rounded-4 border px-8",
    "text-subheadline font-regular outline-none",
    SURFACE[variant],
    className,
  );

  const content = (
    <>
      {icon && (
        <span aria-hidden className="shrink-0 leading-none text-neutral-5">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </>
  );

  if (variant === "new") {
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        onClick={onClick}
        className={rootClassName}
        {...(props as HTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  }

  if (onRemove) {
    return (
      <span ref={ref as React.Ref<HTMLSpanElement>} className={rootClassName} {...props}>
        {content}
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel}
          className="-mr-4 flex size-16 shrink-0 items-center justify-center rounded-full text-neutral-5 outline-none"
        >
          {removeIcon}
        </button>
      </span>
    );
  }

  return (
    <span ref={ref as React.Ref<HTMLSpanElement>} className={rootClassName} {...props}>
      {content}
    </span>
  );
});
