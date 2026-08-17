"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * List Item — mirrors the Figma component set "List Item"
 * (page ❖ Select: List Item, Select Dropdown, fileKey 3wFivMDO6P0heqk4YPLJQF,
 * node 7233:33316).
 *
 * Figma component-set description (verbatim, Vietnamese):
 *   "Dạng lựa chọn đơn giản, thường hiển thị trong list (radio/checkbox -
 *   selection, chevron-right navigation
 *   Thích hợp cho bottom sheet, form chọn phương án."
 *
 * Figma axes/properties → props:
 *   Type                                 → `variant` ("radio-button" | "checkbox" |
 *                                           "switchers" | "navigation" | "input")
 *   :state                               → derived, like Checkbox/Radio/Switch (and
 *                                           unlike Button): there is no case here
 *                                           where the row must stay natively
 *                                           interactive while rendering as
 *                                           non-disabled, so `disabled` drives
 *                                           styling directly. "pressing" is plain
 *                                           CSS `:active` — `pointer-events-none`
 *                                           on disabled means it can never fire
 *                                           there, so no extra gating is needed.
 *   "👁️‍🗨️ Show Icon <"                    → `leadingIcon` (rendered iff provided)
 *   nested "Size Large?" on the icon slot → `leadingIconSize` (24 / 40)
 *   "💬 Show Header-txt"                 → `header` (rendered iff provided; the
 *                                           `input` variant's node tree has no
 *                                           Header-txt layer at all, so it's
 *                                           ignored there rather than guessed)
 *   Label                                → `label` (always rendered)
 *   "Required?"                          → `required` (red "*" after the label)
 *   "💬 Show Sub-txt"                    → `subText` (rendered iff provided)
 *   "Has Info?"                          → `showInfo`
 *   "👁️‍🗨️ Show Icon >" (default true)     → `showChevron` — `navigation`/`input` only
 *   "(R)Label"                           → `value` — `input` only
 *   "💬 Show (R)Sub-txt" (default true)   → `showValueSubText` + `valueSubText`,
 *                                           `input` only
 *
 * This component does NOT render the Radio/Checkbox/Switch itself. Each of those
 * components' own doc comments say they are "usually placed inside a List Item" —
 * so the `control` slot is where a real `<Radio>`, `<Checkbox>` or `<Switch>` goes
 * (rendered with `showLabel={false}`: List Item already supplies the label).
 * `navigation` and `input` instead render a built-in chevron-right, matching
 * their Figma nodes (there is no control instance on those two variants).
 *
 * Every colour/spacing below was read off the Figma nodes rather than inferred,
 * including two asymmetries that do NOT extrapolate across variants — per this
 * DS's rule to never infer one state's/variant's styling from a sibling's:
 *   - radio-button/checkbox DROP the Neutral/3 bottom border entirely on both
 *     pressing and disabled. switchers/navigation/input KEEP the border in every
 *     state and layer the Neutral/2 press fill on top of it instead of replacing
 *     it.
 *   - On disabled, radio-button/checkbox dim Header-txt + Label + Sub-txt all to
 *     Neutral/4 uniformly. switchers/navigation/input dim ONLY the primary Label
 *     (and the info/chevron icons) to Neutral/4 — Header-txt and Sub-txt keep
 *     their enabled colour even while the row is disabled. This was confirmed
 *     directly on checkbox, navigation, switchers and input; radio-button's
 *     Icon/Info fill wasn't independently re-checked but its node tree is
 *     otherwise identical to checkbox's.
 *   - Sub-txt's rest colour itself differs by variant: Neutral/5 for
 *     radio-button/checkbox, Neutral/6 for switchers/navigation/input.
 */

export type ListItemVariant =
  | "radio-button"
  | "checkbox"
  | "switchers"
  | "navigation"
  | "input";

export type ListItemLeadingIconSize = "small" | "large";

/** Figma: nested ".List Item / Icons" component, "Size Large?"=no/yes. */
const LEADING_ICON_SIZE: Record<ListItemLeadingIconSize, string> = {
  small: "size-24",
  large: "size-40",
};

/** Figma: padding top/bottom 12 for every variant except `input`, which uses 8. Left/right padding is 0 — the parent List supplies 16px, per the Guidelines note "Khi đặt trong List, left/right padding của List Item = 16px". */
const ROW_PADDING: Record<ListItemVariant, string> = {
  "radio-button": "py-12",
  checkbox: "py-12",
  switchers: "py-12",
  navigation: "py-12",
  input: "py-8",
};

/**
 * radio-button/checkbox lose the Neutral/3 divider entirely on pressing and
 * disabled. switchers/navigation/input keep it in every state. See the file
 * doc comment — this is read directly off the nodes, not a rule to extrapolate.
 */
const DROPS_BORDER_WHEN_INACTIVE: Record<ListItemVariant, boolean> = {
  "radio-button": true,
  checkbox: true,
  switchers: false,
  navigation: false,
  input: false,
};

/** Sub-txt's rest colour differs by variant even before disabled is considered. */
const SUB_TEXT_COLOR: Record<ListItemVariant, string> = {
  "radio-button": "text-neutral-5",
  checkbox: "text-neutral-5",
  switchers: "text-neutral-6",
  navigation: "text-neutral-6",
  input: "text-neutral-6",
};

/** Only radio-button/checkbox dim Header-txt and Sub-txt on disabled; see file doc comment. */
const SECONDARY_TEXT_DIMS_ON_DISABLED: Record<ListItemVariant, boolean> = {
  "radio-button": true,
  checkbox: true,
  switchers: false,
  navigation: false,
  input: false,
};

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 11v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1" fill="currentColor" />
    </svg>
  );
}

export interface ListItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Figma: Type. */
  variant?: ListItemVariant;
  disabled?: boolean;
  /** Figma: "👁️‍🗨️ Show Icon <" — leading icon slot, rendered iff provided. */
  leadingIcon?: ReactNode;
  /** Figma: nested "Size Large?" on the icon slot — 24px small / 40px large. */
  leadingIconSize?: ListItemLeadingIconSize;
  /** Figma: "💬 Show Header-txt". No-op on `variant="input"` — its Figma node
   *  tree has no Header-txt layer at all. */
  header?: ReactNode;
  /** Figma: Label — the row's always-visible primary text. */
  label: ReactNode;
  /** Figma: "Required?" — appends a red "*" after the label. */
  required?: boolean;
  /** Figma: "💬 Show Sub-txt". */
  subText?: ReactNode;
  /** Figma: "Has Info?" — small info glyph to the right of the label block. */
  showInfo?: boolean;
  /** `radio-button`/`checkbox`/`switchers` only: drop in a real `<Radio>`,
   *  `<Checkbox>` or `<Switch>` (with `showLabel={false}` — List Item supplies
   *  the label). Ignored for `navigation`/`input`. */
  control?: ReactNode;
  /** Figma: "👁️‍🗨️ Show Icon >", default true. `navigation`/`input` only. */
  showChevron?: boolean;
  /** `input` only — Figma: "(R)Label", the current value shown on the right. */
  value?: ReactNode;
  /** `input` only — Figma: "(R)Sub-txt". */
  valueSubText?: ReactNode;
  /** `input` only — Figma: "💬 Show (R)Sub-txt", default true. */
  showValueSubText?: boolean;
}

export const ListItem = forwardRef<HTMLDivElement, ListItemProps>(
  function ListItem(
    {
      variant = "radio-button",
      disabled = false,
      leadingIcon,
      leadingIconSize = "small",
      header,
      label,
      required = false,
      subText,
      showInfo = false,
      control,
      showChevron = true,
      value,
      valueSubText,
      showValueSubText = true,
      className,
      ...props
    },
    ref,
  ) {
    const isInput = variant === "input";
    const dimsSecondary = SECONDARY_TEXT_DIMS_ON_DISABLED[variant];

    const labelColor = disabled ? "text-neutral-4" : "text-brand-black";
    const headerColor =
      disabled && dimsSecondary ? "text-neutral-4" : "text-neutral-7";
    const subTextColor =
      disabled && dimsSecondary ? "text-neutral-4" : SUB_TEXT_COLOR[variant];
    const iconColor = disabled ? "text-neutral-4" : "text-neutral-6";

    return (
      <div
        ref={ref}
        aria-disabled={disabled || undefined}
        className={cn(
          "flex w-full items-center gap-8 border-b transition-colors",
          ROW_PADDING[variant],
          disabled
            ? cn(
                "pointer-events-none cursor-not-allowed",
                DROPS_BORDER_WHEN_INACTIVE[variant]
                  ? "border-transparent"
                  : "border-neutral-3",
              )
            : cn(
                "cursor-pointer border-neutral-3 active:bg-neutral-2",
                DROPS_BORDER_WHEN_INACTIVE[variant] && "active:border-transparent",
              ),
          className,
        )}
        {...props}
      >
        {leadingIcon && (
          <span
            className={cn(
              "flex shrink-0 items-center justify-center",
              LEADING_ICON_SIZE[leadingIconSize],
            )}
          >
            {leadingIcon}
          </span>
        )}

        {isInput ? (
          <div className="flex flex-1 items-center justify-between gap-8">
            <div className="flex flex-col gap-2">
              <span
                className={cn(
                  "flex items-center gap-4 text-subheadline font-regular",
                  labelColor,
                )}
              >
                {label}
                {required && <span className="text-brand-red">*</span>}
              </span>
              {subText && (
                <span className={cn("text-caption1", subTextColor)}>{subText}</span>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={cn("text-subheadline font-semibold", labelColor)}>
                {value}
              </span>
              {showValueSubText && valueSubText && (
                <span className={cn("text-caption1", subTextColor)}>
                  {valueSubText}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-2">
            {header && (
              <span className={cn("text-caption1", headerColor)}>{header}</span>
            )}
            <span
              className={cn(
                "flex items-center gap-4 text-subheadline font-regular",
                labelColor,
              )}
            >
              {label}
              {required && <span className="text-brand-red">*</span>}
            </span>
            {subText && (
              <span className={cn("text-caption1", subTextColor)}>{subText}</span>
            )}
          </div>
        )}

        {showInfo && (
          <span
            className={cn(
              "flex size-24 shrink-0 items-center justify-center",
              iconColor,
            )}
          >
            <InfoIcon className="size-20" />
          </span>
        )}

        {(variant === "navigation" || isInput) && showChevron && (
          <span
            className={cn(
              "flex size-24 shrink-0 items-center justify-center",
              iconColor,
            )}
          >
            <ChevronRightIcon className="size-24" />
          </span>
        )}

        {(variant === "radio-button" ||
          variant === "checkbox" ||
          variant === "switchers") &&
          control && <span className="flex shrink-0 items-center">{control}</span>}
      </div>
    );
  },
);
