"use client";

import {
  forwardRef,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Calendar — mirrors the Figma "{Android} Picker / Type=date (calendar-view)"
 * component (page ❖ Pickers, node 2715:220970) together with its embedded
 * ". {Android} Picker / Date-grid" component set (node 13755:5698, single
 * axis "Has Range?": false | true). This is the month-grid calendar — a
 * different component from the wheel-column Picker in picker.tsx, which
 * lives on the same Figma page and is NOT touched here.
 *
 * Anatomy read off 2715:220970 ("Main-container", 311×302 inside a 343×330
 * white symbol, cornerRadius 0 — no card chrome of its own, meant to sit on
 * a plain surface such as a bottom-sheet body):
 *   Header       — "Month & Year" text + a small decorative chevron (Figma
 *                  groups them, itemSpacing 8; no separate month/year picker
 *                  is wired here — out of scope) and a prev/next arrow pair.
 *   Days of week — 7 labels, Vietnamese, read verbatim off the text nodes:
 *                  T2 T3 T4 T5 T6 T7 CN — weeks start Monday.
 *   Date-grid    — instance of the component set below.
 *
 * Cell states read off "Has Range?=false" (4731:10171):
 *   default        Text "Date", fillStyle "Brand/Solid/Black" → text-brand-black.
 *                  Raw fontSize 19 (no named text style; nearest DS token is
 *                  title3/20, font-regular — 1px off, same rounding pagination.tsx
 *                  used for its own unstyled text reads).
 *   selected       A "Color" circle (44×44, cornerRadius 22) behind the digit,
 *                  fillStyle "Semantic/Red/1" → bg-red-1, digit fillStyle
 *                  "Brand/Solid/Red" → text-brand-red. Read exactly as a LIGHT
 *                  red-1 circle + red text — NOT a solid brand-red chip, and
 *                  not the foreign #BE1128 either; both fills resolve to named,
 *                  non-remote Styles, so no contamination to flag here.
 *   outside-month  Leading/trailing days keep a placeholder digit (Figma left
 *                  "31" sitting in both the Nov-overflow and Jan-overflow
 *                  cells) but at `opacity: 0` — fully invisible, not merely
 *                  dimmed. Ported as blank, non-interactive cells.
 *
 * "Has Range?=true" (13755:5742) reuses the identical red-1/red-text
 * "selected" treatment for the two range endpoints, and for every day
 * strictly between them adds a flush "Highlight" rectangle (cornerRadius 0,
 * same Semantic/Red/1 fill, no gap to the neighbouring circle) spanning the
 * row — confirmed via screenshot: a 2-week example bands days 5–6 on row 1
 * (from the day after the start) and days 8–9 on row 2 (up to the day before
 * the end), each row's own rectangle, not one shape across rows. Reproduced
 * here as one background strip per week row (grid-column span), matching
 * the source instead of per-cell fills.
 *
 * No "Today?" axis exists on the Date-grid component set — its only
 * `componentPropertyDefinitions` entry is "Has Range?", and both it and the
 * parent set's `description` are empty. Figma does not model a today marker
 * distinct from selection anywhere in this component; none is invented here
 * per the "no invented affordances" rule — `today` is tracked internally only
 * to pick the default displayed month when neither `month` nor a value falls
 * in the current month.
 *
 * Weekday-header colour: raw fill rgb(60,60,67) @ 30% opacity, fillStyleId
 * resolves to null (no named Style). Nearest DS token by per-channel distance
 * is Neutral/8 (#384250), applied as `text-neutral-8/30` to preserve the same
 * translucent treatment rather than freezing one flattened hex.
 *
 * Month/year label (fillStyle "Brand/Solid/Black", fontSize 20 — an exact
 * title3 match) and both chevrons (fillStyle "Brand/Solid/Red" on all three:
 * the header chevron and both arrows) were named Styles, read exactly.
 * The chevron glyph itself is a 20-point rounded-cap bezier outline (an
 * SF-Symbol-style chevron); reproduced here as a simple stroked path scaled
 * to the same aspect ratio rather than transcribed point-for-point — flagged
 * as approximated, following the ChevronDownIcon precedent in pagination.tsx.
 *
 * `min`/`max` (out-of-range disabled days) and the range-selection click
 * sequence are NOT modelled in Figma (no disabled variant, no interaction
 * spec) — both are standard, undocumented extensions: disabled styling reuses
 * Neutral/4, the same disabled-text token Button/Tabs/Pagination already use;
 * range click order is first-click-sets-start / second-click-sets-end,
 * swapping if the second click lands before the first.
 */

const WEEKDAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function isSameDay(a?: Date | null, b?: Date | null): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function isBefore(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}
function isAfter(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() > startOfDay(b).getTime();
}
function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}
function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}
function dateKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}
function firstOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function isInMonth(d: Date | null | undefined, month: Date): d is Date {
  return !!d && d.getFullYear() === month.getFullYear() && d.getMonth() === month.getMonth();
}

interface DayCell {
  date: Date;
  inMonth: boolean;
}

/** Figma's read example is a fixed 5-row grid (December fits). A month whose
 * 1st falls late in the week needs a 6th row — computed here, not hardcoded,
 * per the port's task to build real date math rather than freeze one sample. */
function getMonthWeeks(month: Date): DayCell[][] {
  const year = month.getFullYear();
  const m = month.getMonth();
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const firstWeekday = new Date(year, m, 1).getDay(); // 0=Sun..6=Sat
  const offset = (firstWeekday + 6) % 7; // Monday-first
  const totalCells = offset + daysInMonth;
  const rows = Math.ceil(totalCells / 7);
  const cells: DayCell[] = [];
  for (let i = 0; i < rows * 7; i++) {
    const dayNum = i - offset + 1;
    cells.push({
      date: new Date(year, m, dayNum),
      inMonth: dayNum >= 1 && dayNum <= daysInMonth,
    });
  }
  const weeks: DayCell[][] = [];
  for (let r = 0; r < rows; r++) weeks.push(cells.slice(r * 7, r * 7 + 7));
  return weeks;
}

/** Figma: header chevron + both prev/next arrows share one glyph shape
 * (Brand/Solid/Red) — see the file doc comment on the approximation. */
function ChevronIcon({
  width,
  height,
  className,
}: {
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <svg width={width} height={height} viewBox="0 0 10 16" fill="none" aria-hidden className={className}>
      <path
        d="M1.5 1.5L8 8L1.5 14.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface CalendarRangeValue {
  start: Date | null;
  end: Date | null;
}

type CellState = "default" | "selected" | "in-range" | "disabled" | "outside";

function getCellState(
  cell: DayCell,
  opts: {
    mode: "single" | "range";
    value?: Date | null;
    rangeValue?: CalendarRangeValue;
    min?: Date;
    max?: Date;
  },
): CellState {
  if (!cell.inMonth) return "outside";
  const { mode, value, rangeValue, min, max } = opts;
  if ((min && isBefore(cell.date, min)) || (max && isAfter(cell.date, max))) {
    return "disabled";
  }
  if (mode === "range") {
    const start = rangeValue?.start ?? null;
    const end = rangeValue?.end ?? null;
    if (isSameDay(cell.date, start) || isSameDay(cell.date, end)) return "selected";
    if (start && end && isAfter(cell.date, start) && isBefore(cell.date, end)) return "in-range";
    return "default";
  }
  return isSameDay(cell.date, value) ? "selected" : "default";
}

export interface CalendarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "value" | "defaultValue"> {
  /** Figma "Has Range?". Default "single" reads the false variant; "range"
   * reads the true variant — see the file doc comment for both. */
  mode?: "single" | "range";
  /** single mode (default) */
  value?: Date | null;
  onChange?: (date: Date) => void;
  /** range mode */
  rangeValue?: CalendarRangeValue;
  onRangeChange?: (value: CalendarRangeValue) => void;
  /** Displayed month (any Date within it). Controlled if provided. */
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  /** Inclusive bounds — days outside are rendered disabled. Not a Figma
   * variant, see file doc comment. */
  min?: Date;
  max?: Date;
  "aria-label"?: string;
}

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(function Calendar(
  {
    mode = "single",
    value = null,
    onChange,
    rangeValue,
    onRangeChange,
    month: monthProp,
    defaultMonth,
    onMonthChange,
    min,
    max,
    className,
    "aria-label": ariaLabel = "Lịch chọn ngày",
    ...props
  },
  ref,
) {
  const today = startOfDay(new Date());
  const initialAnchor =
    (mode === "range" ? rangeValue?.start : value) ?? defaultMonth ?? today;

  const [uncontrolledMonth, setUncontrolledMonth] = useState(() => firstOfMonth(initialAnchor));
  const month = monthProp ? firstOfMonth(monthProp) : uncontrolledMonth;

  const setMonth = (next: Date) => {
    if (!monthProp) setUncontrolledMonth(next);
    onMonthChange?.(next);
  };

  const weeks = getMonthWeeks(month);
  const cellRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const anchorForMonth = (m: Date) => {
    const selected = mode === "range" ? rangeValue?.start : value;
    return isInMonth(selected, m) ? selected : m;
  };

  const [focusedKey, setFocusedKey] = useState(() => dateKey(anchorForMonth(month)));

  // Re-anchor the roving tab-stop whenever the displayed month changes, so
  // Tab always lands on a visible day (the selection if it's in this month,
  // otherwise the 1st). Adjusting state during render (rather than an
  // effect) per https://react.dev/learn/you-might-not-need-an-effect —
  // this is a derived reset keyed off `month` changing, not a subscription.
  const [renderedMonthKey, setRenderedMonthKey] = useState(() => dateKey(month));
  const monthKey = dateKey(month);
  if (monthKey !== renderedMonthKey) {
    setRenderedMonthKey(monthKey);
    setFocusedKey(dateKey(anchorForMonth(month)));
  }

  const handleDayClick = (cell: DayCell, state: CellState) => {
    if (!cell.inMonth || state === "disabled") return;
    if (mode === "range") {
      const cur = rangeValue ?? { start: null, end: null };
      const next: CalendarRangeValue =
        !cur.start || cur.end
          ? { start: cell.date, end: null }
          : isBefore(cell.date, cur.start)
            ? { start: cell.date, end: cur.start }
            : { start: cur.start, end: cell.date };
      onRangeChange?.(next);
    } else {
      onChange?.(cell.date);
    }
    setFocusedKey(dateKey(cell.date));
  };

  const handleGridKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const deltas: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      (document.activeElement as HTMLElement | null)?.click();
      return;
    }
    const delta = deltas[event.key];
    if (delta === undefined) return;
    event.preventDefault();

    const current = weeks.flat().find((c) => dateKey(c.date) === focusedKey)?.date ?? month;
    let next = addDays(current, delta);
    // Arrow keys move within the visible month only — crossing a boundary
    // clamps to the nearest edge rather than paging months (not specified).
    if (next.getMonth() !== month.getMonth() || next.getFullYear() !== month.getFullYear()) {
      const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
      next = delta < 0 ? new Date(month.getFullYear(), month.getMonth(), 1) : new Date(month.getFullYear(), month.getMonth(), daysInMonth);
    }
    const key = dateKey(next);
    setFocusedKey(key);
    requestAnimationFrame(() => cellRefs.current[key]?.focus());
  };

  return (
    <div
      ref={ref}
      className={cn("flex w-full max-w-[343px] flex-col gap-16 bg-brand-white", className)}
      {...props}
    >
      {/* Header — Figma "Header", 24px tall, space-between. */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="text-title3 font-regular text-brand-black">
            Tháng {month.getMonth() + 1} {month.getFullYear()}
          </span>
          <ChevronIcon width={6} height={11} className="text-brand-red" />
        </div>
        <div className="flex items-center gap-6">
          <button
            type="button"
            aria-label="Tháng trước"
            onClick={() => setMonth(addMonths(month, -1))}
            className="flex size-24 items-center justify-center text-brand-red"
          >
            <ChevronIcon width={9} height={16} className="-scale-x-100" />
          </button>
          <button
            type="button"
            aria-label="Tháng sau"
            onClick={() => setMonth(addMonths(month, 1))}
            className="flex size-24 items-center justify-center text-brand-red"
          >
            <ChevronIcon width={9} height={16} />
          </button>
        </div>
      </div>

      {/* Month — Figma "Month", 12px gap between weekday row and grid. */}
      <div className="flex flex-col gap-12">
        <div className="grid grid-cols-7">
          {WEEKDAY_LABELS.map((label) => (
            <span
              key={label}
              className="flex h-18 items-center justify-center text-caption1 font-regular text-neutral-8/30"
            >
              {label}
            </span>
          ))}
        </div>

        <div role="grid" aria-label={ariaLabel} className="flex flex-col gap-8" onKeyDown={handleGridKeyDown}>
          {weeks.map((week, rowIdx) => {
            const states = week.map((cell) => getCellState(cell, { mode, value, rangeValue, min, max }));
            const inRangeIdx = states.reduce<number[]>((acc, s, i) => {
              if (s === "in-range") acc.push(i);
              return acc;
            }, []);
            const bandFrom = inRangeIdx[0];
            const bandTo = inRangeIdx[inRangeIdx.length - 1];

            return (
              <div key={rowIdx} role="row" className="relative grid h-44 grid-cols-7">
                {inRangeIdx.length > 0 && (
                  <div
                    aria-hidden
                    className="bg-red-1"
                    style={{ gridColumn: `${bandFrom + 1} / ${bandTo + 2}`, gridRow: 1 }}
                  />
                )}
                {week.map((cell, colIdx) => {
                  const state = states[colIdx];
                  const key = dateKey(cell.date);
                  return (
                    <button
                      key={key}
                      ref={(el) => {
                        cellRefs.current[key] = el;
                      }}
                      type="button"
                      role="gridcell"
                      tabIndex={key === focusedKey && cell.inMonth ? 0 : -1}
                      aria-selected={state === "selected"}
                      aria-disabled={state === "disabled" || undefined}
                      disabled={!cell.inMonth}
                      data-state={state}
                      style={{ gridColumn: colIdx + 1, gridRow: 1 }}
                      onClick={() => handleDayClick(cell, state)}
                      className={cn(
                        "relative z-[1] flex size-44 items-center justify-center rounded-full",
                        "text-title3 font-regular text-brand-black outline-none",
                        "data-[state=outside]:invisible data-[state=outside]:pointer-events-none",
                        "data-[state=in-range]:text-brand-red",
                        "data-[state=selected]:bg-red-1 data-[state=selected]:text-brand-red",
                        "data-[state=disabled]:cursor-not-allowed data-[state=disabled]:text-neutral-4",
                      )}
                    >
                      {cell.inMonth ? cell.date.getDate() : null}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
