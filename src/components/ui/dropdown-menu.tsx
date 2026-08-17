"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Dropdown Menu — mirrors the Figma component set "❖ Dropdown Menu".
 *
 * Figma models this as two separate pieces, ported here as three parts:
 *   ".Dropdown Menu / Item" (COMPONENT_SET, State × Type)   → <DropdownMenuItem>
 *   "Dropdown Menu"         (COMPONENT, a composed instance) → <DropdownMenuContent>
 * Figma does NOT model a trigger as a component anywhere on the page — the
 * file's own demo just wires an arbitrary "..." icon button to open the menu
 * — so <DropdownMenuTrigger> below is this port's own minimal, unopinionated
 * addition, not a traced node.
 *
 * Figma axes → props (Item):
 *   Type  → `variant`  ("default" | "danger"; `type` is taken by the HTML attribute)
 *   State → derived: base "enabled" state plus a `disabled` prop, mapped to
 *           `data-state`. Figma's third state, "pressing", is NOT a settable
 *           prop — like Button's ":active" pressing, it's a hover/press LOOK,
 *           so it's driven by :hover/:focus/:active pseudo-classes gated on
 *           data-state=enabled rather than a state value of its own.
 *
 * Figma component description (".Dropdown Menu / Item", verbatim, vi):
 *   "Dùng như list actions hoặc điều hướng sang page khác
 *    Chỉ nên hiển thị 7≤ Items
 *    Common uses: contextual actions, filtering and sorting"
 *
 * Scope: ports the menu surface + rows faithfully — default/pressing/disabled
 * × default/danger, selected check-mark, dividers, leading icon slot, trailing
 * accordion chevron. Open/close is intentionally minimal: a controlled `open`
 * prop, click-outside, and Escape — no popover/floating library. Figma's
 * "accordion" item (tap → parent menu shrinks 10px, child menu expands
 * overlapping right at that spot) is simplified here to an inline expanding
 * sub-list instead of the overlay-with-shrink animation; see `hasAccordion`.
 */

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(node);
      else (ref as { current: T | null }).current = node;
    }
  };
}

/** Figma trailing "Check-mark" (16×16) — fixed part of the row, not a slot. */
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8.5l3 3 7-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Figma trailing "chevron_right" (16×16) — fixed part of the accordion row. */
function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M6 3.5l5 4.5-5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------
 * Root — open/close state + click-outside + Escape. Deliberately minimal:
 * no positioning engine. `DropdownMenuContent` self-anchors with `absolute`
 * relative to this root's `relative` wrapper.
 * ---------------------------------------------------------------------- */

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentId: string;
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenuContext(component: string) {
  const ctx = useContext(DropdownMenuContext);
  if (!ctx) {
    throw new Error(`<${component}> must be rendered inside <DropdownMenu>`);
  }
  return ctx;
}

export interface DropdownMenuProps {
  /** Controlled open state. Omit to let the menu manage its own state. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children: ReactNode;
}

export function DropdownMenu({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
}: DropdownMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentId = useId();

  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef, contentId }}>
      <div className={cn("relative inline-block", className)}>{children}</div>
    </DropdownMenuContext.Provider>
  );
}

/* -------------------------------------------------------------------------
 * Trigger — not a traced Figma node (see file header). Renders a plain
 * button; style it via `className` or wrap your own trigger and spread the
 * returned handlers if you need a non-button element.
 * ---------------------------------------------------------------------- */

export type DropdownMenuTriggerProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const DropdownMenuTrigger = forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  function DropdownMenuTrigger({ onClick, type = "button", ...props }, forwardedRef) {
    const { open, setOpen, triggerRef, contentId } = useDropdownMenuContext(
      "DropdownMenuTrigger",
    );

    return (
      <button
        ref={mergeRefs(triggerRef, forwardedRef)}
        type={type}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? contentId : undefined}
        onClick={(e) => {
          onClick?.(e);
          setOpen(!open);
        }}
        {...props}
      />
    );
  },
);

/* -------------------------------------------------------------------------
 * Content — Figma "Dropdown Menu" component: white surface, rounded-12,
 * Shadow/Small, 8px vertical padding, items stacked with no gap (each item
 * supplies its own divider). Fixed 240 width in Figma; kept as the default
 * but overridable via className.
 * ---------------------------------------------------------------------- */

export interface DropdownMenuContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Horizontal anchor relative to the trigger. Figma: "can appear in all 4 directions". */
  align?: "start" | "end";
  /** Vertical anchor relative to the trigger. */
  side?: "bottom" | "top";
}

export const DropdownMenuContent = forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  function DropdownMenuContent(
    { align = "start", side = "bottom", className, children, ...props },
    forwardedRef,
  ) {
    const { open, setOpen, triggerRef, contentId } = useDropdownMenuContext(
      "DropdownMenuContent",
    );
    const contentRef = useRef<HTMLDivElement>(null);

    // Click-outside + Escape-to-close.
    useEffect(() => {
      if (!open) return;

      function handlePointerDown(e: PointerEvent) {
        const target = e.target as Node;
        if (contentRef.current?.contains(target)) return;
        if (triggerRef.current?.contains(target)) return;
        setOpen(false);
      }
      function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") {
          setOpen(false);
          triggerRef.current?.focus();
        }
      }
      document.addEventListener("pointerdown", handlePointerDown);
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("pointerdown", handlePointerDown);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [open, setOpen, triggerRef]);

    // Move focus onto the first enabled item when the menu opens.
    useEffect(() => {
      if (!open) return;
      const first = contentRef.current?.querySelector<HTMLElement>(
        '[role^="menuitem"]:not([data-disabled="true"])',
      );
      first?.focus();
    }, [open]);

    function handleKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
      const items = Array.from(
        contentRef.current?.querySelectorAll<HTMLElement>(
          '[role^="menuitem"]:not([data-disabled="true"])',
        ) ?? [],
      );
      if (items.length === 0) return;
      const currentIndex = items.indexOf(document.activeElement as HTMLElement);

      e.preventDefault();
      if (e.key === "ArrowDown") items[(currentIndex + 1) % items.length]?.focus();
      else if (e.key === "ArrowUp")
        items[(currentIndex - 1 + items.length) % items.length]?.focus();
      else if (e.key === "Home") items[0]?.focus();
      else if (e.key === "End") items[items.length - 1]?.focus();
    }

    if (!open) return null;

    return (
      <div
        ref={mergeRefs(contentRef, forwardedRef)}
        id={contentId}
        role="menu"
        onKeyDown={handleKeyDown}
        className={cn(
          "absolute z-50 flex w-240 flex-col items-start overflow-hidden",
          "rounded-12 bg-brand-white py-8",
          // Figma binds this to "Shadow/Small", a REMOTE effect style (#ADADAD
          // @40%) from an unsubscribed library that leaked in via copy-paste —
          // it is not part of this design system. Mapped to the DS's own
          // shadow-1, which shares its single-layer shape. Figma to be corrected.
          "shadow-1",
          "[&>[role^='menuitem']:last-child]:border-b-0",
          side === "top" ? "bottom-full mb-8" : "top-full mt-8",
          align === "end" ? "right-0" : "left-0",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

/* -------------------------------------------------------------------------
 * Item — Figma ".Dropdown Menu / Item" COMPONENT_SET (State × Type).
 * ---------------------------------------------------------------------- */

export type DropdownMenuItemVariant = "default" | "danger";

/**
 * Every color below was read off the Figma node fills rather than inferred.
 * `hover`/`focus`/`active` together stand in for Figma's single "pressing"
 * state — a menu item highlights the same way whether you're pointing at it
 * or have arrowed onto it with the keyboard.
 */
const ITEM_VARIANT: Record<DropdownMenuItemVariant, string> = {
  // Figma: label/icon Brand/Black; pressing fill Neutral/2.
  default: cn(
    "text-brand-black",
    "hover:data-[state=enabled]:bg-neutral-2 focus:data-[state=enabled]:bg-neutral-2",
    "active:data-[state=enabled]:bg-neutral-2",
    "data-[state=disabled]:text-neutral-4",
  ),
  // Figma: label/icon Brand/Red. Its pressing fill is bound to "Accent/Red/Red 3"
  // (#ffcbcb) — a REMOTE variable from an unsubscribed "Colors" collection that
  // leaked in via copy-paste, whose palette belongs to a different product
  // (its Primary is #d30019, not brand-red #da2128). Mapped to red-1, the same
  // pressing tint Button's tertiary variant uses. Figma to be corrected.
  danger: cn(
    "text-brand-red",
    "hover:data-[state=enabled]:bg-red-1 focus:data-[state=enabled]:bg-red-1",
    "active:data-[state=enabled]:bg-red-1",
    "data-[state=disabled]:text-red-3",
  ),
};

export interface DropdownMenuItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  variant?: DropdownMenuItemVariant;
  disabled?: boolean;
  /**
   * Figma Style="selected" — trailing check-mark. Leave `undefined` for a
   * plain action row (`role="menuitem"`); pass `true`/`false` to opt into
   * single-select semantics (`role="menuitemradio"`, `aria-checked`).
   */
  selected?: boolean;
  /** Leading 24×24 icon slot. Figma Style="showIcon" / "changeIcon". Recolors via `currentColor`. */
  icon?: ReactNode;
  /**
   * Figma Style="hasAccordion" — reveals a nested item list on click/Enter.
   * Figma overlays the child menu and shrinks the parent by 10px; this port
   * simplifies that to an inline expanding sub-list (see file header).
   */
  hasAccordion?: boolean;
  subItems?: ReactNode;
  onSelect?: () => void;
  children?: ReactNode;
}

export const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  function DropdownMenuItem(
    {
      variant = "default",
      disabled = false,
      selected,
      icon,
      hasAccordion = false,
      subItems,
      onSelect,
      className,
      children,
      onClick,
      onKeyDown,
      ...props
    },
    ref,
  ) {
    const { setOpen } = useDropdownMenuContext("DropdownMenuItem");
    const [expanded, setExpanded] = useState(false);
    const state = disabled ? "disabled" : "enabled";
    const role = selected === undefined ? "menuitem" : "menuitemradio";

    function activate() {
      if (disabled) return;
      if (hasAccordion) {
        setExpanded((e) => !e);
        return;
      }
      onSelect?.();
      setOpen(false);
    }

    return (
      <>
        <div
          ref={ref}
          role={role}
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled || undefined}
          aria-checked={selected === undefined ? undefined : selected}
          aria-haspopup={hasAccordion || undefined}
          aria-expanded={hasAccordion ? expanded : undefined}
          data-state={state}
          data-disabled={disabled || undefined}
          onClick={(e) => {
            onClick?.(e);
            activate();
          }}
          onKeyDown={(e) => {
            onKeyDown?.(e);
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              activate();
            }
          }}
          className={cn(
            "flex min-h-44 w-full items-center gap-12 border-b border-neutral-3 px-16 py-10",
            "text-body font-regular outline-none",
            disabled ? "cursor-not-allowed" : "cursor-pointer",
            ITEM_VARIANT[variant],
            className,
          )}
          {...props}
        >
          {icon && <span className="size-24 shrink-0">{icon}</span>}
          <span className="min-w-0 flex-1 truncate">{children}</span>
          {selected && <CheckIcon className="size-16 shrink-0" />}
          {hasAccordion && (
            <ChevronIcon
              className={cn(
                "size-16 shrink-0 transition-transform",
                expanded && "rotate-90",
              )}
            />
          )}
        </div>
        {hasAccordion && expanded && (
          <div role="group" className="flex w-full flex-col">
            {subItems}
          </div>
        )}
      </>
    );
  },
);
