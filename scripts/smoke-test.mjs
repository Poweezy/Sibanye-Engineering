/**
 * SES website — post-build smoke test (artifact integrity gate).
 *
 * Verifies dist/ is complete and coherent after `astro build`:
 * route counts, sitemap/robots, the PHP endpoint, dotfile copy, brand assets
 * (official lockup per ADR-015), retired-asset regression guard, SEO meta on
 * key pages, the enquiry success-state handler, the official amber token in
 * compiled CSS, the AI-slop vocabulary guard (ADR-019), the rule that no
 * AI-generated asset is referenced by site code (ADR-018), and the hero
 * blueprint backdrop + gear porthole with foreground protection, payload and
 * raw-source (OneDrive resurrection) guards (ADR-021), interior hero
 * photo backdrops and the leadership profile photos (same ADR-021 pipeline).
 *
 * Zero dependencies. Exit 0 = all checks pass; exit 1 = failures listed.
 * Invoked by `npm test` (which runs the build first) — see package.json and
 * docs/HANDOVER.md §1.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');

const results = [];
const failures = [];
function check(name, ok, detail = '') {
  results.push({ name, ok });
  if (!ok) failures.push(`✗ ${name}${detail ? ` — ${detail}` : ''}`);
}

// 0. dist must exist — fail fast with a clear instruction.
if (!existsSync(DIST)) {
  console.error('FAIL dist/ not found — run `npm run build` first (or use `npm test`).');
  process.exit(1);
}

// 1. Route inventory — 38 index.html files (7 core + 9 services + 22 projects,
//    including their indexes) + 404.html = 39 routes.
const indexPages = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name === 'index.html') indexPages.push(p);
  }
};
walk(DIST);
check('route count (index.html files)', indexPages.length === 38, `found ${indexPages.length}, expected 38`);
check('404 page present', existsSync(join(DIST, '404.html')));

// 2. Infrastructure artifacts
check('sitemap-index.xml', existsSync(join(DIST, 'sitemap-index.xml')));
check('sitemap-0.xml', existsSync(join(DIST, 'sitemap-0.xml')));
const robots = existsSync(join(DIST, 'robots.txt')) ? readFileSync(join(DIST, 'robots.txt'), 'utf8') : '';
check('robots.txt references sitemap', /sitemap-index\.xml/i.test(robots));
check('api/enquiry.php shipped', existsSync(join(DIST, 'api', 'enquiry.php')));
check('.htaccess shipped (dotfile copy)', existsSync(join(DIST, '.htaccess')));

// 3. Brand assets — ADR-015: the official lockup is the only site logo.
for (const asset of [
  'logo-official.jpg',
  'favicon.png',
  'apple-touch-icon.png',
  'og.jpg',
  'SIBANYE-LOGO-(OFFICIAL).jpg',
]) {
  const p = join(DIST, asset);
  const ok = existsSync(p) && statSync(p).size > 1024;
  check(`asset ${asset}`, ok);
}
check('retired monogram absent (ADR-015 regression guard)', !existsSync(join(DIST, 'logo-ses.png')));
check('capability PDF shipped', existsSync(join(DIST, 'downloads', 'ses-capability-statement-2026.pdf')));

// 4. SEO meta on key pages — one core page, one service, one case study, contact.
const firstDir = (parent) =>
  readdirSync(join(DIST, parent), { withFileTypes: true }).find((e) => e.isDirectory())?.name;
const servicePage = firstDir('services');
const caseStudy = firstDir('projects');
const metaTargets = [
  'index.html',
  join('about', 'index.html'),
  servicePage ? join('services', servicePage, 'index.html') : null,
  caseStudy ? join('projects', caseStudy, 'index.html') : null,
  join('contact', 'index.html'),
].filter(Boolean);
for (const rel of metaTargets) {
  const html = readFileSync(join(DIST, rel), 'utf8');
  check(`canonical on ${rel}`, html.includes('rel="canonical"'));
  check(`og:image on ${rel}`, html.includes('property="og:image"') && html.includes('/og.jpg'));
}
const homeHtml = readFileSync(join(DIST, 'index.html'), 'utf8');
check(
  'large social-card meta (1200×630, summary_large_image)',
  homeHtml.includes('og:image:width" content="1200"') && homeHtml.includes('summary_large_image'),
);

// 5. Enquiry form surface + compiled success-state handler.
const contactHtml = readFileSync(join(DIST, 'contact', 'index.html'), 'utf8');
check(
  'enquiry form anchor + status element on contact',
  contactHtml.includes('id="enquiry"') && contactHtml.includes('data-form-status'),
);
const astroDir = join(DIST, '_astro');
const jsFiles = existsSync(astroDir) ? readdirSync(astroDir).filter((f) => f.endsWith('.js')) : [];
// Astro inlines small component scripts into the page HTML and emits larger
// ones as _astro/*.js modules — the handler is legitimate in either place.
// Signature: reads the `sent` query param via URLSearchParams (quoted literal).
const hasHandler = (s) => s.includes('URLSearchParams') && /(["'])sent\1/.test(s);
const handlerInBundles = jsFiles.some((f) => hasHandler(readFileSync(join(astroDir, f), 'utf8')));
check(
  'enquiry success-state handler compiled (inline or bundle)',
  hasHandler(contactHtml) || handlerInBundles,
);

// 6. Token sanity in compiled CSS — official amber present, retired teal absent.
const cssFiles = existsSync(astroDir) ? readdirSync(astroDir).filter((f) => f.endsWith('.css')) : [];
const cssText = cssFiles.map((f) => readFileSync(join(astroDir, f), 'utf8')).join('');
check('official amber #D69C1F in compiled CSS', cssFiles.length > 0 && cssText.toLowerCase().includes('#d69c1f'));
check('retired teal #2FB7C2 absent (retheme regression guard)', !cssText.toLowerCase().includes('#2fb7c2'));

// 7. Copy integrity — AI-slop vocabulary guard (ADR-019).
// Scans every built page for filler/AI-flavoured marketing vocabulary. The SES
// mission statement ("cutting-edge and innovative solutions…") is verbatim
// client copy and deliberately NOT on this list — protected per ADR-019.
const slopPatterns = [
  ['seamless', /seamless/i],
  ['delve', /\bdelve\b/i],
  ['elevate/elevating', /\belevat(e|ing)\b/i],
  ['unlock/unlocking', /\bunlock(ing)?\b/i],
  ['game-changer', /game-?chang/i],
  ['revolutionize', /revolutioniz/i],
  ['world-class', /world-class/i],
  ['award-winning', /award-winning/i],
];
const pageHtmls = indexPages.map((p) => [p, readFileSync(p, 'utf8')]);
for (const [label, re] of slopPatterns) {
  const hit = pageHtmls.find(([, html]) => re.test(html));
  check(`copy guard: "${label}" absent from all pages`, !hit, hit ? `found in ${hit[0]}` : '');
}

// 8. AI-generated assets never referenced by site code (ADR-018 boundary,
//    machine-checked): Higgsfield proposals live under docs/ only.
const aiAssetHits = pageHtmls.filter(([, html]) =>
  /higgsfield|creative-proposals|cloudfront/i.test(html),
);
check(
  'no AI-generated asset references in dist (ADR-018)',
  aiAssetHits.length === 0,
  aiAssetHits.map(([p]) => p).join(', '),
);

// 9. Hero blueprint plate + gear porthole (ADR-021) — approved proposal-B
//    plate as the backdrop, supplied Manzini Mall photography showing through
//    the gear mask, protected foreground, lean payload, intact gear watermark.
check(
  'hero blueprint backdrop (proposal-B plate) on home',
  homeHtml.includes('hero-backdrop') && homeHtml.includes('proposal-b-hero-grid-16x9.webp'),
);
check(
  'hero gear porthole with supplied photography on home',
  homeHtml.includes('ses-hero__gear-rotor') &&
    homeHtml.includes('ses-hero__gear-photo') &&
    homeHtml.includes('manzini-mall-01.webp') &&
    homeHtml.includes('gear-mask.svg'),
);
check(
  'gear window sweeps over a stationary photo (rotor spin + reverse counter-spin)',
  /gear-spin\s+90s\s+linear\s+infinite\s+reverse/.test(homeHtml) &&
    /gear-spin\s+90s\s+linear\s+infinite(?! reverse)/.test(homeHtml),
);
check(
  'hero copy shield + dimmed porthole photo (headline legibility)',
  // esbuild minifies ::before to :before and brightness(0.78) to brightness(.78)
  homeHtml.includes(':before') && /brightness\(\.?78\)/.test(homeHtml),
);
check(
  'hero backdrop non-interactive (pointer-events-none, aria-hidden)',
  homeHtml.includes('pointer-events-none') && homeHtml.includes('aria-hidden'),
);
check(
  'moving gear watermark intact (ADR-021 foreground protection)',
  homeHtml.includes('gear-watermark') && cssText.includes('gear-spin'),
);
const oversized = [];
const walkImgs = (dir) => {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walkImgs(p);
    else if (statSync(p).size > 700 * 1024) oversized.push(p.replace(ROOT, ''));
  }
};
walkImgs(join(DIST, 'images'));
check(
  'no oversized raw photos in dist (ADR-021 payload guard ≤700KB)',
  oversized.length === 0,
  oversized.join(', '),
);

// 9b. OneDrive resurrection guard (ADR-021): the sync folder has already
//     resurrected deleted raws into public/images once — raw source
//     photographs must never ship from there, WebP derivatives only.
const rawSrc = [];
const walkRaw = (dir) => {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walkRaw(p);
    else if (/\.(jpe?g|png|tiff?|bmp)$/i.test(entry.name)) rawSrc.push(p.replace(ROOT, ''));
  }
};
walkRaw(join(ROOT, 'public', 'images'));
check(
  'no raw source photographs in public/images (OneDrive resurrection guard)',
  rawSrc.length === 0,
  rawSrc.join(', '),
);

// 9c. Interior hero photo backdrops (ADR-021 pipeline): supplied photography on
//     PageHero pages — decorative and non-interactive on each.
const heroPhotoPages = [
  ['about', 'engineers-golden-industrial-site.webp'],
  ['services', 'sunset-industrial-blueprint.webp'],
];
for (const [page, file] of heroPhotoPages) {
  const html = readFileSync(join(DIST, page, 'index.html'), 'utf8');
  const img = new RegExp(`<img[^>]*${file}[^>]*>`).exec(html)?.[0] ?? '';
  check(
    `${page} hero photo backdrop (decorative, non-interactive)`,
    img !== '' && img.includes('aria-hidden') && img.includes('pointer-events-none'),
  );
}

// 9d. Leadership profile photos (ADR-021 pipeline): avatar images on the home
//     and leadership pages — real content images with descriptive alts.
const leadershipHtml = readFileSync(join(DIST, 'leadership', 'index.html'), 'utf8');
const avatarExpectations = [
  ['musa-nkonyane.webp', 'Portrait of Nkonyane Musa'],
  ['frans-pienaar.webp', 'Portrait of Frans Pienaar'],
];
for (const [file, alt] of avatarExpectations) {
  const pattern = new RegExp(`<img[^>]*${file.replace('.', '\\.')}[^>]*>`);
  const homeImg = pattern.exec(homeHtml)?.[0] ?? '';
  const leadershipImg = pattern.exec(leadershipHtml)?.[0] ?? '';
  check(
    `leadership avatar (${alt}) on home + leadership page`,
    homeImg !== '' &&
      leadershipImg !== '' &&
      homeImg.includes(`alt="${alt}"`) &&
      leadershipImg.includes(`alt="${alt}"`),
  );
}

// 9e. Leadership biographies (approved SES copy — statement pp. 4–5) render on
//     /leadership; populated bios must never regress to placeholder cards.
const bioMarkers = [
  'public private partnership specialist',
  'IDP (2025–2030) for Manzini Municipality',
  'Inyatsi Construction Group Chairman',
  'Institute of Directors in Southern Africa',
];
const missingBios = bioMarkers.filter((m) => !leadershipHtml.includes(m));
check(
  'leadership biographies rendered from approved statement text',
  missingBios.length === 0,
  missingBios.join(' | '),
);

// 9f. Project photography (ADR-021 pipeline): each photo-carrying project
//     renders its derivative with a descriptive alt on the projects index
//     and its own case-study page.
const projectsIndexHtml = readFileSync(join(DIST, 'projects', 'index.html'), 'utf8');
for (const [id, webp, alt] of [
  ['galp-fuel-station-forecourt', 'galp-fueling-station-forecourt\\.webp', 'GALP Fueling Station Forecourt'],
  ['healing-power-church', 'healing-power-church\\.webp', 'Healing Power Church (HPC)'],
]) {
  const pageHtml = readFileSync(join(DIST, 'projects', id, 'index.html'), 'utf8');
  const imgIndex = new RegExp(`<img[^>]*${webp}[^>]*>`).exec(projectsIndexHtml)?.[0] ?? '';
  const imgPage = new RegExp(`<img[^>]*${webp}[^>]*>`).exec(pageHtml)?.[0] ?? '';
  check(
    `${alt} photo on projects index + case-study page (descriptive alt)`,
    imgIndex !== '' && imgPage !== '' && imgIndex.includes(`alt="${alt}"`) && imgPage.includes(`alt="${alt}"`),
  );
}

// Result -------------------------------------------------------------------
const passed = results.filter((r) => r.ok).length;
console.log(`SES smoke test — ${passed}/${results.length} checks passed (${indexPages.length} pages scanned in dist/).`);
if (failures.length > 0) {
  console.error('\nFailures:');
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log('✓ Artifact integrity verified.');
