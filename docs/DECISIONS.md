# Decision Log

## Architecture

### ADR-001 — Astro static + selective PHP
- **Decision:** Astro 5 static output; single PHP endpoint (`public/api/enquiry.php`) for the enquiry form.
- **Why:** Matches cPanel-style Eswatini hosting; no Node runtime required; per-route control as per brief.
- **Status:** Accepted by client (2026-10-21).

### ADR-002 — Tailwind v4 via `@tailwindcss/vite`
- **Decision:** Token-driven styling in `src/styles/global.css` under `@theme`; no `tailwind.config` file.
- **Why:** Single source of truth for the design system; zero-config Vite integration.
- **Note:** `@apply` cannot reference custom component classes (e.g. `@apply btn`) — shared button declarations are grouped under a multi-selector rule instead.

### ADR-003 — Fonts self-hosted via Fontsource
- **Decision:** `@fontsource-variable/space-grotesk` (display) + `@fontsource-variable/inter` (text), imported in `BaseLayout.astro`.
- **Why:** No third-party CDN requests; GDPR-friendly; self-hosting aligns with "no dependency on external CDNs".

### ADR-004 — Typed JSON content collections
- **Decision:** Services, sectors, projects, leadership, clients as JSON files validated by zod schemas in `src/content/config.ts`.
- **Why:** Separates content from presentation for Stage-3 page generation; schema catches malformed entries at build time; empty fields are explicit.

### ADR-005 — SEO placeholders pending domain
- **Decision:** `site: 'https://www.sibanyeengineering.com'` in `astro.config.mjs`; canonical URLs derive from it.
- **Why:** A valid absolute `site` is required for canonical/sitemap correctness.
- **Risk:** Domain not yet confirmed by SES — flag in `docs/content-open-items.md`; must be updated if different.

## Design

### ADR-006 — Original visual identity (navy + teal)
- **Decision:** Engineering navy ramp (`ink`), instrument teal accent (`accent`), paper neutrals; Space Grotesk display / Inter text; blueprint-grid motif as a transitional treatment for awaited imagery.
- **Why:** Engineering credibility and clear hierarchy, inspired by (not copied from) the reference site's discipline. Original palette, type pairing, icon set, logo lockup and section patterns.
- **Status:** Prototype awaiting SES review (Gate 2 → Gate 3).

### ADR-007 — Content-integrity rendering convention
- **Decision:** Unverified content is stored empty or flagged and rendered as `[CONFIRM WITH SES]` or neutral placeholders (em-dash statistics, blueprint image slots, initials avatars).
- **Why:** Phase 4 rule — never invent values, clients, qualifications or outcomes; placeholders keep gaps visible during review.

### ADR-008 — Defer client-logo wall
- **Decision:** Approved client names are seeded in `clients.json` but not rendered until SES confirms logo permissions and wording.
- **Why:** Third-party marks require permission; names-without-logos could imply endorsement beyond what is approved.

## Environment notes

- npm here blocks install scripts by default; `esbuild` and `sharp` post-installs were approved (`npm approve-scripts`) — required for Astro's build tooling.
- Windows/PowerShell environment: files with leading `{`/`[` must be written via shell (`[IO.File]::WriteAllText`) or pretty-printed to avoid editor JSON parsing.

## Brand assets

### ADR-009 — Official SES logo integration
- **Decision:** The supplied raster `public/logo.png` (official SES gear mark on an opaque olive/orange sunburst background) is processed — never hand-edited — by `scripts/process-logo.mjs` (sharp): warm-background knockout, fringe/despeckle passes, red-debris pass, connected-component cleanup of detached fragments, alpha bounding-box trim. Derivatives: `public/logo-ses.png` (web, 360px), `public/favicon.png` (128, gear mark on white chip), `public/apple-touch-icon.png` (180).
- **Why:** The supplied file is opaque and shows upscaling artefacts, so it cannot sit directly on the navy surfaces; black lettering is unreadable on dark backgrounds, so the mark rides on a white chip in header/footer. The original supplied file stays untouched as the brand reference.
- **Constraint:** Derivatives are raster from an upscaled source — fine at web sizes, not print quality. Vector artwork (AI/EPS/SVG/PDF) plus reversed/mono variants have been requested from SES; derivatives must be replaced when supplied.
- **Status:** Implemented 2026-10-21. Placeholder SVG logo and favicon retired.
