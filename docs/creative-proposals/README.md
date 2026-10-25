# Creative proposals register (Higgsfield-generated; SES-approved where marked)

Generated imagery produced under the codified creative-asset policy (see
`docs/gate2-design-review.md` §5 and `docs/content-open-items.md` item 17):

- **Non-documentary decoration only** — abstract textures/backdrops. Never depicts,
  captions or implies real SES projects, people, clients, credentials or outcomes.
- **Never replaces or alters the official logo** (`public/SIBANYE-LOGO-(OFFICIAL).jpg`).
- **Per-asset SES approval required** before any site use; unapproved assets stay in
  this folder and are never referenced by site code.
- Tool: `higgsfield` CLI, FLUX.2 model (free plan), 1 credit per image. Generated
  2026-10-23 by the ses-visual-designer track via `higgsfield-generate`.

| Asset | Source job (FLUX.2) | Prompt intent | Intended slot | Policy screen | SES approval |
| --- | --- | --- | --- | --- | --- |
| `proposal-A-hero-contours-16x9.png` | `58334af9-9f3e-4f3c-a418-2722fa995b39` | Abstract topographic contour lines, thin elegant amber/gold strokes on warm near-black; no text, no logo, no people | CTA-band backdrop texture — **shipped 2026-10-24** | ✅ Abstract, on-palette, no text/logo/people | ✅ **Approved 2026-10-24** (client direction; ships as `public/images/creative/proposal-a-cta-contours.webp` via `build-hero-derivatives.mjs` job 10) |
| `proposal-B-hero-grid-16x9.png` | `6fbc42b1-9e87-4706-8832-b17d81b54a64` | Abstract technical blueprint grid, faint amber geometry on warm ink; no text, no logo, no people | Hero backdrop plate — **shipped 2026-10-24** | ⚠️ Abstract, no logo/people/legible claims; contains faint **illegible pseudo-annotations** (decorative gibberish) and stroke colour drifts olive vs official amber — **secondary variant only** | ✅ **Approved 2026-10-24** (client direction; ships as `public/images/hero/proposal-b-hero-grid-16x9.webp` — home hero backdrop) |

**Adoption status (2026-10-24):** both proposals approved by client direction and shipped through the ADR-022 path — register → approval → ≤700KB WebP derivative (`scripts/build-hero-derivatives.mjs`) → smoke guards (leak scan + presence/decoration checks). Derivative filenames deliberately avoid register/CDN tokens; smoke check 8 scans `dist/` for leakage of unapproved assets. Future generative assets must repeat this exact path before any site use.

CloudFront source URLs (may expire) are recoverable via `higgsfield generate list`
using the job IDs above.
