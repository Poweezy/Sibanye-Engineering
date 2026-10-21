# Project Status — Sibanye Engineering Solutions Website

**Agency:** Analytical Sigma (Pty) Ltd · **Client:** Sibanye Engineering Solutions (SES)

| Item | State |
| --- | --- |
| Current phase | **2 — Design & homepage prototype (built, awaiting design review)** |
| Stack | Astro 5 + TypeScript, Tailwind v4, typed JSON content collections, single PHP mail endpoint |
| Build status | ✅ `npm run build` green — 1 page, static output in `/dist` |
| Design review | ⏳ Pending SES decision on homepage prototype + navy/teal identity |
| Content integrity | All unverified fields render as placeholders/`[CONFIRM WITH SES]` — nothing fabricated |

## Stage log

- **Phase 1 — Audit:** complete. Findings in `docs/PHASE1-AUDIT.md`; recommendations accepted by client (2026-10-21).
- **Phase 2 (2a — Scaffold):** repo initialised (git `main`); Astro + Tailwind v4 + Fontsource; tokens, BaseLayout, Header/Footer, Logo, Icon set, SectionHead, ImagePlaceholder, content collections + seed data.
- **Phase 2 (2b — Homepage prototype):** hero, about, services, stats, featured-projects carousel, sectors, capabilities, leadership, enquiry section. Responsive, scroll-reveal (reduced-motion safe), carousel with counter, honeypot-protected enquiry form (front-end validation; server endpoint pending Stage 3).
- **Phase 2 (2c — Brand integration):** official SES logo received (`public/logo.png`). Processing pipeline `scripts/process-logo.mjs` (sharp): background knockout, debris/connected-component cleanup, trim → `logo-ses.png`, `favicon.png`, `apple-touch-icon.png`. Placeholder logo and favicon retired; white-chip treatment on dark surfaces.
- **Phase 4 (early pass — capability statement received):** `ses-capability-statement-2026.pdf` identified, filed under `docs/00-brief/source-documents/` and text-extracted (`scripts/extract-pdf-text.mjs`). Projects data rebuilt from statement references (21 entries with clients/values/locations/roles); mission, vision, addresses, phones, domain and contract forms verified; footer and homepage copy aligned. Discrepancies logged in `docs/content-open-items.md` verification notes — none resolved by invention.
- **Phase 3 —** not started (gated on design approval).
- **Phase 4/5 —** ongoing registers: `docs/content-open-items.md`, `docs/GATES.md`.

## Immediate next steps

1. SES design review of homepage prototype ( Gate 2 → Gate 3 decision).
2. SES to supply: 2026 capability statement (source of truth), vector logo artwork + reversed/mono variant (raster received and processed), photography permissions, statistics approval, mail recipient address.
3. On approval: build remaining pages (about, services, sectors, projects, case studies, capabilities, approach, leadership, contact, 404), PHP endpoint + `.htaccess`, security headers, downloads, SEO extras.
