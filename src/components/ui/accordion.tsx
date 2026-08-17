"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Accordion — mirrors the Figma component set "Accordion" (id 4229:13448, page
 * "❖ Accordion"), read via its 4 variant instances (Expand × withBG, both
 * false/true) plus its component property definitions.
 *
 * Figma axes → props:
 *   Expand  → derived open/closed state, exposed as `data-state` on the
 *             trigger (open | closed) — never the FAQ text's own visibility,
 *             which Figma achieves by literally toggling `visible` on the
 *             answer node. CSS drives the equivalent height transition here
 *             (grid-template-rows 0fr → 1fr), so the panel node stays mounted.
 *   withBG  → `withBG` prop on `AccordionItem`. Changes WHERE the Neutral/2
 *             card lives, not just a color: false wraps header+panel in a
 *             plain 16px-gap stack with the panel itself as the rounded-12
 *             Neutral/2 card; true makes the *item* the rounded-12 Neutral/2
 *             card (8px gap) and the panel sits directly in its padding with
 *             no chrome of its own. Read off both pairs of nodes directly,
 *             not inferred from one.
 *   Icon    → `icon` prop on `AccordionTrigger`. This is a real Figma
 *             component property (`Icon`, type INSTANCE_SWAP, default a
 *             "help_outline" glyph) — i.e. a user-supplied slot, not a fixed
 *             part of the header — so no icon is baked in by default here.
 *             Its color IS read off the node and does depend on `withBG`:
 *             Brand/Solid/Red on the plain variant, Brand/Solid/Black once
 *             the item has its own card background. Wrapped in a span so a
 *             `currentColor`-based icon picks it up, same as DropdownMenuItem.
 *   Title, Content → `AccordionTrigger`'s children / `AccordionContent`'s
 *             children (Figma component properties `Title#4229:64` and
 *             `Content#4229:65`, both plain TEXT). Header title text is
 *             Brand/Solid/Black in every variant/state read — unlike Tabs,
 *             there is no color change on selection here, only the chevron
 *             rotates.
 *   (no disabled/size axis on this component set.)
 *
 * Structure: header row is icon (24×24, optional) + title (flex-1,
 * Subheadline/Regular) + chevron (24×24, fixed — NOT a Figma component
 * property, so not a slot), `items-start` because Figma top-aligns all three
 * against a title that can wrap 2 lines (itemSpacing 8, counterAxisAlignItems
 * MIN — confirmed by every child instance reading y=0 regardless of the
 * title's wrapped height).
 *
 * `type`/`value`/`defaultValue` (single vs multiple open items) are an
 * inferred extension, not read: the Figma page only documents one isolated
 * accordion item (Expand/withBG variants), never a list/group of them, so
 * there is nothing to trace this behaviour from. Defaults to "single" per the
 * port brief.
 *
 * Trap this component set is exactly built to test: `data-[state=x]:` only
 * matches the element carrying the attribute. The chevron is a DESCENDANT of
 * the button that owns `data-state` — its rotation is wired through `group` +
 * `group-data-[state=open]:rotate-180` on the trigger, not a bare
 * `data-[state=open]:` class sitting uselessly on the svg. The panel's own
 * `data-state` (for the grid-rows height trick) lives on the same div its
 * `data-[state=...]:grid-rows-*` classes are written on.
 */

/* -------------------------------------------------------------------------
 * Root — open-item bookkeeping only, no visual output (matches Figma: there
 * is no "Accordion list" component, only the single item below).
 * ---------------------------------------------------------------------- */

export type AccordionType = "single" | "multiple";

export interface AccordionProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** "single" (default) closes other items when one opens; "multiple" allows
   *  several open at once. Inferred extension — see file-level doc comment. */
  type?: AccordionType;
  /** Controlled open value(s): a string for "single", a string[] for "multiple". */
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
}

interface AccordionContextValue {
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext(component: string): AccordionContextValue {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error(`<${component}> must be rendered inside <Accordion>.`);
  }
  return ctx;
}

function toArray(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  { type = "single", value, defaultValue, onValueChange, className, children, ...props },
  ref,
) {
  const [uncontrolled, setUncontrolled] = useState<string[]>(() => toArray(defaultValue));
  const isControlled = value !== undefined;
  const openValues = isControlled ? toArray(value) : uncontrolled;

  const emit = (next: string[]) => {
    if (!isControlled) setUncontrolled(next);
    onValueChange?.(type === "single" ? (next[0] ?? "") : next);
  };

  const toggle = (itemValue: string) => {
    const isOpen = openValues.includes(itemValue);
    if (type === "single") {
      emit(isOpen ? [] : [itemValue]);
    } else {
      emit(isOpen ? openValues.filter((v) => v !== itemValue) : [...openValues, itemValue]);
    }
  };

  return (
    <AccordionContext.Provider
      value={{ isOpen: (v) => openValues.includes(v), toggle }}
    >
      <div ref={ref} className={cn("flex flex-col gap-16", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
});

/* -------------------------------------------------------------------------
 * Item — provides the per-item open state + `withBG` to Trigger/Content, and
 * renders the ONE structural difference `withBG` makes: where the Neutral/2
 * card wrapper sits (see file-level doc comment).
 * ---------------------------------------------------------------------- */

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  /** Figma "withBG" variant. Default false (matches Figma's own default). */
  withBG?: boolean;
}

interface AccordionItemContextValue {
  open: boolean;
  toggle: () => void;
  withBG: boolean;
  triggerId: string;
  contentId: string;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

function useAccordionItemContext(component: string): AccordionItemContextValue {
  const ctx = useContext(AccordionItemContext);
  if (!ctx) {
    throw new Error(`<${component}> must be rendered inside <AccordionItem>.`);
  }
  return ctx;
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { value, withBG = false, className, children, ...props },
  ref,
) {
  const { isOpen, toggle } = useAccordionContext("AccordionItem");
  const open = isOpen(value);
  const baseId = useId();
  const triggerId = `${baseId}-trigger`;
  const contentId = `${baseId}-content`;

  return (
    <AccordionItemContext.Provider
      value={{ open, toggle: () => toggle(value), withBG, triggerId, contentId }}
    >
      <div
        ref={ref}
        className={cn(
          "flex flex-col",
          // Figma: root itemSpacing 16 + no fill when withBG=false (the panel
          // supplies its own card); root itemSpacing 8 + Neutral/2 fill +
          // cornerRadius 12 + padding 16 when withBG=true (item IS the card).
          withBG ? "gap-8 rounded-12 bg-neutral-2 p-16" : "gap-16",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
});

/* -------------------------------------------------------------------------
 * Trigger — Figma's "Accordion"/"Header" row: icon? + title + chevron.
 * ---------------------------------------------------------------------- */

/** Figma trailing chevron ("expand_more"/"expand_less" Material Round icons,
 *  24×24 instance box). Ported as ONE glyph (the "expand_more" / down vector,
 *  path read directly off the node) rotated 180° on open rather than swapping
 *  instances — CSS-only, no icon-swap plumbing needed. The <path> keeps the
 *  vector's own local coordinates and is translated by the exact offset
 *  (6.4125, 8.7075) Figma placed it at inside the 24×24 box, so the glyph
 *  sits pixel-for-pixel where Figma drew it, and rotates around a box center
 *  that lands almost exactly on the glyph's own center. */
function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        transform="translate(6.4125 8.7075)"
        d="M9.4625 0.2925 L5.5825 4.1725 L1.7025 0.2925 C1.3125 -0.0975 0.6825 -0.0975 0.2925 0.2925 C-0.0975 0.6825 -0.0975 1.3125 0.2925 1.7025 L4.8825 6.2925 C5.2725 6.6825 5.9025 6.6825 6.2925 6.2925 L10.8825 1.7025 C11.2725 1.3125 11.2725 0.6825 10.8825 0.2925 C10.4925 -0.0875 9.8525 -0.0975 9.4625 0.2925 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export interface AccordionTriggerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  /** Figma component property "Icon" (INSTANCE_SWAP) — optional leading
   *  24×24 slot. Left un-defaulted: this is a user-supplied slot, not a
   *  fixed part of the header (see file-level doc comment). */
  icon?: ReactNode;
  onClick?: (event: ReactMouseEvent<HTMLButtonElement>) => void;
}

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  function AccordionTrigger({ icon, className, children, onClick, id, ...props }, ref) {
    const { open, toggle, withBG, triggerId, contentId } = useAccordionItemContext(
      "AccordionTrigger",
    );

    return (
      <button
        ref={ref}
        id={id ?? triggerId}
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        data-state={open ? "open" : "closed"}
        onClick={(event) => {
          onClick?.(event);
          toggle();
        }}
        className={cn(
          // `group` — the chevron below reaches this via group-data-*, since
          // data-state lives here, not on the svg (see file-level doc comment).
          "group flex w-full items-start gap-8 text-left outline-none",
          className,
        )}
        {...props}
      >
        {icon && (
          <span
            aria-hidden
            className={cn(
              "size-24 shrink-0",
              // Figma: help_outline reads Brand/Solid/Red on the plain variant,
              // Brand/Solid/Black once the item has its own card background.
              withBG ? "text-brand-black" : "text-brand-red",
            )}
          >
            {icon}
          </span>
        )}
        <span className="flex-1 text-subheadline font-regular text-brand-black">
          {children}
        </span>
        <ChevronIcon
          className={cn(
            "size-24 shrink-0 text-neutral-6 transition-transform duration-200",
            "group-data-[state=open]:rotate-180",
          )}
        />
      </button>
    );
  },
);

/* -------------------------------------------------------------------------
 * Content — Figma's "Answer" panel. Height transition is CSS-only: a `grid`
 * wrapper animates `grid-template-rows` between 0fr/1fr (data-state lives on
 * this same div), with an `overflow-hidden` child clipping the reveal — no
 * JS height measurement, no animation library. The panel stays mounted at all
 * times (Figma instead toggles `visible` on its answer node — not portable to
 * an animated CSS transition, since display:none can't be transitioned), and
 * is marked `inert` while closed so it can't be focused or read by mistake.
 * ---------------------------------------------------------------------- */

export type AccordionContentProps = HTMLAttributes<HTMLDivElement>;

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  function AccordionContent({ className, children, ...props }, ref) {
    const { open, withBG, triggerId, contentId } = useAccordionItemContext("AccordionContent");

    return (
      <div
        data-state={open ? "open" : "closed"}
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-in-out",
          "data-[state=closed]:grid-rows-[0fr] data-[state=open]:grid-rows-[1fr]",
        )}
      >
        <div className="overflow-hidden">
          <div
            ref={ref}
            id={contentId}
            role="region"
            aria-labelledby={triggerId}
            inert={!open}
            className={cn(
              "text-subheadline font-regular text-brand-black",
              // Figma: the panel is its own Neutral/2 card only in the plain
              // (withBG=false) variant — once the item itself is the card, the
              // text sits directly in the parent's padding with no extra chrome.
              !withBG && "rounded-12 bg-neutral-2 p-16",
              className,
            )}
            {...props}
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);
