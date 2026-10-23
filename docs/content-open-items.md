# Content Open Items — Integrity Register

**Rule (Phase 4):** nothing is published unless traceable to the SES 2026 capability statement,
the approved website proposal, or written SES approval. Unverified fields render as placeholders
or `[CONFIRM WITH SES]` and are never fabricated.

| # | Item | Status | Blocks |
| --- | --- | --- | --- |
| 1 | **SES 2026 capability statement** (source-of-truth document) | ✅ **Received 2026-10-21** (`docs/00-brief/source-documents/ses-capability-statement-2026.pdf`, 20 pp; extracted text alongside). Content verification in progress — see verification notes below | — (remaining: SES to confirm this is the approved version) |
| 2 | **Statistics approval** — years of experience, projects delivered, sectors, markets | ⏳ Outstanding | Homepage stats render as em-dashes until approved figures arrive |
    - RESOLVED 2026-10-23: SES approved the statistics section; activated with evidence-matched figures only (21 projects, 8 disciplines, 2 markets, 30+ years director-level). See ADR-020.
| 3 | **Project photography + usage permissions** (hero, portfolio, case studies) | ⏳ Outstanding | Blueprint placeholders shown wherever imagery belongs |
  - **2026-10-23 update:** Hero photography approved by client direction — the eleven supplied Manzini Mall photographs now back the homepage hero (ADR-021). Broader photography permissions remain open.
| 4 | **Brand assets** — official lockup **received 2026-10-22** (`SIBANYE-LOGO-(OFFICIAL).jpg`, amber field + black monogram + wordmark + services tagline) and **adopted as the site logo by client directive 2026-10-22** (`logo-official.jpg` 1080×544 full lockup via `scripts/process-logo.mjs`; monogram now internal only — favicon/apple icon + OG card). Still outstanding: **vector artwork** (AI/EPS/SVG/PDF), **reversed/mono variant**, and a **compact/horizontal variant** for small-size legibility (the full lockup's wordmark is unreadable at header scale) | 🔶 Partially resolved | Print-quality derivatives; small-size legibility pending a compact variant |
| 5 | **Domain confirmation** — `sibanyeengineering.com` | ✅ **Confirmed** — www.sibanyeengineering.com appears in the capability statement | — |
| 6 | **Enquiry mailbox + SMTP account details** for `public/api/enquiry.php` | ⏳ Outstanding | Form submission endpoint (Stage 3) |
| 7 | **Client logo permissions** — client names confirmed by the statement (p16 "Our Clients"); logo wall withheld until SES provides logo files and permission | ⏳ Outstanding | Any rendering of third-party marks (permission required) |
| 8 | **Leadership profiles** — bios now sourced from statement pp. 4–5; photographs and SES approval of published wording outstanding | 🔶 Partially resolved | Leadership page |
| 9 | **Case-study data** — clients, values, locations and SES roles now populated from the statement; per-project sign-off outstanding | 🔶 Partially resolved | Case-study pages |
| 10 | **Testimonials** | ⏳ None supplied | No testimonials section exists; none will be created without written approval |
| 11 | **Contact details** — phones (+268) 2404 5512 / (+268) 7802 4964 (statement also lists +268 7906 1000 and SA +27 65 688 0826 / +27 86 607 7369), address and P O Box 7433 confirmed from statement p17 | ✅ From statement | Footer/contact page (publish after SES confirms approved version) |
| 12 | **Regional presence** — SES Engineering Solutions, 02 Bruton Road, Bryanston, Sandton, South Africa (statement p17) | ✅ From statement | Footer |
| 13 | **Unapproved third-party marks** — any client/partner logos not covered by item 7 must not appear anywhere | 🚫 Standing rule | Whole site |

| 14 | **Official SES brand guide** — verified HEX/CMYK specifications, vector logo, reversed/mono variants | 🔶 Partially resolved — **primary amber now official**: `accent-500` = logo field `#D69C1F` (sampled from the supplied lockup, ADR-013). `flare` `#E2631B` + `bright` `#F0D711` remain provisional (statement-cover samples). Full guide still outstanding | Theming confidence for flare/bright; print assets; removing "provisional" labels |
| 15 | **Logo tagline vs `services.json` naming** — the lockup prints "Civil Engineering Advisory Services \| Transportation \| Water Infrastructure \| Mining \| Energy \| Structures \| Project Management"; site services use full names (e.g. "Mining Engineering", "Structural Engineering") | ⏳ SES to confirm canonical service names before any copy changes | Meta descriptions / capability summaries echoing the tagline |
| 16 | **Monogram derivative** — resolved for header/footer by client directive 2026-10-22 (full official lockup displayed as supplied; `logo-ses.png` retired). The monogram now appears only inside the favicon/apple icon and OG card composition | ✅ Resolved by directive (2026-10-22) | — (favicon/OG composition unchanged) |
| 17 | **AI-generated creative assets (Higgsfield)** — client-requested design enhancement. Policy (Gate 2 package §5): non-documentary decoration only (abstract textures/motion backdrops), never depicting real SES projects, people or credentials, never replacing the official logo; **per-asset SES approval required before site use**. Status: account unblocked by the client 2026-10-23 (workspace `971117e8…` active); free plan gates `gpt_image_2_5` behind a Basic plan (`job_minimum_basic_plan_required`) but **FLUX.2 works at 1 credit/image** — two policy-screened hero-texture proposals generated (A primary, B secondary-with-caveats), 7 credits remaining, provenance register at `docs/creative-proposals/README.md` | 🔶 **Awaiting SES approval of the proposals** — no generated asset is referenced by site code | Design-team texture/backdrop proposals |

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

## Old-website reconciliation (appsystemsz.com/sibanyeengineering)

The old site is itself an Ander-styled rebuild carrying **unverified marketing copy**. Per Phase 4, only statement-corroborated items may be adopted:

- ✅ **Corroborated by the capability statement:** phone +268 7906 1000 (statement p17 also lists it — candidate third number, SES to confirm placement), email info@sibanyeengineering.com, Mbabane location, the four statistics *labels*.
- 🚫 **Not adopted (unverified):** taglines ("Engineering progress. Building possibility.", "Engineering solutions for a brighter Africa"), footer motto "We are one · Innovation · Inspire", Geotechnical Engineering as a service, "digital capability / BIM / GIS / data" claims, generic project cards, and the "0+" statistics values.
- 🚫 **Out of initial scope:** the old site's "Sibanye AI Assist" chatbot — a future enhancement per the commercial constraints.

## Photographic permissions note

Supplied or downloaded imagery may only be used where SES holds the rights or has written
permission from the project owner/client. Each project image must be cleared against item 3
before replacing its placeholder.
