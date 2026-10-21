# Content Open Items — Integrity Register

**Rule (Phase 4):** nothing is published unless traceable to the SES 2026 capability statement,
the approved website proposal, or written SES approval. Unverified fields render as placeholders
or `[CONFIRM WITH SES]` and are never fabricated.

| # | Item | Status | Blocks |
| --- | --- | --- | --- |
| 1 | **SES 2026 capability statement** (source-of-truth document) | ✅ **Received 2026-10-21** (`docs/00-brief/source-documents/ses-capability-statement-2026.pdf`, 20 pp; extracted text alongside). Content verification in progress — see verification notes below | — (remaining: SES to confirm this is the approved version) |
| 2 | **Statistics approval** — years of experience, projects delivered, sectors, markets | ⏳ Outstanding | Homepage stats render as em-dashes until approved figures arrive |
| 3 | **Project photography + usage permissions** (hero, portfolio, case studies) | ⏳ Outstanding | Blueprint placeholders shown wherever imagery belongs |
| 4 | **Brand assets** — official raster logo **received 2026-10-21** and processed (`scripts/process-logo.mjs` → `logo-ses.png`, `favicon.png`, `apple-touch-icon.png`). Still outstanding: **vector artwork** (AI/EPS/SVG/PDF) and **reversed/mono variant** | 🔶 Partially resolved | Print-quality derivatives; dark-background reversed mark |
| 5 | **Domain confirmation** — `sibanyeengineering.com` | ✅ **Confirmed** — www.sibanyeengineering.com appears in the capability statement | — |
| 6 | **Enquiry mailbox + SMTP account details** for `public/api/enquiry.php` | ⏳ Outstanding | Form submission endpoint (Stage 3) |
| 7 | **Client logo permissions** — client names confirmed by the statement (p16 "Our Clients"); logo wall withheld until SES provides logo files and permission | ⏳ Outstanding | Any rendering of third-party marks (permission required) |
| 8 | **Leadership profiles** — bios now sourced from statement pp. 4–5; photographs and SES approval of published wording outstanding | 🔶 Partially resolved | Leadership page |
| 9 | **Case-study data** — clients, values, locations and SES roles now populated from the statement; per-project sign-off outstanding | 🔶 Partially resolved | Case-study pages |
| 10 | **Testimonials** | ⏳ None supplied | No testimonials section exists; none will be created without written approval |
| 11 | **Contact details** — phones (+268) 2404 5512 / (+268) 7802 4964 (statement also lists +268 7906 1000 and SA +27 65 688 0826 / +27 86 607 7369), address and P O Box 7433 confirmed from statement p17 | ✅ From statement | Footer/contact page (publish after SES confirms approved version) |
| 12 | **Regional presence** — SES Engineering Solutions, 02 Bruton Road, Bryanston, Sandton, South Africa (statement p17) | ✅ From statement | Footer |
| 13 | **Unapproved third-party marks** — any client/partner logos not covered by item 7 must not appear anywhere | 🚫 Standing rule | Whole site |

## Verification notes from the capability statement (2026-10-21)

Discrepancies and ambiguities found during transcription — **do not resolve by invention; ask SES**:

1. **MNWAP value** — statement prints E360,000,000 for the JV scope (30 km secondary distribution,
   Lots 2–3 + on-farm development). Confirm this is the SES scope value, not the programme total.
2. **MR3 pedestrian bridges** — two overlapping references: 4No. steel bridges (E18,000,000) and
   3No. concrete/steel composite bridges on MR3 Lot 1 (R52 million). One programme or two packages?
3. **"BUY CASH NIFOODS"** — printed client name for the Buy Cash Warehouse rehabilitation;
   likely a typo (UNIFOODS?). Verify.
4. **Water reticulation reference (Inyatsi, Manzini, E8,000,000)** — printed project title is not
   extractable from the layout; also a sidebar caption "MR3 WEIGH BRIDGE — E8,000.000 — Inyatsi"
   may be a separate reference or an image caption. Verify.
5. **Frans Pienaar degree** — byline prints "BEng (Civil)"; bio text says "Bachelor of Science in
   Civil Engineering, Stellenbosch University, 1987". Confirm the correct abbreviation.
6. **Cover address** ("Nedbank Centre, Swazi Plaza") vs p17 (full street + box) — p17 version used
   on site; cover is an abbreviated form. No action.
7. **Nsoko capacity** — reference says 13.34 MWp; photo caption says "13 MW". Use 13.34 MWp.
8. **Values page (p6) is graphical** — value wording could not be extracted; homepage values line
   remains pending SES sign-off.

## Photographic permissions note

Supplied or downloaded imagery may only be used where SES holds the rights or has written
permission from the project owner/client. Each project image must be cleared against item 3
before replacing its placeholder.
