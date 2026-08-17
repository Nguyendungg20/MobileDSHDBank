"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Button — mirrors the Figma component set "Button" (page ❖ Button).
 *
 * Figma axes → props:
 *   Type  → `variant`   (renamed: `type` is taken by the HTML button attribute)
 *   Size  → `size`
 *   Style → `iconLeft` / `iconRight` / `iconOnly`
 *   State → derived: enabled is the base, `pressing` is :active, plus
 *           `disabled` and `loading` props.
 *
 * Every colour below was read off the Figma nodes rather than inferred. Note the
 * states are NOT a uniform overlay — each variant changes background its own way.
 */

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "underline-white"
  | "underline-gradient";

export type ButtonSize = "large" | "medium" | "small" | "x-small";

/**
 * Figma: large 56 / medium 48 / small 44 / x-small 32, label drops 16→14→12.
 * `min-w-*` equals the height per size: a button's minimum width is a circle, so
 * a content-hugging button that shrinks to just a spinner or a single icon reads
 * as a circle, never a squished oval. Text buttons are always wider than tall, so
 * this only rescues the degenerate icon/spinner-only case.
 */
const SIZE: Record<ButtonSize, string> = {
  large: "h-56 min-w-56 text-body",
  medium: "h-48 min-w-48 text-body",
  small: "h-44 min-w-44 text-subheadline",
  "x-small": "h-32 min-w-32 text-caption1",
};

/**
 * Styling keys off `data-state` (enabled | loading | disabled), mirroring Figma's
 * State axis, rather than the `:disabled` pseudo-class. The element IS natively
 * disabled while loading — you must not be able to click it — but Figma's loading
 * state keeps the enabled background, so borrowing `:disabled` for styling would
 * grey it out. `pressing` stays as `:active`, which only fires when interactive.
 */
const VARIANT: Record<ButtonVariant, string> = {
  // Gradient background, with #000 15% laid over it while pressed or loading.
  primary: cn(
    "bg-brand-gradient-h text-brand-white",
    "after:absolute after:inset-0 after:rounded-full after:bg-press-overlay",
    "after:opacity-0 after:transition-opacity",
    "active:data-[state=enabled]:after:opacity-100",
    "data-[state=loading]:after:opacity-100",
    "data-[state=disabled]:bg-none data-[state=disabled]:bg-neutral-4",
    "data-[state=disabled]:text-neutral-5",
  ),
  // Pressed swaps fill Neutral/2 → Neutral/3; disabled drops the border entirely.
  secondary: cn(
    "bg-neutral-2 border border-neutral-3 text-brand-black",
    "active:data-[state=enabled]:bg-neutral-3",
    "data-[state=disabled]:bg-neutral-4 data-[state=disabled]:border-transparent",
    "data-[state=disabled]:text-neutral-5",
  ),
  // Pressed tints the fill Red/1 and keeps the red border.
  tertiary: cn(
    "bg-brand-white border border-brand-red text-brand-red",
    "active:data-[state=enabled]:bg-red-1",
    "data-[state=disabled]:bg-neutral-3 data-[state=disabled]:border-neutral-4",
    "data-[state=disabled]:text-neutral-5",
  ),
  "underline-white": cn(
    "text-brand-red",
    "active:data-[state=enabled]:bg-neutral-2/50",
    "data-[state=disabled]:text-red-3",
  ),
  "underline-gradient": cn(
    "text-brand-white",
    "active:data-[state=enabled]:bg-neutral-2/20",
    "data-[state=disabled]:text-neutral-4",
  ),
};

const isUnderline = (v: ButtonVariant) => v.startsWith("underline");

function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "size-16 shrink-0 animate-spin rounded-full",
        "border-2 border-current border-t-transparent",
        className,
      )}
    />
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** Figma Style="icon <" */
  iconLeft?: ReactNode;
  /** Figma Style="icon >" */
  iconRight?: ReactNode;
  /** Figma Style="icon-only" — square, no horizontal padding. */
  iconOnly?: boolean;
  /** Stretch to the container width. Figma variants are drawn at a fixed 240. */
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "large",
      loading = false,
      disabled = false,
      iconLeft,
      iconRight,
      iconOnly = false,
      fullWidth = false,
      className,
      children,
      type = "button",
      ...props
    },
    ref,
  ) {
    const state = loading ? "loading" : disabled ? "disabled" : "enabled";

    return (
      <button
        ref={ref}
        type={type}
        // Natively disabled while loading so it cannot be double-submitted, even
        // though it does not render as the disabled state.
        disabled={disabled || loading}
        data-state={state}
        aria-busy={loading || undefined}
        className={cn(
          // cornerRadius is 1000 in Figma — a pill at every size.
          "relative isolate inline-flex items-center justify-center gap-8 rounded-full",
          "overflow-hidden font-semibold whitespace-nowrap",
          "transition-colors outline-none",
          "disabled:cursor-not-allowed",
          SIZE[size],
          VARIANT[variant],
          iconOnly ? "aspect-square px-0" : "px-16",
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {loading ? (
          <Spinner />
        ) : (
          <>
            {iconLeft}
            {children != null &&
              (isUnderline(variant) ? (
                // Figma builds the underline as a 1px bottom stroke on the label
                // frame (strokeBottom: 1, INSIDE), not text-decoration.
                <span className="border-b border-current">{children}</span>
              ) : (
                children
              ))}
            {iconRight}
          </>
        )}
      </button>
    );
  },
);
