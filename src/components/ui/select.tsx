"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { ListItem } from "@/components/ui/list-item";
import { Radio } from "@/components/ui/radio";

/**
 * Select — mirrors the Figma component set "Select Dropdown"
 * (page ❖ Select: List Item, Select Dropdown, fileKey 3wFivMDO6P0heqk4YPLJQF,
 * component set node 7233:32670).
 *
 * Figma component-set properties (there is NO :state axis — see below):
 *   Has 2-Options?               → VARIANT "no" | "yes" — see "NOT ported" below
 *   "👁️‍🗨️ Show Icon <" (bool, default true)  → `icon` slot, rendered iff provided
 *   "👁️‍🗨️ Show Icon >" (bool, default true)  → `showChevron` prop
 *   "Show OD" (bool, default false)          → NOT ported — see below
 *
 * IMPORTANT deviation from the brief this was ported against: the brief assumed
 * this component "closely mirrors Input" with a default/focus/filled/disabled/
 * error :state axis. It does not. The actual Figma node is a single fixed
 * "Fund Source" card — Icon(40) + Title(caption) + Amount(subheadline/
 * semibold) + a circular "expand_more" chevron badge — with none of those
 * states modelled anywhere in the component set or its componentPropertyDefinitions
 * (confirmed by reading them directly, not inferred). Per this DS's own rule to
 * never invent an unread value: `disabled` / `error` / the empty-value
 * "placeholder" look below are this port's own additions for a Select to be
 * usable as a real form control, styled from this DS's general disabled/error
 * conventions (same tokens Input uses: neutral-4 dim text, red-6 error border) —
 * NOT traced Figma states. Flagged here and in the port report.
 *
 * The trigger's real anatomy, read off node 7233:32671 ("Has 2-Options?=no"):
 *   - Card: rounded-16, fill bound to style "Base/White" — a REMOTE (foreign,
 *     non-DS) style that resolves to plain white; mapped to this DS's own
 *     `brand-white` rather than adding a token for a foreign ref. Flagged.
 *   - effectStyle "Shadow 1" (local, not remote) → `shadow-1`.
 *   - Auto-layout padding reads as top:10/right:0/bottom:0/left:0 with a fixed
 *     60px height and top-aligned content — i.e. the missing 10px at the
 *     bottom is slack from the fixed height, not literal padding. Ported as
 *     symmetric `py-10` (10 top *and* bottom), which lands in the same place.
 *   - Content row padding 0/16/0/16 → `px-16` on the inner row.
 *   - Title text: fillStyle Neutral/6, 12px, no bound text style → `text-caption1
 *     text-neutral-6` (12px is exactly caption1's size).
 *   - Amount/value text: textStyle "Subheadline/Body/Semibold", fillStyle
 *     Brand/Solid/Black → `text-subheadline font-semibold text-brand-black`.
 *   - Trailing "Icon" frame: 32×32, padding 4, cornerRadius 100 (pill), fill
 *     Neutral/2, containing the "expand_more" (chevron-down) vector at
 *     Neutral/6, strokeWeight ~1.71 — a circular chevron badge, NOT a bare
 *     chevron like Input's suffix. Ported faithfully as a size-32 rounded-full
 *     bg-neutral-2 badge. The 180° rotate-on-open is this port's own addition
 *     (Figma only shows the closed glyph) — the same convention Accordion uses.
 *   - Leading icon slot: 40×40 (".Icon / Bank+Wallet / Logo" in the source
 *     instance) → generic `icon` ReactNode slot, same pattern as Input's
 *     `icon` prop.
 *
 * NOT ported, and why:
 *   - "Has 2-Options?=yes": not a state or size variant of the same control —
 *     its node tree is a structurally different two-field composite (e.g. a
 *     "Khoản vay" / "Thời gian" — loan amount + duration — pair, each with its
 *     own inline chevron, no card chevron badge, and Figma does not even bind
 *     the same shadow style to it). Two independent value pickers side by
 *     side don't fit a single `value`/`onChange` API. Left out, same call as
 *     Input's skipped "amount-number" variant.
 *   - "Show OD" banner: a fund-specific overdraft-limit notice row (orange-
 *     tinted text + a small pill button + a chevron) hardcoded to banking
 *     copy ("Bao gồm 3,000,000 VND hạn mức thấu chi"). Too domain-specific to
 *     generalize into a generic Select; not exposed as a prop.
 *
 * The open panel is NOT modelled on the "Select Dropdown" node itself — Figma
 * has no popover/menu attached to it anywhere on this page. It IS modelled a
 * layer up: the file's own "Bottom-sheet / Select-source-account" instance
 * (node 14589:47329, heading "Chọn tài khoản") and the "[NEW] Bottom-sheet /
 * Thời hạn thanh toán" instance (13935:22599) both show the real intended
 * pairing — a `<BottomSheet>` whose body is a stack of List Item
 * `Type=radio-button, :state=default` rows, each with a leading 40px icon,
 * Header-txt + Label, optional Sub-txt, and a real small `<Radio>` instance
 * (Checked?=False by default) as the trailing control — exactly ListItem's
 * own documented "the control slot is where a real `<Radio>` goes" pattern.
 * Composed here as `<BottomSheet><ListItem variant="radio-button" .../></BottomSheet>`,
 * not redrawn. The `<Radio>` inside each row is decorative (aria-hidden,
 * tabIndex=-1) — the row itself, not the radio input, carries `role="option"`
 * and `aria-selected`, since a listbox exposes one selectable element per row,
 * not a nested native radio control.
 */

export interface SelectOption {
  value: string;
  label: ReactNode;
  /** Optional — Figma's "Header txt" (small caption above Label) seen in the
   *  Select-source-account demo, e.g. an account number. */
  header?: ReactNode;
  /** Optional — Figma's "Sub txt" (e.g. an overdraft note) below the label. */
  subText?: ReactNode;
  /** Optional per-option leading icon (Figma: ".List Item / Icons", 40px). */
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "value"> {
  options: SelectOption[];
  /** Controlled selected value. */
  value?: string;
  onChange?: (value: string) => void;
  /** Figma: Title — shown as a small caption above the value once one is set,
   *  and doubles as the BottomSheet panel's heading. */
  label?: ReactNode;
  /** Shown in place of a value when nothing is selected yet. Not a traced
   *  Figma state — see file doc comment. */
  placeholder?: string;
  /** Figma: "👁️‍🗨️ Show Icon <" — leading 40px slot, rendered iff provided. */
  icon?: ReactNode;
  /** Figma: "👁️‍🗨️ Show Icon >", default true. */
  showChevron?: boolean;
  /** Not a traced Figma state — this DS's general disabled convention. */
  disabled?: boolean;
  /** Not a traced Figma state — this DS's general error convention (Input's
   *  red-6 border/text). */
  error?: boolean;
  errorText?: ReactNode;
  helperText?: ReactNode;
  /** className for the outer wrapper (trigger + hint row). */
  containerClassName?: string;
}

/** Figma: "expand_more" vector — Neutral/6, strokeWeight ~1.71. */
function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.71"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Figma: "error" hint icon — vector fill Semantic/Red/6. Same glyph Input uses. */
function ErrorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.71" />
      <path d="M12 7.5v6" stroke="currentColor" strokeWidth="1.71" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="1" fill="currentColor" />
    </svg>
  );
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    options,
    value,
    onChange,
    label,
    placeholder = "Select an option",
    icon,
    showChevron = true,
    disabled = false,
    error = false,
    errorText,
    helperText,
    id,
    className,
    containerClassName,
    onClick,
    onKeyDown,
    ...props
  },
  forwardedRef,
) {
  const [open, setOpen] = useState(false);
  const autoId = useId();
  const triggerId = id ?? autoId;
  const listboxId = `${triggerId}-listbox`;
  const hintId = `${triggerId}-hint`;

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);
  const help = error ? errorText : helperText;

  function selectOption(opt: SelectOption) {
    if (opt.disabled) return;
    onChange?.(opt.value);
    setOpen(false);
  }

  // Focus the selected (or first enabled) option once the panel mounts.
  // BottomSheet mounts its body a render after `open` flips true (it only
  // renders `children` once its own internal `mounted` state catches up) and
  // ALSO focuses its own root div once that happens — and that `mounted`
  // flip is itself staggered across more than one of BottomSheet's own
  // effects, so no single fixed delay from here reliably runs after
  // BottomSheet's focus() call every time (confirmed by logging real
  // `.focus()` calls: both a plain rAF and a macrotask `setTimeout(0)` lost
  // the race at least once — the exact number of renders it takes
  // BottomSheet to settle isn't guaranteed by anything Select can observe
  // from outside it). `setTimeout` polling (NOT `requestAnimationFrame` —
  // rAF callbacks are suspended by the browser while this tab isn't the
  // foreground/visible one, which would silently never resolve this) keeps
  // re-asserting focus onto the option for a short window after opening, so
  // whichever commit BottomSheet's own focus() lands on, this always runs
  // after it within that window and wins deterministically.
  useEffect(() => {
    if (!open) return;
    let tries = 0;
    let timeoutId = 0;
    function tick() {
      tries += 1;
      // Only steal focus while it's still sitting on the dialog wrapper (or
      // hasn't reached the panel at all yet) — never once it's already on
      // ANY option, so this can't fight the user if they've already started
      // arrowing to a different row within this same short window.
      const activeIsAnOption = document.activeElement?.getAttribute("role") === "option";
      if (!activeIsAnOption) {
        const container = listRef.current;
        const selectedEl = container?.querySelector<HTMLElement>('[aria-selected="true"]');
        const firstEnabled = container?.querySelector<HTMLElement>(
          '[role="option"]:not([aria-disabled="true"])',
        );
        (selectedEl ?? firstEnabled)?.focus();
      }
      if (tries < 20) timeoutId = window.setTimeout(tick, 16);
    }
    timeoutId = window.setTimeout(tick, 0);
    return () => window.clearTimeout(timeoutId);
  }, [open]);

  function handleListKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
    const items = Array.from(
      listRef.current?.querySelectorAll<HTMLElement>(
        '[role="option"]:not([aria-disabled="true"])',
      ) ?? [],
    );
    if (items.length === 0) return;
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(currentIndex + 1) % items.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(currentIndex - 1 + items.length) % items.length]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1]?.focus();
    }
  }

  return (
    <div className={cn("flex w-full flex-col gap-8", containerClassName)}>
      <button
        ref={(node) => {
          triggerRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        id={triggerId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-describedby={help ? hintId : undefined}
        onClick={(e) => {
          onClick?.(e);
          if (!disabled) setOpen((o) => !o);
        }}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (disabled) return;
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={cn(
          "relative flex w-full items-center gap-8 rounded-16 py-10 pl-16 pr-16 text-left",
          "transition-colors outline-none",
          disabled
            ? "bg-neutral-2 shadow-none cursor-not-allowed"
            : "bg-brand-white shadow-1",
          error && "border border-red-6",
          className,
        )}
        {...props}
      >
        {icon && (
          <span className="flex size-40 shrink-0 items-center justify-center">
            {icon}
          </span>
        )}

        <span className="flex min-w-0 flex-1 flex-col gap-2">
          {label && (
            <span
              className={cn(
                "text-caption1",
                disabled ? "text-neutral-4" : "text-neutral-6",
              )}
            >
              {label}
            </span>
          )}
          <span
            className={cn(
              "truncate text-subheadline",
              selected
                ? cn("font-semibold", disabled ? "text-neutral-4" : "text-brand-black")
                : cn("font-regular", disabled ? "text-neutral-4" : "text-neutral-5"),
            )}
          >
            {selected ? selected.label : placeholder}
          </span>
        </span>

        {showChevron && (
          <span
            aria-hidden
            className={cn(
              "flex size-32 shrink-0 items-center justify-center rounded-full transition-transform",
              disabled ? "bg-neutral-3" : "bg-neutral-2",
              open && "rotate-180",
            )}
          >
            <ChevronDownIcon
              className={cn("size-24", disabled ? "text-neutral-4" : "text-neutral-6")}
            />
          </span>
        )}
      </button>

      {help && (
        <p
          id={hintId}
          className={cn(
            "flex items-center gap-8 text-caption1",
            error ? "text-red-6" : "text-neutral-6",
          )}
        >
          {error && <ErrorIcon className="size-16 shrink-0" />}
          {help}
        </p>
      )}

      <BottomSheet open={open} onOpenChange={setOpen} title={label || placeholder}>
        <div
          ref={listRef}
          role="listbox"
          id={listboxId}
          aria-labelledby={triggerId}
          onKeyDown={handleListKeyDown}
          className="flex flex-col"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <ListItem
                key={opt.value}
                variant="radio-button"
                role="option"
                tabIndex={-1}
                aria-selected={isSelected}
                disabled={opt.disabled}
                leadingIcon={opt.icon}
                leadingIconSize="large"
                header={opt.header}
                label={opt.label}
                subText={opt.subText}
                control={
                  <Radio
                    size="small"
                    showLabel={false}
                    checked={isSelected}
                    disabled={opt.disabled}
                    tabIndex={-1}
                    aria-hidden
                    onChange={() => selectOption(opt)}
                  />
                }
                onClick={() => selectOption(opt)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    selectOption(opt);
                  }
                }}
              />
            );
          })}
        </div>
      </BottomSheet>
    </div>
  );
});
