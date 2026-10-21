# Phase 1 — Audit & Discovery (record of findings, 2026-10-21)

## Repository state at engagement

- No existing website code, framework, build tooling, git history or deployment configuration.
- Supplied material only:
  - Website proposal (DOCX + extracted text) — scope, sitemap intent, sourced SES content
  - SES 2026 capability statement references (primary content source; document itself outstanding)
  - Homepage design concept (`website mock up.png`)
  - Analytical Sigma letterhead branding (agency's own — not an SES brand asset)
- No third-party services, analytics or payment dependencies in scope.

## Architecture assessment

Greenfield build. Recommendation (accepted at Gate 1): **Astro 5 static output + TypeScript**,
Tailwind CSS v4 with token-driven theming, typed JSON content collections, self-hosted variable
fonts, and **one selective PHP endpoint** for the enquiry form — matching the cPanel-style
Eswatini hosting environment with no Node runtime requirement. No paid services; no external
CDN dependencies.

## Existing reusable components

None inherited — everything is newly built but designed for reuse: token system
(`src/styles/global.css`), `BaseLayout`, `Header`, `Footer`, `Logo`, `Icon`, `SectionHead`,
`ImagePlaceholder`, and per-section homepage components that Stage 3 generalises into
page-level sections.

## Content & asset gaps (full register: `docs/content-open-items.md`)

Capability statement document; approved statistics; project photography and permissions;
vector/reversed logo variants; leadership bios and photos; per-project case-study data;
client logo permissions; testimonials (none supplied); final contact details; domain
confirmation; enquiry mailbox/SMTP details.

## Proposed sitemap

Home · About · Services (+8 service detail pages) · Sectors · Projects index · Case-study
pages (one per project) · Capabilities · Approach · Leadership · Contact · 404.
Downloads: capability statement (when supplied). Integrations: WhatsApp deep link + float,
project-enquiry form. Deferred (future enhancements, not in initial scope): AI assistant,
careers portal, advanced project search, engineering insights.

## Recommended visual direction

Original identity: engineering navy ramp + instrument teal accent on paper neutrals; Space
Grotesk display / Inter text; angular hairline components; blueprint-grid motif for awaited
imagery; restrained scroll-reveal animation honouring `prefers-reduced-motion`. Inspired by the
reference site's structural discipline — no copying of its designs, text, branding or layouts.

## Technical & hosting risks

- cPanel-style shared hosting: PHP mail deliverability and SPF/DKIM setup — mitigation:
  configurable recipient, honeypot spam control, documented DNS requirements.
- Supplied logo is raster with baked-in background and upscaling artefacts — mitigation:
  processing pipeline (ADR-009) + vector artwork request.
- No confirmed domain yet — canonical URLs currently assume `www.sibanyeengineering.com`.
- Single-source content dependency (capability statement outstanding) — mitigation: typed
  content collections with explicit placeholder rendering, integrity register tracked weekly.

## Implementation plan (within scope, 3–4 weeks)

1. **Week 1:** scaffold, design tokens, homepage prototype (done) → design review
2. **Week 2:** all remaining pages + case studies + content integration
3. **Week 3:** enquiry endpoint, security headers, downloads, SEO extras, accessibility pass
4. **Week 4:** QA (automated + manual), fixes, content freeze, deployment rehearsal, handover
