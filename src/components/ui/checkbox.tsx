"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Checkbox — mirrors the Figma component set "Checkbox" (page ❖ Checkbox).
 *
 * Figma component description (verbatim, Vietnamese):
 *   "Checkbox cho phép chọn nhiều giá trị cùng lúc, không giới hạn một lựa chọn
 *   duy nhất. Thường được đặt trong List Item."
 *   ("Checkbox allows selecting multiple values at once, not limited to a single
 *   choice. Usually placed inside a List Item.")
 *
 * Figma axes → props:
 *   Size        → `size`     (small 16 / large 24, label text drops 14→12)
 *   Disabled?   → `disabled` (a real, boolean, 1:1 map — unlike Button's loading
 *                 state, there is no case here where the element is natively
 *                 disabled yet must render as non-disabled, so — unlike Button —
 *                 disabled styling keys off the `disabled` prop directly rather
 *                 than a `data-state` attribute)
 *   Status      → derived tri-state: unchecked | checked | indeterminate.
 *                 `indeterminate` has no HTML *attribute* — only an imperative
 *                 DOM property — so it's applied via ref in an effect and also
 *                 drives styling directly (Figma treats it as its own Status,
 *                 visually identical to checked).
 *   "💬 Show Label" (boolean, default true)   → `showLabel`
 *   "↳Edit Label"   (text, default "Label")   → `label`
 *
 * Figma guidance carried on the example rows (Vietnamese, verbatim):
 *   - "Mặc định khi thiết kế giao diện" — default state to use when designing.
 *   - "Chỉ sử dụng khi có option 'Chọn tất cả/Select all'" — the indeterminate
 *     Status is only for a "select all" checkbox, not general use.
 *   - "Mặc định Show Label khi thiết kế giao diện" — Show Label defaults on.
 *
 * Every colour/radius below was read off the Figma nodes rather than inferred.
 */

export type CheckboxSize = "small" | "large";

type CheckboxStatus = "unchecked" | "checked" | "indeterminate";

/** Figma: small box 16 / large box 24, icon 10 / 16, gap 6 / 10, label 12 / 14. */
const SIZE: Record<
  CheckboxSize,
  { box: string; icon: string; gap: string; text: string }
> = {
  small: { box: "size-16", icon: "size-10", gap: "gap-6", text: "text-caption1" },
  large: { box: "size-24", icon: "size-16", gap: "gap-10", text: "text-subheadline" },
};

/**
 * Box fill/stroke by Status, enabled only. Checked and indeterminate are
 * visually identical (Brand/Solid/Red fill + stroke).
 *
 * Radius is deliberately NOT here: it is uniform across every Status and
 * disabled combination. See the box's base classes.
 */
const BOX_STATUS: Record<CheckboxStatus, string> = {
  unchecked: "bg-brand-white border-neutral-5",
  checked: "bg-brand-red border-brand-red",
  indeterminate: "bg-brand-red border-brand-red",
};

/** Disabled overrides fill/stroke the same way for every Status. */
const BOX_DISABLED = "bg-neutral-2 border-neutral-4";

/** Check/minus glyph colour: white when enabled, Neutral/4 when disabled. */
const ICON_COLOR = { enabled: "text-brand-white", disabled: "text-neutral-4" };

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** Figma: Size — renamed from the native `size` attribute (meaningless on a
   *  checkbox input, but present in its HTML type). */
  size?: CheckboxSize;
  /** Figma: Status="indeterminate". Applied to the DOM node imperatively (ref
   *  effect) since HTML has no `indeterminate` attribute, only a JS property. */
  indeterminate?: boolean;
  /** Figma: "💬 Show Label" boolean, default true. */
  showLabel?: boolean;
  /** Figma: "↳Edit Label" text, default "Label". Rendered only if showLabel. */
  label?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      size = "small",
      indeterminate = false,
      showLabel = true,
      label = "Label",
      disabled = false,
      checked,
      defaultChecked,
      onChange,
      className,
      id,
      ...props
    },
    ref,
  ) {
    // Mirrors the input's checked state in React so styling stays deterministic
    // for both controlled and uncontrolled usage (the box's fill/stroke/radius
    // must not depend on CSS pseudo-class cascade order).
    const [uncontrolledChecked, setUncontrolledChecked] = useState(
      defaultChecked ?? false,
    );
    const isControlled = checked !== undefined;
    const isChecked = isControlled ? !!checked : uncontrolledChecked;

    const innerRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

    // Canonical way to apply `indeterminate`: it is a DOM property, not an
    // HTML attribute, so React can't set it via props.
    useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    const status: CheckboxStatus = indeterminate
      ? "indeterminate"
      : isChecked
        ? "checked"
        : "unchecked";

    const sizing = SIZE[size];
    const iconColor = disabled ? ICON_COLOR.disabled : ICON_COLOR.enabled;

    return (
      <label
        className={cn(
          "inline-flex items-center",
          sizing.gap,
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          className,
        )}
      >
        <span className={cn("relative inline-flex shrink-0", sizing.box)}>
          <input
            ref={innerRef}
            id={id}
            type="checkbox"
            checked={isControlled ? checked : undefined}
            defaultChecked={isControlled ? undefined : defaultChecked}
            disabled={disabled}
            onChange={(e) => {
              if (!isControlled) setUncontrolledChecked(e.target.checked);
              onChange?.(e);
            }}
            className="peer absolute inset-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
            {...props}
          />
          <span
            aria-hidden
            className={cn(
              // Figma authors the unchecked and disabled boxes at radius 5 and the
              // filled checked/indeterminate ones at 4 — an inconsistency in the
              // file, and 5 breaks the DS's own "multiples of 4, never 0" rule.
              // Normalised to 4 on the designer's call; Figma to be corrected.
              "pointer-events-none flex items-center justify-center rounded-4 border-[1.5px] transition-colors",
              sizing.box,
              disabled ? BOX_DISABLED : BOX_STATUS[status],
            )}
          >
            {status === "checked" && (
              <CheckIcon className={cn(sizing.icon, iconColor)} />
            )}
            {status === "indeterminate" && (
              <MinusIcon className={cn(sizing.icon, iconColor)} />
            )}
          </span>
        </span>
        {showLabel && (
          <span className={cn(sizing.text, "font-regular text-brand-black")}>
            {label}
          </span>
        )}
      </label>
    );
  },
);
