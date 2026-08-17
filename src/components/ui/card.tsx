import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Card — mirrors the Figma component set "HDBank Card"
 * (page ❖ Cards, fileKey 3wFivMDO6P0heqk4YPLJQF, node 16014:19741).
 *
 * IMPORTANT SCOPE NOTE: the "❖ Cards" page holds no generic surface/container
 * card (no header-body-footer box). Every component on it is specific to
 * rendering the physical HDBank payment card artwork: this "HDBank Card"
 * component set (orientation + blocked state), a ".HDBank Card / Pending
 * Status" overlay badge, a small "Card-credit-card2" picker tile used in a
 * card-type gallery, and a large "Hình thẻ" section that is pure card-face
 * photography (not a component at all). This file ports the one real,
 * uncontaminated, general-purpose piece: the HDBank Card frame itself — the
 * "reusable primitive" this page actually offers. See the bottom of this file
 * for what was deferred and why.
 *
 * Figma component-set description (verbatim, Vietnamese):
 *   "Homepage: Chỉ sử dụng thẻ dọc / Other screens: Tùy chọn theo nghiệp vụ"
 *   ("Homepage: only use the vertical card. Other screens: optional, per
 *   business flow.") — i.e. `orientation="vertical"` is the expected default
 *   everywhere except when a screen specifically calls for the horizontal
 *   layout.
 *
 * Figma axes/properties → props:
 *   Type ("vertical" | "horizontal")   → `orientation`
 *   Blocked? (no | yes)                → `blocked`
 *   "Has Badge?" (boolean, default no) → `badge` slot, rendered iff provided
 *   "Has Stauts?" (boolean, default no, sic — typo in Figma itself)
 *                                       → `status` slot, rendered iff provided
 *
 * The card FACE (the actual bank-card photography/artwork) is a static IMAGE
 * fill on the master component in Figma, not an exposed swappable property —
 * there is no "pick a card image" component property to port. Reproducing it
 * here would mean vendoring proprietary HDBank card photography into this
 * repo, which is out of scope. Instead the face is a slot: pass `imageSrc` for
 * a real photo, or `children` for any custom face content (gradient mockup,
 * logo, etc.) — the dev preview demonstrates both.
 *
 * `blocked` drives styling via `data-state` ("enabled" | "blocked"), matching
 * this DS's convention of never keying visuals off pseudo-classes — Card has
 * no native disabled/interactive state at all (it isn't a button), so this is
 * purely presentational, but the same attribute-driven pattern keeps it
 * consistent with the rest of the library.
 *
 * Read directly off the Figma nodes, confirmed identical across all 4
 * variants (never assumed from one sibling):
 *   - cornerRadius: 12 (`rounded-12`)
 *   - stroke: solid white at 20% opacity, 2px (`border-2 border-brand-white/20`)
 *   - effects: [] on every one of the 4 variants — there is NO shadow token
 *     here, not even a remote one to flag. Do not invent one.
 *   - Blocked=yes layers a second fill on top of the image: solid black at
 *     60% opacity (`bg-black/60` overlay), and swaps in a centered
 *     ".HDBank Card / Pending Status" instance.
 *   - "Has Badge?" slot: pinned to the right edge, vertically centered
 *     (Figma constraints horizontal=MAX, vertical=CENTER).
 *   - "Has Stauts?" slot: pinned bottom-left (constraints horizontal=MIN,
 *     vertical=MAX), Figma's own instance under it composes a real `<Badge
 *     bold variant="green">` + a Caption1/medium white expiry line — exactly
 *     the shape the dev preview reproduces via the real `<Badge>` component
 *     rather than redrawing it.
 *
 * Sizes read off the two orientation variants: vertical 218×342, horizontal
 * 314×200 (both ≈ the same physical card, just rotated for a phone screen).
 * These are the Figma-native pixel dimensions, kept as the default fixed
 * size; override with `className` if a prototype needs a different scale.
 */

export type CardOrientation = "vertical" | "horizontal";

/**
 * Figma: ".HDBank Card / Pending Status" component set, Type axis (6 members).
 * Every icon-background/glyph pairing below was read off its own node — they
 * do NOT all match ("thẻ đang tạm khoá" uses the clock glyph, not a lock,
 * despite being a "locked" status; only "thẻ hết hạn" uses the lock glyph).
 */
export type CardPendingStatus =
  | "pending-activation"
  | "delivering"
  | "pending-review"
  | "temporarily-locked"
  | "expired"
  | "pending-contract-signature";

interface PendingStatusSpec {
  /** Vietnamese label, verbatim from Figma. */
  label: string;
  icon: "clock" | "lock";
  /** Figma: Icon frame fill — "Brand/Solid/Orange" or "Brand/Solid/Red", both local tokens. */
  iconBg: string;
}

// "thẻ đang tạm khoá" (temporarily locked) reads Brand/Solid/Red on its Icon
// frame in Figma — the one exception to "orange = clock, red = expired"
// that would otherwise fall out of this table. Read directly off the node,
// not extrapolated from a sibling.
const PENDING_STATUS: Record<CardPendingStatus, PendingStatusSpec> = {
  "pending-activation": { label: "Chờ kích hoạt", icon: "clock", iconBg: "bg-brand-orange" },
  delivering: { label: "Đang giao thẻ", icon: "clock", iconBg: "bg-brand-orange" },
  "pending-review": { label: "Chờ xử lý", icon: "clock", iconBg: "bg-brand-orange" },
  "temporarily-locked": { label: "Thẻ đang tạm khoá", icon: "clock", iconBg: "bg-brand-red" },
  expired: { label: "Thẻ hết hạn", icon: "lock", iconBg: "bg-brand-red" },
  "pending-contract-signature": {
    label: "Chờ ký Hợp đồng điện tử",
    icon: "clock",
    iconBg: "bg-brand-orange",
  },
};

function ClockGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 5.5V10l3 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="4.5" y="9" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.5 9V6.5a3.5 3.5 0 0 1 7 0V9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Figma: ".HDBank Card / Pending Status" instance — centered overlay content shown when `blocked`. */
export function CardPendingStatusBadge({ status }: { status: CardPendingStatus }) {
  const spec = PENDING_STATUS[status];
  return (
    <div className="flex flex-col items-center gap-4 p-4 text-center">
      <span
        className={cn(
          "flex size-32 shrink-0 items-center justify-center rounded-full text-brand-white",
          spec.iconBg,
        )}
      >
        {spec.icon === "clock" ? (
          <ClockGlyph className="size-20" />
        ) : (
          <LockGlyph className="size-20" />
        )}
      </span>
      <span className="text-caption1 font-regular text-brand-white/95">{spec.label}</span>
    </div>
  );
}

/** Figma: vertical 218×342 / horizontal 314×200. */
const ORIENTATION: Record<CardOrientation, string> = {
  vertical: "w-218 aspect-[218/342]",
  horizontal: "w-314 aspect-[314/200]",
};

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Figma: Type. Component-set guidance: vertical is the homepage default. */
  orientation?: CardOrientation;
  /** Figma: Blocked?. */
  blocked?: boolean;
  /** Only rendered while `blocked` — Figma's centered Pending Status overlay. */
  pendingStatus?: CardPendingStatus;
  /** Figma: "Has Badge?" slot — pinned to the right edge, vertically centered. */
  badge?: ReactNode;
  /** Figma: "Has Stauts?" slot (sic) — pinned bottom-left. */
  status?: ReactNode;
  /** Card-face photo. Omit and pass `children` instead for custom face content. */
  imageSrc?: string;
  imageAlt?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    orientation = "vertical",
    blocked = false,
    pendingStatus,
    badge,
    status,
    imageSrc,
    imageAlt = "",
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <div
      ref={ref}
      data-state={blocked ? "blocked" : "enabled"}
      className={cn(
        "relative isolate shrink-0 overflow-hidden rounded-12 border-2 border-brand-white/20",
        "bg-neutral-3", // fallback fill when no image/children face content is given
        ORIENTATION[orientation],
        className,
      )}
      {...props}
    >
      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element -- prototype lab, arbitrary external card art
        <img src={imageSrc} alt={imageAlt} className="absolute inset-0 size-full object-cover" />
      ) : (
        children
      )}

      {blocked && (
        // Figma: solid #000 at 60% opacity. Written as an arbitrary hex, not
        // `bg-black` — this DS's token reset removes the stock Tailwind
        // black/white color scale (only `brand-black` #333 remains), so
        // `bg-black` silently generates no rule at all. Confirmed via
        // computed styles in-browser after this exact bug showed up here.
        <div className="absolute inset-0 flex items-center justify-center bg-[#000000]/60">
          {pendingStatus && <CardPendingStatusBadge status={pendingStatus} />}
        </div>
      )}

      {badge && (
        <span className="absolute top-1/2 right-0 -translate-y-1/2">{badge}</span>
      )}

      {status && <span className="absolute bottom-12 left-12">{status}</span>}
    </div>
  );
});

/**
 * NOT PORTED — deferred, in scope-priority order:
 *
 * 1. "Card-credit-card2" (component set id 4497:5655, props: active=no|yes) —
 *    the small ~99×108 picker tile used in the "Các loại thẻ khác" gallery
 *    (HDBank Vietjet Platinum/Classic, VISA Classic/Gold, Mastercard Gold,
 *    Napas Silver/Gold). NOT built: its Figma styles resolve to
 *    `remote: true` refs — fillStyle "Mono/White", strokeStyle "Yellow/4",
 *    effectStyle "Shadow/Large" — the same foreign contamination flagged on
 *    Dropdown Menu and Tags. Porting it as-is would bake in tokens that don't
 *    belong to this design system; it needs a designer decision on which
 *    local token each remote ref should actually map to before it's built.
 *
 * 2. The "Hình thẻ" section (~20 rounded-rectangle nodes) — this is a flat
 *    library of card-face photography (JCB/Napas/Visa/Mastercard artwork),
 *    not a component. Nothing to port; it's exactly the kind of content the
 *    `imageSrc`/`children` face slot above expects a consumer to supply.
 */
