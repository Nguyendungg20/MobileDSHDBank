"use client";

import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Navigation — Figma page "❖ Navigation" (nodeId 4:192642, fileKey
 * 3wFivMDO6P0heqk4YPLJQF) holds several things. Inventory (see report for the
 * full breakdown):
 *
 *   1. "Header" (component set, id 7223:106618) — BUILT here as `HeaderBar`.
 *   2. ".Bottom-nav / Item" (component, id 9604:30000) — BUILT here as
 *      `NavigationBar` + `NavigationItem`.
 *   3. "Bottom-nav" (component set, id 11474:13147, Property 1 = "KH Mass" |
 *      "KHUT") — a pre-skinned full bar per HDBank customer segment.
 *      DEFERRED: "KH Mass"'s background is a raw bitmap IMAGE fill and
 *      "KHUT"'s is an unnamed raw hex `#F8D294` with icon colour `#5B2D40` —
 *      neither resolves through a named Figma Style, so neither maps onto any
 *      DS token. Porting either verbatim means inventing colours outside this
 *      DS's vocabulary. Flagged for the designer to either tokenise or
 *      confirm as intentionally bespoke, one-off segment theming.
 *   4. "Header / Action / Item", "_Header / Left Action", "_Header / Right
 *      Action", "_Header / Middle" — all four live under a section explicitly
 *      named "Do not use" (id 11210:9535). Skipped outright, not deferred.
 *   5. ".Status-bar" (id 1707:303722) — an OS status-bar mockup (9:41 clock,
 *      signal, wifi, battery), bundled into every Header variant's frame for
 *      screen-mockup purposes in Figma. Not part of the app-bar itself, so
 *      NOT ported — a real device/browser chrome supplies this, and baking a
 *      fake "9:41" clock into a UI component would be actively misleading in
 *      a stakeholder-facing prototype.
 *
 * ---- 1. HeaderBar — Figma "Header" -----------------------------------
 * Figma axes → props:
 *   New?   → only ONE `New?=False` example exists (Type=Default) — a legacy
 *            predecessor. Every other combination is `New?=True`, so this
 *            port targets that generation only and drops `New?=False`
 *            entirely (same call as Tabs dropping an undocumented legacy
 *            value — see tabs.tsx).
 *   White? → prop `white`. Read off a live instance (White?=True,
 *            Type=Progress): Title flips Neutral-black → Brand/Solid/White.
 *            Description stayed `Neutral/6` in BOTH modes — read as-is, not
 *            "corrected" to white; flagged in case that's a contrast bug in
 *            the source file, not intentional.
 *   Type   → prop `variant`. Type drives the Left slot (back button vs.
 *            Avatar instance) AND the Right slot (0/1/2 actions) TOGETHER —
 *            it is not decomposable into independent axes:
 *              default             → back + title/description + 1 action
 *              two-actions         → back + title/description + 2 actions
 *              avatar-one-action   → avatar + title/description + 1 action
 *              avatar-two-actions  → avatar + title/description + 2 actions
 *              logo                → back + centered logo + 1 action
 *              progress            → back + segmented progress bar, no action
 *
 * Structure read off Figma (`.App header`, 390×44, HORIZONTAL, gap 8, padding
 * 0/8): Left is a 44×44 circular hit-area (back icon or Avatar instance),
 * Middle holds Title (`Title3/SemiBold`) + optional Description
 * (`Caption1/Regular`, `Neutral/6`) OR the logo OR the progress bar, Right is
 * 1–2 action icons with a vertical divider between two. Below `.App header`
 * sits a 1px divider, style name **"Stroke/Gray", `remote: true`** — a
 * foreign ref, not a real DS style (see AGENTS.md "Foreign refs"). Mapped to
 * `border-neutral-3`, this DS's real divider token everywhere else
 * (Tabs, Checkbox). The `.Status-bar` instance and the near-invisible
 * "Blur BG" rectangle (white @ 1% opacity) at the top of every variant are
 * both dropped — see inventory note 5 above.
 *
 * The progress bar (`.App header / Progress`) read as exactly 6 bars, 4px
 * tall, `cornerRadius: 2` (a pill at that height), gap 4: filled bars
 * `Brand/Solid/Red`, unfilled `Neutral/4` — both real named styles.
 *
 * ---- 2. NavigationBar / NavigationItem — Figma ".Bottom-nav / Item" ---
 * Real Figma component properties on the single-item component (not a
 * variant set): `Show Badge` (bool, default true), `Text` (string, default
 * "Trang chủ"), `icon` (instance-swap), `active` (bool, default true).
 * Mapped: `badge` (ReactNode slot), `label`, `icon` (ReactNode slot),
 * `active`.
 *
 * Structure read (75×64 total): an optional callout badge
 * (`.Action Button / Badge`, Type=Type2 — white rounded-6 bubble,
 * `Caption2/Semibold` `Brand/Solid/Red` text, pointer triangle, `Shadow 3`)
 * floats ABOVE the item without affecting its 64px height (confirmed: 8px
 * top padding + 40px icon zone + 4px gap + 12px label exactly sums to 64,
 * with no room left for the badge — it must be absolutely positioned, not in
 * flow). Label read as Be Vietnam Pro **Bold, fontSize 10** — below this
 * DS's smallest step; mapped to `caption2` (11px), the same 1px approximation
 * Badge.tsx already establishes as this DS's precedent for sub-11px text.
 *
 * Read-only-mode limitation: Figma component properties can't be toggled
 * without write access, so only the `active=true` (default) rendering of the
 * item was inspectable — not `active=false`. In that one inspectable state:
 * label reads `Brand/Solid/Black`; the "Active overlay" layer (a `Line`
 * rectangle, `Brand/Solid/White`, 2px, full width, PLUS a white-to-transparent
 * vertical gradient wash) sits absolutely positioned behind the icon. A
 * WHITE line and a WHITE wash are invisible on a white bar — the Figma
 * component was authored assuming it sits on a COLOURED bar background
 * (exactly what the deferred "KH Mass"/"KHUT" skins in note 3 above provide).
 * Since this DS has no token-based colored-bar option to reuse here and "no
 * invented focus rings — the selected-item treatment is the affordance" is a
 * hard constraint, the affordance had to be ADAPTED (not literally read) to
 * remain visible on a neutral bar: unselected icon/label → `neutral-6`
 * (muted, INFERRED — the false/inactive state could not be read at all),
 * selected icon/label → `brand-black` (the one value actually read), and the
 * white 2px indicator line → `brand-red` (this DS's established selected/
 * active accent everywhere else selection needs a colour — Tabs, Button,
 * Badge). The white gradient "glow" wash is dropped rather than
 * approximated — recolouring it would be invention on top of invention.
 * FLAGGED for designer sign-off; this is the single largest judgment call in
 * this port.
 */

// ---------------------------------------------------------------------------
// Icons — inline SVG stand-ins, `currentColor`, same convention as
// Checkbox/Radio/Avatar. Figma vector paths don't export via read-only MCP.
// ---------------------------------------------------------------------------

function BackArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M19 12H5M5 12l6-6M5 12l6 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// HeaderBar — Figma "Header", New?=True only (see doc comment).
// ---------------------------------------------------------------------------

export type HeaderVariant =
  | "default"
  | "two-actions"
  | "avatar-one-action"
  | "avatar-two-actions"
  | "logo"
  | "progress";

const AVATAR_VARIANTS: HeaderVariant[] = ["avatar-one-action", "avatar-two-actions"];
const TWO_ACTION_VARIANTS: HeaderVariant[] = ["two-actions", "avatar-two-actions"];

export interface HeaderBarProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  variant?: HeaderVariant;
  /** Figma "White?" — for use over imagery/gradient hero content. */
  white?: boolean;
  title?: ReactNode;
  /** Figma: `Neutral/6` in both `white` states — read as-is, see doc comment. */
  description?: ReactNode;
  /** Renders the back button in the Left slot. Omit on avatar variants (the
   *  Avatar instance takes that slot instead — Figma never shows both). */
  onBack?: () => void;
  /** Accessible name for the back button — Figma carries no text for it. */
  backLabel?: string;
  /** Left slot content for `avatar-*` variants, e.g. `<Avatar size="normal" />`. */
  avatar?: ReactNode;
  /** Middle slot content for `variant="logo"`. Falls back to a plain
   *  wordmark stand-in — the real HDBank logo vector doesn't export via
   *  read-only MCP. */
  logo?: ReactNode;
  primaryAction?: ReactNode;
  /** Right slot's 2nd action (two-action variants only). A vertical divider
   *  is inserted automatically between the two, mirroring the `Line` node
   *  Figma draws there. */
  secondaryAction?: ReactNode;
  /** `variant="progress"` only. Figma's own demo reads 6 segments. */
  progress?: { current: number; total?: number };
}

export const HeaderBar = forwardRef<HTMLElement, HeaderBarProps>(function HeaderBar(
  {
    variant = "default",
    white = false,
    title,
    description,
    onBack,
    backLabel = "Back",
    avatar,
    logo,
    primaryAction,
    secondaryAction,
    progress,
    className,
    ...props
  },
  ref,
) {
  const isAvatar = AVATAR_VARIANTS.includes(variant);
  const isTwoAction = TWO_ACTION_VARIANTS.includes(variant);
  const isLogo = variant === "logo";
  const isProgress = variant === "progress";
  const fg = white ? "text-brand-white" : "text-brand-black";

  return (
    <header
      ref={ref}
      className={cn(
        "flex h-44 w-full items-center gap-8 border-b border-neutral-3 px-8",
        white ? "bg-transparent" : "bg-brand-white",
        className,
      )}
      {...props}
    >
      {/* Left — Figma ".App header / Left", 44×44 circular hit-area */}
      <div className="flex h-44 w-44 shrink-0 items-center justify-center">
        {isAvatar
          ? avatar
          : onBack && (
              <button
                type="button"
                onClick={onBack}
                aria-label={backLabel}
                className={cn(
                  "flex h-44 w-44 items-center justify-center rounded-full outline-none",
                  fg,
                )}
              >
                <BackArrowIcon className="size-24" />
              </button>
            )}
      </div>

      {/* Middle — Figma ".App header / Middle" */}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
        {isLogo ? (
          (logo ?? <span className="text-title3 font-bold text-brand-red">HDBank</span>)
        ) : isProgress ? (
          <ProgressBar current={progress?.current ?? 1} total={progress?.total ?? 6} />
        ) : (
          <>
            {title != null && (
              <span className={cn("truncate text-title3 font-semibold", fg)}>{title}</span>
            )}
            {description != null && (
              <span className="truncate text-caption1 text-neutral-6">{description}</span>
            )}
          </>
        )}
      </div>

      {/* Right — Figma ".App header / Right", 44×44 (1 action) or with a
          divider between two (Figma: a rotated `Line` node) */}
      {!isProgress && (primaryAction || secondaryAction) && (
        <div className={cn("flex h-44 shrink-0 items-center gap-8", fg)}>
          {primaryAction}
          {isTwoAction && secondaryAction && (
            <>
              <span aria-hidden className="h-24 w-px bg-neutral-3" />
              {secondaryAction}
            </>
          )}
        </div>
      )}
    </header>
  );
});

/** Figma ".App header / Progress" — 6 pill bars, gap 4, filled Brand/Solid/Red,
 *  unfilled Neutral/4. `cornerRadius: 2` on a 4px-tall bar is a pill either way. */
function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-4" role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={total}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          aria-hidden
          className={cn("h-4 flex-1 rounded-full", i < current ? "bg-brand-red" : "bg-neutral-4")}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// NavigationBar / NavigationItem — Figma ".Bottom-nav / Item"
// ---------------------------------------------------------------------------

export interface NavigationBarProps extends HTMLAttributes<HTMLElement> {
  "aria-label"?: string;
}

/** Fixed-bottom bar shell. Renders `role="navigation"`; the caller places
 *  `NavigationItem`s inside. Mobile-first: intended to sit `fixed inset-x-0
 *  bottom-0` on a phone-width screen (left as the consuming page's job, so a
 *  dev/preview page can render it inline instead). */
export const NavigationBar = forwardRef<HTMLElement, NavigationBarProps>(function NavigationBar(
  { className, children, "aria-label": ariaLabel = "Primary", ...props },
  ref,
) {
  return (
    <nav
      ref={ref}
      role="navigation"
      aria-label={ariaLabel}
      className={cn(
        "flex w-full items-stretch border-t border-neutral-3 bg-brand-white",
        className,
      )}
      {...props}
    >
      {children}
    </nav>
  );
});

export interface NavigationItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  icon: ReactNode;
  label: string;
  /** Figma "active" component property. Styled via `data-state`
   *  (selected | default), never `:disabled` — consistent with every other
   *  selectable component in this DS (Tabs, Chip). */
  active?: boolean;
  /** Figma "Show Badge" — pass content to show the callout; omit to hide it.
   *  Absolutely positioned so it never affects the item's height (see doc
   *  comment: badge + item never fit within the read 64px height together). */
  badge?: ReactNode;
}

export const NavigationItem = forwardRef<HTMLButtonElement, NavigationItemProps>(
  function NavigationItem({ icon, label, active = false, badge, className, ...props }, ref) {
    const state = active ? "selected" : "default";

    return (
      <button
        ref={ref}
        type="button"
        data-state={state}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group relative flex h-64 flex-1 flex-col items-center pt-8 pb-12 outline-none",
          className,
        )}
        {...props}
      >
        {/* Selected indicator — Figma draws a Brand/Solid/White 2px line here,
            calibrated for a colored bar. Adapted to brand-red — see doc comment. */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-2 bg-transparent group-data-[state=selected]:bg-brand-red"
        />

        {badge && (
          <span className="absolute -top-28 left-1/2 flex -translate-x-1/2 flex-col items-center">
            <span className="rounded-8 bg-brand-white px-4 py-4 text-caption2 font-semibold whitespace-nowrap text-brand-red shadow-3">
              {badge}
            </span>
            {/* Pointer triangle — Figma draws a dedicated vector; stand-in via clip-path. */}
            <span aria-hidden className="h-4 w-8 bg-brand-white [clip-path:polygon(0_0,100%_0,50%_100%)]" />
          </span>
        )}

        <span
          aria-hidden
          className={cn(
            "flex h-40 w-full items-center justify-center text-neutral-6 [&_svg]:size-24",
            "group-data-[state=selected]:text-brand-black",
          )}
        >
          {icon}
        </span>
        <span
          className={cn(
            "mt-4 text-caption2 leading-none font-bold text-neutral-6",
            "group-data-[state=selected]:text-brand-black",
          )}
        >
          {label}
        </span>
      </button>
    );
  },
);
