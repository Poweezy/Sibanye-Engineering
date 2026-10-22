# Gate 2 — SES Design Review Package

**Project:** Sibanye Engineering Solutions website · **Agency:** Analytical Sigma (Pty) Ltd
**Prepared:** 2026-10-22 · **Gate:** 2 of 6 (Design approval) · **Scope of review:** the full working site (39 routes)

This package is the single checklist SES needs to review the site and give (or withhold) Gate 2
sign-off. Nothing here requires technical knowledge — every item is a design, content or approval
decision. Answer inline or in writing; the agency will record outcomes in `docs/GATES.md` and
`docs/STATUS.md`.

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
| D3 | **Statistics** — homepage stats render as blanks (—) pending figures | Supply approved numbers for the four stat labels (item 2) or keep blanks | ☐ Figures supplied ☐ Keep blanks |
| D4 | **Homepage values line** — statement p6 is graphical; wording could not be transcribed | Confirm the values wording as printed in the statement | ☐ Confirmed ☐ Deferred |
| D5 | **Service naming** — logo tagline uses short forms ("Mining", "Structures") vs site's full names | Confirm canonical names before any copy changes (item 15) | ☐ Keep full names ☐ Match tagline |
| D6 | **Logo usage** — full official lockup shown per your directive (ADR-015) | The wordmark is unreadable at header scale — approve a compact/horizontal variant for the header (item 4); full lockup stays in the footer | ☐ Supply variant ☐ Keep as is |
| D7 | **21 case studies** — data transcribed from the capability statement | Approve per-project publication (item 9), or mark exclusions | ☐ Approve ☐ With edits |
| D8 | **Project values displayed** (e.g. E360m) — pending the Q1–Q4 clarifications | Publish values only once Q1–Q4 are answered | ☐ After Q1–Q4 ☐ Withhold values |
| D9 | **Leadership** — bios from statement pp. 4–5 | Approve published wording + supply photographs + confirm the degree entry (Q5) | ☐ Approve ☐ With edits |
| D10 | **Capability-statement download** — deliberately not linked | Confirm `ses-capability-statement-2026.pdf` is the approved public version (item 1) to enable the button | ☐ Approved PDF ☐ Send new version |
| D11 | **Client logo wall** — client *names* are statement-confirmed; logos withheld | Supply logo files + written permission (item 7) or keep names-only | ☐ Supply logos ☐ Names only |
| D12 | **Photography** — blueprint placeholders shown wherever imagery belongs | Supply project photos + permissions (item 3); placeholders stay until then | ☐ Photos to follow ☐ Keep placeholders |
| D13 | **Enquiry form routing** — endpoint is built and hardened but delivers nowhere yet | Provide the mailbox/SMTP details (item 6), then we run a live end-to-end test | ☐ Details to follow |

## 4. Statement-transcription questions — Q1–Q6 (from the capability statement)

These are places where the printed statement is ambiguous. We transcribed faithfully but will not
resolve them by guesswork; answers may adjust case-study data before publication.

| # | Question |
| --- | --- |
| Q1 | **MNWAP value** — the statement prints E360,000,000 for the JV scope (30 km distribution, Lots 2–3 + on-farm). Is this the SES scope value or the programme total? |
| Q2 | **MR3 pedestrian bridges** — two references exist: 4No. steel bridges (E18,000,000) and 3No. concrete/steel composite on MR3 Lot 1 (R52 million). One programme or two packages? |
| Q3 | **"BUY CASH NIFOODS"** — printed client name for the warehouse rehabilitation. Is this a typo for UNIFOODS? |
| Q4 | **Inyatsi, Manzini (E8,000,000)** — the project title is not extractable from the layout, and a sidebar caption "MR3 WEIGH BRIDGE — E8,000.000" may be separate. What is the correct title/reference? |
| Q5 | **Frans Pienaar degree** — byline prints "BEng (Civil)"; bio says "BSc Civil Engineering, Stellenbosch, 1987". Which abbreviation is correct? |
| Q6 | **Homepage values line** — statement p6 is graphical and could not be transcribed. Please supply the exact value wording. |

## 5. Creative-asset policy (incl. AI-imagery boundaries)

- **Official logo:** the supplied `SIBANYE-LOGO-(OFFICIAL).jpg` is the only logo source. All web
  derivatives are generated by `scripts/process-logo.mjs` (favicon, apple-touch icon, social card).
  The logo is never recoloured, restyled or replaced without SES approval. Vector/reversed/compact
  variants remain requested (item 4).
- **Photography:** only SES-supplied imagery or imagery with written owner permission (item 3).
  Each project image is cleared before it replaces a placeholder. Placeholder graphics are clearly
  labelled and never imply evidence of completed work.
- **AI-generated imagery (Higgsfield tools are available in our studio):** used only for
  *non-documentary* decoration — abstract textures, motion backdrops, brand-pattern exploration —
  and only with your explicit approval per asset. **AI imagery will never** depict or caption an
  actual SES project, person, credential or client, and will never replace the official logo or
  brand colours. Any approved AI asset is logged in `docs/content-open-items.md` with its tool,
  prompt and intended slot.
- **No-fabrication rule:** no invented values, clients, credentials, testimonials, awards or
  statistics — the site shows blanks/placeholders rather than guesses.

## 6. Verification status (already checked by the agency)

- `npm run build` — green, **39 pages**.
- Internal link check (`scripts/link-check.mjs`) — **44/44** internal references resolve.
- Contrast — amber/near-black pairing verified against WCAG 2.1 AA (dark-on-amber CTAs 7.8:1).
- Reduced-motion support — all animation (reveals, gear watermark, page transitions) renders
  static and fully visible when the OS requests reduced motion.
- Mobile/desktop layouts reviewed at narrow and wide viewports.
- Not yet testable without hosting: live form delivery (needs D13), HTTPS redirect (hosting layer).

## 7. Sign-off

Gate 2 outcome (choose one):

- ☐ **Approved — proceed to content freeze (Gate 4)** with the decisions above
- ☐ **Approved with changes** — list changes: ______________________________________
- ☐ **Not approved — rework required** — list required changes: ____________________

| | Name | Signature | Date |
| --- | --- | --- | --- |
| SES representative | | | |
| Analytical Sigma (recorded by) | | | |