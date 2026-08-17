import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * OTT — mirrors the Figma component "OTT" (page ❖ OTT, fileKey
 * 3wFivMDO6P0heqk4YPLJQF, node 7358:64918).
 *
 * WHAT "OTT" IS: a mocked native push notification — the card the OS draws
 * on the lock screen / notification shade, not anything rendered inside the
 * app's own UI. In Vietnamese banking, "thông báo OTT" ("over-the-top"
 * notification, delivered through the app rather than by SMS) is the
 * standard term for this delivery channel — HDBank's own fee schedules list
 * "Phí thông báo OTT" as a line item alongside SMS banking fees. So "OTT"
 * here isn't cryptic Figma shorthand for something else (not a promo
 * interstitial, not a coach-mark) — it is a real notification, reproduced so
 * a prototype can show "you'll receive something like this" without firing
 * an actual push. Kept as `ott.tsx` / `<OTT>` rather than renamed, since the
 * domain term is the clear name.
 *
 * The page holds exactly one component — no variant set, no Type/State axis,
 * and an empty `description` field on the source node — so there is nothing
 * to enumerate beyond this single anatomy: app icon, bold title, regular
 * body (with an inline bold run in the real content for an emphasized
 * value). No dismiss affordance anywhere on the node — the same absence
 * Toast and Callout already document for this library, and it tracks: a
 * real OS notification isn't dismissed by the app's own UI either. So this
 * port adds none.
 *
 * Icon: Figma's own icon is the real "Di HDBank app icon" instance — a
 * nested multi-group vector tracing the literal HD Bank wordmark/logomark.
 * Same call as Card's card-face photography (src/components/ui/card.tsx):
 * proprietary brand artwork is a slot, not something to hand-trace
 * bezier-by-bezier. `icon` defaults to a simplified built-in badge using
 * this DS's own brand gradient; pass a real asset via `icon` for
 * pixel-exact use. The gradient stops read off the node (5 stops: #EC1D24 at
 * 0–50%, #F9A01B at 75%, #FEBE10 at 85%, #FEDB00 at 100%) are close to, but
 * not identical to, `bg-brand-gradient-h`'s (#DA2128…#FFDD00) — this is a
 * local/detached gradient fill (`fillStyleId` is null), not bound to the
 * shared "Brand/Gradient" style, so it maps to the nearest DS token here
 * rather than hard-coding a second near-duplicate hex ramp.
 *
 * Shadow: both the outer "OTT" frame and the inner "Main" card carry the
 * same raw DROP_SHADOW (radius 48, 0 offset, spread 0, rgba(109,109,109,
 * 0.175)) — `effectStyleId` is null (not bound to a named effect style), and
 * the value doesn't match Shadow 1..5 exactly: it's a single wide ambient
 * blur, not any of the ramp's two-part offset+spread combos. Mapped here to
 * `shadow-5`, the softest/largest step, as the nearest token — flagged
 * rather than silently hard-coded as a one-off box-shadow.
 *
 * Width: Figma fixes the card at 343 (≈ 390 mobile frame − 24px margin ×
 * 2 — the same arithmetic Toast's dropped 326 comes from). Ported as
 * `w-full` rather than a hard-coded 343, for the same reason: that number is
 * a screen-margin artifact of the frame this was drawn in, not a token this
 * component should carry.
 *
 * The outer "OTT" component also pads 48px above the card before hugging
 * height — canvas real estate reserved for a status bar in the mockup this
 * was drawn against, not a stylistic property of the notification itself.
 * Dropped here; a consumer compositing this into a phone-frame mockup adds
 * their own top offset.
 */

export interface OTTProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Notification title. Figma: "Thông báo Di-HDBank" — Subheadline/Bold. */
  title: ReactNode;
  /**
   * Notification body. Figma: Subheadline/Regular, with an inline
   * Subheadline/Bold run around the emphasized value (e.g. an amount) —
   * wrap that fragment in your own `<span className="font-bold">`.
   */
  children: ReactNode;
  /**
   * App badge. Defaults to a generic gradient placeholder — see doc comment:
   * the real HDBank wordmark artwork isn't vendored here.
   */
  icon?: ReactNode;
}

function DefaultIcon() {
  return (
    <span
      aria-hidden
      className="flex size-40 shrink-0 items-center justify-center rounded-8 bg-brand-gradient-h"
    >
      <span className="text-caption2 font-bold text-brand-white">HD</span>
    </span>
  );
}

/**
 * A mocked OS push notification. There is no live-announcement behavior to
 * preserve (nothing here appears/disappears on a timer the way a real OS
 * notification or this DS's own Toast does) — `role="status"` /
 * `aria-live="polite"` are semantics this port adds, matching Toast's
 * convention for the same family of content, so assistive tech treats the
 * title+body as one announced unit rather than silent static text.
 */
export function OTT({
  title,
  children,
  icon,
  role = "status",
  "aria-live": ariaLive = "polite",
  className,
  ...props
}: OTTProps) {
  return (
    <div
      role={role}
      aria-live={ariaLive}
      className={cn(
        "flex w-full items-start gap-16 rounded-16 bg-brand-white p-16 shadow-5",
        className,
      )}
      {...props}
    >
      {icon ?? <DefaultIcon />}
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <p className="text-subheadline font-bold text-brand-black">{title}</p>
        <p className="text-subheadline font-regular text-brand-black">
          {children}
        </p>
      </div>
    </div>
  );
}
