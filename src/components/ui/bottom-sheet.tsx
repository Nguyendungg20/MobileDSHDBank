"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Bottom-sheet — mirrors the Figma component set "❖ Bottom-sheet"
 * (fileKey 3wFivMDO6P0heqk4YPLJQF, page node 4:192643, component set node
 * 7257:76825).
 *
 * Figma models the surface as ".Bottom sheet / Header" (COMPONENT, node
 * 7345:9553) stacked over ".Bottom-sheet / Body" (a family of "Usage="
 * content variants, node 13775:44988) inside a root "Bottom-sheet"
 * COMPONENT_SET with:
 *   Type          → VARIANT "default" | "share" (see contamination note below)
 *   Show Button   → BOOLEAN, not ported (see below)
 *   Show Keyboard → BOOLEAN, not ported (see below)
 *
 * Figma component-set description (verbatim, vi):
 *   "Sử dụng property Usage để định nghĩa context cụ thể (contract, account,
 *   filter…)" — that Usage axis lives on the BODY sub-component, not this one;
 *   this port leaves the body as `children` so any real DS component (List
 *   Item, Radio, Button…) can fill it, per that axis's own intent.
 *
 * Figma component-set/guideline usage bullets (verbatim, vi):
 *   "Bottom Sheet xuất hiện ở cuối màn hình, trượt lên trên nội dung hiện tại
 *    Dùng để hiển thị nhanh thông tin, tùy chọn hoặc xác nhận liên quan đến
 *    màn hình đang xem
 *    Giúp user thao tác ngắn gọn, tập trung, không cần rời khỏi trang chính"
 *
 * Figma height/scroll rule (Guidelines "#2 — Quy định về chiều cao & hành vi
 * của bottom-sheet", verbatim, vi):
 *   "Chiều cao mặc định của bottom-sheet sẽ ôm theo nội dung bên trong, cho
 *    đến khi đạt max height. 🚫 Không cuộn nội dung khi chưa đạt max height."
 *   "Max height bottom-sheet = cạnh dưới của component Header. Khi đạt max
 *    height → nội dung bên trong được phép cuộn."
 *   i.e. the sheet hugs its content up to a cap, the Header never scrolls,
 *   and only the body scrolls once the cap is hit. Ported as: sheet
 *   `max-h-[90vh]`, Header `shrink-0`, body `flex-1 overflow-y-auto` — no
 *   height is forced when content is short.
 *
 * Header axes → props (read off the Header instance tree, not a formal
 * component-property — Figma exposes these only as guideline callouts
 * "💬 Show Subhead" / "Has Action?", not typed booleans):
 *   Heading                         → `title` (always rendered)
 *   "💬 Show Subhead"                → `subtitle` (rendered iff provided)
 *   Has Action? (".Header / Action") → `headerAction` — Figma models this as
 *     its own COMPONENT_SET with Type="button" (a Button/secondary + a
 *     Button/primary pill, both x-small text-only — "Đặt lại" / "Lưu") or
 *     Type="icon" (up to three 32×32 icon actions, optionally badged). Ported
 *     as a plain slot rather than a variant prop: compose real `<Button
 *     size="x-small">` or icon buttons here, same pattern List Item uses for
 *     its `control` slot.
 *
 * NOT ported, and why:
 *   - Type="share": the second child of the root COMPONENT_SET is not a DS
 *     variant at all — its single layer is an IMAGE fill of an actual iOS
 *     system Share Sheet screenshot (AirDrop/Messages/Mail row, Copy/Add to
 *     Reading List/Add Bookmark rows), pasted in as design reference. It
 *     carries none of this file's tokens. Flagging for Figma cleanup rather
 *     than porting it as a "share" variant.
 *   - "Show Button" (boolean, default false): toggles a hidden "Button Group"
 *     instance whose real content is one specific compound flow (a T&C
 *     checkbox + full-width primary Button, for a contract-confirmation
 *     screen) — too specific to generalize as a boolean prop. Compose your
 *     own footer via `children` instead (see the /dev/bottom-sheet preview).
 *   - "Show Keyboard" (boolean, default false): toggles a hidden iOS system
 *     on-screen-keyboard mockup, included only as canvas reference for how
 *     the sheet sits above a keyboard. Not a web-applicable component.
 *
 * Colour/shadow provenance:
 *   - Surface fill: Brand/Solid/White. Corner radius 16/16/0/0 (top only).
 *   - Drag handle ("Knock"): 40×4, cornerRadius 100 (pill), fill Neutral/3.
 *   - Header bottom divider: the Header node binds a Neutral/3 stroke style,
 *     but every strokeWeight on it (top/right/bottom/left) reads 0 — i.e. the
 *     border is bound but switched off. Matched faithfully: no divider is
 *     rendered here, same as Figma's own render.
 *   - Root component effects: two DROP_SHADOW effects exist (radius 3/50) but
 *     both have `visible: false` and no bound effect style — Figma is not
 *     actually rendering a shadow on this surface. No shadow class is
 *     applied here either, for the same reason.
 *   - Scrim/backdrop: no scrim, overlay, or backdrop layer exists anywhere on
 *     the Bottom-sheet page (searched by name across the whole page) — the
 *     library does not model it. `bg-neutral-10/40` below is this port's own
 *     reasonable default (darkest neutral, 40% — the same opacity Dropdown
 *     Menu's foreign "Shadow/Small" reads at), not a value read from Figma.
 *     Flagging so the designer can add a real scrim spec if one exists.
 *
 * Behaviour is intentionally minimal: controlled `open`/`onOpenChange`,
 * Escape + backdrop click to close, body scroll lock while mounted, a CSS-only
 * slide-up/fade transition (no animation library). No snap points or
 * drag-to-dismiss physics — nothing on the Figma page specifies them.
 */

export interface BottomSheetProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Controlled open state — this component does not manage its own. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Figma: Heading — always rendered. */
  title: ReactNode;
  /** Figma: Header "💬 Show Subhead" — rendered iff provided. */
  subtitle?: ReactNode;
  /** Figma: Header "Has Action?" slot — compose real `<Button size="x-small">`
   *  or icon buttons here (see file doc comment). Rendered iff provided. */
  headerAction?: ReactNode;
  /** Body content. Figma's ".Bottom-sheet / Body" always pads 16 on every
   *  side — kept here as the body wrapper's own padding, not on `children`. */
  children: ReactNode;
}

export const BottomSheet = forwardRef<HTMLDivElement, BottomSheetProps>(
  function BottomSheet(
    { open, onOpenChange, title, subtitle, headerAction, children, className, ...props },
    forwardedRef,
  ) {
    const [mounted, setMounted] = useState(open);
    const [visible, setVisible] = useState(false);
    const sheetRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);
    const headingId = useId();

    // Mount immediately on open; unmount only after the close transition ends,
    // so the slide-down/fade-out has time to play.
    useEffect(() => {
      if (open) {
        previousFocusRef.current = document.activeElement as HTMLElement | null;
        setMounted(true);
      }
    }, [open]);

    useEffect(() => {
      if (!mounted) return;
      if (open) {
        const raf = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(raf);
      }
      setVisible(false);
      const timeout = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timeout);
    }, [open, mounted]);

    // Body scroll lock while the sheet is mounted (covers the closing animation too).
    useEffect(() => {
      if (!mounted) return;
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }, [mounted]);

    // Focus moves into the sheet on open, and back to the trigger on close.
    useEffect(() => {
      if (open && mounted) sheetRef.current?.focus();
    }, [open, mounted]);

    useEffect(() => {
      if (!open) previousFocusRef.current?.focus();
    }, [open]);

    // Escape-to-close, only while logically open.
    useEffect(() => {
      if (!open) return;
      function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") onOpenChange(false);
      }
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, onOpenChange]);

    if (!mounted) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        {/* Scrim — no Figma-modeled backdrop layer; see file doc comment. */}
        <div
          aria-hidden
          onClick={() => onOpenChange(false)}
          className={cn(
            "absolute inset-0 bg-neutral-10/40 transition-opacity duration-300",
            visible ? "opacity-100" : "opacity-0",
          )}
        />

        <div
          ref={mergeRefs(sheetRef, forwardedRef)}
          role="dialog"
          aria-modal="true"
          aria-labelledby={headingId}
          tabIndex={-1}
          className={cn(
            "relative flex w-full max-h-[90vh] flex-col overflow-hidden",
            "rounded-t-16 bg-brand-white outline-none",
            "transition-transform duration-300 ease-out",
            visible ? "translate-y-0" : "translate-y-full",
            className,
          )}
          {...props}
        >
          {/* Header — Figma ".Bottom sheet / Header": shrink-0, never scrolls. */}
          <div className="flex shrink-0 flex-col bg-brand-white">
            {/* Indicator — Figma "Knock": 40×4 pill, centered. */}
            <div className="flex flex-col items-center gap-8 px-16 py-12">
              <span aria-hidden className="h-4 w-40 rounded-full bg-neutral-3" />
            </div>

            {/* Content — Heading/Subhead (left, grows) + optional trailing action. */}
            <div className="flex items-center gap-4 px-16 pt-8 pb-12">
              <div className="flex min-w-0 flex-1 flex-col gap-4">
                <h2
                  id={headingId}
                  className="text-title3 font-semibold text-brand-black"
                >
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-subheadline font-regular text-neutral-6">
                    {subtitle}
                  </p>
                )}
              </div>
              {headerAction && (
                <div className="flex shrink-0 items-center gap-8">
                  {headerAction}
                </div>
              )}
            </div>
          </div>

          {/* Body — Figma ".Bottom-sheet / Body": 16px padding, scrolls once max-height is hit. */}
          <div className="flex-1 overflow-y-auto p-16">{children}</div>
        </div>
      </div>
    );
  },
);

function mergeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): (node: T | null) => void {
  return (node) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(node);
      else (ref as { current: T | null }).current = node;
    }
  };
}
