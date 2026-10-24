// Generate the hero WebP derivatives from the raw sources under docs/
// (ADR-021: WebP derivatives only in public/images, each ≤700KB).
//
//   1. Blueprint plate — docs/creative-proposals/proposal-B-hero-grid-16x9.png
//      → public/images/hero/proposal-b-hero-grid-16x9.webp
//   2. Gear-porthole photo — docs/raw-photography/manzini-mall-01.jpg
//      → public/images/hero/manzini-mall-01.webp (1200px wide, for the ≤820px
//        gear window at 1–2× device pixel ratio)
//
// OneDrive has repeatedly resurrected/deleted files in public/images/hero, so
// re-run this script (`node scripts/build-hero-derivatives.mjs`) if a
// derivative ever goes missing.
import sharp from 'sharp';

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
];

for (const { src, out, resize, webp } of jobs) {
  let pipeline = sharp(src);
  if (resize) pipeline = pipeline.resize(resize);
  const info = await pipeline.webp(webp).toFile(out);
  console.log(`wrote ${out} — ${info.size} bytes (${info.width}x${info.height})`);
  if (info.size > GUARD) {
    console.error(`ERROR: ${out} exceeds the ADR-021 ${GUARD / 1024}KB payload guard`);
    process.exit(1);
  }
}
