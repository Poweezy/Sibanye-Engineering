# Gate 2 — SES Design Review Package

**Project:** Sibanye Engineering Solutions website · **Agency:** Analytical Sigma (Pty) Ltd
**Prepared:** 2026-10-22 · **Gate:** 2 of 6 (Design approval) · **Scope of review:** the full working site (39 routes)

SES confirmed Gate 2 design approval on 2026-10-28. This approval is recorded from the client's
confirmation; an approver name and signature were not supplied. It approves the design gate only:
content decisions, usage rights, content freeze and production QA remain tracked separately in
`docs/GATES.md` and `docs/content-open-items.md`.

---

## 1. How to preview the site

**Option A — on your computer (recommended):**
1. Open the project folder in VS Code.
2. Run `npm install` once, then `npm run dev` and open the printed address (http://localhost:4321).
3. Resize the window narrow/wide — every page is responsive.

**Option B — production preview:** run `npm run build`, then `npm run preview` (serves the built `dist/`, closest to the live site).

**Suggested review order:** Homepage → Services (index + any detail page) → Projects (index + 2–3 case studies) → About → Approach → Leadership → Capabilities → Contact (try the enquiry form — locally it will show the success/failure message but no email is sent yet, by design).

## 2. What is in the build (39 routes)

| Area | Routes |
| --- | --- |
| Core pages | Home · About · Sectors · Capabilities · Approach · Leadership · Contact · 404 (8) |
| Services | Index + 8 detail pages (Civil, Water & Sanitation, Transportation, Energy, Structural, Mining, Project & Programme Management, Industrial & Commercial Buildings) (9) |
| Projects | Index with sector filter + 21 statement-sourced case studies (22) |
| — | **Total: 39 routes** · sitemap, robots.txt, security headers, custom 404 included |

## 3. Decision checklist — D1–D13 (please answer each)

| # | Decision | Our recommendation | Your call |
| --- | --- | --- | --- |
| D1 | **Visual identity** — warm near-black + amber system; Space Grotesk display / Inter body; blueprint motif; hairline grid | Approve as the SES identity (amber is now the official logo-field colour `#D69C1F`) | ☐ Approve ☐ Adjust |
| D2 | **Hero message** — "Engineering Infrastructure. Enabling Sustainable Progress." with supporting line | Approve or supply preferred wording | ☐ Approve ☐ Adjust |
| D3 | **Statistics** — SES approved evidence-matched figures (21 documented projects, 8 disciplines, 2 documented markets, 30+ years director-level; ADR-020) | Confirm the published labels and evidence boundaries remain acceptable | ☐ Confirmed ☐ Adjust |
| D4 | **Homepage values line** — statement p6 is graphical; wording could not be transcribed | Confirm the values wording as printed in the statement | ☐ Confirmed ☐ Deferred |
| D5 | **Service naming** — logo tagline uses short forms ("Mining", "Structures") vs site's full names | Confirm canonical names before any copy changes (item 15) | ☐ Keep full names ☐ Match tagline |
| D6 | **Logo usage** — full official lockup shown per your directive (ADR-015) | The wordmark is unreadable at header scale — approve a compact/horizontal variant for the header (item 4); full lockup stays in the footer | ☐ Supply variant ☐ Keep as is |
| D7 | **21 case studies** — data transcribed from the capability statement | Approve per-project publication (item 9), or mark exclusions | ☐ Approve ☐ With edits |
| D8 | **Project values displayed** (e.g. E360m) — pending the Q1–Q4 clarifications | Publish values only once Q1–Q4 are answered | ☐ After Q1–Q4 ☐ Withhold values |
| D9 | **Leadership** — SES-approved bios and credentials from statement pp. 4–5; portraits are present | Confirm current presentation or request edits | ☐ Approve ☐ With edits |
| D10 | **Capability-statement download** — deliberately not linked | Confirm `ses-capability-statement-2026.pdf` is the approved public version (item 1) to enable the button | ☐ Approved PDF ☐ Send new version |
| D11 | **Client logo wall** — client *names* are statement-confirmed; logos withheld | Supply logo files + written permission (item 7) or keep names-only | ☐ Supply logos ☐ Names only |
| D12 | **Photography** — supplied project photos are assigned to matching project cards and detail heroes; publication permissions remain to be confirmed (item 3) | Confirm rights and placements for each supplied project photo; retain placeholders where no cleared image is available | ☐ Confirm rights ☐ Changes required |
| D13 | **Enquiry form routing** — endpoint is built and configured to send to `corporate@sibanyeengineering.com`; production mail delivery is not yet verified (item 6) | Confirm the recipient is monitored and authorize a live end-to-end test on the agreed host | ☐ Confirm mailbox ☐ Details to follow |

## 4. Statement-transcription questions — Q1–Q6 (from the capability statement)

These are places where the printed statement is ambiguous. We transcribed faithfully but will not
resolve them by guesswork; answers may adjust case-study data before publication.

| # | Question |
| --- | --- |
| Q1 | **MNWAP value** — the statement prints E360,000,000 for the JV scope (30 km distribution, Lots 2–3 + on-farm). Is this the SES scope value or the programme total? |
| Q2 | **MR3 pedestrian bridges** — two references exist: 4No. steel bridges (E18,000,000) and 3No. concrete/steel composite on MR3 Lot 1 (R52 million). One programme or two packages? |
| Q3 | **"BUY CASH NIFOODS"** — printed client name for the warehouse rehabilitation. Is this a typo for UNIFOODS? |
| Q4 | **Inyatsi, Manzini (E8,000,000)** — the project title is not extractable from the layout, and a sidebar caption "MR3 WEIGH BRIDGE — E8,000.000" may be separate. What is the correct title/reference? |
| Q5 | **Frans Pienaar degree** — ✅ Resolved 2026-10-24: SES confirmed the published byline as "BEng (Civil)"; see content item 8. |
| Q6 | **Homepage values line** — statement p6 is graphical and could not be transcribed. Please supply the exact value wording. |

## 5. Creative-asset policy (incl. AI-imagery boundaries)

- **Official logo:** the supplied `SIBANYE-LOGO-(OFFICIAL).jpg` is the only logo source. All web
  derivatives are generated by `scripts/process-logo.mjs` (favicon, apple-touch icon, social card).
  The logo is never recoloured, restyled or replaced without SES approval. Vector/reversed/compact
  variants remain requested (item 4).
- **Photography:** only SES-supplied imagery or imagery with written owner permission (item 3).
  Supplied project photos are currently assigned to matching records; broader written usage
  permissions and any unconfirmed placements remain open. Imagery must not be presented as
  documentary evidence without its source and publication rights being confirmed.
- **AI-generated imagery (Higgsfield):** decorative use only; it must not be represented as an
  actual SES project, credential or client, or replace the official logo or brand colours. Each
  asset and its intended use must have explicit SES approval and be recorded in
  `docs/content-open-items.md`. Proposal A (CTA texture), B (homepage blueprint plate), and C2
  (homepage hero, including a generic engineer figure) are approved and in use; the approval to
  depict a generic person is recorded in ADR-023. Proposal C remains unused. See the provenance
  register in `docs/creative-proposals/`.
- **No-fabrication rule:** no invented values, clients, credentials, testimonials, awards or
  statistics — the site shows blanks/placeholders rather than guesses.

## 6. Verification status (already checked by the agency)

- `npm test` — green, **39 pages**, **87/87 smoke checks**, **86/86** internal references resolve (2026-10-28).
- Contrast — amber/near-black pairing verified against WCAG 2.1 AA (dark-on-amber CTAs 7.8:1).
- Reduced-motion support — all animation (reveals, gear watermark, page transitions) renders
  static and fully visible when the OS requests reduced motion.
- Local browser spot-check (2026-10-28): Energy and Water & Sanitation filters show matching project cards; Manzini Region Sustainable Water Supply hero image loads; 390px viewport has no horizontal overflow.
- Contact-form spot-check (2026-10-28): native browser validation requires name, email and message; contact layout fits a 390px viewport. This does not test PHP mail delivery.
- Still open for Gate 5: comprehensive cross-browser and accessibility review, Lighthouse budgets, live form delivery, production HTTPS redirect, and production security-header verification.

## 7. Sign-off

**Gate 2 design outcome:** ✅ Approved — client confirmation recorded 2026-10-28.
This does not mark the Gate 4 content checklist or Gate 5 QA complete.

| | Name | Signature | Date |
| --- | --- | --- | --- |
| SES representative | Not supplied | Not supplied | 2026-10-28 (approval confirmed) |
| Analytical Sigma (recorded by) | Client confirmation recorded | — | 2026-10-28 |