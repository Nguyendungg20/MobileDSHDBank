"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Progress tracker — mirrors the Figma component sets ".Step" (id 4300:25727)
 * and the assembled "Progress tracker" (id 4332:7708) on page "❖ Progress
 * tracker" (nodeId 3450:229502). A stepper, not to be confused with the
 * separate "Progress bar" page (out of scope for this port).
 *
 * Figma axes → props, with one inversion worth calling out:
 *   - The assembled "Progress tracker" component's own `Horizontal` boolean
 *     describes the tracker's OVERALL layout (row vs column) — this maps to
 *     `orientation`.
 *   - The inner ".Step" component's `Horizontal` boolean describes an
 *     INDIVIDUAL item's internal axis (icon-top/label-below vs
 *     icon-left/text-right) — and confusingly, the assembled tracker uses the
 *     OPPOSITE per-item orientation from its own name: the "row" tracker
 *     (assembled Horizontal=true) is built from ".Step Horizontal=false"
 *     items (icon stacked above a single label, so each item is narrow enough
 *     to sit side by side), while the "column" tracker (assembled
 *     Horizontal=false) is built from ".Step Horizontal=true" items
 *     (icon + label + a second "Status" text line side by side, since each
 *     item now has the full row width to itself). Verified by reading both
 *     assembled instances' children and their mainComponent names — this is
 *     not a guess.
 *   - ".Step"'s `Property 1` (done | current | default) → derived per-step
 *     state from `current` vs index, exposed as `data-state` (done | current
 *     | upcoming) rather than any pseudo-class, per this repo's convention.
 *   - ".Step"'s `Line=true` (only defined for Horizontal=true) → `variant`
 *     ("compact"), a row of plain pill bars with no icon or label. Read off a
 *     real instance (id 4407:14120, 342×6) used on the "confirm" screen in
 *     the same Figma section, not merely a legacy/unused variant. Horizontal
 *     only — no vertical "Line" variant exists in the file.
 *
 * `data-state` lives on each `<li>` (the step root), never a descendant —
 * Tailwind's `data-[state=x]:` variant only matches the element carrying the
 * attribute, it does not cascade like `group-data-*` would (see Tabs' file
 * header for the prior post-mortem this trap caused). Every descendant below
 * — indicator, label, description, connector — reaches the step's state via
 * `group` on the `<li>` + `group-data-[state=…]:` on itself. The one
 * exception is the "compact" variant, where the styled element IS the
 * `data-state` element (a single `<li>` bar with no children), so plain
 * `data-[state=x]:` is correct there.
 *
 * Connector colour is derived from the SAME state as the step that precedes
 * it: the segment after step `i` is green iff step `i`'s own state is "done"
 * (current's own trailing connector is NOT green — verified against the
 * Figma screenshot, where the line turns gray immediately after the red
 * "current" circle, not after it). This lets the connector reuse the
 * preceding `<li>`'s `group-data-[state=done]` with no extra branching.
 *
 * IMPORTANT — raw hex, no Figma styles: every colour read off every node in
 * this component set (`fillStyleId`/`strokeStyleId`) came back empty — none
 * of it is wired to a named Style, unlike the rest of this library. Values
 * below are the nearest DS token to each raw hex read off the node, per
 * AGENTS.md's guidance for unstyled/foreign values, NOT an exact 1:1 (see the
 * component's own doc comment further down for the mapping table). Flagged
 * for the designer to wire up real Styles in Figma.
 */

export type ProgressTrackerOrientation = "horizontal" | "vertical";
export type ProgressTrackerVariant = "default" | "compact";

export interface ProgressTrackerStep {
  label: string;
  /** Figma "Status" placeholder text — secondary line, rendered only in the
   *  vertical orientation's default variant (the only ".Step" layout with a
   *  second text node). */
  description?: string;
}

type StepState = "done" | "current" | "upcoming";

function getState(index: number, current: number): StepState {
  if (index < current) return "done";
  if (index === current) return "current";
  return "upcoming";
}

/** Figma path was 11.17×8.38 inside a 16px icon — approximated, not traced. */
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3.5 8.3L6.3 11L12.5 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Indicator circle, shared by horizontal and vertical (default variant only).
 *
 * Figma read three different circle sizes (done/default ~20px, current's
 * outer ring 24px with an 18px inner dot); normalised to a single 24px outer
 * size across all three states so steps stay aligned regardless of which
 * state is current — a deliberate simplification over the raw pixel reads,
 * not an overlooked inconsistency.
 */
function StepIndicator({ state, index }: { state: StepState; index: number }) {
  // NOTE on colour: every node in this Figma component set is raw hex with no
  // named Style — a foreign palette (done #19875c, current #be1128) that is NOT
  // this DS's ramp. Rather than freeze the nearest hex, the accents are normalised
  // to the DS's established brand steps: current → red-6 (brand-red, the active
  // accent every other component uses — Button/Checkbox/Radio/Tab/Chip) and done
  // → green-6 (the /6 brand-hue step, matching Switch's "on"). Figma to be fixed.
  if (state === "done") {
    return (
      <span className="flex size-24 shrink-0 items-center justify-center rounded-full bg-green-6">
        <CheckIcon className="size-12 text-brand-white" />
      </span>
    );
  }
  if (state === "current") {
    // Outer ring kept as a lighter red halo (red-4) around the brand-red dot.
    return (
      <span className="flex size-24 shrink-0 items-center justify-center rounded-full border-2 border-red-4 bg-brand-white">
        <span className="flex size-16 items-center justify-center rounded-full bg-red-6 text-caption1 font-bold text-brand-white">
          {index + 1}
        </span>
      </span>
    );
  }
  // upcoming — Figma: border rgb(229,229,229), no Style → neutral-3 (near-exact).
  // Number fill was raw black at 50% opacity (an iOS-style overlay, not a DS
  // token) → nearest solid DS token is neutral-5.
  return (
    <span className="flex size-24 shrink-0 items-center justify-center rounded-full border border-neutral-3 bg-brand-white text-caption1 font-medium text-neutral-5">
      {index + 1}
    </span>
  );
}

const LABEL_COLOR = cn(
  // Figma: done label rgb(153,153,153) / #999 (no Style) → nearest neutral-5.
  "group-data-[state=done]:text-neutral-5",
  // Current label matches the indicator — normalised to brand-red (see StepIndicator).
  "group-data-[state=current]:text-red-6",
  // Figma: upcoming label rgb(51,51,51) / #333 — an EXACT match to brand-black.
  "group-data-[state=upcoming]:text-brand-black",
);

// Figma: "Status" secondary text is rgb(153,153,153) in every state read → neutral-5.
const DESCRIPTION_COLOR = "text-neutral-5";

const CONNECTOR_COLOR = cn(
  "group-data-[state=done]:bg-green-6",
  "group-data-[state=current]:bg-neutral-3",
  "group-data-[state=upcoming]:bg-neutral-3",
);

export interface ProgressTrackerProps
  extends Omit<HTMLAttributes<HTMLOListElement>, "children"> {
  steps: ProgressTrackerStep[];
  /** 0-based index of the active step. Controlled — this component has no
   *  internal navigation state or click handling. */
  current: number;
  /** Figma: assembled "Progress tracker"'s own `Horizontal` axis. */
  orientation?: ProgressTrackerOrientation;
  /** Figma: ".Step"'s `Line` axis. "compact" is horizontal-only — no vertical
   *  "Line" variant exists in the file, so this is ignored when
   *  `orientation="vertical"`. */
  variant?: ProgressTrackerVariant;
}

export const ProgressTracker = forwardRef<HTMLOListElement, ProgressTrackerProps>(
  function ProgressTracker(
    { steps, current, orientation = "horizontal", variant = "default", className, ...props },
    ref,
  ) {
    if (variant === "compact") {
      return (
        <ol
          ref={ref}
          aria-label={props["aria-label"] ?? "Progress"}
          className={cn("flex w-full gap-6", className)}
          {...props}
        >
          {steps.map((step, index) => {
            const state = getState(index, current);
            return (
              <li
                key={index}
                data-state={state}
                aria-current={state === "current" ? "step" : undefined}
                aria-label={step.label}
                className={cn(
                  "h-6 flex-1 rounded-full",
                  // Figma: upcoming fill rgb(242,242,244), no Style → neutral-2.
                  "data-[state=upcoming]:bg-neutral-2",
                  // done/current fill normalised to brand-red (see StepIndicator).
                  "data-[state=done]:bg-red-6",
                  "data-[state=current]:bg-red-6",
                )}
              />
            );
          })}
        </ol>
      );
    }

    if (orientation === "vertical") {
      return (
        <ol
          ref={ref}
          aria-label={props["aria-label"] ?? "Progress"}
          className={cn("flex flex-col", className)}
          {...props}
        >
          {steps.map((step, index) => {
            const state = getState(index, current);
            const isLast = index === steps.length - 1;
            return (
              <li
                key={index}
                data-state={state}
                aria-current={state === "current" ? "step" : undefined}
                className="group flex gap-8"
              >
                <div className="flex shrink-0 flex-col items-center">
                  <StepIndicator state={state} index={index} />
                  {!isLast && (
                    <div aria-hidden className={cn("my-4 w-2 flex-1", CONNECTOR_COLOR)} />
                  )}
                </div>
                <div className={cn("flex flex-col gap-2", !isLast && "pb-16")}>
                  <span className={cn("text-caption1 font-medium", LABEL_COLOR)}>
                    {step.label}
                  </span>
                  {step.description && (
                    <span className={cn("text-caption1 font-regular", DESCRIPTION_COLOR)}>
                      {step.description}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      );
    }

    // horizontal — icon stacked above a single-line label, connectors between.
    return (
      <ol
        ref={ref}
        aria-label={props["aria-label"] ?? "Progress"}
        className={cn("flex w-full items-start", className)}
        {...props}
      >
        {steps.map((step, index) => {
          const state = getState(index, current);
          const isLast = index === steps.length - 1;
          return (
            <li
              key={index}
              data-state={state}
              aria-current={state === "current" ? "step" : undefined}
              className={cn("group flex items-start", isLast ? "flex-none" : "flex-1")}
            >
              <div className="flex shrink-0 flex-col items-center gap-4">
                <StepIndicator state={state} index={index} />
                <span
                  className={cn(
                    "text-caption1 font-medium whitespace-nowrap",
                    LABEL_COLOR,
                  )}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                // mt-12 aligns to the 24px indicator's vertical centre (half its height).
                <div aria-hidden className={cn("mt-12 h-2 flex-1", CONNECTOR_COLOR)} />
              )}
            </li>
          );
        })}
      </ol>
    );
  },
);
