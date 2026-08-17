"use client";

import {
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Tooltip — mirrors the Figma component "❖ Tooltip" (fileKey 3wFivMDO6P0heqk4YPLJQF,
 * page nodeId 6:192652).
 *
 * Unlike most ported components this page holds a single COMPONENT, not a
 * COMPONENT_SET — there is no Type/Size/State variant axis at all. Both
 * instances on the page (the bare symbol and the one with real copy) share
 * one fixed look; the only thing that changes between them is the text.
 *
 * Figma's own doc frame on this page states, verbatim (vi):
 *   "Dùng để hiển thị thông tin bổ sung khi người dùng nhấp vào icon info.
 *    Thường sẽ xuất hiện bên cạnh các label trên các trường thông tin"
 *   ("Shows supplementary info when the user taps the info icon. Usually
 *     appears beside the label on an input field.")
 *   Thông số (spec): "After delay - 1ms / Animation: Instant - 100ms /
 *   Vị trí xuất hiện: Ngay bên dưới icon info"
 *   ("Delay: ~none / Animation: instant, ~100ms / Appears: right below the
 *     info icon.")
 *
 * Every descendant of the page's "Tooltip" section was walked looking for an
 * arrow/pointer/caret graphic — there is none. Figma models exactly one
 * position (directly under the trigger) and no directional pointer shape.
 * `side` below is therefore this port's own addition for prototype
 * flexibility, not a traced Figma axis; only `side="bottom"` reflects what
 * Figma actually draws, and it renders as a plain rounded bubble with no
 * pointer in every direction.
 *
 * Anatomy read directly off the node (fillStyleId/textStyleId/effectStyleId
 * are all null — nothing here is bound to a named Style, so these are the
 * raw values, not token names):
 *   Bubble: fill #000000 @ 75% opacity, cornerRadius 8, padding 8/16/8/16,
 *     itemSpacing 8, auto-layout HUG width up to maxWidth 358, counter-axis
 *     align MIN (icon top-aligns against text once it wraps to 2 lines).
 *     No named style exists for the fill or an effect (the inner-shadow
 *     effect on the node is present but `visible: false`) — mapped to the
 *     nearest raw value already used elsewhere in this codebase
 *     (`src/components/ui/card.tsx` uses the same `bg-[#000000]/NN` shape
 *     for its own unnamed black-overlay fill).
 *   Icon: instance "Small/Info", 16×16, white fill, traced as exact vector
 *     paths below (not a placeholder glyph).
 *   Text: Be Vietnam Pro Regular 14px / 130% line-height / -0.2px tracking —
 *     matches this DS's `text-subheadline` token exactly. Fill white.
 *
 * The gap between trigger and bubble (`mt-8` etc. below) is this port's own
 * choice, on the DS's 4px grid — Figma's spec text says only "right below",
 * no pixel value.
 */

export type TooltipSide = "top" | "bottom" | "left" | "right";

/**
 * Figma instance "Small/Info" (16×16) — traced from the node's own vector
 * paths (two vectors: a ring outline + an "i" mark), not a stock icon.
 */
function InfoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <g transform="translate(1.33 1.33)">
        <path
          fill="currentColor"
          d="M6.67 0C2.99 0 0 2.99 0 6.67c0 3.67 2.99 6.66 6.67 6.66 3.67 0 6.66-2.99 6.66-6.66C13.33 2.99 10.34 0 6.67 0Zm0 12c-2.94 0-5.34-2.39-5.34-5.33S3.73 1.33 6.67 1.33s5.33 2.4 5.33 5.34S9.61 12 6.67 12Z"
        />
      </g>
      <g transform="translate(7.33 4.67)">
        <path fill="currentColor" d="M0 2.67h1.33v4H0v-4ZM0 0h1.33v1.33H0V0Z" />
      </g>
    </svg>
  );
}

/** Figma draws only "bottom" — the other three sides are this port's addition. */
const SIDE_POSITION: Record<TooltipSide, string> = {
  bottom: "top-full left-1/2 mt-8 -translate-x-1/2",
  top: "bottom-full left-1/2 mb-8 -translate-x-1/2",
  left: "right-full top-1/2 mr-8 -translate-y-1/2",
  right: "left-full top-1/2 ml-8 -translate-y-1/2",
};

type TriggerElement = ReactElement<HTMLAttributes<HTMLElement>>;

export interface TooltipProps {
  /** Bubble content. Figma's own instances carry a single text label. */
  content: ReactNode;
  /** Single focusable trigger — cloned to receive the hover/focus handlers
   *  and `aria-describedby`. */
  children: TriggerElement;
  /** Placement relative to the trigger. See file header — Figma only draws "bottom". */
  side?: TooltipSide;
  /**
   * Leading icon slot. Every real Figma instance shows the Info glyph inside
   * the bubble itself (it is baked into the single component, not a
   * togglable Style) — pass `false` to omit it, which is this port's own
   * option, not a Figma-modelled one.
   */
  icon?: ReactNode | false;
  /** Controlled open state. Omit to let the tooltip manage its own state. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Extra classes on the bubble. */
  className?: string;
}

export const Tooltip = forwardRef<HTMLSpanElement, TooltipProps>(function Tooltip(
  {
    content,
    children,
    side = "bottom",
    icon,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    className,
  },
  forwardedRef,
) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;
  const tooltipId = useId();
  // Wraps the trigger, purely so Escape can find it again with a DOM query —
  // see the effect below. `cloneElement`-ing an arbitrary caller-supplied
  // trigger while also touching a `ref`'s `.current` anywhere in the closures
  // passed to it is flagged by this repo's react-hooks/refs lint rule as an
  // unsafe render-time ref read (cloneElement is opaque to the analysis), so
  // this component does not read/write a ref inside the clone's props.
  const wrapperRef = useRef<HTMLSpanElement>(null);

  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  // Escape dismisses and returns focus to the trigger, same contract as
  // DropdownMenuContent.
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        wrapperRef.current
          ?.querySelector<HTMLElement>("button, a[href], input, select, textarea, [tabindex]")
          ?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const trigger = isValidElement(children)
    ? cloneElement(children, {
        "aria-describedby": open ? tooltipId : children.props["aria-describedby"],
        onMouseEnter: (e: ReactMouseEvent<HTMLElement>) => {
          children.props.onMouseEnter?.(e);
          setOpen(true);
        },
        onMouseLeave: (e: ReactMouseEvent<HTMLElement>) => {
          children.props.onMouseLeave?.(e);
          setOpen(false);
        },
        onFocus: (e: FocusEvent<HTMLElement>) => {
          children.props.onFocus?.(e);
          setOpen(true);
        },
        onBlur: (e: FocusEvent<HTMLElement>) => {
          children.props.onBlur?.(e);
          setOpen(false);
        },
      })
    : children;

  const iconNode =
    icon === false ? null : (icon ?? <InfoIcon className="size-16 shrink-0 text-brand-white" />);

  return (
    <span
      ref={(node) => {
        wrapperRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      }}
      className="relative inline-block"
    >
      {trigger}
      {open && (
        <span
          id={tooltipId}
          role="tooltip"
          className={cn(
            "absolute z-50 inline-flex w-max max-w-[358px] items-start gap-8",
            // No named Style for this fill (see file header) — raw value,
            // same shape as the unnamed overlay in card.tsx.
            "rounded-8 bg-[#000000]/75 px-16 py-8",
            SIDE_POSITION[side],
            className,
          )}
        >
          {iconNode}
          <span className="min-w-0 flex-1 text-subheadline font-regular text-brand-white">
            {content}
          </span>
        </span>
      )}
    </span>
  );
});
