/**
 * SES logo processing pipeline.
 *
 * Source: public/logo.png (supplied by SES 2026-10-21 — official mark).
 * Issue:  the supplied raster carries an opaque olive/orange sunburst
 *         background and upscaling artefacts, so it cannot be placed
 *         directly on the site's dark navy surfaces.
 *
 * Strategy (non-destructive — the original file is never modified):
 *  1. Load raw RGBA.
 *  2. Knockout pass — remove warm, saturated background pixels
 *     (olive/orange/gold family). The mark itself is neutral
 *     (black letters, silver gear, navy outlines) and survives.
 *  3. Fringe pass — drop warm halo pixels adjacent to transparency.
 *  4. Despeckle — remove isolated survivors.
 *  5. Erase the small secondary gear (top-right) so the favicon crops clean.
 *  6. Manual alpha bounding-box trim.
 *  7. Emit: public/logo-ses.png (web, h=360) and public/favicon.png
 *     (gear mark on white chip, 128px) + public/apple-touch-icon.png (180px).
 *
 * If SES later supplies vector artwork (AI/EPS/SVG/PDF), replace these
 * derivatives — see docs/content-open-items.md item 4.
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const SRC = fileURLToPath(new URL('../public/logo.png', import.meta.url));
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

// 4) Erase the small secondary gear (top-right) for a clean favicon crop
for (let y = 0; y < H; y++) {
  for (let x = Math.round(W * 0.63); x < W; x++) {
    if (y < Math.round(H * 0.3)) data[px(x, y) + 3] = 0;
  }
}

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

// 6) Web logo — full lockup
const logoBox = bbox();
const logo = await raw(data, W, H).extract(logoBox).png().toBuffer();
await sharp(logo).resize({ height: 360 }).png({ compressionLevel: 9 }).toFile('public/logo-ses.png');

// 7) Favicon — main gear mark on a white chip
const gearLeft = Math.round(W * 0.215);
const gearWidth = Math.round(W * 0.49);
const gearBuf = await raw(data, W, H)
  .extract({ left: gearLeft, top: 0, width: gearWidth, height: H })
  .png()
  .toBuffer();
const g = await sharp(gearBuf).raw().toBuffer({ resolveWithObject: true });
const GW = g.info.width;
const GH = g.info.height;
removeSmallComponents(g.data, GW, GH, 1500);

let gx0 = GW;
let gy0 = GH;
let gx1 = -1;
let gy1 = -1;
for (let y = 0; y < GH; y++) {
  for (let x = 0; x < GW; x++) {
    if (g.data[(y * GW + x) * 4 + 3] > 8) {
      if (x < gx0) gx0 = x;
      if (x > gx1) gx1 = x;
      if (y < gy0) gy0 = y;
      if (y > gy1) gy1 = y;
    }
  }
}
const gearBox = { left: gx0, top: gy0, width: gx1 - gx0 + 1, height: gy1 - gy0 + 1 };
const gearTrim = await sharp(g.data, { raw: { width: GW, height: GH, channels: 4 } })
  .extract(gearBox)
  .png()
  .toBuffer();

const chip = (size) =>
  sharp(gearTrim)
    .resize({ width: size, height: size, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .flatten({ background: '#ffffff' })
    .png({ compressionLevel: 9 });

await chip(128).toFile('public/favicon.png');
await chip(180).toFile('public/apple-touch-icon.png');

console.log(
  JSON.stringify(
    {
      source: { width: W, height: H },
      logo: { box: logoBox, out: 'public/logo-ses.png', height: 360 },
      gear: { box: gearBox },
      favicon: 'public/favicon.png (128)',
      appleTouchIcon: 'public/apple-touch-icon.png (180)',
    },
    null,
    2,
  ),
);
