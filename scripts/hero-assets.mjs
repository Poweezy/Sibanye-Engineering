/**
 * hero-assets.mjs — Stage 1 of the hero-backdrop milestone.
 * Idempotent: enumerates the supplied photographs (public/images and
 * source-photos), generates lean WebP derivatives for the site backdrop into
 * public/images/hero/, and builds one contact sheet for the visual
 * documentary-integrity review. Originals are NEVER modified.
 */
import sharp from 'sharp';
import { readdirSync, statSync, mkdirSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';

const ROOT = 'c:/Users/nsiba/OneDrive/Documents/Sibanye Engineering';
const SRC_DIRS = [join(ROOT, 'public/images'), join(ROOT, 'source-photos')];
const OUT_DIR = join(ROOT, 'public/images/hero');
const SHEET = join(ROOT, 'docs/creative-proposals/photo-contact-sheet.jpg');

const collect = () => {
  const byName = new Map();
  for (const dir of SRC_DIRS) {
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir)) {
      if (!/\.jpe?g$/i.test(f) || f.startsWith('.')) continue;
      const full = join(dir, f);
      const st = statSync(full);
      if (!st.isFile() || st.size < 200000) continue; // ignore thumbnails
      if (!byName.has(f)) byName.set(f, full);
    }
  }
  const nat = (n) => {
    const m = n.match(/\((\d+)\)/);
    const base = n.replace(/\.[^.]+$/, '').replace(/\s*\(\d+\)$/, '');
    return m ? [base, Number(m[1])] : [base, 0];
  };
  return [...byName.entries()]
    .sort((a, b) => {
      const [an, ai] = nat(a[0]);
      const [bn, bi] = nat(b[0]);
      return an.localeCompare(bn) || ai - bi;
    })
    .map(([, p]) => p);
};

(async () => {
  mkdirSync(OUT_DIR, { recursive: true });
  const photos = collect();
  if (photos.length === 0) {
    console.log(JSON.stringify({ error: 'no source photos found in public/images or source-photos' }));
    process.exit(1);
  }
  const outs = [];
  let total = 0;
  for (let i = 0; i < photos.length; i++) {
    const out = join(OUT_DIR, `manzini-mall-${String(i + 1).padStart(2, '0')}.webp`);
    await sharp(photos[i])
      .rotate() // honour EXIF orientation
      .resize({ width: 2048, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(out);
    total += statSync(out).size;
    outs.push(basename(out));
  }
  // Contact sheet — one small image for the documentary-integrity review
  const TW = 360;
  const cols = 3;
  const thumbs = [];
  for (const p of photos) {
    thumbs.push(await sharp(p).rotate().resize({ width: TW }).toBuffer());
  }
  const metas = await Promise.all(thumbs.map((t) => sharp(t).metadata()));
  const rows = Math.ceil(photos.length / cols);
  const cellH = Math.max(...metas.map((m) => m.height ?? 0));
  await sharp({
    create: {
      width: TW * cols + 8 * (cols + 1),
      height: cellH * rows + 8 * (rows + 1),
      channels: 3,
      background: { r: 18, g: 16, b: 15 },
    },
  })
    .composite(thumbs.map((t, i) => ({
      input: t,
      left: 8 + (i % cols) * (TW + 8),
      top: 8 + Math.floor(i / cols) * (cellH + 8),
    })))
    .jpeg({ quality: 72 })
    .toFile(SHEET);
  console.log(JSON.stringify({
    photos: photos.length,
    derivatives: outs.length,
    totalKB: Math.round(total / 1024),
    sheet: 'docs/creative-proposals/photo-contact-sheet.jpg',
    files: outs,
  }));
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });