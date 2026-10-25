// Generate the hero WebP derivatives from the raw sources under docs/
// (ADR-021: WebP derivatives only in public/images, each ≤700KB).
//
//   1. Blueprint plate — docs/creative-proposals/proposal-B-hero-grid-16x9.png
//      → public/images/hero/proposal-b-hero-grid-16x9.webp
//   2. Gear-porthole photo — docs/raw-photography/manzini-mall-01.jpg
//      → public/images/hero/manzini-mall-01.webp (1200px wide, for the ≤820px
//        gear window at 1–2× device pixel ratio)
//   3. About-hero photo — docs/raw-photography/engineers-golden-industrial-site.png
//      → public/images/hero/engineers-golden-industrial-site.webp (1600px wide
//        full-bleed backdrop for the PageHero band on /about)
//   4. Services-hero photo — docs/raw-photography/sunset-industrial-blueprint.png
//      → public/images/hero/sunset-industrial-blueprint.webp (1600px wide
//        full-bleed backdrop for the PageHero band on /services)
//   5. Leadership portrait — docs/raw-photography/musa-nkonyane-profile.jpg
//      → public/images/team/musa-nkonyane.webp (400×400 square, attention
//        crop, avatar for the leadership cards on home + /leadership)
//   6. Leadership portrait — docs/raw-photography/frans-pienaar-profile.png
//      → public/images/team/frans-pienaar.webp (400×400 square, attention
//        crop, avatar for the leadership cards on home + /leadership)
//   7. Project photo — docs/raw-photography/galp-fueling-station-forecourt.png
//      → public/images/projects/galp-fueling-station-forecourt.webp (1600px
//        wide, GALP forecourt photo for the project card + case-study page)
//   8. Project photo — docs/raw-photography/healing-power-church.jpg
//      → public/images/projects/healing-power-church.webp (1600px wide, HPC
//        church structure photo for the project card + case-study page)
//   9. Project photo — docs/raw-photography/manzini-mall-original.webp
//      (8192×6144 original, preserved here after a OneDrive resurrection)
//      → public/images/projects/manzini-mall.webp (1600px wide, Manzini Mall
//        photo for the project card + case-study page)
//  10. CTA-band texture — docs/creative-proposals/proposal-A-hero-contours-16x9.png
//      (approved generative asset, register job 58334af9, ADR-022)
//      → public/images/creative/proposal-a-cta-contours.webp (full-bleed
//        decorative backdrop for the CtaBand, screen-blended; the output name
//        deliberately avoids register/CDN tokens — smoke check 8)
//
// OneDrive has repeatedly resurrected/deleted files in public/images/hero, so
// re-run this script (`node scripts/build-hero-derivatives.mjs`) if a
// derivative ever goes missing.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const GUARD = 700 * 1024;
const jobs = [
  {
    src: 'docs/creative-proposals/proposal-B-hero-grid-16x9.png',
    out: 'public/images/hero/proposal-b-hero-grid-16x9.webp',
    webp: { quality: 85 },
  },
  {
    src: 'docs/raw-photography/manzini-mall-01.jpg',
    out: 'public/images/hero/manzini-mall-01.webp',
    resize: { width: 1200, withoutEnlargement: true },
    webp: { quality: 82 },
  },
  {
    src: 'docs/raw-photography/engineers-golden-industrial-site.png',
    out: 'public/images/hero/engineers-golden-industrial-site.webp',
    resize: { width: 1600, withoutEnlargement: true },
    webp: { quality: 82 },
  },
  {
    src: 'docs/raw-photography/sunset-industrial-blueprint.png',
    out: 'public/images/hero/sunset-industrial-blueprint.webp',
    resize: { width: 1600, withoutEnlargement: true },
    webp: { quality: 82 },
  },
  {
    src: 'docs/raw-photography/musa-nkonyane-profile.jpg',
    out: 'public/images/team/musa-nkonyane.webp',
    resize: { width: 400, height: 400, fit: 'cover', position: 'attention' },
    webp: { quality: 82 },
  },
  {
    src: 'docs/raw-photography/frans-pienaar-profile.png',
    out: 'public/images/team/frans-pienaar.webp',
    resize: { width: 400, height: 400, fit: 'cover', position: 'attention' },
    webp: { quality: 82 },
  },
  {
    src: 'docs/raw-photography/galp-fueling-station-forecourt.png',
    out: 'public/images/projects/galp-fueling-station-forecourt.webp',
    resize: { width: 1600, withoutEnlargement: true },
    webp: { quality: 82 },
  },
  {
    src: 'docs/raw-photography/healing-power-church.jpg',
    out: 'public/images/projects/healing-power-church.webp',
    resize: { width: 1600, withoutEnlargement: true },
    webp: { quality: 82 },
  },
  {
    src: 'docs/raw-photography/manzini-mall-original.webp',
    out: 'public/images/projects/manzini-mall.webp',
    resize: { width: 1600, withoutEnlargement: true },
    webp: { quality: 82 },
  },
  {
    src: 'docs/creative-proposals/proposal-A-hero-contours-16x9.png',
    out: 'public/images/creative/proposal-a-cta-contours.webp',
    webp: { quality: 85 },
  },
];

for (const { src, out, resize, webp } of jobs) {
  let pipeline = sharp(src);
  if (resize) pipeline = pipeline.resize(resize);
  mkdirSync(dirname(out), { recursive: true }); // sharp does not create folders
  const info = await pipeline.webp(webp).toFile(out);
  console.log(`wrote ${out} — ${info.size} bytes (${info.width}x${info.height})`);
  if (info.size > GUARD) {
    console.error(`ERROR: ${out} exceeds the ADR-021 ${GUARD / 1024}KB payload guard`);
    process.exit(1);
  }
}
