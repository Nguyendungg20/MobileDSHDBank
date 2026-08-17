"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Tabs — mirrors the Figma component sets ".Tab-item" (id 7346:11971, the single
 * trigger) and "Tabs" (id 7350:8680, the full row) on page "❖ Tabs".
 *
 * Figma axes → props:
 *   Type (both sets)     → `variant` ("underlined" | "solid")
 *   Has Maximum? (Tabs)  → `fullWidth` on TabsList, INVERTED: Figma's default "no"
 *                          is the evenly-stretched row (every .Tab-item instance
 *                          uses `layoutSizingHorizontal: FILL`) — that is our
 *                          default, `fullWidth=true`. Figma's "yes" example
 *                          switches the underlined instances to fixed/hug widths
 *                          that don't fill the row, i.e. natural width with room
 *                          to scroll — that is `fullWidth=false`.
 *                          NOTE: this toggle is only demonstrated for
 *                          variant="underlined". Every "solid" row read (both
 *                          "Has Maximum?" values) keeps FILL sizing on its items,
 *                          so `fullWidth=false` on a solid list is an inferred
 *                          extension for API symmetry, not a value read off a node.
 *   Active? (.Tab-item)  → derived from Tabs' controlled/uncontrolled `value`,
 *                          exposed as `data-state` (selected | default | disabled),
 *                          consistent with Button/Chip rather than `:disabled`.
 *   Show Dot (.Tab-item) → `dot` on TabsTrigger. Only wired up for
 *                          variant="underlined": every "solid" instance read had no
 *                          Icon/Dot layer under Text-wrapper at all, so there is
 *                          nothing to swap for "solid".
 *   disabled             → NOT a Figma State axis for this component — the Tabs
 *                          page defines no disabled variant. Implemented anyway
 *                          because the port scope calls for it; styled with
 *                          Neutral/4, the token Checkbox/Radio already use for
 *                          their real disabled states, rather than inventing a
 *                          new one. Flagged as inferred, not read.
 *
 * Structure mirrors Figma 1:1 for "underlined": each trigger is a column of
 * [content row] + [2px Indicator bar] — that's a literal child of the Figma node
 * ("Text-wrapper" + "Indicator" rectangle), not a border/pseudo-element trick.
 * Figma also draws a 1px Neutral/3 bottom stroke on both the standalone .Tab-item
 * AND the full Tabs row; ported as a single border-b on TabsList (both strokes sit
 * at the same position at the same weight/colour, so doubling them would be
 * invisible anyway — the row-level one alone keeps the DOM simpler and stays
 * continuous under variable-width triggers).
 *
 * `data-state` lives on the trigger root (button), never a descendant — Tailwind's
 * `data-[state=x]:` variant only matches the element carrying the attribute, it
 * does not cascade like `group-data-*` would. Every trigger below either styles
 * that same root element directly, or reaches a child via `group` +
 * `group-data-[state=…]:` — see Chip's post-mortem in AGENTS.md for why this
 * matters (state colours written on an inner span with `data-state` left on the
 * root compile clean and render silently wrong).
 */

export type TabsVariant = "underlined" | "solid";
type TriggerState = "default" | "selected" | "disabled";

interface TabsContextValue {
  value: string | undefined;
  setValue: (value: string) => void;
  variant: TabsVariant;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

interface TabsListContextValue {
  fullWidth: boolean;
}

const TabsListContext = createContext<TabsListContextValue>({ fullWidth: true });

function useTabsContext(component: string): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error(`<${component}> must be rendered inside <Tabs>.`);
  }
  return ctx;
}

function setRef<T>(ref: React.Ref<T> | undefined, node: T) {
  if (typeof ref === "function") ref(node);
  else if (ref) (ref as MutableRefObject<T | null>).current = node;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  variant?: TabsVariant;
  /** Controlled selected value. Omit and use `defaultValue` for uncontrolled use. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

/** Root — provides context only, no visual output of its own (matches Figma: the
 * component sets are the row and the item, there is no separate "Tabs root" frame). */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { variant = "underlined", value, defaultValue, onValueChange, className, children, ...props },
  ref,
) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : uncontrolled;
  const baseId = useId();

  const setValue = (next: string) => {
    if (!isControlled) setUncontrolled(next);
    onValueChange?.(next);
  };

  return (
    <TabsContext.Provider value={{ value: current, setValue, variant, baseId }}>
      <div ref={ref} className={cn("flex flex-col gap-16", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
});

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  /** Figma "Has Maximum?", inverted — see the file-level doc comment. */
  fullWidth?: boolean;
  "aria-label"?: string;
}

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  { fullWidth = true, className, children, onKeyDown, ...props },
  ref,
) {
  const { variant } = useTabsContext("TabsList");
  const listRef = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;

    const tabs = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)') ?? [],
    );
    if (tabs.length === 0) return;

    const activeIndex = tabs.findIndex((tab) => tab === document.activeElement);
    let nextIndex = activeIndex;
    if (event.key === "ArrowRight") {
      nextIndex = activeIndex < 0 ? 0 : (activeIndex + 1) % tabs.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = activeIndex < 0 ? tabs.length - 1 : (activeIndex - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabs.length - 1;
    }

    event.preventDefault();
    // Automatic activation, per the WAI-ARIA tabs pattern: arrow keys move focus
    // AND select — the simple/common variant (vs. manual activation + Enter/Space).
    tabs[nextIndex].focus();
    tabs[nextIndex].click();
  };

  return (
    <TabsListContext.Provider value={{ fullWidth }}>
      <div
        ref={(node) => {
          listRef.current = node;
          setRef(ref, node);
        }}
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
        className={cn(
          "flex overflow-x-auto",
          // Figma: 1px Neutral/3 baseline spanning the whole row; each selected
          // underlined trigger's own 2px red Indicator sits on top of it.
          variant === "underlined" && "border-b border-neutral-3",
          // Figma: 2px padding "track" + rounded-8, Neutral/3 fill — a segmented
          // control housing the pill-shaped triggers.
          variant === "solid" && "gap-0 rounded-8 bg-neutral-3 p-2",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </TabsListContext.Provider>
  );
});

export interface TabsTriggerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onSelect"> {
  value: string;
  disabled?: boolean;
  /** Figma "Show Dot" — underlined only, see file-level doc comment. */
  dot?: boolean;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(function TabsTrigger(
  { value, disabled = false, dot = false, className, children, onClick, id, ...props },
  ref,
) {
  const { value: active, setValue, variant, baseId } = useTabsContext("TabsTrigger");
  const { fullWidth } = useContext(TabsListContext);
  const selected = active === value;
  const state: TriggerState = disabled ? "disabled" : selected ? "selected" : "default";

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      id={id ?? `${baseId}-tab-${value}`}
      aria-selected={selected}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      data-state={state}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setValue(value);
      }}
      className={cn(
        "group relative flex outline-none",
        fullWidth ? "flex-1" : "shrink-0",
        variant === "underlined" ? "h-40 flex-col" : "h-28 items-center",
        "data-[state=disabled]:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {variant === "underlined" ? (
        <>
          <span
            className={cn(
              "flex flex-1 items-center justify-center gap-4 px-16 whitespace-nowrap",
              // Figma: Label is ALWAYS Subheadline/Bold for this variant — only the
              // colour changes between default and selected (unlike "solid", which
              // also swaps the weight). Do not assume uniform behaviour across variants.
              "text-subheadline font-bold text-neutral-5",
              "group-data-[state=selected]:text-brand-red",
              "group-data-[state=disabled]:text-neutral-4",
            )}
          >
            {children}
            {dot && (
              <span
                aria-hidden
                className="size-4 shrink-0 rounded-full bg-brand-orange"
              />
            )}
          </span>
          <span
            aria-hidden
            className={cn(
              "h-2 w-full bg-transparent",
              "group-data-[state=selected]:bg-brand-red",
            )}
          />
        </>
      ) : (
        <span
          className={cn(
            "flex h-28 w-full items-center justify-center gap-8 whitespace-nowrap rounded-8 px-16",
            // Figma: "solid" swaps BOTH weight and colour on selection (Regular →
            // Bold, Neutral/5 → Brand/Solid/Black), plus a white pill fill —
            // different from "underlined", which only ever changes colour.
            "text-subheadline font-regular text-neutral-5",
            "group-data-[state=selected]:bg-brand-white group-data-[state=selected]:font-bold group-data-[state=selected]:text-brand-black",
            "group-data-[state=disabled]:text-neutral-4",
          )}
        >
          {children}
        </span>
      )}
    </button>
  );
});

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children?: ReactNode;
}

/** Minimal panel — not part of the Figma "Tabs" page (which only documents the
 * list/trigger), but required to demonstrate switching in the preview. */
export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(function TabsContent(
  { value, className, children, ...props },
  ref,
) {
  const { value: active, baseId } = useTabsContext("TabsContent");
  const selected = active === value;

  return (
    <div
      ref={ref}
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      hidden={!selected}
      tabIndex={0}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
});
