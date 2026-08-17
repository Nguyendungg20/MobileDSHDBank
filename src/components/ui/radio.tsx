"use client";

import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Radio — mirrors the Figma component set "Radio Button" (page ❖ Radio Button).
 *
 * Figma component-set description (verbatim, Vietnamese):
 *   "Radio cho phép user chọn 1 option duy nhất trong một nhóm
 *   Thường hiển thị theo nhóm từ 2-5 lựa chọn, nếu có nhiều hơn 5 lựa chọn, cân
 *   nhắc sử dụng Searchable List nếu thấy phù hợp
 *   Thường được đặt trong List Item"
 *
 * Figma axes → props:
 *   Size        → `size`     (small 16 / large 20, label caption1 → body, gap 6 → 8)
 *   Checked?    → derived from the native `checked`/`defaultChecked` value, mirrored
 *                 into React state (same reasoning as Checkbox) so ring/dot styling
 *                 never depends on CSS pseudo-class cascade order.
 *   Disabled?   → `disabled`, a real boolean 1:1 map — like Checkbox (and unlike
 *                 Button), there is no state here where the element is natively
 *                 disabled yet must render non-disabled, so styling keys off the
 *                 `disabled` prop directly rather than a `data-state` attribute.
 *   "💬 Show Label" (boolean, default true)   → `showLabel`
 *   "↳Edit Label"   (text, default "Label")   → `label`
 *
 * Figma models no separate group/wrapper component for Radio — grouping in the
 * file is just several instances placed side by side. So no wrapper is exported
 * here either: pass the same native `name` to every Radio in a group and the
 * browser handles single-selection and arrow-key navigation natively.
 *
 * Every colour/radius below was read off the Figma nodes rather than inferred.
 * Two things surfaced while porting that are deliberately NOT reflected in code:
 *   - Every unchecked variant carries a hidden (`visible: false`) inner "dot" node
 *     filled with a *remote* (foreign, non-DS) "Brand/Yellow" style. It never
 *     renders — dead leftover from duplication — so it's omitted entirely rather
 *     than ported. Flagged for the designer to purge from the file.
 *   - The checked/enabled ring's white fill resolves to a remote "Mono/White"
 *     style, while the unchecked ring's identical-looking white fill is the local
 *     "Brand/Solid/White". Same colour, foreign token on one side; both map to
 *     this DS's local `brand-white`.
 */

export type RadioSize = "small" | "large";

/** Figma: small box 16 / dot 10 / gap 6 / caption1 label; large box 20 / dot 12.5 / gap 8 / body label. */
const SIZE: Record<
  RadioSize,
  { box: string; dot: string; gap: string; text: string }
> = {
  small: { box: "size-16", dot: "size-10", gap: "gap-6", text: "text-caption1" },
  large: { box: "size-20", dot: "size-[12.5px]", gap: "gap-8", text: "text-body" },
};

/**
 * Ring fill/stroke by Checked?, enabled only. Figma: the stroke darkens from
 * Neutral/5 (unchecked) to Neutral/6 (checked) even though the fill stays white
 * in both — there is no uniform "selected" treatment to assume.
 */
const RING_STATUS: Record<"unchecked" | "checked", string> = {
  unchecked: "bg-brand-white border-neutral-5",
  checked: "bg-brand-white border-neutral-6",
};

/** Disabled overrides fill/stroke the same way regardless of Checked?. */
const RING_DISABLED = "bg-neutral-2 border-neutral-4";

/** Dot fill: brand red when enabled, Neutral/5 when disabled. Only rendered when checked. */
const DOT_COLOR = { enabled: "bg-brand-red", disabled: "bg-neutral-5" };

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** Figma: Size — renamed from the native `size` attribute (meaningless on a
   *  radio input, but present in its HTML type). */
  size?: RadioSize;
  /** Figma: "💬 Show Label" boolean, default true. */
  showLabel?: boolean;
  /** Figma: "↳Edit Label" text, default "Label". Rendered only if showLabel. */
  label?: ReactNode;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  function Radio(
    {
      size = "small",
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
    // for both controlled and uncontrolled usage — same reasoning as Checkbox.
    const [uncontrolledChecked, setUncontrolledChecked] = useState(
      defaultChecked ?? false,
    );
    const isControlled = checked !== undefined;
    const isChecked = isControlled ? !!checked : uncontrolledChecked;

    const sizing = SIZE[size];
    const dotColor = disabled ? DOT_COLOR.disabled : DOT_COLOR.enabled;

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
            ref={ref}
            id={id}
            type="radio"
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
              // Figma: cornerRadius 100 on a 16/20px box — a circle at every size.
              "pointer-events-none flex items-center justify-center rounded-full border-[1.5px] transition-colors",
              sizing.box,
              disabled
                ? RING_DISABLED
                : RING_STATUS[isChecked ? "checked" : "unchecked"],
            )}
          >
            {isChecked && (
              <span
                aria-hidden
                className={cn("rounded-full", sizing.dot, dotColor)}
              />
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
