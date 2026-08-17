---
name: add-component
description: Port a component from the Đi-HDBank Figma library into src/components/ui, faithfully and verified. Use when the user asks to add, build or port a component (Input, Toast, Tabs, Bottom-sheet…), or pastes a Figma node link to a component page.
---

# Port a component from Figma

Read `AGENTS.md` first if you have not — it holds the token vocabulary, the `data-state` rule, and the read-only Figma workaround. This skill is the procedure.

Usage: `/add-component <name>` — or the user pastes a Figma page link like
`https://www.figma.com/design/3wFivMDO6P0heqk4YPLJQF/…?node-id=13740-40306`.

## 1. Locate the component set

If given a link, the `node-id` (`13740-40306` → `13740:40306`) is the **page**. If not given one, ask — you cannot list Figma files or search pages by name, and guessing a `fileKey` is impossible.

```
get_metadata(fileKey: "3wFivMDO6P0heqk4YPLJQF", nodeId: "<page id>")
```

The output is big and gets written to a file rather than your context. Mine it:

```bash
jq -r '.[].text // empty' FILE | grep -oE '<symbol id="[^"]+" name="[^"]*"[^>]*'
```

Variants look like `Type=primary, Style=text-only, Size=large, State=enabled` and carry `width`/`height`. Note a component *page* often holds several component sets plus legacy ones — axis values from `grep | sort -u` will be a union across all of them, so do not assume every combination belongs to your component.

## 2. Read the real values — never infer them

Load the `figma:figma-use` skill (mandatory), then batch **all** the nodes you need into ONE `use_figma` call — the account allows ~15 Figma calls/min:

```js
const ids = { 'primary/large/enabled': '6893:22103', 'primary/large/disabled': '14798:108133' /* … */ };
const sn = async (id) => { if (!id) return null; const s = await figma.getStyleByIdAsync(id); return s ? s.name : null; };
const out = {};
for (const [label, id] of Object.entries(ids)) {
  const n = await figma.getNodeByIdAsync(id);           // direct id reads work in read-only mode
  out[label] = {
    h: Math.round(n.height),
    pad: [n.paddingTop, n.paddingRight, n.paddingBottom, n.paddingLeft],
    gap: n.itemSpacing,
    radius: n.cornerRadius,
    fillStyle: await sn(n.fillStyleId),                  // ← the NAME is what maps to a token
    strokeStyle: await sn(n.strokeStyleId),
    effectStyle: await sn(n.effectStyleId),
  };
}
return out;
```

Resolve style **names** (`"Neutral/2"`, `"Shadow 2"`, `"Subheadline/Body/Semibold"`) — they map straight onto tokens. A raw hex only tells you what it looks like today.

Also read `componentSet.description`: this library documents real usage rules in Vietnamese (Switchers: *"Nếu user bật/tắt một tính năng trong form có button submit, đổi sang dùng Checkbox"*). Preserve it as a doc comment — it is design intent you cannot re-derive.

**Read every state you ship.** Button's five variants each handle `pressing` differently — one overlays black 15%, others swap the background outright. There is no pattern to extrapolate from. If a value resists reading, say so; do not invent it.

## 3. Write it

Mirror `src/components/ui/button.tsx`: `forwardRef`, `variant`/`size` props, Figma's State axis as `data-state`, `cn()` for classes, a doc comment naming the Figma page and mapping Figma axes → props.

Cite Figma in comments where a value looks arbitrary (`// Figma: cornerRadius 1000 — a pill at every size`). The next reader cannot open Figma from the diff.

## 4. Verify — the step that catches the real bugs

Add `src/app/dev/<name>/page.tsx` rendering **every variant × state** (copy `src/app/dev/button/page.tsx`).

A screenshot is not enough. Read the computed styles back and compare to the Figma values:

```js
// in the browser
const c = getComputedStyle(el);
({ bg: c.backgroundColor, border: c.borderTopColor, color: c.color, h: c.height, radius: c.borderRadius })
```

This is how the Button loading-state bug was caught: it *looked* plausible but rendered `#d2d6db` when Figma said gradient. Check `npx tsc --noEmit` too.

## 5. Register it in the sidebar

Add an entry to `COMPONENTS` in `src/components/registry.ts`:

```ts
{ slug: "toast", name: "Toast", figmaNode: "2503:220799", notes: "3 type × 2 position" }
```

Skip this and the component is invisible in the lab nav even though `/dev/<name>` works. `notes` is the Figma axes in shorthand — it is what tells a reader at a glance whether the port covers what they need.

`figmaNode` is optional, for the rare component not ported from Figma (e.g. `Surface`, a generic container the library lacks). Omit it and say so in `notes`. Such a component must still be DS-token-only — it may compose existing tokens but must invent no new colours, radii or shadows — and its file's doc comment must state loudly that it is not from Figma.

## 6. Watch for foreign refs

If `getStyleByIdAsync` / `getVariableByIdAsync` returns **`remote: true`**, that value is *not* part of this design system — a foreign `Colors` collection and a `Shadow/Small` effect style have leaked into this file via copy-paste from another project (its Primary is `#d30019`, not brand-red `#da2128`). Do **not** add a token for it. Map it to the nearest real DS token, note the provenance in a comment, and flag it in your report so the designer can purge it in Figma.

## 7. Report

A table of variant/state → Figma style name → token used, plus anything you could not verify, plus any `remote: true` refs you hit.
