---
name: sync-tokens
description: Re-generate src/styles/tokens.css from the Đi-HDBank Figma library's Styles. Use when Figma colours, type, shadows or the brand gradient have changed, when tokens look stale or wrong, or when the user asks to sync/refresh design tokens.
---

# Re-sync tokens from Figma

`src/styles/tokens.css` is generated, not hand-written. This skill regenerates it.

## The one thing to know first

**This design system has no Figma Variables.** `getLocalVariableCollectionsAsync()` returns 0 collections. Tokens are **Paint / Text / Effect Styles**. So `get_variable_defs` is useless here — it only returns variables bound within a node you pass, and errors with *"nothing selected"* when there are none. Do not go down that path.

Consequence: there are no modes, so **there is no dark theme to derive**. Do not invent one.

## 1. Pull the styles

Load the `figma:figma-use` skill (mandatory), then read all three style tables in a single `use_figma` call against `fileKey: 3wFivMDO6P0heqk4YPLJQF`. Style reads are document-level and work even though the MCP is in read-only mode (page loading is not).

```js
const rgbToHex = (c) => { const h = (n) => Math.round(n * 255).toString(16).padStart(2, '0'); return '#' + h(c.r) + h(c.g) + h(c.b); };
const paint = await figma.getLocalPaintStylesAsync();
const text  = await figma.getLocalTextStylesAsync();
const fx    = await figma.getLocalEffectStylesAsync();
return {
  paint: paint.map(s => ({ name: s.name, paint: s.paints[0] })),
  text: text.map(s => ({ name: s.name, size: s.fontSize, style: s.fontName.style,
    lh: s.lineHeight, ls: s.letterSpacing })),
  fx: fx.map(s => ({ name: s.name, effects: s.effects })),
};
```

Watch the units: Figma line-height and letter-spacing come back as `{unit, value}`, and `unit` may be `PERCENT`, `PIXELS` or `AUTO`. `-3%` letter-spacing means −3% *of the font size* — resolve it (32px → −0.96px) rather than emitting `-3%`.

## 2. Map names → tokens

| Figma style | token |
|---|---|
| `Brand/Solid/Red` | `--color-brand-red` |
| `Neutral/5` | `--color-neutral-5` |
| `Semantic/Blue/6` | `--color-blue-6` |
| `Subheadline/Body/Regular` (16) | `--text-body` |
| `Shadow 2` | `--shadow-2` |
| `Brand/Gradient/Horizontal` | `@utility bg-brand-gradient-h` |

Figma's 28 text styles collapse to 8 sizes: they are size × weight, every one is 130% line-height, and weight composes separately (`text-body font-semibold`). Letter-spacing is taken from each size's **Regular** style — Bold/Semibold at 14 and 12 differ by 0.1px, which is dropped deliberately.

Preserve the two intentional deviations and the `@theme static` (see `AGENTS.md`). Keep the explanatory comments — they are why the file is trustworthy.

## 3. Verify against a live DOM, not by reading the file

The failure mode here is silent: a token can be *written* and still not *exist* at runtime, because Tailwind tree-shakes unused theme vars unless `@theme static` is on.

With the dev server up, check tokens actually resolve:

```js
const r = getComputedStyle(document.documentElement);
['--color-red-6', '--color-purple-6', '--radius-16', '--shadow-1'].map(v => [v, r.getPropertyValue(v).trim() || 'EMPTY ← BUG']);
```

`/` renders every token; open it and look. Any `EMPTY` means the `static` keyword got lost.

## 4. Report the diff

Tokens are a contract — components depend on them. Say plainly what changed value, what was added, and what disappeared. A removed token is a breaking change: grep `src/components` for it before deleting.
