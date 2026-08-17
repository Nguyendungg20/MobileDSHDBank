"use client";

import {
  forwardRef,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type InputHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

/**
 * SearchBar — mirrors the Figma component set "❖ Search Bar" (fileKey
 * 3wFivMDO6P0heqk4YPLJQF, page 13764:10387, frame "Search Bar" 7314:20267).
 *
 * Figma axes → props:
 *   Style (solid | outlined) → `variant`.
 *   :state (default | focus | typing | filled) → derived `data-state`, the
 *     same shape as Input's: driven by focus + has-a-value rather than the
 *     `:focus` pseudo-class, because "filled" (has a value, NOT focused)
 *     needs its own look — typed-black text, no caret — distinct from both
 *     "default" and "typing".
 *
 * There is NO `disabled` variant in this component set — the page only
 * defines 4 states × 2 styles (8 symbols total, confirmed via get_metadata).
 * `disabled` here is inferred from Input's convention (dim value text to
 * Neutral/5, block interaction) reusing only tokens already read off this
 * component. This is flagged in the port report as not sourced from Figma.
 *
 * Layout facts read off the nodes, not inferred:
 *   - Main-container: h-36, px-8 py-6, gap-8, single row, center-aligned.
 *     `cornerRadius` reads as **10** in Figma on every state — not a value
 *     on this DS's radius scale (4/8/12/16/20/24/32/full, per AGENTS.md).
 *     Mapped to the nearest token, `rounded-12` (equidistant from 8; 12
 *     read as the closer match to the pill-leaning proportions of a 36px
 *     search field). Flagged in the report, not silently rounded.
 *   - solid: fill "Neutral/2", no stroke.
 *   - outlined: fill "Brand/Solid/White", 1px stroke "Neutral/3".
 *   - Leading icon: shared icon-library "search" component (Style=Outlined),
 *     20×20, fill Neutral/5 — unchanged across every state.
 *   - Caret: an ".Input / Cursor" instance toggled by its own "Show?"
 *     boolean override — visible (Brand/Solid/Orange, 2×20, pill) only in
 *     `focus` and `typing`; hidden in `default` and `filled`. Modelled with
 *     the native `caret-orange-6` text-input caret (same approach as
 *     Input) since the browser already only paints a caret while focused —
 *     no extra DOM node needed to reproduce the same on/off behaviour.
 *   - Placeholder / value text style resolves to "Text/Body/Medium" — this
 *     textStyleId came back `remote: true` (a foreign/leaked style ref, see
 *     AGENTS.md's contamination note), so it was NOT trusted verbatim.
 *     Mapped to the nearest real DS type token: `text-body font-medium`.
 *     Color is Neutral/5 in default/focus (placeholder-style), Brand/Solid/
 *     Black in typing/filled (typed value) — exactly Input's convention.
 *   - Trailing (clear) icon: shared icon-library "cancel" component
 *     (Style=Filled, Neutral/5, ~17×17 within a 20×20 slot), visible ONLY
 *     in the `typing` state (focused AND has a value) — its visibility
 *     override is explicitly OFF in `filled` (has a value, blurred), which
 *     differs from Input's "show whenever hasValue && focused" rule only in
 *     that Input has no `filled`+focused overlap to begin with. Matched
 *     here exactly: the clear button hides again on blur.
 *   - Designer sticky note on the page (verbatim): "Truncate text: Max 1
 *     line" → `truncate` applied to the input text.
 *   - No trailing "Cancel" text-button affordance exists anywhere in this
 *     component set or on the page — not composed here. Flagged as absent
 *     in the report rather than invented.
 *   - Native WebKit search decorations (`::-webkit-search-cancel-button` /
 *     `-decoration`) are suppressed since the custom clear button above
 *     already reproduces Figma's cancel icon — leaving both would double
 *     up in Safari/Chrome.
 */

export type SearchBarVariant = "solid" | "outlined";

type DataState = "default" | "focus" | "typing" | "filled" | "disabled";

/** Figma: icon-library "search" component, Style=Outlined — Neutral/5, 20×20.
 *  Exact vector geometry wasn't extracted (same limitation as Input's
 *  icons); this is a faithful stand-in built from the same stroke weight. */
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="8.5" cy="8.5" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M17 17l-3.8-3.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Figma: icon-library "cancel" component, Style=Filled — Neutral/5, ~17×17. */
function CancelIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="10" fill="currentColor" />
      <path
        d="M6.8 6.8l6.4 6.4M13.2 6.8l-6.4 6.4"
        stroke="var(--color-brand-white)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export interface SearchBarProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** Figma: Style. */
  variant?: SearchBarVariant;
  /** Accessible name for the field. Figma has no separate Label layer on
   *  this component — the placeholder carries the visible copy — so this
   *  renders visually-hidden via a real <label>, falling back to
   *  `aria-label`/`placeholder` when omitted. */
  label?: string;
  /** Not part of the Figma component set — see the file doc comment. */
  disabled?: boolean;
  /** className for the outer pill/box wrapper. */
  containerClassName?: string;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  function SearchBar(
    {
      variant = "solid",
      label,
      disabled = false,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      id,
      className,
      containerClassName,
      placeholder = "Search",
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) {
    const autoId = useId();
    const inputId = id ?? autoId;

    const innerRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? "");
    const isControlled = value !== undefined;
    const currentValue = String((isControlled ? value : uncontrolledValue) ?? "");
    const hasValue = currentValue.length > 0;

    const [focused, setFocused] = useState(false);

    const state: DataState = disabled
      ? "disabled"
      : focused
        ? hasValue
          ? "typing"
          : "focus"
        : hasValue
          ? "filled"
          : "default";

    // Figma: solid = fill Neutral/2, no stroke. outlined = fill Brand/Solid/
    // White, 1px stroke Neutral/3. Unchanged by state in the source file.
    const containerColor =
      variant === "outlined"
        ? "bg-brand-white border border-neutral-3"
        : "bg-neutral-2 border border-transparent";

    // Figma: typed value is Brand/Solid/Black (typing, filled); placeholder-
    // style text stays Neutral/5 (default, focus). Disabled dims further —
    // not a Figma value, see file doc comment.
    const textColor =
      state === "disabled"
        ? "text-neutral-4"
        : state === "typing" || state === "filled"
          ? "text-brand-black"
          : "text-neutral-5";

    const iconColor = state === "disabled" ? "text-neutral-4" : "text-neutral-5";

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

    return (
      <div
        className={cn(
          "flex h-36 items-center gap-8 rounded-12 px-8 py-6 transition-colors",
          containerColor,
          disabled && "cursor-not-allowed",
          containerClassName,
        )}
      >
        <SearchIcon className={cn("size-20 shrink-0", iconColor)} />
        {label && (
          <label htmlFor={inputId} className="sr-only">
            {label}
          </label>
        )}
        <input
          ref={innerRef}
          id={inputId}
          type="search"
          disabled={disabled}
          value={isControlled ? value : undefined}
          defaultValue={isControlled ? undefined : defaultValue}
          placeholder={placeholder}
          aria-label={!label ? (ariaLabel ?? placeholder) : undefined}
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
          className={cn(
            "w-full min-w-0 truncate bg-transparent text-body font-medium outline-none",
            "placeholder:text-neutral-5",
            // Figma draws focus as the caret alone (Brand/Solid/Orange, no
            // ring) — the caret IS the focus affordance, so it must not be
            // left at the browser default. See Input's identical note.
            "caret-orange-6",
            // Suppress native WebKit search decorations — the custom clear
            // button below already reproduces Figma's cancel icon.
            "[&::-webkit-search-cancel-button]:appearance-none",
            "[&::-webkit-search-decoration]:appearance-none",
            textColor,
            "disabled:cursor-not-allowed disabled:placeholder:text-neutral-4",
            className,
          )}
          {...props}
        />
        {state === "typing" && (
          <button
            type="button"
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleClear}
            aria-label="Clear search"
            className="shrink-0"
          >
            <CancelIcon className="size-16 text-neutral-5" />
          </button>
        )}
      </div>
    );
  },
);
