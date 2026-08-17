"use client";

import {
  forwardRef,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Rating — mirrors the Figma components ".Rating / Emotions" (component set,
 * page "❖ Rating", id 7:192662) and ".Rating / Button" (the tappable
 * icon+label item built on top of it).
 *
 * Figma models a 5-point EMOTION-FACE scale here, not a star rating — there
 * is no star variant anywhere on this page (confirmed via get_metadata + a
 * screenshot of every frame on the page, including the "Template / Rating
 * Widget" example screens). Five hand-drawn face icons run angry → sad →
 * neutral → happy → loved (".Rating / Emotions" Type=1..5).
 *
 * Figma axes → props:
 *   Type (Emotions, 1–5)          → internal only (`RatingFaceIcon`); the 5
 *                                    faces always render in fixed order.
 *   Active? (".Rating / Button")  → derived from `value` — the tapped face
 *                                    is "active", the rest aren't:
 *     - Icon: Figma switches grey ↔ colour with a real blend mode
 *       (`LUMINOSITY` when inactive, `PASS_THROUGH`/normal when active), not
 *       a second grey icon asset. Ported 1:1 as CSS `mix-blend-mode`, so the
 *       "grey" reads correctly against whatever the icon sits on (white
 *       card, yellow card, gradient…) — exactly like the Figma layer does,
 *       rather than a flat hand-picked grey.
 *     - Label: Figma keeps the "Label" text node laid out at full size even
 *       when inactive — it has an EMPTY fill (invisible), not
 *       `visible: false`. Deliberate no-layout-shift trick: row height never
 *       jumps when a face is (de)selected. Ported the same way
 *       (`text-transparent` → `text-brand-red`), not a conditional render.
 *     - itemSpacing: read as 0px (inactive) → 4px (active) directly off the
 *       two atomic ".Rating / Button" variants — not a uniform gap.
 *
 * Every fill/stroke inside the face artwork is a RAW, unstyled hex — every
 * fillStyleId/strokeStyleId on every vector path resolved to `null` (no
 * bound Figma style at all, not even a `remote: true` one). These are
 * illustration colours, not design tokens, so they're reproduced as literal
 * hex rather than mapped onto the semantic ramp. Two are worth flagging:
 *   - `#DA2128` (the Type=5 "loved" eyes) is an EXACT match for this DS's
 *     `brand-red` / `red-6` (`#da2128`) — likely not a coincidence, but
 *     still unbound in the file.
 *   - `#FAA61A` (the bg gradient overlay, every type) is an EXACT match for
 *     `brand-orange` / `orange-6` (`#faa61a`).
 *   - `#FEEDD1` (the bg outline, every type) is one bit off `orange-2`
 *     (`#ffeed1`) — almost certainly the same eyedropped colour, off by
 *     export/rounding noise, not a deliberate second value.
 *   - `#FFC512` (the bg base fill) and `#181818` (all face linework) don't
 *     land on any token in the ramp (closest are `orange-5 #ffbc4b` and
 *     `neutral-10 #111927` respectively, both a visible distance off).
 *   None of the above were changed — flagged for the designer to bind to
 *   real styles in Figma, not silently "corrected" here.
 *
 * Not modelled in Figma (no state axis for it on this page) — added per this
 * port's brief the same way Radio/Checkbox/Picker handle the unmodelled
 * case: `readOnly` disables interaction without inventing any new visual
 * treatment, and NO focus ring is invented (`outline-none` is never
 * applied) — the browser's own default focus-visible outline is left alone,
 * since Figma draws no focus-visible treatment anywhere on this page.
 *
 * Figma also documents a fully-composed "Rating Widget" CARD (title + this
 * row + divider + a "Lịch sử đánh giá ứng dụng" (rating history) link, 3
 * background usages: default / on-gradient / side-menu) built on top of
 * this row. Out of scope here — same call as Radio shipping without its
 * List Item wrapper: this file is the reusable 5-face selector only.
 */

export type RatingValue = 1 | 2 | 3 | 4 | 5;

const VALUES: RatingValue[] = [1, 2, 3, 4, 5];

/** Figma's own default text on ".Rating / Button" is literally "Label" at every
 *  position — real screens override all 5, e.g. the Settings/App-rating screens
 *  read: ["Không sẵn sàng", "Chưa sẵn sàng", "Phân vân", "Sẵn sàng", "Rất sẵn
 *  sàng"]. Pass your own via `labels`. */
const DEFAULT_LABELS: [string, string, string, string, string] = [
  "Label",
  "Label",
  "Label",
  "Label",
  "Label",
];

/**
 * The 5 face illustrations. Each is a shared rounded-square background (identical
 * across all 5 Figma instances bar sub-pixel export noise) plus a per-type face
 * overlay, positioned to match the Figma node geometry (group offset/size read off
 * each ".Rating / Emotions" Type=N variant, cross-checked against the % insets
 * get_design_context derived for the same nodes).
 */
function RatingBackground() {
  return (
    <g transform="translate(2,2)">
      <path
        d="M28.4288 0H7.57614C3.3946 0 0.00479929 3.3898 0.00479929 7.57134V28.424C0.00479929 32.6055 3.3946 35.9953 7.57614 35.9953H28.4288C32.6103 35.9953 36.0001 32.6055 36.0001 28.424V7.57134C36.0001 3.3898 32.6103 0 28.4288 0Z"
        fill="#FFC512"
      />
      <path
        opacity="0.64"
        d="M35.986 28.4252V19.2071C33.3176 25.3183 30.318 28.985 24.1695 28.985H0.0186189C0.307851 32.9036 3.5687 35.9919 7.56196 35.9919H28.4193C32.5992 35.9919 35.9906 32.6051 35.9906 28.4205L35.986 28.4252Z"
        fill="#FAA61A"
      />
      <path
        d="M28.4287 1.29688C31.8901 1.29688 34.7031 4.10989 34.7031 7.57134V28.4287C34.7031 31.8901 31.8901 34.7031 28.4287 34.7031H7.57134C4.10989 34.7031 1.29688 31.8901 1.29688 28.4287V7.57134C1.29688 4.10989 4.10989 1.29688 7.57134 1.29688H28.4287ZM28.4287 0H7.57134C3.39147 0 0 3.38681 0 7.57134V28.4287C0 32.6085 3.38681 36 7.57134 36H28.4287C32.6085 36 36 32.6132 36 28.4287V7.57134C36 3.39148 32.6132 0 28.4287 0Z"
        fill="#FEEDD1"
      />
    </g>
  );
}

function RatingFaceIcon({ type }: { type: RatingValue }) {
  const gradId = useId();

  switch (type) {
    case 1: // angry — slanted brows, flat mouth
      return (
        <>
          <RatingBackground />
          <g transform="translate(11.19,13.26)" stroke="#181818" strokeWidth="1.38085" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M17.3074 0.690506L12.5258 4.24059H17.3074" />
            <path d="M0.690467 0.690467L5.47212 4.24055H0.690467" />
            <path d="M0.83991 13.2394H16.9529" />
          </g>
        </>
      );
    case 2: // sad — dot eyes, frown
      return (
        <>
          <RatingBackground />
          <g transform="translate(13.23,12.67)">
            <path
              d="M1.79606 13.6265C2.13194 11.7092 4.1239 10.0951 6.7783 10.0111C9.62863 9.9225 12.0544 11.7092 12.3623 13.7152"
              stroke="#181818"
              strokeWidth="1.22224"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path d="M3.56408 1.78207C3.56408 2.76639 2.76636 3.5641 1.78204 3.5641C0.797719 3.5641 0 2.76639 0 1.78207C0 0.797745 0.797719 2.5699e-05 1.78204 2.5699e-05C2.76636 2.5699e-05 3.56408 0.797745 3.56408 1.78207Z" fill="#181818" />
            <path d="M13.7713 1.78204C13.7713 2.76636 12.9736 3.56408 11.9893 3.56408C11.005 3.56408 10.2072 2.76636 10.2072 1.78204C10.2072 0.797719 11.005 0 11.9893 0C12.9736 0 13.7713 0.797719 13.7713 1.78204Z" fill="#181818" />
          </g>
        </>
      );
    case 3: // neutral — flat brows, flat mouth (Figma exports this one pre-flattened with the bg)
      return (
        <>
          <RatingBackground />
          <g transform="translate(2,2)" stroke="#181818" strokeWidth="1.38085" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M9.84323 24.2728H25.9562" />
            <path d="M9.36723 11.5414H14.3635" />
            <path d="M20.9598 11.5414H25.956" />
          </g>
        </>
      );
    case 4: // happy — curved brows, smile, blush
      return (
        <>
          <RatingBackground />
          <g transform="translate(9.62,12.95)">
            <defs>
              <radialGradient id={`${gradId}-a`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(18.8092 7.11613) scale(2.07127)">
                <stop offset="0.55" stopColor="#F25400" />
                <stop offset="0.99" stopColor="#FFC512" />
              </radialGradient>
              <radialGradient id={`${gradId}-b`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(2.07127 7.11613) scale(2.07127)">
                <stop offset="0.55" stopColor="#F25400" />
                <stop offset="0.99" stopColor="#FFC512" />
              </radialGradient>
            </defs>
            <g stroke="#181818" strokeWidth="1.27822" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M2.96666 2.74093C2.96666 1.53735 3.82035 0.697646 5.0146 0.641666C6.30215 0.581021 7.11386 1.66331 7.11386 2.74093" />
              <path d="M14.065 2.74093C14.065 1.53735 14.9187 0.697646 16.113 0.641666C17.4005 0.581021 18.2123 1.66331 18.2123 2.74093" />
              <path d="M16.1361 9.78573C15.7862 11.7824 13.7056 13.4664 10.944 13.5551C7.97233 13.6484 5.44389 11.787 5.122 9.69243" />
            </g>
            <path opacity="0.69" d={`M20.8805 7.11613C20.8805 8.25906 19.9522 9.18741 18.8092 9.18741C17.6663 9.18741 16.738 8.25906 16.738 7.11613C16.738 5.9732 17.6663 5.04486 18.8092 5.04486C19.9522 5.04486 20.8805 5.9732 20.8805 7.11613Z`} fill={`url(#${gradId}-a)`} />
            <path opacity="0.69" d={`M4.14254 7.11613C4.14254 8.25906 3.2142 9.18741 2.07127 9.18741C0.928341 9.18741 0 8.25906 0 7.11613C0 5.9732 0.928341 5.04486 2.07127 5.04486C3.2142 5.04486 4.14254 5.9732 4.14254 7.11613Z`} fill={`url(#${gradId}-b)`} />
          </g>
        </>
      );
    case 5: // loved — smile, red heart-caret eyes
      return (
        <>
          <RatingBackground />
          <g transform="translate(11.23,13.21)">
            <path
              d="M14.4476 9.8241C14.0977 11.8254 12.0125 13.5095 9.24609 13.5981C6.26981 13.6914 3.7367 11.8254 3.41481 9.7308"
              stroke="#181818"
              strokeWidth="1.27822"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path d="M1.43688 1.43688L3.20026 3.62011L5.08493 1.43688" stroke="#DA2128" strokeWidth="2.87366" strokeMiterlimit="10" strokeLinecap="round" fill="none" />
            <path d="M12.6235 1.43693L14.3869 3.62016L16.2715 1.43693" stroke="#DA2128" strokeWidth="2.87366" strokeMiterlimit="10" strokeLinecap="round" fill="none" />
          </g>
        </>
      );
  }
}

export interface RatingProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** Controlled selected face, 1–5. Omit + use `defaultValue` for uncontrolled use. */
  value?: RatingValue;
  defaultValue?: RatingValue;
  onChange?: (value: RatingValue) => void;
  /** Figma "↳Edit Label" per position — defaults to Figma's own placeholder ("Label"
   *  ×5). Only the selected face's label is ever visible (see file doc comment). */
  labels?: [string, string, string, string, string];
  /** Not a Figma state axis on this page — display-only, no tap interaction. */
  readOnly?: boolean;
  name?: string;
}

export const Rating = forwardRef<HTMLDivElement, RatingProps>(function Rating(
  {
    value,
    defaultValue,
    onChange,
    labels = DEFAULT_LABELS,
    readOnly = false,
    name,
    className,
    "aria-label": ariaLabel,
    ...props
  },
  ref,
) {
  const [uncontrolled, setUncontrolled] = useState<RatingValue | undefined>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : uncontrolled;
  const groupRef = useRef<HTMLDivElement | null>(null);
  const reactId = useId();
  const groupName = name ?? reactId;

  const select = (next: RatingValue) => {
    if (!isControlled) setUncontrolled(next);
    onChange?.(next);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (readOnly) return;
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
      return;
    }

    const radios = Array.from(
      groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]') ?? [],
    );
    if (radios.length === 0) return;

    const activeIndex = radios.findIndex((r) => r === document.activeElement);
    let nextIndex = activeIndex < 0 ? 0 : activeIndex;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = activeIndex < 0 ? 0 : (activeIndex + 1) % radios.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = activeIndex < 0 ? radios.length - 1 : (activeIndex - 1 + radios.length) % radios.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = radios.length - 1;
    }

    event.preventDefault();
    // Automatic activation (WAI-ARIA radio group pattern): arrow keys move
    // focus AND select, same convention this DS already uses for Tabs.
    radios[nextIndex].focus();
    radios[nextIndex].click();
  };

  const rovingValue = current ?? VALUES[0];

  return (
    <div
      ref={(node) => {
        groupRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={cn("flex w-full", className)}
      {...props}
    >
      {VALUES.map((v) => {
        const checked = current === v;
        return (
          <button
            key={v}
            type="button"
            role="radio"
            name={groupName}
            aria-checked={checked}
            aria-label={labels[v - 1]}
            aria-disabled={readOnly || undefined}
            tabIndex={readOnly ? -1 : rovingValue === v ? 0 : -1}
            onClick={readOnly ? undefined : () => select(v)}
            className={cn(
              "flex flex-1 flex-col items-center",
              checked ? "gap-4" : "gap-0",
              readOnly ? "cursor-default" : "cursor-pointer",
            )}
          >
            <svg
              viewBox="0 0 40 40"
              width={40}
              height={40}
              className="shrink-0"
              style={checked ? undefined : { mixBlendMode: "luminosity" }}
              aria-hidden
            >
              <RatingFaceIcon type={v} />
            </svg>
            <span
              className={cn(
                "text-caption1 font-medium select-none",
                checked ? "text-brand-red" : "text-transparent",
              )}
            >
              {labels[v - 1]}
            </span>
          </button>
        );
      })}
    </div>
  );
});
