# Project Status — Sibanye Engineering Solutions Website

**Agency:** Analytical Sigma (Pty) Ltd · **Client:** Sibanye Engineering Solutions (SES)

| Item | State |
| --- | --- |
| Current phase | **3 — Implementation (full sitemap built; formal design approval still pending at Gate 2)** |
| Stack | Astro 5 + TypeScript, Tailwind v4, typed JSON content collections, single PHP mail endpoint |
| Build status | ✅ `npm run build` green — **39 pages**, link-check clean (43/43 internal references resolve) |
| Design review | ⏳ Pending SES decision on prototype + provisional amber/near-black identity (ADR-010) |
| Content integrity | All unverified fields render as placeholders/`[CONFIRM WITH SES]` — nothing fabricated |

## Stage log

- **Phase 1 — Audit:** complete. Findings in `docs/PHASE1-AUDIT.md`; recommendations accepted by client (2026-10-21).
- **Phase 2 (2a — Scaffold):** repo initialised (git `main`); Astro + Tailwind v4 + Fontsource; tokens, BaseLayout, Header/Footer, Logo, Icon set, SectionHead, ImagePlaceholder, content collections + seed data.
- **Phase 2 (2b — Homepage prototype):** hero, about, services, stats, featured-projects carousel, sectors, capabilities, leadership, enquiry section. Responsive, scroll-reveal (reduced-motion safe), carousel with counter, honeypot-protected enquiry form (front-end validation; server endpoint pending Stage 3).
- **Phase 2 (2c — Brand integration):** official SES logo received (`public/logo.png`). Processing pipeline `scripts/process-logo.mjs` (sharp): background knockout, debris/connected-component cleanup, trim → `logo-ses.png`, `favicon.png`, `apple-touch-icon.png`. Placeholder logo and favicon retired; white-chip treatment on dark surfaces.
- **Phase 4 (early pass — capability statement received):** `ses-capability-statement-2026.pdf` identified, filed under `docs/00-brief/source-documents/` and text-extracted (`scripts/extract-pdf-text.mjs`). Projects data rebuilt from statement references (21 entries with clients/values/locations/roles); mission, vision, addresses, phones, domain and contract forms verified; footer and homepage copy aligned. Discrepancies logged in `docs/content-open-items.md` verification notes — none resolved by invention.
- **Phase 2 (2d — brand retheme):** six provisional brand reference values (client-sampled from the statement cover) adopted as the token foundation — warm near-black ink, amber primary, orange hover, yellow confined to non-text signature marks. Contrast-driven component fixes (dark-on-amber CTAs, bronze accent text on light, bronze focus rings, warm `theme-color`); `flare-bar` signature divider added to the footer; `ses-brand-identity` agent created to enforce palette/contrast/logo/type law; `HomeEnquiry` duplicated-markup defect fixed; old-website elements reconciled (only statement-corroborated items adopted).
- **Phase 3 — Implementation (this stage):** full sitemap built — 39 routes: About, Services index + 8 detail pages, Sectors, Projects index with client-side sector filter + 21 statement-sourced case-study pages, Capabilities, Approach (5-phase delivery narrative mapped from statement capabilities), Leadership (credentials only; bios/photographs pending), Contact (channels + enquiry form), 404. Shared components added: `PageHero`, `CtaBand`, `ProjectCard`. Infrastructure: `public/api/enquiry.php` (honeypot + validation + header injection guards), `public/.htaccess` (security headers, caching, clean URLs, HTTPS redirect), `robots.txt`, `@astrojs/sitemap`, QA script `scripts/link-check.mjs` (43/43 pass). Capability-statement download is deliberately not linked until SES confirms the approved PDF version (content item 1); form submission requires live-host testing (PHP, content item 6).
- **Phase 4/5 —** ongoing registers: `docs/content-open-items.md`, `docs/GATES.md`.

## Immediate next steps

1. SES design review of the full site (Gate 2 → Gate 3 sign-off decision).
2. SES to supply: official brand guide (verified HEX/CMYK + vector logo + reversed/mono variant — provisional palette in use until then), photography permissions, statistics approval, mail recipient address (enables end-to-end form test), approved capability-statement PDF version (enables the download link).
3. On content arrival: resolve `[CONFIRM WITH SES]` placeholders (Gate 4), then QA pass (Gate 5) — Lighthouse, cross-browser, live form submission.
