# Sibanye Engineering hero redesign

This package contains replacement Astro components for the home-page hero.

## Files
- `src/components/HomeHero.astro`
- `src/components/HeroBackdrop.astro`

## Apply
1. Create a branch in your local clone before changing files.
2. Replace the matching files with these versions.
3. Run `npm run build`.
4. Check the home page at desktop and mobile widths, especially text contrast and image crop.
5. The hero now uses the approved proposal-B blueprint plate
   (`public/images/hero/proposal-b-hero-grid-16x9.webp`) as the backdrop, with
   the Manzini Mall photo (`public/images/hero/manzini-mall-01.webp`) visible
   through the gear via the CSS mask in `public/images/gear-mask.svg`. ADR-021
   requires WebP derivatives only in `public/images` — raw sources live under
   `docs/` (plate: `docs/creative-proposals/`, photo: `docs/raw-photography/`).
   Regenerate both derivatives with `node scripts/build-hero-derivatives.mjs`
   (also the fix if OneDrive sync ever deletes a derivative). To feature a
   different frame through the gear, add its raw to `docs/raw-photography/`,
   extend the job list in `scripts/build-hero-derivatives.mjs`, and change the
   `src` of `.ses-hero__gear-photo` in `HomeHero.astro`.

## Important
These are source changes, not a verified deployment. I could read the public repository, but the connected GitHub integration rejected branch creation with HTTP 403, so I could not push or open a pull request directly.
