/**
 * The component index — what the lab sidebar lists.
 *
 * Hand-edited rather than derived from the filesystem: `figmaNode` and `notes`
 * carry provenance a folder name cannot. Add an entry here when porting a
 * component (the /add-component skill does this as its last step), otherwise the
 * component is invisible in the sidebar even though its route works.
 *
 * Kept sorted alphabetically by `name`.
 */

export interface ComponentEntry {
  /** Route slug under /dev. */
  slug: string;
  /** Display name — match the Figma component set's name. */
  name: string;
  /** Figma page nodeId this was ported from, `1234:5678` form. Omitted for the
   *  rare component that is not ported from Figma (e.g. Surface). */
  figmaNode?: string;
  /** Short note shown under the name; usually the Figma axes. */
  notes?: string;
}

const FILE_KEY = "3wFivMDO6P0heqk4YPLJQF";

export const figmaUrl = (nodeId: string) =>
  `https://www.figma.com/design/${FILE_KEY}/?node-id=${nodeId.replace(":", "-")}`;

export const COMPONENTS: ComponentEntry[] = [
  {
    slug: "accordion",
    name: "Accordion",
    figmaNode: "1827:220699",
    notes: "expand × withBG — chevron rotate, single/multiple",
  },
  {
    slug: "avatar",
    name: "Avatar",
    figmaNode: "7074:49963",
    notes: "5 size × 4 type (empty/zodiac/user/bank) + initials",
  },
  {
    slug: "badge",
    name: "Badge",
    figmaNode: "4:192630",
    notes: "2 bold × 5 type — colour-semantic label",
  },
  {
    slug: "banner",
    name: "Banner",
    figmaNode: "2139:220757",
    notes: "default (tinted + close) × promo (gradient)",
  },
  {
    slug: "bottom-sheet",
    name: "Bottom-sheet",
    figmaNode: "4:192643",
    notes: "title/subtitle/action + scrollable body",
  },
  {
    slug: "button",
    name: "Button",
    figmaNode: "4:192632",
    notes: "5 variant × 4 size × 4 state",
  },
  {
    slug: "callout",
    name: "Callout",
    figmaNode: "10299:377227",
    notes: "4 meaning × tinted/white × optional action",
  },
  {
    slug: "card",
    name: "Card",
    figmaNode: "2855:220948",
    notes: "HDBank bank-card visual — vertical/horizontal × blocked",
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    figmaNode: "13740:40306",
    notes: "2 size × 3 status × disabled",
  },
  {
    slug: "chip",
    name: "Chip",
    figmaNode: "14566:38723",
    notes: "2 size × 4 state × on-white",
  },
  {
    slug: "dropdown-menu",
    name: "Dropdown Menu",
    figmaNode: "14094:50922",
    notes: "menu surface + item states",
  },
  {
    slug: "indicator",
    name: "Indicator",
    figmaNode: "3645:230662",
    notes: "carousel dots — active red/white × inactive",
  },
  {
    slug: "input",
    name: "Input",
    figmaNode: "7:192659",
    notes: "text + phone × 9 state — floating label",
  },
  {
    slug: "keyboard",
    name: "Keyboard",
    figmaNode: "1630:419002",
    notes: "on-screen keyboard mockup — numeric + qwerty",
  },
  {
    slug: "list-item",
    name: "List Item",
    figmaNode: "7:192663",
    notes: "5 type × 3 state — holds Radio/Checkbox/Switch",
  },
  {
    slug: "loading",
    name: "Loading & Skeleton",
    figmaNode: "3020:221042",
    notes: "spinner 5 size + skeleton line/circle/rect",
  },
  {
    slug: "navigation",
    name: "Navigation",
    figmaNode: "4:192642",
    notes: "header bar (6 type) + bottom nav (item + badge)",
  },
  {
    slug: "ott",
    name: "OTT",
    figmaNode: "4229:13190",
    notes: "mocked push notification (thông báo OTT) — no variants",
  },
  {
    slug: "pagination",
    name: "Pagination",
    figmaNode: "4:192644",
    notes: "numbered pages + prev/next",
  },
  {
    slug: "picker",
    name: "Pickers",
    figmaNode: "6:192657",
    notes: "wheel column primitive — 7-row fade + selection band",
  },
  {
    slug: "progress-bar",
    name: "Progress bar",
    figmaNode: "3439:229390",
    notes: "default pill + large bordered card, gradient fill",
  },
  {
    slug: "progress-tracker",
    name: "Progress tracker",
    figmaNode: "3450:229502",
    notes: "horizontal/vertical × done/current/upcoming + compact bar",
  },
  {
    slug: "pull-to-refresh",
    name: "Pull to Refresh",
    figmaNode: "4385:11355",
    notes: "refreshing state only — CSS spinner ring (no drag physics)",
  },
  {
    slug: "radio",
    name: "Radio Button",
    figmaNode: "13740:32122",
    notes: "2 size × checked × disabled",
  },
  {
    slug: "rating",
    name: "Rating",
    figmaNode: "7:192662",
    notes: "5-point emotion-face scale (no stars) — tap + readOnly",
  },
  {
    slug: "scrollbar",
    name: "Scrollbar",
    figmaNode: "15465:302809",
    notes: "ScrollArea — styled native scrollbar (track + thumb)",
  },
  {
    slug: "search-bar",
    name: "Search Bar",
    figmaNode: "13764:10387",
    notes: "solid/outlined × default/focus/typing/filled",
  },
  {
    slug: "section-header",
    name: "Section Header",
    figmaNode: "14919:619",
    notes: "4 size × default/inverted — optional subtitle/action",
  },
  {
    slug: "slider",
    name: "Slider",
    figmaNode: "2678:220840",
    notes: "single + range (2 thumb), optional value + min/max",
  },
  {
    slug: "surface",
    name: "Surface",
    notes: "generic container — not in Figma, DS tokens only",
  },
  {
    slug: "switch",
    name: "Switch",
    figmaNode: "13740:39102",
    notes: "on × disabled — no size axis",
  },
  {
    slug: "tabs",
    name: "Tabs",
    figmaNode: "4:192641",
    notes: "underlined + solid × selected/disabled",
  },
  {
    slug: "tag",
    name: "Tags",
    figmaNode: "202:215535",
    notes: "new-tag false/true — removable pill vs add-trigger",
  },
  {
    slug: "toast",
    name: "Toast",
    figmaNode: "2503:220799",
    notes: "4 type × bold — no shadow, no close",
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    figmaNode: "6:192652",
    notes: "bubble + arrow, 4 sides",
  },
];
