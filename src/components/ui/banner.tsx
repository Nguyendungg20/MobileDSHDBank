import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Banner — mirrors two real Figma component sources on page "❖ Banner"
 * (node 2139:220757), not one:
 *
 *  1. "Banner-home" (COMPONENT_SET, id 2139:220788, `Property 1` axis with
 *     values 01 / td / bill / card / IPP / Variant6). Only variant `01`
 *     (2139:220789) is a generic, reusable shape: rounded-12 tinted card,
 *     an optional illustration on the left, message + CTA button in a
 *     "Detail" column, and a `close` icon overlaid top-right. The other five
 *     (`td`/`bill`/`card`/`IPP`/`Variant6`) are one-off campaign screenshots —
 *     each hardcodes its own raster illustration, its own ad-hoc gradient or
 *     image fill, and campaign copy. They share `01`'s outer contract (12
 *     radius, ~120 tall, illustration + text + CTA + close) but nothing about
 *     their fills is a token — confirmed via `getStyleByIdAsync`: none of the
 *     six variants bind a fillStyleId, every colour is a raw paint. So this
 *     port generalizes the *shape* from `01` as `variant="default"` rather
 *     than reproducing five bespoke campaign designs as component variants.
 *  2. "1Click Banner" (COMPONENT, id 11063:10632, standalone — not part of a
 *     variant set). Brand-gradient background (its own ".Banner BG" instance,
 *     id 11063:10623/11063:10628: a custom red→orange→yellow linear gradient
 *     rectangle plus a blurred white→orange radial "glow" ellipse — neither
 *     layer binds a style; the gradient's stop pattern doesn't match this
 *     DS's named `Brand/Gradient/Horizontal` style either, so it is
 *     approximated here to the closest real token, `bg-brand-gradient-h`, per
 *     AGENTS.md rather than hand-rolled as a one-off arbitrary gradient; the
 *     blurred glow accent is dropped as a decorative flourish, not a token).
 *     Content is a white two-line message + a small underline CTA, with an
 *     illustration/photo slot ("Graphic", 144×132, `IMAGE` fill) on the right
 *     instead of the left. No close affordance anywhere on this component.
 *
 * Figma axis → prop:
 *   Property 1 (Banner-home) / standalone (1Click Banner) → `variant`
 *     ("default" | "promo") — renamed from Figma's raw variant name since
 *     `01` isn't a meaningful label in code and "1Click Banner" isn't a
 *     `Property 1` value at all.
 *   illustration/Graphic slot → `illustration` (ReactNode, optional both
 *     variants — present in `bill`/`card`/`td`/`IPP`/1Click Banner, absent in
 *     `01`, so optional rather than required).
 *   Button instance in Detail/Content → `cta` (ReactNode) — composed by the
 *     caller with the real `<Button>`, not redrawn. Every Banner-home CTA
 *     instance actually resolves to a *different*, older Button component
 *     (mainComponent id 1621:419404, "Size=Medium, Type=primary, State=
 *     default, Active=True") than the one `button.tsx` ports (id 4:192632) —
 *     a leftover from before the Button redesign, not a second Button this DS
 *     should support. The 1Click Banner CTA is more telling: its Type
 *     property reads "underline (white-bg)", but its actual rendered label
 *     fill is solid `#da2128` (brand-red) — i.e. it resolves to this
 *     codebase's `underline-white` Button variant, not `underline-gradient`,
 *     despite sitting on the gradient background (Figma's variant name
 *     describes the light glow strip behind the text, not the banner's own
 *     background — the same "don't trust the label" trap AGENTS.md flags for
 *     Toast's "Type=yellow"). The preview composes the real `<Button>`
 *     accordingly.
 *   `close` instance (2139:220795, Style=Outlined) → `onDismiss` +
 *     `dismissLabel`, mirroring Tag's `onRemove`/`removeLabel` convention:
 *     only rendered when `onDismiss` is passed, only available on `default`
 *     (Banner-home's `close` has no counterpart anywhere on 1Click Banner).
 *     The instance's internals (the actual glyph vector/colour) did not
 *     expand through the read-only API — only its 16×16 outer frame (solid
 *     white fill, cornerRadius 20) came back — so the × glyph below is
 *     redrawn plainly in `text-neutral-6`, matching Tag's default remove
 *     glyph treatment, rather than invented pixel-for-pixel.
 *
 * Sizing notes read off nodes rather than guessed:
 *   - `default` container padding is Figma's exact [16,12,16,12] → `py-16
 *     px-12`; itemSpacing 16 between illustration and content, even though
 *     the source frame's layoutMode is NONE (absolute) — the same spacing
 *     value carries over cleanly to a real flex gap.
 *   - `default` illustration slot is size-88, matching `bill`'s "Image" frame
 *     (88×88, itself holding a 91×91 `IMAGE` fill cropped to that box).
 *   - `default`'s close sits at Figma x=334/y=8 inside a fixed 358-wide frame
 *     (→ right/top offset 8px from a 358 canvas) — ported as `absolute
 *     right-8 top-8` against this component's own (fluid-width) container,
 *     rather than copying Figma's fixed 358, so it doesn't hardcode the
 *     mobile-frame width Toast's doc comment already warns against.
 *   - `promo` Content padding is Figma's exact [0,16,24,16] (`pr-16 pb-24
 *     pl-16`, no top padding) and itemSpacing 12; Graphic slot is a fixed
 *     `w-144` (full container height), matching 1Click Banner exactly since
 *     Content (214) + Graphic (144) tile the full 358 width with no gap.
 *   - Message text: `default` reads fontSize 12 (caption1) at raw colour
 *     `#000000` (`01`/`td`) or `#333333` (`bill`, an exact `brand-black`
 *     match) — neither is bound to a fillStyleId. Both map to
 *     `text-brand-black`; the pure-`#000` instances are a raw-hex deviation
 *     from the DS's own black, flagged for the designer rather than
 *     replicated. `promo`'s "Subtitle" is fontSize 14 Bold, and its
 *     fillStyleId resolves to a style named "Text White/Primary" with
 *     `remote: true` — foreign-collection contamination per the DS's
 *     confirmed leak (see memory: di-hdbank-foreign-colors-leak). Maps to
 *     `text-brand-white`, an exact value match, not a guess.
 *
 * Not a status message: unlike Toast, nothing on the Banner page reads as a
 * transient announcement — these are persistent, promotional/informational
 * cards sitting in normal page flow — so this port adds no `role`/`aria-live`
 * beyond what the caller passes in, only the dismiss button's accessible name.
 */

export type BannerVariant = "default" | "promo";

const VARIANT_STYLE: Record<
  BannerVariant,
  { container: string; text: string; padding: string; gap: string }
> = {
  // Figma "01": raw solid #fff4d6, unbound to any style — approximated to the
  // nearest real token rather than inlined as an arbitrary hex.
  default: {
    container: "bg-orange-1",
    text: "text-brand-black",
    padding: "py-16 px-12",
    gap: "gap-16",
  },
  // Figma "1Click Banner" .Banner BG: a custom blurred gradient, not bound to
  // the DS's own Brand/Gradient/Horizontal style either — approximated to it
  // per AGENTS.md ("If a background uses the brand gradient, we have
  // bg-brand-gradient-h").
  promo: {
    container: "bg-brand-gradient-h",
    text: "text-brand-white",
    padding: "",
    gap: "gap-0",
  },
};

export interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: BannerVariant;
  /** Figma: illustration/photo slot — optional on both variants (absent on
   * Banner-home's `01`, present on `bill`/`card`/`td`/`IPP` and 1Click Banner). */
  illustration?: ReactNode;
  /** Message text. Every Banner instance on the page is a single text block —
   * no separate title/body split exists to model. */
  children: ReactNode;
  /** Composed by the caller with the real `<Button>` — see doc comment for
   * which variant/size each Figma instance actually resolves to. */
  cta?: ReactNode;
  /** `default` only — Figma has no close affordance on the promo variant. */
  onDismiss?: () => void;
  /** Accessible name for the dismiss button, e.g. "Dismiss promotion".
   * Required whenever `onDismiss` is passed (mirrors Tag's `removeLabel`). */
  dismissLabel?: string;
}

export const Banner = forwardRef<HTMLDivElement, BannerProps>(function Banner(
  {
    variant = "default",
    illustration,
    children,
    cta,
    onDismiss,
    dismissLabel,
    className,
    ...props
  },
  ref,
) {
  const styles = VARIANT_STYLE[variant];
  const showDismiss = variant === "default" && onDismiss != null;

  return (
    <div
      ref={ref}
      className={cn(
        "relative isolate flex w-full overflow-hidden rounded-12",
        styles.container,
        styles.padding,
        styles.gap,
        variant === "default" ? "items-center" : "items-stretch",
        className,
      )}
      {...props}
    >
      {illustration != null && (
        <span
          className={cn(
            "flex shrink-0 items-center justify-center",
            variant === "default" ? "size-88" : "order-2 w-144",
          )}
        >
          {illustration}
        </span>
      )}

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col",
          variant === "default"
            ? cn("gap-8", showDismiss && "pr-24")
            : "gap-12 pr-16 pb-24 pl-16",
        )}
      >
        <p className={cn("min-w-0 text-caption1 font-regular", styles.text)}>
          {children}
        </p>
        {cta}
      </div>

      {showDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className="absolute top-8 right-8 flex size-16 shrink-0 items-center justify-center rounded-full text-neutral-6 outline-none"
        >
          ×
        </button>
      )}
    </div>
  );
});
