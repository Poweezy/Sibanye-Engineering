/**
 * SES logo processing pipeline.
 *
 * Source: public/SIBANYE-LOGO-(OFFICIAL).jpg — official lockup supplied by SES
 *         on 2026-10-22 (2160×1088 JPG: black "S…S" lettering with a silver 3D
 *         gear as the E, on a flat amber field sampled at #D69C1F).
 *         Supersedes the 2026-10-21 capability-statement mark (public/logo.png,
 *         now retained as an archive reference only).
 *
 * Strategy (non-destructive — the original file is never modified):
 *  1. Load raw RGBA.
 *  2. Knockout pass — remove the flat amber field (warm, saturated pixels).
 *     The artwork itself is neutral (black letters, silver gear) and survives.
 *  3. Fringe pass — drop warm halo pixels adjacent to transparency.
 *  4. Despeckle — remove isolated survivors and tiny stray components.
 *  5. Monogram crop — extract the S-gear-S emblem band (calibrated 2026-10-22
 *     by pixel-density scan: x≈496–1576, y≈16–766) and alpha-trim.
 *  6. Emit: public/logo-ses.png (web monogram, h=360), public/favicon.png and
 *     public/apple-touch-icon.png (monogram on the official amber chip), and
 *     public/og.jpg (1200×630 social card composed from the real monogram and
 *     wordmark strips on the amber field — no third-party fonts involved).
 *
 * If SES later supplies vector artwork (AI/EPS/SVG/PDF), replace these
 * derivatives — see docs/content-open-items.md item 4.
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const SRC = fileURLToPath(new URL('../public/SIBANYE-LOGO-(OFFICIAL).jpg', import.meta.url));
const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
const px = (x, y) => (y * W + x) * 4;

const isWarm = (r, g, b, satMin) => {
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  return mx - mn > satMin && r > b + 12 && g > b + 6;
};

// 1) Knockout: warm saturated background
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = px(x, y);
    if (isWarm(data[i], data[i + 1], data[i + 2], 30)) data[i + 3] = 0;
  }
}

// 2) Fringe cleanup: warm halo pixels touching transparency
{
  const snapshot = Buffer.from(data);
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const i = px(x, y);
      if (snapshot[i + 3] === 0) continue;
      if (!isWarm(snapshot[i], snapshot[i + 1], snapshot[i + 2], 14)) continue;
      let transparent = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          if (snapshot[px(x + dx, y + dy) + 3] === 0) transparent++;
        }
      }
      if (transparent >= 2) data[i + 3] = 0;
    }
  }
}

// 3) Despeckle: isolated opaque pixels
{
  const snapshot = Buffer.from(data);
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const i = px(x, y);
      if (snapshot[i + 3] === 0) continue;
      let opaque = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          if (snapshot[px(x + dx, y + dy) + 3] !== 0) opaque++;
        }
      }
      if (opaque === 0) data[i + 3] = 0;
    }
  }
}

// 4) The official 2026-10-22 artwork needs no secondary-gear erasure — the
//    favicon is now the full monogram on an amber chip (see emit section).

// Red/maroon debris pass (saturation peak in the red channel)
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = px(x, y);
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const mx = Math.max(r, g, b);
    const mn = Math.min(r, g, b);
    if (mx - mn > 45 && r > g + 25) data[i + 3] = 0;
  }
}

// Connected-component cleanup: drop detached fragments smaller than the
// brand elements (debris ticks, dots, crop-edge slivers).
const removeSmallComponents = (buf, w, h, minArea) => {
  const seen = new Uint8Array(w * h);
  const stack = new Int32Array(w * h);
  const at = (x, y) => y * w + x;
  for (let y0 = 0; y0 < h; y0++) {
    for (let x0 = 0; x0 < w; x0++) {
      const start = at(x0, y0);
      if (seen[start] || buf[start * 4 + 3] === 0) continue;
      let top = 0;
      stack[top++] = start;
      seen[start] = 1;
      const comp = [];
      while (top > 0) {
        const idx = stack[--top];
        comp.push(idx);
        const x = idx % w;
        const y = (idx - x) / w;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
            const n = at(nx, ny);
            if (seen[n] || buf[n * 4 + 3] === 0) continue;
            seen[n] = 1;
            stack[top++] = n;
          }
        }
      }
      if (comp.length < minArea) for (const idx of comp) buf[idx * 4 + 3] = 0;
    }
  }
};

removeSmallComponents(data, W, H, 2000);

// 5) Manual alpha bounding-box trim
const bbox = () => {
  let minX = W, minY = H, maxX = -1, maxY = -1;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (data[px(x, y) + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
};

const raw = (buf, w, h) => sharp(buf, { raw: { width: w, height: h, channels: 4 } });

const AMBER = { r: 214, g: 156, b: 31 }; // official field colour sampled from the supplied JPG

// Trim helper: alpha bounding box of an arbitrary raw buffer
const alphaBBox = (buf, w, h) => {
  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (buf[(y * w + x) * 4 + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
};

// 6) Monogram — the S-gear-S emblem band for header/footer use
const monoCrop = { left: 470, top: 0, width: 1130, height: 785 };
const monoBuf = await raw(data, W, H).extract(monoCrop).png().toBuffer();
const m = await sharp(monoBuf).raw().toBuffer({ resolveWithObject: true });
removeSmallComponents(m.data, m.info.width, m.info.height, 1200);
const monoBox = alphaBBox(m.data, m.info.width, m.info.height);
const monogram = await sharp(m.data, { raw: { width: m.info.width, height: m.info.height, channels: 4 } })
  .extract(monoBox)
  .png()
  .toBuffer();
await sharp(monogram)
  .resize({ height: 360 })
  .png({ compressionLevel: 9 })
  .toFile('public/logo-ses.png');

// 7) Favicon + Apple touch icon — monogram centred on the official amber chip
const chip = (size, inset) => {
  const inner = Math.round(size * inset);
  const pad = Math.round((size - inner) / 2);
  return sharp(monogram)
    .resize({ width: inner, height: inner, fit: 'contain', background: { ...AMBER, alpha: 1 } })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { ...AMBER, alpha: 1 } })
    .flatten({ background: AMBER })
    .png({ compressionLevel: 9 });
};

await chip(128, 0.84).toFile('public/favicon.png');
await chip(180, 0.84).toFile('public/apple-touch-icon.png');

// 8) Open Graph card — 1200×630, composed entirely from the real artwork
const stripBuf = await raw(data, W, H)
  .extract({ left: 0, top: 795, width: W, height: 145 }) // wordmark band (rows ≈824–920)
  .png()
  .toBuffer();
const s = await sharp(stripBuf).raw().toBuffer({ resolveWithObject: true });
removeSmallComponents(s.data, s.info.width, s.info.height, 800);
const stripBox = alphaBBox(s.data, s.info.width, s.info.height);
const stripTrim = await sharp(s.data, { raw: { width: s.info.width, height: s.info.height, channels: 4 } })
  .extract(stripBox)
  .png()
  .toBuffer();

const stripResized = await sharp(stripTrim).resize({ width: 1000 }).png().toBuffer();
const stripMeta = await sharp(stripResized).metadata();
const monoScaled = await sharp(monogram).resize({ height: 330 }).png().toBuffer();
const monoMeta = await sharp(monoScaled).metadata();
const inkBar = await sharp({
  create: { width: 1200, height: 12, channels: 4, background: { r: 18, g: 16, b: 15, alpha: 1 } },
})
  .png()
  .toBuffer();

const monoY = 64;
const stripY = monoY + 330 + 44;
await sharp({
  create: { width: 1200, height: 630, channels: 4, background: { ...AMBER, alpha: 1 } },
})
  .composite([
    { input: monoScaled, left: Math.round((1200 - monoMeta.width) / 2), top: monoY },
    { input: stripResized, left: Math.round((1200 - stripMeta.width) / 2), top: stripY },
    { input: inkBar, left: 0, top: 618 },
  ])
  .jpeg({ quality: 90 })
  .toFile('public/og.jpg');

const outMeta = await sharp('public/logo-ses.png').metadata();
console.log(
  JSON.stringify(
    {
      source: { width: W, height: H, amber: '#D69C1F' },
      monogram: { crop: monoCrop, box: monoBox },
      logo: { out: 'public/logo-ses.png', width: outMeta.width, height: outMeta.height },
      favicon: 'public/favicon.png (128, amber chip)',
      appleTouchIcon: 'public/apple-touch-icon.png (180, amber chip)',
      og: 'public/og.jpg (1200×630)',
    },
    null,
    2,
  ),
);
