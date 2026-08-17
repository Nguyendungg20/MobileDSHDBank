"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Picker — ported from the Figma page "❖ Pickers" (fileKey 3wFivMDO6P0heqk4YPLJQF,
 * page node 6:192657).
 *
 * That page holds several distinct things, not one component set:
 *   - "{iOS} Picker": Type=district / city / iOS Time Picker / iOS Timer Picker /
 *     iOS Time & Date Picker / date / date-picked — seven loose COMPONENTs (not
 *     variants of a single COMPONENT_SET) sharing one construction: one or more
 *     side-by-side scrollable "wheel" columns, each a stack of rows that fade in
 *     size/colour with distance from a centred selection band.
 *   - "{Android} Picker": Type=list (a Cancel/Done title bar wrapping an {iOS}
 *     Picker instance as its body — Android's own picker IS the iOS wheel, just
 *     re-chromed), Type=date (picked), Type=date (calendar-view) (a full month
 *     grid: header, weekday row, day grid — not a wheel at all).
 *   - ". {Android} Picker / Date-grid": Has Range?=false/true — the day-cell grid
 *     that backs the calendar-view type, unrelated to the wheel primitive.
 *
 * This port ships ONLY the wheel/drum primitive below (`<Picker>`, one scrollable
 * column), per the "prioritise the wheel primitive" scope. NOT ported, deferred:
 *   - Type=date (calendar-view) + Date-grid: a full month-grid date picker is a
 *     different component shape entirely (see `progress-tracker`-style grid, not
 *     a wheel) — worth its own port.
 *   - Type=date-picked / date (picked): compact "value chosen" summary rows —
 *     read as thin wrappers around List Item's `input` variant, not the wheel.
 *   - Android's Cancel/Done title-bar chrome (Type=list): compose it yourself
 *     from `<BottomSheet>` (title="", headerAction={<Button/> x2}) wrapping one
 *     or more `<Picker>` columns in the body — that's literally how the Figma
 *     "Template / Pickers" usage example (node 13935:16659) builds a real sheet:
 *     BottomSheet header/body/footer + List Item rows + one {iOS} Picker + a
 *     Button Group footer.
 *   - Multi-column composites (time/date wheels): the Figma "Time Picker" /
 *     "date" types are literally 2-3 of this same column component placed side
 *     by side (verified: both reuse the identical row-text instance set,
 *     "Frame 839/840/841/842"). Compose them by rendering multiple `<Picker>`s
 *     in a flex row — demonstrated on /dev/picker — rather than building a
 *     second component.
 *
 * Column construction, read off "Type=district" (node 3490:230066, and its row
 * instance "Frame 839", node 3490:230055):
 *   - 7 rows are visible at once (3 above the centre, 3 below), each a plain
 *     text layer, all font style "Regular" (no bold anywhere — only size/colour
 *     change, not weight).
 *   - Row height + font size step by distance from centre and were snapped to
 *     this DS's real --text-* ramp rather than kept as raw px, since three of
 *     the four steps land within 2px of a real token:
 *       centre   fontSize 23 → text-title3   (20px, nearest token)
 *       ±1       fontSize 18 → text-body     (16px — tied to title3 by raw
 *                                              distance; body chosen so the
 *                                              ramp actually steps down)
 *       ±2       fontSize 14 → text-subheadline (14px, exact)
 *       ±3(edge) fontSize 12 → text-caption1 (12px, exact)
 *   - Row colour also steps by distance. The centre row's fill binds a style
 *     literally named "Text / Light / Primary" that resolves `remote: true` —
 *     it is NOT part of this design system (see AGENTS.md "foreign refs" rule),
 *     a copy-paste leak from another file. Its raw colour (#16191c) sits
 *     between neutral-9/neutral-10 and brand-black; mapped here to
 *     `text-brand-black`, the token this DS's every other component (Button,
 *     List Item) actually uses for primary label text — flag for the designer
 *     to swap the bound style in Figma.
 *     The ±1/±2/±3 rows carry NO named style at all (`fillStyle: null`, plain
 *     hex) — #aeaeae → nearest is neutral-5; #c2c2c2 and the edge #d7d7d7 both
 *     read nearest to neutral-4 (a real, if narrow, token gap at that spot in
 *     the ramp — not an error).
 *   - The selection band is two 0.5px hairlines (colour ~#cccccc, nearest
 *     neutral-4) bracketing the centre row only — there is no fill/highlight
 *     behind the centre row, just the two rules. Their gap equals the centre
 *     row's own height (~31px), which is why `itemHeight` below is set to 32
 *     (Figma's px, rounded onto this DS's 4px spacing grid per AGENTS.md).
 *   - Figma achieves the fade via true per-row perspective: row HEIGHT itself
 *     shrinks with distance (15/18/23/29/23/18/15px), not just font size. This
 *     port simplifies to a uniform `itemHeight` per row (still faithful to the
 *     "functional, not physics" scope) and carries the fade only through
 *     font-size + colour, which reads the same at a glance.
 *
 * Interaction (not modelled in Figma — a static mock has no scroll behaviour to
 * read off): a native `overflow-y-auto` + `scroll-snap-type: y mandatory` list.
 * Selecting an option scrolls it to `scrollTop = index * itemHeight`, which
 * centers it exactly given the top/bottom spacer padding below — no momentum
 * physics, no drag-inertia simulation, just CSS scroll-snap + the browser's own
 * scroll physics. `onChange` fires once scrolling settles (150ms of no scroll
 * events), not on every intermediate frame; the visual fade re-renders live
 * while dragging so it doesn't look inert mid-scroll.
 *
 * Accessibility: modelled as a listbox (`role="listbox"` + `role="option"` +
 * `aria-selected` + `aria-activedescendant`), not a wrapped native `<select>` —
 * Figma's own multi-column wheels (time/date) can't be represented by one
 * native select anyway, so a single consistent semantic pattern was used for
 * both the single- and multi-column cases. Arrow Up/Down and Home/End move the
 * selection on the focused column. No focus ring is added: Figma draws no
 * focus-visible treatment anywhere on this page (no state axis exists for
 * Picker at all), so per this DS's "no invented focus rings" rule the listbox
 * keeps the browser's own default focus outline rather than inventing one.
 */

export interface PickerOption {
  value: string;
  label: ReactNode;
}

export interface PickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  options: PickerOption[];
  /** Controlled selected value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Fires once scrolling settles on a new row (not on every scroll frame). */
  onChange?: (value: string) => void;
  /** Rows visible at once — Figma shows 7 (3 above/below centre). Keep it odd. */
  visibleRows?: number;
  /** Figma: ~31px centre-row/band height, rounded to this DS's 4px grid. */
  itemHeight?: number;
  "aria-label"?: string;
}

/** Figma: centre fontSize 23→title3, ±1 18→body, ±2 14→subheadline, ±3(edge) 12→caption1. */
const TEXT_SIZE_BY_DISTANCE = [
  "text-title3",
  "text-body",
  "text-subheadline",
  "text-caption1",
] as const;

/** Figma: centre binds a foreign "Text / Light / Primary" style → mapped to this
 *  DS's real primary-text token; ±1 nearest neutral-5; ±2/±3(edge) both nearest neutral-4. */
const COLOR_BY_DISTANCE = [
  "text-brand-black",
  "text-neutral-5",
  "text-neutral-4",
  "text-neutral-4",
] as const;

function tierClass(distance: number) {
  const i = Math.min(distance, TEXT_SIZE_BY_DISTANCE.length - 1);
  return cn(TEXT_SIZE_BY_DISTANCE[i], COLOR_BY_DISTANCE[i]);
}

export const Picker = forwardRef<HTMLDivElement, PickerProps>(function Picker(
  {
    options,
    value,
    defaultValue,
    onChange,
    visibleRows = 7,
    itemHeight = 32,
    className,
    "aria-label": ariaLabel,
    ...props
  },
  forwardedRef,
) {
  const baseId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  const indexOf = useCallback(
    (v: string | undefined) => {
      if (v === undefined) return 0;
      const i = options.findIndex((o) => o.value === v);
      return i === -1 ? 0 : i;
    },
    [options],
  );

  const [selectedIndex, setSelectedIndex] = useState(() =>
    indexOf(value ?? defaultValue),
  );

  // Keep latest onChange/options without re-subscribing the scroll listener.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Padding above/below the real rows so the first/last option can still reach
  // the centre band. scrollTop = index * itemHeight then centers that index
  // exactly (see file doc comment for the algebra).
  const padding = ((visibleRows - 1) / 2) * itemHeight;
  const containerHeight = visibleRows * itemHeight;

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior) => {
      containerRef.current?.scrollTo({ top: index * itemHeight, behavior });
    },
    [itemHeight],
  );

  // Position at the initial value before first paint — no visible jump.
  useLayoutEffect(() => {
    scrollToIndex(indexOf(value ?? defaultValue), "auto");
    // Intentionally run once on mount only; controlled `value` changes are
    // handled by the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Controlled value changed externally — scroll to match.
  useEffect(() => {
    if (value === undefined) return;
    const i = indexOf(value);
    if (i === selectedIndex) return;
    setSelectedIndex(i);
    scrollToIndex(i, "smooth");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let raf = 0;
    let settleTimeout: ReturnType<typeof setTimeout>;

    const nearestIndex = () =>
      Math.min(
        Math.max(Math.round(el.scrollTop / itemHeight), 0),
        optionsRef.current.length - 1,
      );

    function handleScroll() {
      // Live fade update while dragging, throttled to one per frame.
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setSelectedIndex(nearestIndex()));

      // Commit + fire onChange once scrolling has settled.
      clearTimeout(settleTimeout);
      settleTimeout = setTimeout(() => {
        const i = nearestIndex();
        setSelectedIndex(i);
        onChangeRef.current?.(optionsRef.current[i]?.value);
      }, 150);
    }

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(raf);
      clearTimeout(settleTimeout);
    };
  }, [itemHeight]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    let next = selectedIndex;
    if (e.key === "ArrowDown") next = Math.min(selectedIndex + 1, options.length - 1);
    else if (e.key === "ArrowUp") next = Math.max(selectedIndex - 1, 0);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = options.length - 1;
    else return;
    e.preventDefault();
    setSelectedIndex(next);
    scrollToIndex(next, "smooth");
    onChangeRef.current?.(options[next]?.value);
  }

  const activeOptionId =
    options[selectedIndex] !== undefined ? `${baseId}-option-${selectedIndex}` : undefined;

  // Fades the top/bottom couple of rows toward the surface colour, matching
  // Figma's edge rows reading as partially cut off rather than hard-clipped.
  const edgeMask = useMemo(
    () =>
      `linear-gradient(to bottom, transparent 0, black ${itemHeight}px, black calc(100% - ${itemHeight}px), transparent 100%)`,
    [itemHeight],
  );

  return (
    <div
      ref={forwardedRef}
      className={cn("relative", className)}
      style={{ height: containerHeight }}
      {...props}
    >
      <div
        ref={containerRef}
        role="listbox"
        aria-label={ariaLabel}
        aria-activedescendant={activeOptionId}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="absolute inset-0 snap-y snap-mandatory overflow-y-auto"
        style={{ WebkitMaskImage: edgeMask, maskImage: edgeMask }}
      >
        <div aria-hidden style={{ height: padding }} />
        {options.map((option, i) => {
          const distance = Math.abs(i - selectedIndex);
          return (
            <div
              key={option.value}
              id={`${baseId}-option-${i}`}
              role="option"
              aria-selected={i === selectedIndex}
              onClick={() => {
                setSelectedIndex(i);
                scrollToIndex(i, "smooth");
                onChangeRef.current?.(option.value);
              }}
              className={cn(
                "flex snap-center cursor-pointer items-center justify-center font-regular select-none",
                tierClass(distance),
              )}
              style={{ height: itemHeight }}
            >
              {option.label}
            </div>
          );
        })}
        <div aria-hidden style={{ height: padding }} />
      </div>

      {/* Selection band — two hairlines bracketing the centre row. Overlaid
          outside the scrolling element so it stays fixed while rows scroll
          under it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 border-y border-neutral-4"
        style={{ top: padding, height: itemHeight }}
      />
    </div>
  );
});
