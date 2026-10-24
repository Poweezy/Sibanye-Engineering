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
   through the gear via the CSS mask in `public/images/gear-mask.svg`. The
   gear rotates like a porthole: `.ses-hero__gear-rotor` spins the masked
   window and the amber watermark in lockstep, while the photo
   counter-rotates at the same rate — the image appears pinned to the page
   and the sweeping window reveals different parts of it. Headline
   legibility is layered: the photo renders dimmed (`brightness(0.78)`),
   a radial "pool of shade" (`.ses-hero__copy::before`) paints above the
   gear but below the text, and headline/sub-copy carry soft text-shadows.
   ADR-021
   requires WebP derivatives only in `public/images` — raw sources live under
   `docs/` (plate: `docs/creative-proposals/`, photo: `docs/raw-photography/`).
   Regenerate both derivatives with `node scripts/build-hero-derivatives.mjs`
   (also the fix if OneDrive sync ever deletes a derivative). To feature a
   different frame through the gear, add its raw to `docs/raw-photography/`,
   extend the job list in `scripts/build-hero-derivatives.mjs`, and change the
   `src` of `.ses-hero__gear-photo` in `HomeHero.astro`.
6. Interior heroes can carry the same photography: `PageHero` accepts an
   optional `image` prop — the About page passes
   `/images/hero/engineers-golden-industrial-site.webp` and the Services page
   `/images/hero/sunset-industrial-blueprint.webp`, each rendered as a
   full-bleed, aria-hidden, non-interactive backdrop under `ink-950` gradient
   scrims so the eyebrow/title/intro keep full contrast. Their raw sources live
   under `docs/raw-photography/` (`engineers-golden-industrial-site.png`,
   `sunset-industrial-blueprint.png`); derivatives come from the same
   `node scripts/build-hero-derivatives.mjs` pipeline (jobs 3–4, 1600px wide,
   ≤700KB guard). Pages that omit `image` keep the plain blueprint band.
7. Leadership avatars use the same pipeline: raw portraits live in
   `docs/raw-photography/` and 400×400 square WebP derivatives render via the
   `LeaderAvatar` component — the photo when present, the initials circle as
   fallback — on the home and leadership cards. Current avatars: Musa
   Nkonyane (`musa-nkonyane.webp`, job 5) and Frans Pienaar
   (`frans-pienaar.webp`, job 6), both under `public/images/team/`.
8. Project photography works the same way: the projects collection takes an
   optional `image` field (WebP derivative under `/images/projects/`, e.g.
   `galp-fueling-station-forecourt.webp`, job 7, raw
   `docs/raw-photography/galp-fueling-station-forecourt.png`), rendered via
   the `ProjectImage` component — the photo when present, the engineering
   placeholder as fallback — on project cards (home carousel + `/projects/`)
   and the case-study pages.

## Important
These are source changes, not a verified deployment. I could read the public repository, but the connected GitHub integration rejected branch creation with HTTP 403, so I could not push or open a pull request directly.
