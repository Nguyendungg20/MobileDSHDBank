"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Keyboard — mirrors the Figma page "❖ Keyboard"
 * (fileKey 3wFivMDO6P0heqk4YPLJQF, nodeId 1630:419002).
 *
 * Figma models an on-screen iOS system-keyboard mockup, not a DS-native
 * control: a full QWERTY (".Keyboard / Keys" — 5 States × 2 Dark-mode) and a
 * numeric pad (".Keyboard / Numpad" — Type=default|custom × Indicator? ×
 * Dark-mode?). Both exist as symbol assets; the composed "Keyboard" instances
 * on the page combine one of these with a title bar (Cancel/Search) and an
 * autosuggestion strip — that chrome is specific to a text-field context and
 * is NOT ported here, only the keypad surface itself.
 *
 * Ported at full fidelity: the **numeric** pad (Type=custom — the subtype the
 * composed Keyboard symbol actually uses: 1-9, a "000" quick-add, "0", a "."
 * decimal, a backspace key, and a "Next" action key). This is what pairs with
 * PIN/OTP/amount entry, per the porting brief.
 *
 * Ported best-effort only: **qwerty** — lowercase Latin layout, no
 * Shift/Caps-lock/Numbers/Symbols state switching (Figma models 5 States ×
 * dark-mode for that alone; wiring a real IME was explicitly out of scope).
 *
 * Dark-mode axis is dropped entirely — this DS ships no dark theme (tokens
 * come from Figma Styles, not Variables/modes; see AGENTS.md).
 *
 * ── HEAVY FOREIGN CONTAMINATION — read before trusting any hex here ──
 * Nearly every fill on this page resolves to a Figma style with `remote:
 * true` — i.e. it is NOT a token of this design system, it leaked in from a
 * pasted-in Apple iOS UI kit:
 *   "Light/Primary Key Background"   (#FFFFFF)
 *   "Light/Secondary Key Background" (#ADB3BC)
 *   "Light / Text"                   (#000000, pure black)
 *   "Action / Background"            (#007AFF — literal iOS system blue)
 *   "Text/Auto Suggestion"           (SF Pro text style)
 * None of these are DS tokens. Most colours below are hand-mapped onto the
 * nearest *real* DS token — EXCEPT the Enter key. This is OS chrome (a mock of
 * the iOS system keyboard, like `ott.tsx` mocks an iOS notification), not a
 * branded in-app control, so it must LOOK like the iOS keyboard: the enabled
 * Enter key keeps Figma's literal iOS system blue `#007AFF` (kept as an
 * arbitrary value, not a DS token — the designer confirmed it should match the
 * iOS look, not be re-branded red). The outer tray background (#D1D5DB) and the
 * Enter-key's disabled fill/text (#E3E3E3 / #A3A3A3) are raw, un-styled hex with
 * no Figma style at all — mapped to the nearest neutral step by eye.
 *
 * Figma axes → props:
 *   Type=numpad → variant="numeric" (default). Type=keyboard → variant="qwerty".
 *   Enter-key's State=Active?=yes/no → `actionEnabled`.
 *   Digit grid contents → `keys` (override for a bare PIN pad, e.g. blank the
 *   "000"/"." cells).
 *
 * No pressed-state is modelled for numeric/qwerty keys in Figma — the only
 * State axis present is the Enter-key's Active?=yes/no (enabled/disabled, not
 * a press animation). No pressed background is invented here; keys rely on
 * `cursor-pointer` only. Do not add a pressed overlay without re-reading
 * Figma — there is nothing there to source it from.
 */

// ---------------------------------------------------------------------------
// Shared key primitives
// ---------------------------------------------------------------------------

/** Figma: DROP_SHADOW rgba(0,0,0,.3) / offset (0,1) / blur 1 — no named effect
 * style exists for it. `shadow-1` is the nearest DS token, not an exact match
 * (DS: 0 1px 4px rgba(0,0,0,.2)). */
const KEY_SHADOW = "shadow-1";

function DigitKey({
  label,
  onPress,
}: {
  label: string;
  onPress?: (key: string) => void;
}) {
  if (!label) {
    // Figma: blank grid cell (no key placed) — e.g. a PIN pad's empty corners.
    return <div aria-hidden />;
  }
  return (
    <button
      type="button"
      onClick={() => onPress?.(label)}
      className={cn(
        "flex items-center justify-center rounded-4 bg-brand-white text-title2 font-regular text-brand-black",
        KEY_SHADOW,
      )}
      aria-label={label}
    >
      {label}
    </button>
  );
}

function BackspaceIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M8.5 5h11A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-11a1.5 1.5 0 0 1-1.19-.585L3 12l4.31-6.415A1.5 1.5 0 0 1 8.5 5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M11 9.5 16 14.5M16 9.5 11 14.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Numeric pad
// ---------------------------------------------------------------------------

export type KeyboardVariant = "numeric" | "qwerty";

/** Row-major 4×3 grid of digit-key labels. `""` renders a blank cell. */
export type NumericKeyGrid = [
  [string, string, string],
  [string, string, string],
  [string, string, string],
  [string, string, string],
];

/** Figma: Type=custom's exact grid — 1-9, a "000" quick-add, "0", and a "."
 * decimal. This is what the composed "Keyboard" symbol actually renders (not
 * Type=default, which is a plain 1-9/0/backspace grid with no action key). */
const DEFAULT_KEYS: NumericKeyGrid = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["000", "0", "."],
];

export interface KeyboardProps {
  variant?: KeyboardVariant;
  /** Numeric variant only. Defaults to Figma's exact "custom" grid. */
  keys?: NumericKeyGrid;
  /** Enter-key label. Default "Tiếp" (Vietnamese, as the design shows). */
  actionLabel?: string;
  /** Figma State=Active?=yes/no. yes = iOS blue #007AFF, no = disabled grey. */
  actionEnabled?: boolean;
  /**
   * Numeric variant only. Optional quick-add amount chips shown as a top strip
   * above the keypad (Figma's amount-entry usage: "100.000 · 1.000.000 · …"),
   * separated by hairline dividers. Each chip's `value` is passed to onKeyPress.
   */
  quickAmounts?: { label: string; value: string }[];
  onKeyPress?: (key: string) => void;
  onBackspace?: () => void;
  onAction?: () => void;
  className?: string;
}

function NumericPad({
  keys = DEFAULT_KEYS,
  actionLabel = "Tiếp",
  actionEnabled = true,
  quickAmounts,
  onKeyPress,
  onBackspace,
  onAction,
}: Omit<KeyboardProps, "variant" | "className">) {
  return (
    <div className="flex flex-col">
      {/* Quick-add amount strip (amount-entry usage): equal columns split by
          hairline dividers, dark text on the tray. Only shown when supplied. */}
      {quickAmounts && quickAmounts.length > 0 && (
        <div className="flex items-stretch">
          {quickAmounts.map((amt, i) => (
            <button
              key={amt.value}
              type="button"
              onClick={() => onKeyPress?.(amt.value)}
              className={cn(
                "flex-1 py-12 text-center text-subheadline font-medium text-brand-black",
                i > 0 && "border-l border-neutral-4",
              )}
            >
              {amt.label}
            </button>
          ))}
        </div>
      )}

      {/* Figma "Keyboard / Numpad" instance: itemSpacing 6, padding [6,0,6,0].
          3 digit columns @ 88px + 1 action column @ 93px — exact Figma widths. */}
      <div
        className="grid gap-6 py-6"
        style={{ gridTemplateColumns: "88px 88px 88px 93px" }}
      >
      {keys.map((row, r) =>
        row.map((label, c) => (
          <div key={`${r}-${c}`} className="h-47">
            <DigitKey label={label} onPress={onKeyPress} />
          </div>
        )),
      )}

      {/* Backspace — Figma: ".Keyboard / Key" Type=icon, Size=large, spans
          grid rows 1-2 (93×100 = 2×47 + 6px gap). Fill "Light/Secondary Key
          Background" (remote, #ADB3BC) → neutral-5. */}
      <button
        type="button"
        onClick={onBackspace}
        aria-label="Backspace"
        className={cn(
          "col-start-4 row-start-1 row-span-2 flex items-center justify-center rounded-4 bg-neutral-5 text-brand-white",
          KEY_SHADOW,
        )}
      >
        <BackspaceIcon className="size-32" />
      </button>

      {/* Enter/Next — Figma: ".Keyboard / Key / Enter-key", spans rows 3-4.
          Active?=yes fill "Action / Background" = literal iOS system blue
          #007AFF, kept as-is (OS-chrome mock — see file doc comment).
          Active?=no fill/text are raw hex (#E3E3E3 / #A3A3A3, no Figma
          style) → nearest neutrals. */}
      <button
        type="button"
        onClick={onAction}
        disabled={!actionEnabled}
        data-state={actionEnabled ? "enabled" : "disabled"}
        className={cn(
          "col-start-4 row-start-3 row-span-2 flex items-center justify-center rounded-4 text-title2 font-regular",
          KEY_SHADOW,
          "data-[state=enabled]:bg-[#007AFF] data-[state=enabled]:text-brand-white",
          "data-[state=disabled]:cursor-not-allowed data-[state=disabled]:bg-[#e3e3e3] data-[state=disabled]:text-[#a3a3a3]",
        )}
      >
        {actionLabel}
      </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// QWERTY (best-effort — see file doc comment)
// ---------------------------------------------------------------------------

const ROW_1 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const ROW_2 = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const ROW_3 = ["z", "x", "c", "v", "b", "n", "m"];

function LetterKey({
  label,
  onPress,
}: {
  label: string;
  onPress?: (key: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onPress?.(label)}
      className={cn(
        "flex h-42 w-32 items-center justify-center rounded-4 bg-brand-white text-title2 font-regular text-brand-black",
        KEY_SHADOW,
      )}
      aria-label={label}
    >
      {label}
    </button>
  );
}

function SecondaryKey({
  children,
  onPress,
  className,
}: {
  children: ReactNode;
  onPress?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      className={cn(
        "flex h-42 items-center justify-center rounded-4 bg-neutral-5 text-body font-regular text-brand-white",
        KEY_SHADOW,
        className,
      )}
    >
      {children}
    </button>
  );
}

function QwertyPad({
  onKeyPress,
  onBackspace,
}: Pick<KeyboardProps, "onKeyPress" | "onBackspace">) {
  return (
    // Figma ".Keyboard / Qwerty Portrait Layout": itemSpacing 12, padding 3.
    <div className="flex flex-col items-center gap-12 p-3">
      <div className="flex gap-6">
        {ROW_1.map((k) => (
          <LetterKey key={k} label={k} onPress={onKeyPress} />
        ))}
      </div>
      <div className="flex gap-6">
        {ROW_2.map((k) => (
          <LetterKey key={k} label={k} onPress={onKeyPress} />
        ))}
      </div>
      <div className="flex gap-6">
        <SecondaryKey className="w-42" onPress={() => onKeyPress?.("Shift")}>
          ⇧
        </SecondaryKey>
        {ROW_3.map((k) => (
          <LetterKey key={k} label={k} onPress={onKeyPress} />
        ))}
        <SecondaryKey className="w-42" onPress={onBackspace}>
          <BackspaceIcon className="size-24" />
        </SecondaryKey>
      </div>
      {/* Control strip — Figma ".Keyboard / Control Strip" Type=default:
          "123" + emoji + mic + space + return, fontSize 16 → text-body. */}
      <div className="flex w-full gap-6">
        <SecondaryKey className="w-41 shrink-0" onPress={() => onKeyPress?.("123")}>
          123
        </SecondaryKey>
        <SecondaryKey className="w-41 shrink-0" onPress={() => onKeyPress?.("😀")}>
          ☺
        </SecondaryKey>
        <button
          type="button"
          onClick={() => onKeyPress?.(" ")}
          className={cn(
            "h-42 flex-1 rounded-4 bg-brand-white text-body font-regular text-brand-black",
            KEY_SHADOW,
          )}
        >
          space
        </button>
        <SecondaryKey className="w-88 shrink-0" onPress={() => onKeyPress?.("\n")}>
          return
        </SecondaryKey>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Keyboard
// ---------------------------------------------------------------------------

export function Keyboard({
  variant = "numeric",
  keys,
  actionLabel,
  actionEnabled,
  quickAmounts,
  onKeyPress,
  onBackspace,
  onAction,
  className,
}: KeyboardProps) {
  return (
    // Figma outer "Type=numpad"/"Type=keyboard" component fill: raw hex
    // #D1D5DB (no Figma style) → neutral-4 (#D2D6DB), a near-exact match.
    // A BACKGROUND_BLUR effect is present in Figma but invisible here: the
    // fill is fully opaque, so nothing behind it can show through to blur.
    <div
      className={cn("inline-block rounded-4 bg-neutral-4 px-8", className)}
    >
      {variant === "numeric" ? (
        <NumericPad
          keys={keys}
          actionLabel={actionLabel}
          actionEnabled={actionEnabled}
          quickAmounts={quickAmounts}
          onKeyPress={onKeyPress}
          onBackspace={onBackspace}
          onAction={onAction}
        />
      ) : (
        <QwertyPad onKeyPress={onKeyPress} onBackspace={onBackspace} />
      )}
    </div>
  );
}
