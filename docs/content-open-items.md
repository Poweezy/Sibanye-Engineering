# Content Open Items — Integrity Register

**Rule (Phase 4):** nothing is published unless traceable to the SES 2026 capability statement,
the approved website proposal, or written SES approval. Unverified fields render as placeholders
or `[CONFIRM WITH SES]` and are never fabricated.

| # | Item | Status | Blocks |
| --- | --- | --- | --- |
| 1 | **SES 2026 capability statement** (source-of-truth document) | ✅ **Approved for public download by client confirmation 2026-10-28** (`public/downloads/ses-capability-statement-2026.pdf`; source: `docs/00-brief/source-documents/ses-capability-statement-2026.pdf`, 20 pp) | — |
| 2 | **Statistics approval** — years of experience, projects delivered, sectors, markets | ✅ **Resolved 2026-10-23** — SES approved evidence-matched figures only (21 documented projects, 8 disciplines, 2 documented markets, 30+ years director-level; see ADR-020) | — |
| 3 | **Project photography + usage permissions** (hero, portfolio, case studies) | 🔶 Client confirmed 2026-10-28 that currently assigned supplied project photos may be used publicly. Unassigned assets and unmatched placements are explicitly deferred; the USL RDO Office image remains unassigned and unused | No current blocker for approved assigned photos; obtain a separate decision before using deferred assets |
  - **2026-10-23 update:** Hero photography approved by client direction — the eleven supplied Manzini Mall photographs now back the homepage hero (ADR-021). Broader photography permissions remain open.
  - **2026-10-24 update:** hero redesigned as the approved proposal-B blueprint plate with a rotating gear porthole showing one Manzini Mall photograph (ADR-022). Case-study imagery added by client direction for GALP Fueling Station Forecourt and Healing Power Church (supplied raws under `docs/raw-photography/`, ADR-021 pipeline, smoke guard 9f). Photography permissions for the remaining projects remain open.
  - **2026-10-28 update:** supplied National Healthcare Waste Facility and Shonalanga Pump Station photos placed on their matching case studies by client direction. The USL RDO Office photo is retained under `docs/raw-photography/` until its matching project record and placement are confirmed.
  - **2026-10-28 update:** supplied photos matched by filename and visible subject to Buy Cash Warehouse, Emandla Solar PV, Hluti Power Sub-Station, Luke Commission Staff Development Centre, Manzini Region Sustainable Water Supply, MNWAP, MR3 Pedestrian Bridges, Nsoko Solar PV, Ridgeview Township Roads, Sicholo Street, UNDP JET and UNIFOODS and wired to their project records. The "Lavumisa Border 154 KWp Solar Project" image has since been assigned to Lavumisa Border Project by client direction; the Water Reticulation source was also matched to its project by filename and visible subject. Sources are preserved in `docs/raw-photography/`.
| 4 | **Brand assets** — official lockup **received 2026-10-22** (`SIBANYE-LOGO-(OFFICIAL).jpg`, amber field + black monogram + wordmark + services tagline) and **adopted as the site logo by client directive 2026-10-22** (`logo-official.jpg` 1080×544 full lockup via `scripts/process-logo.mjs`; monogram now internal only — favicon/apple icon + OG card). Still outstanding: **vector artwork** (AI/EPS/SVG/PDF), **reversed/mono variant**, and a **compact/horizontal variant** for small-size legibility (the full lockup's wordmark is unreadable at header scale) | 🔶 Partially resolved | Print-quality derivatives; small-size legibility pending a compact variant |
| 5 | **Domain confirmation** — `sibanyeengineering.com` | ✅ **Confirmed** — www.sibanyeengineering.com appears in the capability statement | — |
| 6 | **Enquiry mailbox + SMTP account details** for `public/api/enquiry.php` | 🔶 Recipient is configured as `corporate@sibanyeengineering.com` by client direction; confirm it is a monitored production mailbox and verify host mail delivery/authentication | Live end-to-end form test and mail deliverability |
| 7 | **Client logo permissions** — no client logos are used on the site; a logo wall is explicitly deferred pending files and separate permission | ⏸ Deferred | No current blocker while third-party marks remain absent |
| 8 | **Leadership profiles** — ✅ **RESOLVED 2026-10-24**: SES approved the full profiles. Biographies populated verbatim from statement pp. 4–5 (typographic normalization only: dehyphenation of PDF line breaks, dash spacing, "(2025 -2030)" → "(2025–2030)"); credential bylines confirmed as published — Musa: Pr Eng, PMP®, MBA, MEng, MSAICE, MSANCOLD, MWISA · Frans: Pr Eng, BEng (Civil), MSAICE; portraits live on home + /leadership. Bio rendering enforced by smoke check 9e | ✅ Resolved | — |
| 9 | **Case-study data** — client approved current published case-study content for public use on 2026-10-28; unresolved statement ambiguities Q1–Q4 are explicitly deferred and remain unasserted/unresolved | ✅ Current content approved; Q1–Q4 deferred | No current blocker for approved content; revise only if SES later resolves deferred questions |
| 10 | **Testimonials** | ⏸ Deferred — none supplied; no testimonials are published | No current blocker |
| 11 | **Contact details** — phones (+268) 2404 5512 / (+268) 7802 4964 (statement also lists +268 7906 1000 and SA +27 65 688 0826 / +27 86 607 7369), address and P O Box 7433 confirmed from statement p17 | ✅ From statement | Footer/contact page (publish after SES confirms approved version) |
| 12 | **Regional presence** — SES Engineering Solutions, 02 Bruton Road, Bryanston, Sandton, South Africa (statement p17) | ✅ From statement | Footer |
| 13 | **Unapproved third-party marks** — any client/partner logos not covered by item 7 must not appear anywhere | 🚫 Standing rule | Whole site |

| 14 | **Official SES brand guide** — verified HEX/CMYK specifications, vector, reversed/mono and compact logo variants | ⏸ Deferred — current approved design remains in use; primary amber is official, remaining token references are provisional (ADR-013) | Print-ready and alternate brand assets only |
| 15 | **Logo tagline vs `services.json` naming** — canonical naming confirmation is explicitly deferred; current approved site labels remain unchanged | ⏸ Deferred | No current blocker; revisit before future naming changes |
| 16 | **Monogram derivative** — resolved for header/footer by client directive 2026-10-22 (full official lockup displayed as supplied; `logo-ses.png` retired). The monogram now appears only inside the favicon/apple icon and OG card composition | ✅ Resolved by directive (2026-10-22) | — (favicon/OG composition unchanged) |
| 17 | **AI-generated creative assets (Higgsfield)** — non-documentary imagery only. Under ADR-023, generic AI-generated people may appear decoratively but must never be represented as SES employees or documentary project evidence. The official logo is never replaced. Each asset requires explicit approval and provenance entry in `docs/creative-proposals/README.md`. | ✅ Approved assets A, B, C2 and the engineering-background library are recorded with their usage; proposal C remains unused. |

## Gate 4 content freeze — approved with explicit deferrals (2026-10-28)

The client approved the current published content and currently assigned supplied project photos
for public use, directed that unresolved fields and unassigned assets be deferred, and approved
the current SES 2026 capability statement PDF for public download. The following remain deferred
and are not release blockers while the current approved content is unchanged:

- Q1–Q4 in the statement-verification list (MNWAP value scope, MR3 package relationship, Buy Cash
  client spelling, and the Water Reticulation/Inyatsi project reference).
- Canonical naming differences between the logo tagline and current service names.
- Unassigned USL RDO Office photography and any other unmatched assets.
- Client-logo wall and testimonials; neither is published.
- Remaining alternate/vector brand artwork; the currently approved site identity remains in use.

The configured enquiry recipient still requires production mailbox and mail-delivery verification
under Gate 5. This content approval does not authorize deployment.

## Verification notes from the capability statement (2026-10-21)

Discrepancies and ambiguities found during transcription — **do not resolve by invention; ask SES**.
Q1–Q4 are currently deferred by client direction (2026-10-28); the site retains only approved,
source-supported content and does not infer answers:

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
   ✅ RESOLVED 2026-10-24: SES approved the final credential wording — byline "BEng (Civil)" stands;
   the bio's full degree name is verbatim statement text. Both are now published.
6. **Cover address** ("Nedbank Centre, Swazi Plaza") vs p17 (full street + box) — p17 version used
   on site; cover is an abbreviated form. No action.
7. **Nsoko capacity** — reference says 13.34 MWp; photo caption says "13 MW". Use 13.34 MWp.
8. **Values page (p6) is graphical** — ✅ **RESOLVED 2026-10-24**: the page was rasterized
   (Windows.Data.Pdf render) and the graphical values transcribed verbatim — Futuristic ·
   Respect & Integrity · Playfulness · Participation — plus the "Socio-economic development"
   heading and its paragraph. Published on /about (values grid + SED block) and the home
   About card values line; the old placeholder chips (Integrity/Excellence/Collaboration/
   Sustainability/Professionalism) are retired. Verbatim wording and placeholder regression
   are enforced by smoke check 9i.

## Old-website reconciliation (appsystemsz.com/sibanyeengineering)

The old site is itself an Ander-styled rebuild carrying **unverified marketing copy**. Per Phase 4, only statement-corroborated items may be adopted:

- ✅ **Corroborated by the capability statement:** phone +268 7906 1000 (statement p17 also lists it — candidate third number, SES to confirm placement), email info@sibanyeengineering.com (website enquiry/contact address updated to corporate@sibanyeengineering.com per user direction 2026-10-28), Mbabane location, the four statistics *labels*.
- 🚫 **Not adopted (unverified):** taglines ("Engineering progress. Building possibility.", "Engineering solutions for a brighter Africa"), footer motto "We are one · Innovation · Inspire", Geotechnical Engineering as a service, "digital capability / BIM / GIS / data" claims, generic project cards, and the "0+" statistics values.
- 🚫 **Out of initial scope:** the old site's "Sibanye AI Assist" chatbot — a future enhancement per the commercial constraints.

## Photographic permissions note

Supplied or downloaded imagery may only be used where SES holds the rights or has written
permission from the project owner/client. Each project image must be cleared against item 3
before replacing its placeholder.
