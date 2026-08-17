import clsx, { type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge must be taught this design system's scales.
 *
 * Its stock config assumes Tailwind's default theme, which `tokens.css` replaces
 * wholesale. Left unconfigured it classifies `text-body` as a *text colour*
 * (any unrecognised `text-*` value falls through to that group), so
 * `cn("text-body", "text-neutral-6")` would drop the font size and keep only the
 * colour — silently, with no error. Declaring the real scales keeps font size and
 * colour in separate groups where they belong.
 */

const RAMPS = ["neutral", "red", "orange", "yellow", "green", "blue", "purple"];

const COLORS = [
  "transparent",
  "current",
  "press-overlay",
  "brand-red",
  "brand-orange",
  "brand-yellow",
  "brand-black",
  "brand-white",
  ...RAMPS.flatMap((ramp) =>
    Array.from({ length: 10 }, (_, i) => `${ramp}-${i + 1}`),
  ),
];

const FONT_SIZES = [
  "large-title",
  "title2",
  "title3",
  "body",
  "subheadline",
  "caption1",
  "caption2",
  "overline",
];

const RADII = ["4", "8", "12", "16", "20", "24", "32", "full"];
const SHADOWS = ["1", "2", "3", "4", "5"];
const WEIGHTS = ["regular", "medium", "semibold", "bold"];

const twMerge = extendTailwindMerge({
  override: {
    theme: {
      color: COLORS,
      text: FONT_SIZES,
      radius: RADII,
      shadow: SHADOWS,
      "font-weight": WEIGHTS,
    },
  },
  extend: {
    classGroups: {
      // Custom @utility rules from tokens.css. Gradients set background-image, so
      // they belong with bg-image rather than the bg-color group.
      "bg-image": ["bg-brand-gradient-h", "bg-brand-gradient-v"],
      "text-shadow": ["text-shadow-white"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
