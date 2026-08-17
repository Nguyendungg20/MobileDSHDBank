# Prototype Lab — Đi-HDBank

Deliver UI/UX prototypes to stakeholders as a **web link** instead of a Figma file. Built on the real design system, so a prototype looks like the product rather than like a mockup.

```bash
npm install
npm run dev          # http://localhost:3000
```

## What's where

| Route | What it is | Who opens it |
|---|---|---|
| `/` | Prototype gallery | **Stakeholders** — this is the link you share |
| `/p/<slug>` | One prototype | Stakeholders |
| `/tokens` | Every design token, rendered | You |
| `/dev/<component>` | One component, all variants × states | You |

`/tokens` and `/dev/*` share a sidebar; `/` deliberately does not — it is the front door for people who do not work on the system.

## The design system

Components are ported from the Figma library **🌈Mobile - DS Đi-HDBank** (team DTC). It is a **mobile** design system — build mobile-first.

Tokens in `src/styles/tokens.css` are generated from that file's Paint/Text/Effect **Styles** (this DS has no Figma Variables). Do not hand-edit them; run `/sync-tokens`.

**Two deliberate deviations from stock Tailwind** — read `AGENTS.md` before writing any UI:

1. `--spacing: 1px`, so `p-16` is **16px**, not 64px. The number in the class is the pixel value in Figma.
2. Tailwind's default palette, type scale and radius scale are removed. `bg-blue-500` and `rounded-lg` do not exist — only DS tokens do. Note this **does not fail loudly**: an unknown utility emits no CSS and the property silently falls back.

## Adding things

These are Claude Code skills — run them in Claude Code, not in a terminal:

| | |
|---|---|
| `/add-component` | Port a component from Figma, verified against the real nodes |
| `/new-prototype` | Scaffold a screen at `/p/<slug>` and register it on the gallery |
| `/sync-tokens` | Regenerate tokens when Figma changes |

Two registries are hand-edited, and something is invisible until it is listed:

- `src/components/registry.ts` — the component sidebar
- `src/prototypes/registry.ts` — the gallery

## Verifying a port

Screenshots lie. Every component bug found so far — a loading button rendering as disabled, a chip label stuck black, a switch border inheriting the wrong colour — looked fine and was caught by reading **computed styles** back from the browser and diffing against the Figma values. Do that.

## Known Figma issues

Tracked in `AGENTS.md`. In short: a foreign `Colors` variable collection and a `Shadow/Small` effect style have leaked into the file via copy-paste, and the Switchers component is a half-reskinned iOS system switch. When `getStyleByIdAsync` reports `remote: true`, that value is contamination, not a token.
