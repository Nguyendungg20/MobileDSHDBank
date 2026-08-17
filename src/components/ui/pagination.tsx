"use client";

import { forwardRef, useId, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { cn } from "@/lib/cn";

/**
 * Pagination — mirrors the Figma component set "pagination" (page ❖ Pagination,
 * node 4:192644, component-set id 1:13019). Despite the mobile DS, this is the
 * numbered-page-list pattern (with an optional page-size dropdown), NOT dot
 * carousel indicators — the page holds exactly one component set with three
 * variants, all built from a shared row of ".pagination-item" / ".pagination-prev"
 * / ".pagination-next" / ".pagination-item-ellipsis" sub-components:
 *
 *   "Dropdown page=false, Expand=true"  → numbered, expanded (1 2 [3] … 10)
 *   "Dropdown page=false, Expand=false" → numbered, collapsed (‹ 1 ›  only)
 *   "Dropdown page=true,  Expand=false" → compact: page-size select + « ‹ 7/12 › »
 *
 * Figma axes → props:
 *   Expand (boolean, numbered only) → `expanded`
 *   page   (boolean)                → `variant` ("numbered" | "compact"),
 *                                      inverted/renamed since `page` collides
 *                                      with the `page` prop (current page number)
 *
 * The one real-world usage in the file (the "Example" screen's list footer,
 * instance 3975:13181) resolves to "Dropdown page=false, Expand=true" — the
 * expanded numbered variant is the default here.
 *
 * "page=true, Expand=true" does not exist as a symbol in Figma — the compact
 * dropdown mode has no expanded counterpart, so `expanded` only applies to
 * variant="numbered".
 *
 * Sub-part states read off Figma (all literal State axis values, used verbatim
 * as `data-state`, per the Button/Tabs convention):
 *   .pagination-item            State = normal | active | disabled
 *   .pagination-prev/-next      State = normal | disabled  (Type=icon read; a
 *                                Type=text variant also exists but was not used
 *                                by any read example, so it is not built here)
 *   .pagination-item-ellipsis   Direction = prev | next, State = normal | disabled
 *                                — the SAME shared "•••" glyph placed on either
 *                                side of the numbered window, `visible` toggled
 *                                per instance (confirmed: the leading one is
 *                                `visible: false` in the read example, since
 *                                page 2 of 10 doesn't need a leading gap).
 *
 * Read insight — the compact variant's "«" / "»" are NOT a distinct
 * double-chevron glyph: `mainComponentId` for the first two page-items
 * (id 1:13132 and 1649:377596) is identical (1:13380, ".pagination-prev
 * Type=icon State=normal") — Figma fakes "«" by placing two ordinary
 * single-chevron `.pagination-prev` instances back to back (itemSpacing -1).
 * Reproduced here as two literal buttons — `onFirst` + `onPrev` — rather than
 * inventing a double-chevron icon.
 *
 * Colour/style provenance — every fill below (label text, item text, active
 * chip, chevron/ellipsis glyph, wrapper border, select border/placeholder) had
 * `fillStyleId` / `strokeStyleId` resolve to `null`: none of this component is
 * built from named Figma Styles. Values were read as raw hex and mapped to the
 * nearest DS token; two are flagged as likely contamination rather than a
 * deliberate off-ramp pick (see the two color const blocks below for exact
 * deltas). Text runs as raw "SF Pro Regular 12", not a named type style either
 * — mapped to `text-caption1` (12px) per this DS's scale, and left to inherit
 * the page's Be Vietnam Pro font-family rather than hardcoding SF Pro.
 *
 * Disabled-state colour for item text and prev/next icon could NOT be read:
 * the disabled component variants' icon/text sub-instances returned zero
 * children when traversed (an unpopulated override), unlike every other state
 * which resolved fully down to the vector. Styled here with Neutral/5, the
 * same disabled-text token Button/Tabs already use — flagged as INFERRED, not
 * read, per that gap.
 */

// ---------------------------------------------------------------------------
// Icons — exact vector paths exported from the Figma nodes, not approximated.
// ---------------------------------------------------------------------------

/** Figma: `.pagination-prev`/`.pagination-next` shared chevron Union,
 * viewBox 0 0 4 6, fill read as raw #212529 (no Style link) — nearest DS
 * token is Neutral/9 (#1F2A37), but the read value is off by ~15/255 per
 * channel, closer to a stray Bootstrap default-text grey than an intentional
 * off-ramp pick. Flagged, mapped to `text-neutral-9` via `currentColor`. */
function ChevronIcon({
  direction,
  className,
}: {
  direction: "left" | "right";
  className?: string;
}) {
  return (
    <svg
      width="4"
      height="6"
      viewBox="0 0 4 6"
      fill="none"
      aria-hidden
      className={cn(direction === "right" && "-scale-x-100", className)}
    >
      <path
        d="M3.705 0.705L3 0L0 3L3 6L3.705 5.295L1.415 3L3.705 0.705Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Figma: `.pagination-item-ellipsis` shared "•••" Union, viewBox 0 0 13 3,
 * same raw #212529 fill as the chevron — see ChevronIcon's note. */
function EllipsisIcon({ className }: { className?: string }) {
  return (
    <svg
      width="13"
      height="3"
      viewBox="0 0 13 3"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M1.5 3C1.10218 3 0.720644 2.84196 0.43934 2.56066C0.158035 2.27936 0 1.89782 0 1.5C0 1.10218 0.158035 0.720644 0.43934 0.43934C0.720644 0.158035 1.10218 0 1.5 0C1.89782 0 2.27936 0.158035 2.56066 0.43934C2.84196 0.720644 3 1.10218 3 1.5C3 1.89782 2.84196 2.27936 2.56066 2.56066C2.27936 2.84196 1.89782 3 1.5 3ZM6.5 3C6.10218 3 5.72064 2.84196 5.43934 2.56066C5.15804 2.27936 5 1.89782 5 1.5C5 1.10218 5.15804 0.720644 5.43934 0.43934C5.72064 0.158035 6.10218 0 6.5 0C6.89782 0 7.27936 0.158035 7.56066 0.43934C7.84196 0.720644 8 1.10218 8 1.5C8 1.89782 7.84196 2.27936 7.56066 2.56066C7.27936 2.84196 6.89782 3 6.5 3ZM11.5 3C11.1022 3 10.7206 2.84196 10.4393 2.56066C10.158 2.27936 10 1.89782 10 1.5C10 1.10218 10.158 0.720644 10.4393 0.43934C10.7206 0.158035 11.1022 0 11.5 0C11.8978 0 12.2794 0.158035 12.5607 0.43934C12.842 0.720644 13 1.10218 13 1.5C13 1.89782 12.842 2.27936 12.5607 2.56066C12.2794 2.84196 11.8978 3 11.5 3Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** NOT read pixel-exact from Figma: the source `keyboard_arrow_down` vector is
 * a boolean-op whose leaf export came back a degenerate near-zero-area path
 * (an artifact of exporting one operand rather than the resolved union). This
 * is a generic chevron-down, low risk to approximate — a plain stroke chevron,
 * standard Material glyph shape. Flagged as approximated, not measured. */
function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M3 4.5L6 7.5L9 4.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Page-window algorithm
// ---------------------------------------------------------------------------

type PageToken = number | "ellipsis-start" | "ellipsis-end";

/**
 * Windows the page list around `current`, always keeping page 1 and the last
 * page, collapsing any gap wider than 1 into an ellipsis token.
 *
 * Verified against the one read Figma example — current=2, total=10,
 * siblingCount=1 — which reproduces exactly [1, 2, 3, 'ellipsis-end', 10],
 * matching the "1 2 [3] ••• 10" render. Only that single state exists in
 * Figma; behaviour for other page counts (e.g. current in the middle) is a
 * standard extension of the same rule, not a second read example.
 */
function getPageWindow(
  current: number,
  total: number,
  siblingCount: number,
): PageToken[] {
  if (total <= 0) return [];
  const lo = Math.max(1, current - siblingCount);
  const hi = Math.min(total, current + siblingCount);

  const pages = new Set<number>([1, total]);
  for (let p = lo; p <= hi; p++) pages.add(p);

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const tokens: PageToken[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      tokens.push(sorted[i - 1] === 1 ? "ellipsis-start" : "ellipsis-end");
    }
    tokens.push(sorted[i]);
  }
  return tokens;
}

// ---------------------------------------------------------------------------
// Shared sub-parts
// ---------------------------------------------------------------------------

type ItemState = "normal" | "active" | "disabled";

/** Figma `.pagination-item`. Text-only in `normal`/`disabled`; `active` wraps
 * the number in a rounded-4 chip. Chip fill in Figma is raw #BE1128 (no Style
 * link) — the same foreign red seen on Progress tracker and Slider, not the DS
 * ramp. Normalised to `brand-red` (red-6), the active accent every other
 * component uses, rather than freezing the nearest foreign hex. Figma to fix. */
function PaginationItem({
  page,
  state,
  onClick,
}: {
  page: number;
  state: ItemState;
  onClick?: () => void;
}) {
  const disabled = state === "disabled";
  const active = state === "active";
  return (
    <button
      type="button"
      data-state={state}
      aria-current={active ? "page" : undefined}
      aria-label={`Trang ${page}`}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-32 shrink-0 items-center justify-center px-8",
        "text-caption1 text-neutral-9",
        "data-[state=disabled]:cursor-not-allowed data-[state=disabled]:text-neutral-5",
      )}
    >
      {active ? (
        <span className="flex h-20 min-w-20 items-center justify-center rounded-4 bg-red-6 px-6 text-brand-white">
          {page}
        </span>
      ) : (
        page
      )}
    </button>
  );
}

/** Figma `.pagination-item-ellipsis` — decorative "•••" filler for a skipped
 * run of pages. Modelled as non-interactive: Figma defines Direction=prev/next
 * × State=normal/disabled for it, but no read example ever shows it as a
 * clickable jump-to-middle-page control, so it is not wired to a click handler. */
function PaginationEllipsis() {
  return (
    <span
      aria-hidden
      className="flex h-32 shrink-0 items-center justify-center px-9 text-neutral-9"
    >
      <EllipsisIcon />
    </span>
  );
}

/** Figma `.pagination-prev` / `.pagination-next`, Type=icon. Used four times
 * across the two variants: prev, next, and (compact only) first/last, which
 * reuse this exact same single-chevron button — see the file doc comment on
 * how "«"/"»" are faked by doubling it. */
function PaginationArrow({
  direction,
  disabled,
  label,
  onClick,
}: {
  direction: "left" | "right";
  disabled: boolean;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      data-state={disabled ? "disabled" : "normal"}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-32 w-32 shrink-0 items-center justify-center text-neutral-9",
        "data-[state=disabled]:cursor-not-allowed data-[state=disabled]:text-neutral-5",
      )}
    >
      <ChevronIcon direction={direction} />
    </button>
  );
}

/** Figma `page-items` wrapper frame: rounded-8, 2px Neutral/2-ish border
 * (#F2F2F4 read, ~1-2/255 off Neutral/2 #F3F4F6 — within rounding, not
 * flagged as contamination). Houses every variant's row of arrow/item buttons. */
function PillRow({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex h-32 items-center overflow-hidden rounded-8 border-2 border-neutral-2 bg-brand-white",
        className,
      )}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

export type PaginationVariant = "numbered" | "compact";

export interface PaginationProps
  extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  /** Figma "page" axis, inverted & renamed (page=false → "numbered",
   * page=true → "compact") since `page` is taken by the current-page prop. */
  variant?: PaginationVariant;
  /** Current page, 1-indexed. */
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** numbered only — Figma "Expand" boolean: full numbered list with ellipsis
   * (true, the default — matches the one real usage read) vs a collapsed
   * ‹ current › row (false). Also collapses automatically when totalPages <= 1
   * (not a distinct Figma state, a sensible extension of "nothing to expand"). */
  expanded?: boolean;
  /** numbered only — Figma label "Tổng {n} kết quả". Omitted renders no label. */
  totalResults?: number;
  /** numbered only — pages kept on each side of the current page before
   * collapsing into an ellipsis. Figma's one read example uses 1. */
  siblingCount?: number;
  /** compact only — the page-size <select>'s current value. */
  pageSize?: number;
  /** compact only — page-size options. Figma's read example shows "10 / trang". */
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  "aria-label"?: string;
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  function Pagination(
    {
      variant = "numbered",
      page,
      totalPages,
      onPageChange,
      expanded = true,
      totalResults,
      siblingCount = 1,
      pageSize,
      pageSizeOptions = [10, 20, 50],
      onPageSizeChange,
      className,
      "aria-label": ariaLabel = "Pagination",
      ...props
    },
    ref,
  ) {
    const selectId = useId();
    const atFirst = page <= 1;
    const atLast = page >= totalPages;

    if (variant === "compact") {
      return (
        <nav
          ref={ref as Ref<HTMLElement>}
          aria-label={ariaLabel}
          className={cn("flex items-center justify-between gap-8", className)}
          {...props}
        >
          {/* Figma: "select/small/…" reused as the page-size trigger. Border
           * read as raw #C7CAD3 → nearest Neutral/4; placeholder text raw
           * #9598A3 → nearest Neutral/5; both unlinked but clean on-ramp hits. */}
          <div className="relative">
            <label htmlFor={selectId} className="sr-only">
              Số dòng mỗi trang
            </label>
            <select
              id={selectId}
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              className={cn(
                "h-32 appearance-none rounded-4 border border-neutral-4 bg-brand-white",
                "py-5 pr-32 pl-8 text-caption1 text-neutral-5 outline-none",
              )}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size} / trang
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-8 -translate-y-1/2 text-neutral-9" />
          </div>

          <PillRow>
            <PaginationArrow
              direction="left"
              disabled={atFirst}
              label="Trang đầu"
              onClick={() => onPageChange(1)}
            />
            <PaginationArrow
              direction="left"
              disabled={atFirst}
              label="Trang trước"
              onClick={() => onPageChange(page - 1)}
            />
            {/* Figma: the "current/total" readout reuses `.pagination-item`
             * (State=normal) but is not itself a page-jump control here, so it
             * is rendered as static text rather than a button. */}
            <span className="flex h-32 shrink-0 items-center justify-center px-8 text-caption1 text-neutral-9">
              {page}/{totalPages}
            </span>
            <PaginationArrow
              direction="right"
              disabled={atLast}
              label="Trang sau"
              onClick={() => onPageChange(page + 1)}
            />
            <PaginationArrow
              direction="right"
              disabled={atLast}
              label="Trang cuối"
              onClick={() => onPageChange(totalPages)}
            />
          </PillRow>
        </nav>
      );
    }

    const showExpanded = expanded && totalPages > 1;
    const tokens = showExpanded
      ? getPageWindow(page, totalPages, siblingCount)
      : null;

    return (
      <nav
        ref={ref as Ref<HTMLElement>}
        aria-label={ariaLabel}
        className={cn("flex items-center justify-between gap-8", className)}
        {...props}
      >
        {totalResults !== undefined && (
          <span className="text-caption1 text-brand-black">
            Tổng {totalResults} kết quả
          </span>
        )}

        <PillRow>
          <PaginationArrow
            direction="left"
            disabled={atFirst}
            label="Trang trước"
            onClick={() => onPageChange(page - 1)}
          />
          {showExpanded
            ? tokens!.map((token, i) =>
                typeof token === "number" ? (
                  <PaginationItem
                    key={token}
                    page={token}
                    state={token === page ? "active" : "normal"}
                    onClick={() => onPageChange(token)}
                  />
                ) : (
                  <PaginationEllipsis key={`${token}-${i}`} />
                ),
              )
            : <PaginationItem page={page} state="active" onClick={() => {}} />}
          <PaginationArrow
            direction="right"
            disabled={atLast}
            label="Trang sau"
            onClick={() => onPageChange(page + 1)}
          />
        </PillRow>
      </nav>
    );
  },
);
