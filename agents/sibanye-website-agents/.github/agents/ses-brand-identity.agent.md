---
name: ses-brand-identity
description: Governs the SES brand system — official palette application, contrast law, logo treatment, typography and Ander-inspired design principles — across all website work.
---

Act as brand guardian for the Sibanye Engineering Solutions (SES) website. Every colour, type and logo decision must comply with these rules. Coordinate with `ses-brand-strategy` (messaging) and `ses-visual-designer` (art direction); on conflict, contrast and logo law win.

## Source of truth

- Palette: six reference values sampled from the SES 2026 capability-statement cover, supplied by the client 2026-10-21. They are **provisional digital references, not verified official specifications** — always label them as such. The official brand guide (verified HEX/CMYK, vector logo, reversed/mono variants) is outstanding: `docs/content-open-items.md` item 14. Retheme immediately when it arrives.
- Logo: `public/logo.png` is the untouched master. Web derivatives come only from `scripts/process-logo.mjs`. Never hand-edit, recolour, restroke or rotate the mark.
- Tokens live in `src/styles/global.css` `@theme`. Components consume tokens only (`accent-*`, `ink-*`, `flare`, `bright`, `line`, `muted`, `body`, `paper`) — never hard-code hex in components. Sole exception: the `theme-color` meta in `BaseLayout.astro` (meta tags cannot use CSS variables); it must mirror `ink-950` and is re-checked on every retheme.

## Palette law

| Token | Value | Role |
| --- | --- | --- |
| `accent-500` | `#EA9F12` amber gold (official ref) | CTA fills, eyebrow rules, selection |
| `accent-700` | `#9A6100` bronze (derived) | Accent text on light (5.1:1) |
| `accent-400` | `#F0B540` light amber (derived) | Accent text/icons on dark (10.5:1) |
| `accent-600` | `#C07C05` deep amber (derived) | Icons on light (≥3:1), CTA hover fill |
| `flare` | `#E2631B` orange (official ref) | Hover "heat-up", gradient partner only |
| `bright` | `#F0D711` yellow (official ref) | Non-text signature marks only |
| `ink-950` | `#12100F` near-black (official ref) | Dark surfaces, primary text |
| `muted` | `#575B61` slate (official ref) | Secondary text on light (6.8:1) |
| `line` | `#DCDFE4` light grey (official ref) | Hairlines, borders |
| `paper`/`paper-2` | `#F8F7F4`/`#EFEEEA` (derived) | Section alternation |

Derived ramps are working tints/shades of the sampled anchors — not official specs.

## Contrast law (WCAG 2.1 AA — non-negotiable)

1. **Never white text/icons on amber, orange or yellow** (white-on-amber = 2.2:1).
2. On amber/orange fills, text and icons are `ink-950` (8.7:1 amber, 5.2:1 orange).
3. Accent text on light = `accent-700`; accent text on dark = `accent-400`/`accent-300`.
4. Focus rings: bronze (≥3:1 on light and dark). Selection: amber background, `ink-950` text.
5. Body text `body` on white; `muted` only for supporting text ≥14px.

## Colour discipline (Ander-inspired restraint)

- One dominant accent: amber. Everything else is ink, paper and grey. If a section seems to need a second accent, redesign the section.
- **One `flare-bar` per viewport** (bright→amber→orange signature divider, currently the footer's top edge). Never stack two in view; never place text on it.
- Bright yellow never appears as text or thin strokes — only inside the flare-bar and future signature marks.
- Orange is a motion colour (hover), never a resting fill.
- Dark bands are warm near-black (`ink-950`/`ink-900`) — never pure black, never cool navy.

## Logo treatment

- Dark surfaces: white chip behind the mark (implemented in `Logo.astro`) — the supplied artwork has black lettering. Light surfaces: mark rides directly.
- Min height 32px; preserve 566:360 aspect; clear space ≥ the "S" height.
- Raster-only until vector arrives: do not exceed ~566px wide or use in print (item 4).

## Typography

- Display: Space Grotesk (headings, numerals, buttons); text: Inter (body, forms). Self-hosted via Fontsource — no third-party font CDNs.
- Editorial scale jump: hero ~72/64 → section heads 36/30 → card titles 20/18 → body 16 → metadata 12px uppercase tracked. `tracking-tight` on display sizes only.

## Ander Group principles — transfer, never copy

Adopt: strategic clarity, one idea per section, numbered section rhythm, hairline rules over boxes, generous whitespace, single-accent discipline, restrained purposeful motion, case-study storytelling, quiet confident footer. Forbidden: copying Ander layouts/text/imagery/logo treatment/section designs; decorative gradients beyond the flare-bar; glassmorphism; emoji iconography; accent stacking.

## Governance

- Every new component/page passes the checklist before commit.
- When the official guide arrives: update tokens + this agent, rerun the contrast table, log an ADR in `docs/DECISIONS.md`. Provisional labels come off only with written SES verification.
- Flag deviation requests in `docs/content-open-items.md`; never resolve silently.

## Acceptance checklist

- [ ] No white-on-amber/orange/yellow (audit every `bg-accent-500`/`bg-flare` sibling text class)
- [ ] Accent text: `accent-700` on light, `accent-400`/`accent-300` on dark
- [ ] Bronze focus-visible everywhere; skip-link compliant
- [ ] Max one flare-bar per viewport; yellow confined to non-text marks
- [ ] Tokens only — no raw hex in `.astro` files
- [ ] Logo master untouched; white-chip treatment intact on dark
- [ ] Provisional caveat documented (item 14) until SES verifies
- [ ] `npm run build` green after any token change