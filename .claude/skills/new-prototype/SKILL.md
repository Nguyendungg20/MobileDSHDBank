---
name: new-prototype
description: Scaffold a new prototype screen or flow at /p/<slug>, built from the Đi-HDBank design system components, and register it on the gallery. Use when the user wants to build/mock a new screen, flow or prototype to share with stakeholders.
---

# Scaffold a prototype

A prototype is a route at `/p/<slug>` plus one entry in `src/prototypes/registry.ts`. It gets its own shareable Vercel URL; the gallery at `/` lists them all.

Read `AGENTS.md` for the token vocabulary and the spacing/palette traps before writing UI.

## 1. Understand the screen before building it

Ask, if it is not already clear:
- **What flow, and which screens?** A prototype with two screens and a real transition beats eight static ones.
- **Who reviews it, and what feedback do you want?** That sentence goes in the registry `summary` — it is what the stakeholder reads first.
- **Is there a Figma frame to match?** If so get the node link; port it rather than reinventing. The Figma page `📱Templates & Screens` holds existing screen templates worth stealing from, as do `🔥🔥🔥 TEMPLATES` (Confirmation, Empty, Result, Share, Error/Warning).

## 2. Build it

```
src/app/p/<slug>/page.tsx
```

- **Compose from `src/components/ui/*` — do not hand-roll UI.** If a needed component does not exist yet, use `/add-component` to port it properly instead of faking it inline. A one-off fake is how a design system dies.
- This is a **mobile** design system. Frame the screen mobile-first; a phone-width column centred on the page reads better to a reviewer than a full-bleed desktop layout.
- Copy in Vietnamese, with realistic content. "Chuyển tiền tới Nguyễn Văn A — 2.500.000đ" tells a reviewer something; "Lorem ipsum" and "Label" waste their time.
- Prototypes may hold local state (`useState`) to fake interactivity. They must not call real APIs or hold secrets — these deploy to a public URL.

## 3. Register it

Add to `PROTOTYPES` in `src/prototypes/registry.ts`:

```ts
{
  slug: "chuyen-tien-24-7",
  title: "Chuyển tiền 24/7",
  summary: "Luồng nhập số tiền → xác nhận → kết quả. Cần feedback về bước xác nhận.",
  status: "draft",
  updated: "2026-07-16",          // today, absolute — never "hôm nay"
  figma: "https://figma.com/…",   // optional
}
```

Unregistered prototypes are invisible on the gallery even though the URL works.

## 4. Verify it renders

Do not hand over a link you have not opened. With the dev server running, load `/p/<slug>`, check it at a phone viewport (`resize_window` preset `mobile`), and confirm the gallery at `/` lists it. `npx tsc --noEmit` clean.

## 5. Deploying

Prototypes ship together as one Vercel app — one deploy, one URL per prototype (`/p/<slug>`). For a distinct link per review round, push a branch: Vercel gives that branch its own preview URL and the `/p/<slug>` path stays stable inside it.

Deploying publishes to the internet. Confirm with the user before running a deploy, and never put real customer data in a prototype.
