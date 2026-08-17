"use client";

import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * OtpInput / PinInput — mirrors the Figma component set "OTP & PIN Input"
 * (page "❖ Input, OTP & PIN Input", node 7:192659; component-set frame
 * "OTP & PIN Input", node 7256:120631).
 *
 * Figma axes → props:
 *   Type ("OTP" | "PIN") → `mask` (`false` renders the digit, `true` masks
 *     it). The file itself treats these as one component: the shared
 *     default/focus/error states are literally authored once under the
 *     combined variant name "Type=PIN + OTP" — only the `typing` (mid-entry)
 *     and `filled` (complete) states are drawn twice, once per Type, because
 *     that's the only place the two actually look different (digit glyph vs.
 *     dot). That is why this file ships ONE component with a `mask` prop
 *     rather than two Figma-driven components — the design system itself
 *     models it that way.
 *   Usage ("large" | "small") → `size`. Box 36×56 / gap 8 / digit
 *     Large-Title-Semibold(32) for "large"; box 24×40 / gap 8 / digit
 *     Title2-Semibold(24) for "small". Per the file's own annotation (node
 *     15840:29308, Vietnamese): Large is for a ~3/4-screen bottom-sheet with
 *     the inline error centered; Small is for a ~1/2-screen sheet with the
 *     inline error left-aligned — both facts read directly off the two
 *     "OTP / Hint" text nodes' `textAlignHorizontal` (large: CENTER, small:
 *     LEFT), not guessed.
 *   :state (default | focus | typing | filled | error) → NOT a `data-state`
 *     enum prop like Button/Input. Per-box border colour was read off every
 *     box in every sampled state (large: nodes 13502:36834/9877:39054-58/
 *     7256:120605-615/7295:130778/13502:50560-426) and reduces to exactly
 *     three rules, keyed off each box's own content + focus, not a single
 *     state for the whole field:
 *       - box has no value, not focused            → border Neutral/4
 *       - box is the currently focused/empty box    → border Semantic/
 *         Orange/6 (same "Brand/Solid/Orange" asset Input uses for its
 *         caret — .Input/Cursor, node 7054:9141, fill Brand/Solid/Orange)
 *       - box has a value, not focused              → border Brand/Solid/
 *         Black
 *       - ALL boxes have a value AND none is focused → NO border at all.
 *         The `:state=filled` variant (7295:130776 / 9882:39207) is the only
 *         one whose "Input OTP" boxes have zero children beyond the digit/
 *         dot — the Line 1 stroke is deleted outright, not just recoloured.
 *   `error` → does **not** recolour any box. Read every box in the sampled
 *     error variant (13502:47414 large / 13502:47429 small): box 1 has the
 *     active cursor + Orange border, boxes 2–6 are plain Neutral/4 — i.e.
 *     Figma's error moment is "field cleared, refocused to box 1", not
 *     "boxes turned red". The only red is the hint text below (fill
 *     `Brand/Solid/Red`, which resolved to `#da2128` — this IS brand-red /
 *     red-6, not the foreign `#BE1128` ref seen elsewhere in this file; no
 *     remapping was needed here). So `error` here only swaps in the red
 *     hint row + `aria-invalid`; box colouring still follows the value/focus
 *     rules above. Flagged in the port report in case product wants a
 *     stronger (redder) treatment than the source file models.
 *
 * Masking technique is NOT uniform across sizes in the source file itself:
 *   - Usage=large's PIN dot (node 9882:39211) is a real 16×16 Ellipse,
 *     fill Brand/Solid/Black → reproduced here as a `size-16 rounded-full
 *     bg-brand-black` div.
 *   - Usage=small's PIN dot (node 11558:58546) is not a vector at all — it's
 *     a "●" (U+25CF) glyph, Be Vietnam Pro SemiBold, fontSize 14 (=
 *     text-subheadline), fill Brand/Solid/Black → reproduced here verbatim
 *     as that glyph at `text-subheadline`.
 *   Both are reported here rather than silently unified, since the
 *   inconsistency is the file's, not an implementation shortcut.
 *
 * Spec inconsistency found and NOT silently "fixed": Usage=small's digit
 * text sizing disagrees with itself between states — the `typing` state's
 * small digit (node 11558:58444) is fontSize 24 (text-title2, matching the
 * box's own 24×40 scale-down from large), but the `filled` state's small
 * digit (node 11558:58463) is fontSize 32 (text-large-title, identical to
 * the large usage) — almost certainly a copy/paste miss in the Figma file.
 * `typing`'s value (24 / text-title2) was treated as authoritative here
 * since it scales consistently with the rest of the small box; flagged for
 * the design file owner.
 *
 * Real behaviour (auto-advance, backspace-back, numeric paste) and the
 * cursor affordance are implemented via a real per-box `<input>`, matching
 * Input's own precedent of a native caret (`caret-orange-6`) rather than an
 * invented focus ring — no state here draws a ring in Figma either.
 */

export type OtpPinSize = "large" | "small";

const SIZE: Record<
  OtpPinSize,
  { box: string; text: string; dotSize: string; dotText: string }
> = {
  // Figma: box 36×56, digit Large Title/Semibold (32px).
  large: {
    box: "h-56 w-36",
    text: "text-large-title",
    dotSize: "size-16",
    dotText: "",
  },
  // Figma: box 24×40, digit Title2/Semibold (24px) — see the `typing` vs.
  // `filled` inconsistency note above; `typing`'s value is used.
  small: {
    box: "h-40 w-24",
    text: "text-title2",
    dotSize: "",
    dotText: "text-subheadline",
  },
};

export interface OtpInputProps {
  /** Number of boxes. Figma demos 6. */
  length?: number;
  /** Controlled value — the digits entered so far, left to right, no gaps. */
  value: string;
  onChange: (value: string) => void;
  /** Figma Type: `false` = OTP (digit shown), `true` = PIN (masked). */
  mask?: boolean;
  /** Figma Usage. */
  size?: OtpPinSize;
  /** Figma :state=error — see the doc comment above for exactly what this
   *  does and does not recolour. */
  error?: boolean;
  /** Figma "OTP / Hint" text, shown only when `error` is true — the source
   *  file has no non-error helper-text variant for this component. */
  errorText?: ReactNode;
  autoFocus?: boolean;
  /** Not modeled anywhere in this Figma component set (no disabled variant
   *  exists on the page) — styled here from Input's own disabled treatment
   *  (`text-neutral-4`, `cursor-not-allowed`) as the nearest sourced
   *  reference, not invented from nothing, but unverified against this
   *  component specifically. */
  disabled?: boolean;
  /** Accessible name for the group; defaults to "OTP code" / "PIN code". */
  label?: string;
  id?: string;
  className?: string;
}

function OtpPinField({
  length = 6,
  value,
  onChange,
  mask = false,
  size = "large",
  error = false,
  errorText,
  autoFocus = false,
  disabled = false,
  label,
  id,
  className,
}: OtpInputProps) {
  const autoId = useId();
  const groupId = id ?? autoId;
  const hintId = `${groupId}-hint`;
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const digits = Array.from({ length }, (_, i) => value[i] ?? "");
  const isDone = value.length >= length;
  const groupLabel = label ?? (mask ? "PIN code" : "OTP code");

  const focusIndex = (i: number) => {
    inputsRef.current[i]?.focus();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, i: number) => {
    const raw = e.target.value.replace(/\D/g, "");
    // A mobile OS can autofill a full SMS code into a single focused box in
    // one input event (not a `paste`) — treat that the same as a paste
    // rather than keeping only its last character.
    if (raw.length > 1) {
      const merged = (value.slice(0, i) + raw).slice(0, length);
      onChange(merged);
      const next = Math.min(merged.length, length - 1);
      requestAnimationFrame(() => focusIndex(next));
      return;
    }
    const digit = raw.slice(-1);
    if (!digit) return;
    if (i < value.length) {
      onChange(value.slice(0, i) + digit + value.slice(i + 1));
    } else if (i === value.length) {
      onChange((value + digit).slice(0, length));
    } else {
      return;
    }
    const next = Math.min(i + 1, length - 1);
    requestAnimationFrame(() => focusIndex(next));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, i: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[i]) {
        onChange(value.slice(0, i) + value.slice(i + 1));
      } else if (i > 0) {
        onChange(value.slice(0, i - 1));
        focusIndex(i - 1);
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      e.preventDefault();
      focusIndex(i - 1);
    } else if (e.key === "ArrowRight" && i < length - 1) {
      e.preventDefault();
      focusIndex(i + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!text) return;
    e.preventDefault();
    onChange(text);
    const next = Math.min(text.length, length - 1);
    requestAnimationFrame(() => focusIndex(next));
  };

  // A box only jumps ahead of the first empty slot via a click — redirect
  // that focus to the first empty box instead, so `value` never gets gaps.
  const handleFocus = (i: number) => {
    if (i > value.length && !disabled) {
      focusIndex(value.length);
      return;
    }
    setFocusedIndex(i);
  };

  const { box, text, dotSize, dotText } = SIZE[size];

  return (
    <div className={cn("flex w-full flex-col gap-8", className)}>
      <div
        role="group"
        aria-label={groupLabel}
        className={cn(
          "flex items-center gap-8",
          size === "small" ? "justify-start" : "justify-center",
        )}
      >
        {digits.map((digit, i) => {
          const isActive = focusedIndex === i && !disabled;
          const hasValue = digit !== "";
          const borderColor = isDone
            ? "border-transparent"
            : isActive
              ? "border-orange-6"
              : hasValue
                ? "border-brand-black"
                : "border-neutral-4";

          return (
            <div
              key={i}
              className={cn(
                "relative flex shrink-0 items-center justify-center border-b",
                box,
                borderColor,
              )}
            >
              <input
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]*"
                maxLength={1}
                disabled={disabled}
                autoFocus={autoFocus && i === Math.min(value.length, length - 1)}
                value={digit}
                aria-label={`Digit ${i + 1} of ${length}`}
                aria-invalid={error || undefined}
                aria-describedby={error && errorText ? hintId : undefined}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={handlePaste}
                onFocus={() => handleFocus(i)}
                onBlur={() => setFocusedIndex((cur) => (cur === i ? null : cur))}
                className={cn(
                  "size-full bg-transparent text-center font-semibold outline-none",
                  "caret-orange-6",
                  "disabled:cursor-not-allowed",
                  text,
                  // Masked: hide the real character, the dot overlay below
                  // draws the visible mark instead. Unmasked: the input
                  // itself renders the digit.
                  mask ? "text-transparent" : "text-brand-black",
                  disabled && !mask && "text-neutral-4",
                )}
              />
              {mask && hasValue && (
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-0 flex items-center justify-center",
                    disabled && "opacity-50",
                  )}
                >
                  {dotSize ? (
                    <span className={cn("rounded-full bg-brand-black", dotSize)} />
                  ) : (
                    <span className={cn("font-semibold text-brand-black", dotText)}>●</span>
                  )}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {error && errorText && (
        <p
          id={hintId}
          role="alert"
          className={cn(
            "text-caption1 text-red-6",
            size === "small" ? "text-left" : "text-center",
          )}
        >
          {errorText}
        </p>
      )}
    </div>
  );
}

/** Figma Type=OTP — digits are shown as typed. */
export function OtpInput(props: OtpInputProps) {
  return <OtpPinField {...props} mask={false} />;
}

/** Figma Type=PIN — digits are masked (dot / "●" glyph, see file doc comment). */
export function PinInput(props: Omit<OtpInputProps, "mask">) {
  return <OtpPinField {...props} mask={true} />;
}
