# Content Open Items — Integrity Register

**Rule (Phase 4):** nothing is published unless traceable to the SES 2026 capability statement,
the approved website proposal, or written SES approval. Unverified fields render as placeholders
or `[CONFIRM WITH SES]` and are never fabricated.

| # | Item | Status | Blocks |
| --- | --- | --- | --- |
| 1 | **SES 2026 capability statement** (source-of-truth document) | ⏳ Outstanding | Verification of all quoted services, projects, clients, leadership credentials |
| 2 | **Statistics approval** — years of experience, projects delivered, sectors, markets | ⏳ Outstanding | Homepage stats render as em-dashes until approved figures arrive |
| 3 | **Project photography + usage permissions** (hero, portfolio, case studies) | ⏳ Outstanding | Blueprint placeholders shown wherever imagery belongs |
| 4 | **Brand assets** — official raster logo **received 2026-10-21** and processed (`scripts/process-logo.mjs` → `logo-ses.png`, `favicon.png`, `apple-touch-icon.png`). Still outstanding: **vector artwork** (AI/EPS/SVG/PDF) and **reversed/mono variant** | 🔶 Partially resolved | Print-quality derivatives; dark-background reversed mark |
| 5 | **Domain confirmation** — `www.sibanyeengineering.com` assumed for canonical URLs / SEO | ⏳ Outstanding | `astro.config.mjs` `site`, canonical tags, sitemap, hosting DNS |
| 6 | **Enquiry mailbox + SMTP account details** for `public/api/enquiry.php` | ⏳ Outstanding | Form submission endpoint (Stage 3) |
| 7 | **Client logo permissions** — approved client names seeded in `clients.json` but logo wall withheld | ⏳ Outstanding | Any rendering of third-party marks (permission required) |
| 8 | **Leadership profiles** — full bios, photographs, credential confirmation | ⏳ Outstanding | Leadership page shows initials avatars + credential chips from approved lists |
| 9 | **Case-study data** — per project: client, value, dates, scope, role, outcomes | ⏳ Outstanding | Case-study pages show "in preparation — pending SES confirmation" |
| 10 | **Testimonials** | ⏳ None supplied | No testimonials section exists; none will be created without written approval |
| 11 | **Contact details final confirmation** — phones (+268 2404 5512 / +268 7802 4964), email, Mbabane address | 🔶 From capability statement via proposal; final confirmation pending | Footer, contact page, WhatsApp number |
| 12 | **Regional presence wording** — Bryanston, Sandton office details | ⏳ Outstanding | Footer line "Regional presence" |
| 13 | **Unapproved third-party marks** — any client/partner logos not covered by item 7 must not appear anywhere | 🚫 Standing rule | Whole site |

## Photographic permissions note

Supplied or downloaded imagery may only be used where SES holds the rights or has written
permission from the project owner/client. Each project image must be cleared against item 3
before replacing its placeholder.
