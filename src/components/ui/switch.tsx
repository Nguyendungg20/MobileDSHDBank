"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Switch — mirrors the Figma component set "Switchers" (page ❖ Switchers (Toggles),
 * fileKey 3wFivMDO6P0heqk4YPLJQF, node 13740:39102).
 *
 * Figma → code naming: Figma calls this component "Switchers"; renamed to `Switch`
 * here (idiomatic React — "Switchers" reads oddly in JSX) and shipped as
 * `switch.tsx`.
 *
 * Figma component-set description (verbatim, Vietnamese):
 *   "Còn gọi là "Toggle"
 *   Nếu user bật/tắt một tính năng trong form có button submit, đổi sang dùng
 *   Checkbox"
 * i.e. also called "Toggle"; if the user is switching a feature on/off inside a
 * form that has its own submit button, use Checkbox instead — a Switch commits
 * its change immediately, a Checkbox only commits when the form is submitted.
 * ("Thường được đặt trong List Item" — usually placed inside a List Item, which
 * is why this component ships with no built-in label: List Item supplies it.)
 *
 * Figma axes → props:
 *   On?       → `checked` / `defaultChecked` (boolean)
 *   Disabled? → `disabled` — a real, direct boolean map. As with Checkbox (and
 *               unlike Button's loading state), there is no case where the
 *               element must be natively disabled while rendering as non-disabled,
 *               so styling keys off the `disabled` prop/attribute rather than a
 *               `data-state` attribute.
 *   There is no Size axis on this component set — Figma ships exactly one size.
 *
 * Geometry — read off the actual nodes, not eyeballed:
 *   Track 52×32, fully rounded ends (a stadium/pill — `rounded-full`, per this
 *   DS's convention that a corner radius this large is never a literal token).
 *   Thumb 28×28, inset 2px from every edge of the track; travels 20px
 *   (52 − 28 − 2 − 2) between the off and on positions.
 *
 * Colour provenance — flagged, not guessed:
 *   This component's internal layers are literally named "iOS System / Switches /
 *   On|Off" and most are UNSTYLED raw hex that matches Apple's native iOS switch
 *   exactly (#34C759 on-track, rgba(120,120,128,0.16) off-track) — this reads as
 *   an Apple system-kit asset pasted in and only partially reskinned to this DS's
 *   tokens:
 *     - on + disabled DOES carry a real style, "Semantic/Green/2" → `green-2`.
 *     - off + disabled DOES carry real styles, "Neutral/3" fill + "Neutral/5"
 *       stroke → `neutral-3` / `neutral-5`.
 *     - on + enabled and off + enabled are unstyled raw hex tied to no Figma
 *       style at all (not `remote: true` — simply never named). The DESIGNER HAS
 *       RULED (2026-07): use the DS tokens `green-6` / `neutral-4`, following this
 *       DS's "brand hue = the ramp's /6 step" convention — NOT Apple's #34C759.
 *       So the switch is intentionally the brand green, not the iOS system green,
 *       and the Figma layers still need reskinning to match this code.
 *   The thumb fill is consistently the named style "Brand/Solid/White" →
 *   `brand-white` across all four states — the one part of this component that
 *   IS fully tokenized.
 *   The thumb also carries a two-layer drop shadow (0 3px 1px black/6%,
 *   0 3px 8px black/15%) — Apple's stock iOS switch-knob shadow. It doesn't match
 *   any of this DS's shadow-1..5 elevation styles, so it's kept as an arbitrary
 *   value here rather than forced onto the wrong token (mirrors how Button's
 *   press-overlay was a one-off, not a fit for an existing token — except here
 *   the constraint on this task is "don't touch tokens.css", so it stays inline;
 *   worth promoting to a named token later).
 *   Only the off + enabled thumb carries an extra hairline border (0.5px solid
 *   black at 4% opacity, OUTSIDE align) — again unstyled, again Apple's stock
 *   knob treatment, and again NOT shared by the other three states (per this
 *   DS's rule to never infer one state's styling from a sibling's).
 */

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Figma: On? */
  checked?: boolean;
  defaultChecked?: boolean;
  /** Fires with the new checked value, alongside the native onChange. */
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  function Switch(
    {
      checked,
      defaultChecked = false,
      disabled = false,
      onChange,
      onCheckedChange,
      className,
      id,
      ...props
    },
    ref,
  ) {
    // Mirrors Checkbox's approach: track checked state in React so styling is
    // deterministic for both controlled and uncontrolled usage.
    const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked);
    const isControlled = checked !== undefined;
    const isChecked = isControlled ? !!checked : uncontrolledChecked;

    // Explicit state → class map (mirrors Checkbox's BOX_STATUS/BOX_DISABLED
    // split). No track carries a visible border: the off+disabled node in Figma
    // has a stroke colour (Neutral/5) but strokeWeight 0, so it renders none —
    // an earlier port mistook the colour for a 1px border and drew a grey ring
    // that isn't in the design.
    const trackColor = disabled
      ? isChecked
        ? "bg-green-2" // Figma: Semantic/Green/2 (named style)
        : "bg-neutral-3" // Figma: Neutral/3 fill, no border (stroke weight 0)
      : isChecked
        ? "bg-green-6" // Figma: unstyled raw #34C759 (Apple system green) — mapped to green-6
        : "bg-neutral-4"; // Figma: unstyled raw rgba(120,120,128,0.16) — mapped to neutral-4

    return (
      <span className={cn("relative inline-flex h-32 w-52 shrink-0", className)}>
        <input
          ref={ref}
          id={id}
          type="checkbox"
          role="switch"
          aria-checked={isChecked}
          checked={isControlled ? checked : undefined}
          defaultChecked={isControlled ? undefined : defaultChecked}
          disabled={disabled}
          onChange={(e) => {
            if (!isControlled) setUncontrolledChecked(e.target.checked);
            onChange?.(e);
            onCheckedChange?.(e.target.checked);
          }}
          className="peer absolute inset-0 z-10 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          {...props}
        />
        {/* Track — Figma: 52×32, stadium-rounded. */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 rounded-full transition-colors",
            trackColor,
          )}
        />
        {/* Thumb — Figma: 28×28, inset 2px, 20px travel, Brand/Solid/White fill. */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute top-2 left-2 size-28 rounded-full bg-brand-white transition-transform",
            "shadow-[0_3px_1px_rgba(0,0,0,0.06),0_3px_8px_rgba(0,0,0,0.15)]",
            isChecked && "translate-x-20",
            // Only the off+enabled state carries this hairline in Figma. Uses an
            // explicit rgba(...) arbitrary value rather than `border-black/[…]`:
            // this DS has no generic `black` token (only `brand-black`), so that
            // utility silently resolves to `currentColor` instead of erroring —
            // exactly the kind of drift AGENTS.md warns a token-only theme should
            // catch at build time, except here it slipped through silently.
            !disabled && !isChecked && "border-[0.5px] border-[rgba(0,0,0,0.04)]",
          )}
        />
      </span>
    );
  },
);
