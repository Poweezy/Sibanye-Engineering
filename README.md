# Sibanye Engineering Solutions — Corporate Website

Premium corporate website for **Sibanye Engineering Solutions (SES)**, a multidisciplinary
engineering advisory and project-management practice based in Mbabane, Eswatini, serving
Eswatini and Southern Africa.

Built by **Analytical Sigma (Pty) Ltd**.

## Stack

- [Astro](https://astro.build) (static output) + TypeScript
- Tailwind CSS v4 (design tokens in `src/styles/global.css` via `@theme`)
- Self-hosted variable fonts (Space Grotesk display / Inter text) via Fontsource
- Typed content collections (JSON) for services, sectors, projects, leadership, clients
- One small PHP endpoint (`public/api/enquiry.php`) for the project-enquiry form on cPanel-style hosting

## Commands

```bash
npm install     # install dependencies
npm run dev     # local dev server
npm run build   # production build to /dist
npm run preview # preview the production build
```

## Governance

- `docs/DECISIONS.md` — architecture and design decision log (ADRs)
- `docs/content-open-items.md` — content integrity register; every item pending SES confirmation
- `docs/GATES.md` — phase gates and acceptance evidence
- `docs/STATUS.md` — current stage tracker

## Content integrity rules

1. No unverified claims: project values, clients, qualifications, registrations, statistics and
   testimonials are published only if traceable to the 2026 capability statement, the approved
   proposal, or written SES approval.
2. Unverified fields are stored as empty/`verify: true` and rendered as `[CONFIRM WITH SES]`.
3. Client/partner logos, leadership and project photographs require SES permission before use.
4. English only. British spelling. Currency in Emalangeni (E).

The 2026 capability statement (the primary source of truth) has **not yet been supplied** —
see `docs/content-open-items.md`.
