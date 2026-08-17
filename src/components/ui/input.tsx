"use client";

import {
  forwardRef,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Input — mirrors the Figma component set "Input" (page "❖ Input, OTP & PIN
 * Input", node 7678:49377).
 *
 * Figma component description (verbatim, Vietnamese):
 *   "Dùng để nhập text, sđt, số tiền. Có thể dùng như 1 dạng Dropdown: Xem UI
 *   tại doc."
 *   ("Used to enter text, phone number, amount. Can also be used as a kind of
 *   Dropdown: see the doc for that UI.")
 *
 * Figma axes → props:
 *   Type ("text" | "phone-number" | "amount-number") → `variant`. Only
 *     "text" and "phone-number" are ported here. "amount-number" is a
 *     structurally different composite in the file — a different height
 *     (310×100 vs 399×74), a bound Currency picker, and an "Has
 *     Exchange-rate?" row — and was left out of this pass; see the report.
 *   :state (default|focus|typing|filled|success|error|error-empty|disabled|
 *     disable-empty) → a `data-state` attribute carrying the *same* 9 values,
 *     derived from `disabled` / `status` / focus / has-a-value rather than
 *     the `:disabled`/`:focus` pseudo-classes. A disabled-and-empty field
 *     must render `disable-empty` (placeholder-style text, no floated
 *     label), not just a dimmed `disabled` — the same trap as Button's
 *     loading state, just on a different axis.
 *   "💬 Show Help-txt" (bool, default true) → implicit: pass `helperText` /
 *     `successText` / `errorText` and the hint row renders.
 *   "Required?" (bool, default false) → `required`.
 *   "👁️‍🗨️ Show Icon >" + "Change Icon >" (instance swap, default
 *     chevron_right) → `icon` prop; passing a node renders the suffix slot.
 *   "Show counter" (bool, default false) → `showCounter` (paired with
 *     `maxLength`).
 *
 * Layout facts read off the nodes, not inferred:
 *   - The field is a **bottom-border-only** control: strokeTopWeight/Right/
 *     Left = 0, strokeBottom = 1, and `fills` is empty (no background). Some
 *     state variants author cornerRadius as {12, 12, 0, 0} and others as
 *     {0, 0, 0, 0} — an inconsistency in the file — but since there is no
 *     fill to clip, neither is ever visible. Reported, not implemented.
 *   - The Label is a genuine *floating label*, not a CSS-only trick in
 *     Figma: the same text node sits at Subheadline/Body/Regular size in the
 *     placeholder's position while the field is empty and unfocused
 *     (`default`), then swaps to Caption1/Regular pinned above the value
 *     once focused or filled. Modelled here with real component state
 *     (focus + value tracking) so it behaves the same for controlled and
 *     uncontrolled usage.
 *   - Type=phone-number never uses a Label layer at all — it goes straight
 *     to a static "+84" prefix + placeholder ("000 000 000"), always
 *     visible, never floating.
 *   - Entered/typed text renders Brand/Solid/Black (confirmed on typing,
 *     filled, success and error); the floated Label caption stays
 *     Neutral/5 in every state including disabled.
 */

export type InputVariant = "text" | "phone-number";
export type InputStatus = "default" | "success" | "error";

type DataState =
  | "default"
  | "focus"
  | "typing"
  | "filled"
  | "success"
  | "error"
  | "error-empty"
  | "disabled"
  | "disable-empty";

/** Figma: Icon / Chevron_right — Neutral/5, stroke ~1.71, 24×24. Default suffix icon. */
export function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.71"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Figma: Icon / Cancel (Neutral/5) — the clear button shown in `typing`.
 * Exact vector geometry wasn't extracted (same call as Checkbox's icons);
 * this is a faithful stand-in: a filled circle with a plain white X.
 */
function CancelIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path
        d="M8.5 8.5l7 7M15.5 8.5l-7 7"
        stroke="var(--color-brand-white)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Figma: check_circle — vector fill Semantic/Green/6. */
function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.71" />
      <path
        d="M8 12.5l2.5 2.5L16 9.5"
        stroke="currentColor"
        strokeWidth="1.71"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Figma: "error" hint icon — vector fill Semantic/Red/6. */
function ErrorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.71" />
      <path d="M12 7.5v6" stroke="currentColor" strokeWidth="1.71" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="1" fill="currentColor" />
    </svg>
  );
}

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  /** Figma: Type. Only "text" and "phone-number" are ported. */
  variant?: InputVariant;
  /** Figma: the "Label" text layer. Doubles as the placeholder when the
   *  field is empty and unfocused — see the floating-label note above.
   *  `phone-number` ignores this for layout (no Label layer in Figma) but
   *  still uses it as the accessible name if given. */
  label?: string;
  /** Figma: "Required?". Renders a red asterisk next to the label. */
  required?: boolean;
  /** Figma: :state success/error, driven by validation rather than typing. */
  status?: InputStatus;
  /** Figma: "💬 Show Help-txt" content for the default/typing/focus states. */
  helperText?: ReactNode;
  /** Hint text + green check_circle icon when `status="success"`. */
  successText?: ReactNode;
  /** Hint text + red error icon when `status="error"`. */
  errorText?: ReactNode;
  /** Figma: "👁️‍🗨️ Show Icon >" / "Change Icon >". Renders the suffix slot
   *  when provided — defaults to none (Figma default is hidden). */
  icon?: ReactNode;
  /** Click handler for the suffix icon, e.g. opening a bottom-sheet when
   *  this Input is used "as a Dropdown" per the Figma description. */
  onIconClick?: () => void;
  /** Figma: "Show counter", paired with `maxLength` — e.g. "12/500". */
  showCounter?: boolean;
  /** `phone-number` only: the static prefix shown before the field. */
  countryCode?: string;
  /** className for the outer wrapper (field + hint row). */
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    variant = "text",
    label,
    required = false,
    status = "default",
    helperText,
    successText,
    errorText,
    icon,
    onIconClick,
    showCounter = false,
    countryCode = "+84",
    disabled = false,
    value,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    maxLength,
    type,
    inputMode,
    id,
    className,
    containerClassName,
    placeholder,
    "aria-label": ariaLabel,
    ...props
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = `${inputId}-hint`;

  const innerRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? "");
  const isControlled = value !== undefined;
  const currentValue = String((isControlled ? value : uncontrolledValue) ?? "");
  const hasValue = currentValue.length > 0;

  const [focused, setFocused] = useState(false);

  const state: DataState = disabled
    ? hasValue
      ? "disabled"
      : "disable-empty"
    : status === "error"
      ? hasValue
        ? "error"
        : "error-empty"
      : status === "success"
        ? "success"
        : focused
          ? hasValue
            ? "typing"
            : "focus"
          : hasValue
            ? "filled"
            : "default";

  // Only the "text" variant floats — Type=phone-number has no Label layer.
  const floated = variant === "text" && (focused || hasValue);

  const helpNode =
    state === "error" || state === "error-empty"
      ? errorText
      : state === "success"
        ? successText
        : helperText;

  const hintColor =
    state === "error" || state === "error-empty"
      ? "text-red-6"
      : state === "success"
        ? "text-green-6"
        : "text-neutral-5";

  // Figma: border-bottom colour by state. success/filled/disabled keep the
  // neutral border — only `typing` (Brand/Solid/Orange) and error/error-empty
  // (Semantic/Red/6) change it.
  const borderColor =
    state === "error" || state === "error-empty"
      ? "border-red-6"
      : state === "typing"
        ? "border-orange-6"
        : "border-neutral-3";

  const valueTextColor = disabled ? "text-neutral-4" : "text-brand-black";

  const handleClear = () => {
    const el = innerRef.current;
    if (!el) return;
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    )?.set;
    setter?.call(el, "");
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.focus();
  };

  const resolvedType = type ?? (variant === "phone-number" ? "tel" : "text");
  const resolvedInputMode =
    inputMode ?? (variant === "phone-number" ? "tel" : undefined);

  // "text": while unfloated, the Label text itself acts as the placeholder
  // (Figma reuses the same content for both). While floated, any caller-
  // supplied `placeholder` shows instead. "phone-number" always uses the
  // literal placeholder prop.
  const resolvedPlaceholder =
    variant === "text" ? (floated ? placeholder : label) : placeholder;

  return (
    <div className={cn("flex w-full flex-col gap-8", containerClassName)}>
      <div
        className={cn(
          "flex h-50 items-center gap-8 border-b transition-colors",
          borderColor,
        )}
      >
        <div className="flex h-50 flex-1 flex-col justify-center gap-4">
          {variant === "text" && label && (
            <label
              htmlFor={inputId}
              className={cn(
                "flex items-center gap-2 text-caption1 text-neutral-5",
                !floated && "sr-only",
              )}
            >
              {label}
              {required && <span className="text-red-6">*</span>}
              {showCounter && (
                <span className="ml-auto text-caption1 text-neutral-5">
                  {currentValue.length}
                  {maxLength != null ? `/${maxLength}` : ""}
                </span>
              )}
            </label>
          )}
          <div className="flex items-center gap-8">
            {variant === "phone-number" && (
              <span className={cn("shrink-0 text-subheadline", valueTextColor)}>
                {countryCode}
              </span>
            )}
            <input
              ref={innerRef}
              id={inputId}
              type={resolvedType}
              inputMode={resolvedInputMode}
              disabled={disabled}
              required={required}
              value={isControlled ? value : undefined}
              defaultValue={isControlled ? undefined : defaultValue}
              maxLength={maxLength}
              placeholder={resolvedPlaceholder}
              aria-label={!label ? ariaLabel : undefined}
              onFocus={(e) => {
                setFocused(true);
                onFocus?.(e);
              }}
              onBlur={(e) => {
                setFocused(false);
                onBlur?.(e);
              }}
              onChange={(e) => {
                if (!isControlled) setUncontrolledValue(e.target.value);
                onChange?.(e);
              }}
              data-state={state}
              aria-invalid={
                state === "error" || state === "error-empty" || undefined
              }
              aria-describedby={helpNode ? hintId : undefined}
              className={cn(
                "w-full min-w-0 bg-transparent text-subheadline outline-none",
                "placeholder:text-neutral-5",
                // Figma draws focus as the caret alone: `:state=focus` keeps the
                // Neutral/3 bottom border and shows a 2×21 ".Input / Cursor"
                // filled Brand/Solid/Orange. No ring — so the caret IS the focus
                // affordance here, which is why it must not be left at the
                // browser default.
                "caret-orange-6",
                valueTextColor,
                "disabled:cursor-not-allowed disabled:placeholder:text-neutral-4",
                className,
              )}
              {...props}
            />
            {variant === "text" && hasValue && focused && !disabled && (
              <button
                type="button"
                tabIndex={-1}
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleClear}
                aria-label="Clear"
                className="shrink-0"
              >
                <CancelIcon className="size-16 text-neutral-5" />
              </button>
            )}
          </div>
        </div>
        {icon && (
          <button
            type="button"
            onClick={onIconClick}
            disabled={disabled}
            tabIndex={onIconClick ? 0 : -1}
            aria-hidden={!onIconClick || undefined}
            className={cn(
              "flex size-24 shrink-0 items-center justify-center text-neutral-5",
              disabled && "text-neutral-4",
            )}
          >
            {icon}
          </button>
        )}
      </div>
      {helpNode && (
        <p id={hintId} className={cn("flex items-center gap-8 text-caption1", hintColor)}>
          {state === "success" && <CheckCircleIcon className="size-16 shrink-0" />}
          {(state === "error" || state === "error-empty") && (
            <ErrorIcon className="size-16 shrink-0" />
          )}
          {helpNode}
        </p>
      )}
    </div>
  );
});
