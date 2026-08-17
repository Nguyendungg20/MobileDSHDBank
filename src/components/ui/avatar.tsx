import { useState, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Avatar — mirrors the Figma component set "Avatar" (page ❖ Avatar, node
 * 7074:49963).
 *
 * Figma models this as TWO independent, decoupled component sets composed by
 * instance-swap, not one set with a combined Size × Type axis:
 *   - "Avatar" (node 7045:28533)      → Size axis only: Large/Medium/Normal/Small/XSmall
 *   - ".Avatar / Type" (node 7045:28515) → Type axis only: Empty/Zodiac/User/Bank
 * Every Size variant just wraps an instance of ".Avatar / Type" at matching
 * dimensions; Type is swapped on that nested instance. There is no Figma
 * "State" axis (no disabled/pressed) and no status-dot or group/stack variant
 * on this page — none is built here, to avoid inventing one.
 *
 * Figma axes → props:
 *   Size (Large 64 / Medium 48 / Normal 40 / Small 32 / XSmall 24) → `size`
 *   Type (Empty/Zodiac/User/Bank) → `variant`, renamed per this DS's
 *     convention ("Figma Type axis → prop `variant`", AGENTS.md) — plus one
 *     addition, "initials", that is NOT a Figma Type (see note below).
 *
 * Type → variant mapping, each read off its node rather than inferred:
 *   Type=Empty  → variant="placeholder": frame has NO fill/stroke at all
 *                 (fillStyleId empty, fills[0].visible=false) — just a
 *                 floating "perm_identity" person-outline icon, 40/64 (62.5%)
 *                 of the frame, coloured Neutral/5 (`text-neutral-5`).
 *   Type=User   → variant="photo": circular image fill (cornerRadius 64 on a
 *                 64 frame — always clips to a full circle regardless of
 *                 size), no border.
 *   Type=Bank   → variant="bank": cornerRadius 100 (always a full circle),
 *                 fill invisible (transparent), 1px border in Neutral/3
 *                 (`border-neutral-3`), holding a swappable logo icon
 *                 (44/64 ≈ 68.75% of frame in the Large demo — the demo
 *                 instance is literally an "Abbank" logo swap-instance, i.e.
 *                 this Type is a generic partner-logo slot, not one fixed
 *                 glyph. A neutral placeholder bank icon is the default here;
 *                 pass `icon` for a real logo).
 *   Type=Zodiac → variant="zodiac": circular Semantic/Orange/1 background
 *                 (`bg-orange-1`, read via named fill style — not raw hex),
 *                 a 1px white ring (Figma's own "Boarder" ellipse, drawn on
 *                 top of the icon instance), full-bleed animal artwork. The
 *                 12 animals (`.Avatar / Type / Zodiac`, node 7045:28317)
 *                 are illustrated vector art in Figma; reproducing 12 SVGs
 *                 faithfully was out of scope for a coded prototype, so each
 *                 animal is represented with its emoji instead (no external
 *                 image requests, same recognizable content). The background
 *                 tint and ring are real DS tokens, not approximated.
 *   (none)      → variant="initials": Figma has no Initials Type. Added per
 *                 explicit product requirement (src → initials → placeholder
 *                 fallback chain) since a photo avatar needs *some* graceful
 *                 non-image fallback and Figma doesn't model one. Styled
 *                 from existing DS tokens only (`bg-neutral-3` / literal
 *                 nothing new) — flagged here for the designer to confirm or
 *                 to add an official Initials Type to the Figma component.
 *
 * Icon sizes at Medium/Normal/Small/XSmall for placeholder/bank were NOT
 * directly observed — every Size demo instance in Figma had its nested Type
 * swapped to Zodiac (which is always full-bleed, no independent icon ratio
 * to read), so Medium…XSmall placeholder/bank icon sizes are this port's own
 * interpolation of the Large ratios (40/64 and 44/64), not individually read
 * values. Said plainly: only the Large icon sizes are Figma-confirmed.
 *
 * Contamination note: the zodiac library icon's own ring stroke resolves to
 * style "Base/White", `remote: true` — a foreign style, not part of this
 * design system (see AGENTS.md "Foreign refs" note). It is pure white
 * regardless, so it maps cleanly to `brand-white` with no visual change;
 * flagged for the designer to purge the remote ref in Figma.
 */

export type AvatarSize = "large" | "medium" | "normal" | "small" | "xsmall";

export type AvatarVariant = "photo" | "initials" | "placeholder" | "zodiac" | "bank";

export type ZodiacAnimal =
  | "mouse"
  | "buffalo"
  | "tiger"
  | "cat"
  | "dragon"
  | "snake"
  | "horse"
  | "goat"
  | "monkey"
  | "rooster"
  | "dog"
  | "pig";

/**
 * Figma: box 64/48/40/32/24. Placeholder icon and bank-logo icon ratios are
 * Large-confirmed (40/64, 44/64) and interpolated for the rest — see doc
 * comment above. `emoji` is this port's own choice, sized ~50% of the box —
 * using the `text-[Npx]` arbitrary-value form deliberately: this DS's type
 * scale is token-only (`text-body`, `text-caption1`, …), so a numeric class
 * like `text-32` matches no utility and Tailwind silently emits no CSS for
 * it (see AGENTS.md) — arbitrary-value brackets are the correct escape
 * hatch for a size that isn't on the ramp.
 */
const SIZE: Record<
  AvatarSize,
  { box: string; icon: string; bankIcon: string; emoji: string; text: string }
> = {
  large: { box: "size-64", icon: "size-40", bankIcon: "size-44", emoji: "text-[32px]", text: "text-title2" },
  medium: { box: "size-48", icon: "size-30", bankIcon: "size-33", emoji: "text-[24px]", text: "text-title3" },
  normal: { box: "size-40", icon: "size-25", bankIcon: "size-28", emoji: "text-[20px]", text: "text-body" },
  small: { box: "size-32", icon: "size-20", bankIcon: "size-22", emoji: "text-[16px]", text: "text-subheadline" },
  xsmall: { box: "size-24", icon: "size-15", bankIcon: "size-17", emoji: "text-[12px]", text: "text-caption2" },
};

/** Figma: `.Avatar / Type / Zodiac` — 12 named variants. Emoji stand-in, see
 *  doc comment above for why. */
const ZODIAC_EMOJI: Record<ZodiacAnimal, string> = {
  mouse: "\u{1F42D}",
  buffalo: "\u{1F402}",
  tiger: "\u{1F42F}",
  cat: "\u{1F431}",
  dragon: "\u{1F409}",
  snake: "\u{1F40D}",
  horse: "\u{1F434}",
  goat: "\u{1F410}",
  monkey: "\u{1F412}",
  rooster: "\u{1F413}",
  dog: "\u{1F436}",
  pig: "\u{1F437}",
};

function PersonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M4 20c0-3.5 3.5-6 8-6s8 2.5 8 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Default content for the Bank logo slot — a generic building glyph, not a
 *  real partner logo (Figma's demo instance was literally an Abbank swap).
 *  Pass `icon` for a real logo. */
function BankIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10l8-5 8 5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3.5 20.5h17"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  size?: AvatarSize;
  /** Explicit Type override. If omitted, derived from `src`/`initials`:
   *  src present → "photo", else initials present → "initials", else
   *  "placeholder". Set explicitly to force "zodiac" or "bank". */
  variant?: AvatarVariant;
  /** Image URL for variant="photo" (or auto-derived when `src` is set). */
  src?: string;
  /** Required accessible text for the image — describe who/what it shows.
   *  Pass `alt=""` only if the avatar is purely decorative next to a visible
   *  name elsewhere. */
  alt?: string;
  /** 1–2 letter monogram for variant="initials" (not a Figma Type — see doc
   *  comment). Also doubles as the accessible name for that variant. */
  initials?: string;
  /** Figma: Zodiac variant option. Defaults to "mouse" (Figma's default). */
  zodiac?: ZodiacAnimal;
  /** Custom icon for variant="bank" (or "placeholder"), e.g. a real partner
   *  logo. Defaults to a generic building / person glyph. */
  icon?: ReactNode;
  /** Accessible name for non-photo, non-initials variants (bank/placeholder/
   *  zodiac carry no text of their own to name themselves by). */
  "aria-label"?: string;
}

export function Avatar({
  size = "large",
  variant,
  src,
  alt,
  initials,
  zodiac = "mouse",
  icon,
  className,
  "aria-label": ariaLabel,
  ...props
}: AvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const resolved: AvatarVariant =
    variant ?? (src && !imgFailed ? "photo" : initials ? "initials" : "placeholder");

  const sizing = SIZE[size];

  // photo names itself via `alt` on the <img>; initials names itself via its
  // own visible text. placeholder/bank/zodiac have no text of their own — if
  // the caller didn't pass an accessible name, treat as decorative rather
  // than exposing an unlabeled role="img".
  const isIconVariant =
    resolved === "placeholder" || resolved === "bank" || resolved === "zodiac";
  const a11yProps = isIconVariant
    ? ariaLabel
      ? { role: "img" as const, "aria-label": ariaLabel }
      : { "aria-hidden": true }
    : {};

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        sizing.box,
        resolved === "bank" && "border border-neutral-3",
        resolved === "initials" && "bg-neutral-3",
        resolved === "zodiac" && "bg-orange-1 border border-brand-white",
        className,
      )}
      {...a11yProps}
      {...props}
    >
      {resolved === "photo" && src && (
        // Figma: Type=User — IMAGE fill, cornerRadius 64 (always clips to a
        // full circle via the parent's rounded-full + overflow-hidden).
        // eslint-disable-next-line @next/next/no-img-element -- prototype lab, arbitrary external avatar photo (same precedent as card.tsx)
        <img
          src={src}
          alt={alt ?? ""}
          className="size-full object-cover"
          onError={() => setImgFailed(true)}
        />
      )}

      {resolved === "initials" && (
        <span className={cn(sizing.text, "font-semibold text-brand-black uppercase")}>
          {initials}
        </span>
      )}

      {resolved === "placeholder" && (icon ?? <PersonIcon className={cn(sizing.icon, "text-neutral-5")} />)}

      {resolved === "bank" && (icon ?? <BankIcon className={cn(sizing.bankIcon, "text-neutral-5")} />)}

      {resolved === "zodiac" && (
        <span className={cn(sizing.emoji, "leading-none")} aria-hidden>
          {ZODIAC_EMOJI[zodiac]}
        </span>
      )}
    </span>
  );
}
