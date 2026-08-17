<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Prototype Lab — Đi-HDBank

A place to deliver UI/UX prototypes to stakeholders as a web link instead of a Figma file. Components are ported from the Figma library **🌈Mobile - DS Đi-HDBank** (`fileKey: 3wFivMDO6P0heqk4YPLJQF`, team DTC). It is a **mobile** design system — build mobile-first.

## The three things that will bite you

1. **`--spacing: 1px`.** `p-16` is 16px, not 64px. The number in the class IS the pixel value in Figma. Your stock Tailwind muscle memory is wrong here. Stick to multiples of 4.
2. **Tailwind's default theme is gone.** `bg-blue-500`, `text-sm`, `rounded-lg`, `bg-white`, `bg-black` do not exist — the `--color-*`, `--text-*`, `--radius-*`, `--shadow-*` namespaces are reset to `initial` in `src/styles/tokens.css`. Only DS tokens exist.
   **This does NOT fail loudly.** An unknown utility simply generates no CSS — it does not error. The property then falls back, and the fallback can look plausible: `border-black/[0.04]` produced no rule, so `border-color` resolved to `currentColor` and silently inherited the ancestor's text colour. Nothing in the build complained. The reset narrows what you *can* express; only reading computed styles back in the browser proves what you *did* express.
3. **`@theme static`, not `@theme`.** Tailwind v4 tree-shakes theme variables and only emits ones a literal utility class references. A design system must publish its whole vocabulary, so `static` forces them all out. Without it, `var(--color-purple-6)` silently resolves to nothing.

## The vocabulary

| | tokens |
|---|---|
| color | `brand-{red,orange,yellow,black,white}`, `neutral-1..10`, `{red,orange,yellow,green,blue,purple}-1..10` (1 = lightest) |
| type | `text-{large-title,title2,title3,body,subheadline,caption1,caption2,overline}` + `font-{regular,medium,semibold,bold}` |
| radius | `rounded-{4,8,12,16,20,24,32,full}` — **multiples of 4, never 0** (a rule stated on the Figma "Corner radius" page) |
| elevation | `shadow-1..5` |
| gradient | `bg-brand-gradient-h`, `bg-brand-gradient-v` |

Brand hues are the `/6` step of their semantic ramp — `brand-red` === `red-6`. Brand black is `#333333`, not pure black. Font is Be Vietnam Pro; always keep the `vietnamese` subset.

## Component conventions

`src/components/ui/button.tsx` is the reference implementation — match its shape.

- Figma **Type** axis → prop `variant` (`type` is taken by the HTML attribute). Figma **Size** → `size`. Figma **Style** → boolean/slot props (`iconLeft`, `iconRight`, `iconOnly`).
- Figma **State** axis → a **`data-state` attribute**, never the `:disabled` pseudo-class. An element is often natively `disabled` (to block interaction) while rendering a *non-disabled* state — `loading` is exactly this. Styling off `:disabled` greys out the loading state, silently.
- Use `cn()` from `src/lib/cn.ts`, never raw `twMerge`. It is configured with this DS's scales; the stock config misfiles `text-body` as a text *colour* and drops it when merged with `text-neutral-6`.
- **Do not guess a state's styling from a sibling's.** Button's five variants each change background a different way; there is no uniform pressed treatment.

## Porting from Figma

The Figma MCP is in **read-only mode**: `setCurrentPageAsync()`, `page.loadAsync()`, `page.children` and `page.findAllWithCriteria()` all fail with *"Operation attempted to modify the file while in read-only mode"*. What works:

1. `get_metadata` (fileKey + page nodeId) — large output lands in a file, not your context; mine it with jq for `<symbol id=… name="Type=…, State=…">`.
2. `use_figma` + `figma.getNodeByIdAsync('<id>')` — direct id reads work, and `findAllWithCriteria` works on a node you fetched by id.
3. Resolve `fillStyleId` / `textStyleId` / `effectStyleId` via `getStyleByIdAsync` — the **style name** ("Neutral/2") tells you the token; the hex alone does not.

Batch node reads into one `use_figma` call: the account allows ~15 Figma calls/min, 200/day.

Tokens live in Styles, not Variables — `getLocalVariableCollectionsAsync()` returns 0. There are no modes, so there is no dark theme to derive.
