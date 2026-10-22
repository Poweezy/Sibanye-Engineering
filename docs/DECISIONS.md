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

### ADR-010 — Brand retheme to the provisional SES palette + branding agent
- **Decision:** Adopt the six client-supplied reference values sampled from the capability-statement cover — amber gold `#EA9F12`, bright yellow `#F0D711`, engineering orange `#E2631B`, near-black `#12100F`, slate grey `#575B61`, light grey `#DCDFE4` — as the token foundation, explicitly labelled **provisional** (verified official specs pending: content-open-items item 14). Warm ink/accent ramps derived from the anchors; bronze `#9A6100` derived for accent text on light.
- **Contrast mapping (WCAG AA):** dark-on-amber CTAs (8.7:1) — white-on-amber (2.2:1) banned; bronze accent text on light (5.1:1); light-amber accent text on dark (10.5:1); orange as hover-only motion colour; yellow confined to non-text signature marks; bronze focus rings; one `flare-bar` per viewport (implemented at the footer's top edge).
- **Branding agent:** `agents/sibanye-website-agents/.github/agents/ses-brand-identity.agent.md` created as brand guardian (palette law, contrast law, logo treatment, typography, Ander-principle transfer list, acceptance checklist). On conflict, contrast and logo law win.
- **Old-website policy:** only capability-statement-corroborated items adopted from appsystemsz.com/sibanyeengineering; unverified taglines/motto/services and the AI assistant excluded (see content-open-items).
- **Status:** Implemented 2026-10-21; automatic retheme triggers when the official brand guide arrives.

### ADR-011 — Full-sitemap implementation stage (Phase 3)
- **Decision:** All 39 routes generated from the typed JSON collections — About, Services index + 8 detail pages, Sectors, Projects index (client-side sector filter) + 21 statement-sourced case studies, Capabilities, Approach, Leadership, Contact, 404. Shared patterns: `PageHero`, `CtaBand`, `ProjectCard`. QA automated via `scripts/link-check.mjs` (scans built `dist/`, verifies every internal href/src resolves).
- **Why:** Static generation keeps hosting PHP-free except the enquiry endpoint; link-check makes broken internal references a build-time failure rather than a launch surprise.
- **Status:** Implemented 2026-10-21; build green, 43/43 references resolve.

### ADR-012 — Enquiry endpoint (`public/api/enquiry.php`)
- **Decision:** Single selective-PHP endpoint for cPanel hosting. POST-only (405 otherwise); honeypot field; per-IP rate limit (one submission per 30 s, hourly pruning, state in a dotfile); header-injection stripping via control-character removal; server-side validation; dual response modes — JSON when requested with `Accept: application/json` (fetch path), otherwise a 303 redirect to `/contact/?sent=1#enquiry` (success) or `?sent=0#enquiry` (failure). Recipient constant `info@sibanyeengineering.com`, pending SES confirmation of the production mailbox (content item 6).
- **Why:** Progressive enhancement — the form works without JavaScript; the redirect target carries the success state, which `BaseLayout` surfaces in the `[data-form-status]` element and then cleans from the URL.
- **Accepted risk:** No CSRF token (public enquiry form; honeypot + rate limiting deemed proportionate). Rate-limit state is a mutable dotfile inside the web root — denied by `.htaccess`; revisit if hosting is not Apache.
- **Status:** Implemented; end-to-end delivery blocked on item 6 (mailbox/SMTP).

### ADR-012b — `.htaccess` scope
- **Decision:** Ship only what Apache needs: dotfile denial (including the rate-limit file), security headers (nosniff, referrer policy, framing), expires caching for static assets, custom 404.
- **Why (honest scope):** Clean URLs need no rewrite rules — Astro's directory build format (`/contact/index.html`) serves `/contact/` natively. HTTPS redirect is deferred to the hosting layer (cPanel AutoSSL/force-HTTPS) to avoid conflicting with the host's own rules; must be verified at deployment.
- **Status:** Implemented. Earlier STATUS wording overclaimed clean-URL/HTTPS rules — corrected 2026-10-22.

### ADR-013 — Official SES logo (2026-10-22) + authoritative amber retheme
- **Decision:** SES supplied the official lockup `public/SIBANYE-LOGO-(OFFICIAL).jpg` (2160×1088: flat amber field, black "S…S" lettering with silver 3D gear "E", secondary gear, hex nuts, black/silver wordmark, services tagline). The logo field — sampled `#D69C1F` across three flat regions — supersedes the provisional `#EA9F12` as the **official** `accent-500` anchor; derived ramp recalibrated to WCAG targets (700 `#8b6514` ≥5:1 on white; 600 `#af8019` ≥3:1 on white; 400 `#ddac43` ≥9:1 on ink-950; 300 `#e5c172` ≥11:1). `flare`/`bright` remain provisional (item 14). Pipeline rebuilt: amber knockout → monogram crop (calibrated x≈496–1576, y≈16–766) → `logo-ses.png` 517×360, amber-chip `favicon.png`/`apple-touch-icon.png`, and a 1200×630 `og.jpg` social card composed purely from the real monogram + wordmark band + ink bar (no third-party fonts). OG meta upgraded to a large card with accurate dimensions. Amber CTA hover moved `accent-600`→`flare` (ink-950 on flare = 5.2:1; 600 was reserved for icons on light). Old `public/logo.png` retained as archive only.
- **Why:** The logo is the first verified official brand artifact; the palette must match it exactly. Header keeps the white-chip treatment (black lettering on dark surfaces).
- **Open items:** Vector artwork + reversed/mono variant still outstanding (item 4); the header/footer monogram is a derivative of the official mark and needs SES approval (item 16); the lockup's printed services tagline is brand evidence, not site copy (item 15).
- **Status:** Implemented 2026-10-22; build verified after token change.

### ADR-014 — View transitions + progressive-enhancement JS pattern
- **Decision:** Astro `<ClientRouter />` in `BaseLayout`. All behavioural JS lives in one `astro:page-load` listener that re-queries the swapped DOM each navigation (nav toggle, enquiry feedback, scroll reveals) — no stale listeners, no per-component script duplication. Reveal observer is disabled entirely under `prefers-reduced-motion` (content shows immediately). Form success/failure is read from the `?sent` query parameter into `[data-form-status]`, focused for screen readers, then removed via `history.replaceState`.
- **Why:** One init path for first load and every client-side navigation; keeps per-route `<title>`/meta intact because pages are still statically rendered.
- **Status:** Implemented 2026-10-22.

### ADR-015 — Official lockup adopted as the site logo (client directive)
- **Decision:** Per client directive 2026-10-22 ("that is the right logo — no logo-ses.png"), `Logo.astro` now displays the **full official lockup exactly as supplied** — optimized to `public/logo-official.jpg` (1080×544, mozjpeg q88) by `scripts/process-logo.mjs`, amber field intact, riding on any surface without a chip or typeset substitutes. The monogram derivative `logo-ses.png` is retired (file deleted); the monogram remains internal to the pipeline for the favicon/apple-icon chips and the OG card composition. JSON-LD Organization logo updated to `/logo-official.jpg`.
- **Why:** The client wants their complete brand artwork — monogram, wordmark and tagline — as the mark, not an extracted emblem.
- **Open item:** At header scale (h-12) the lockup's wordmark/tagline fall below legible size; a compact/horizontal variant plus vector/reversed artwork are requested (content-open-items item 4). SES to confirm.
- **Status:** Implemented 2026-10-22.
