/**
 * SES website — post-build smoke test (artifact integrity gate).
 *
 * Verifies dist/ is complete and coherent after `astro build`:
 * route counts, sitemap/robots, the PHP endpoint, dotfile copy, brand assets
 * (official lockup per ADR-015), retired-asset regression guard, SEO meta on
 * key pages, the enquiry success-state handler, the official amber token in
 * compiled CSS, the AI-slop vocabulary guard (ADR-019), the no-unapproved-
 * AI-asset leakage guard (ADR-018), and the hero
 * raw-source (OneDrive resurrection) guards (ADR-021), interior hero
 * photo backdrops and the leadership profile photos (same ADR-021 pipeline),
 * plus engineering imagery on service/sector cards and service detail heroes,
 * motion polish (count-up stats, staggered grid reveals, card zoom)
 * and the SES values wording transcribed from capability statement p. 6 (9i).
 *
 * The CSP script hashes are checked against each emitted inline module so
 * restrictive production headers cannot silently disable client behaviour.
 *
 * Zero dependencies. Exit 0 = all checks pass; exit 1 = failures listed.
 * Invoked by `npm test` (which runs the build first) — see package.json and
 * docs/HANDOVER.md §1.
 */
import { createHash } from 'node:crypto';
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

// 1. Route inventory — 39 index.html files (7 core + 9 services + 22 projects,
//    including their indexes, plus privacy) + 404.html = 40 routes.
const indexPages = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name === 'index.html') indexPages.push(p);
  }
};
walk(DIST);
check('route count (index.html files)', indexPages.length === 39, `found ${indexPages.length}, expected 39`);
check('404 page present', existsSync(join(DIST, '404.html')));

// 2. Infrastructure artifacts
check('sitemap-index.xml', existsSync(join(DIST, 'sitemap-index.xml')));
check('sitemap-0.xml', existsSync(join(DIST, 'sitemap-0.xml')));
const robots = existsSync(join(DIST, 'robots.txt')) ? readFileSync(join(DIST, 'robots.txt'), 'utf8') : '';
check('robots.txt references sitemap', /sitemap-index\.xml/i.test(robots));
check('api/enquiry.php shipped', existsSync(join(DIST, 'api', 'enquiry.php')));
check('.htaccess shipped (dotfile copy)', existsSync(join(DIST, '.htaccess')));
const apacheConfig = readFileSync(join(DIST, '.htaccess'), 'utf8');
const csp = apacheConfig.match(/Content-Security-Policy\s+"([^"]+)"/i)?.[1] ?? '';
const scriptSrc = csp.match(/(?:^|;)\s*script-src\s+([^;]+)/i)?.[1] ?? '';
const htmlFiles = [...indexPages, join(DIST, '404.html')];
const inlineModuleHashes = new Set();
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  for (const [, attributes, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\bsrc\s*=/.test(attributes) || !/\btype="module"/i.test(attributes)) continue;
    inlineModuleHashes.add(
      `'sha256-${createHash('sha256').update(body).digest('base64')}'`,
    );
  }
}
const missingCspHashes = [...inlineModuleHashes].filter((hash) => !csp.includes(hash));
check(
  'CSP allows exact inline module scripts without unsafe-inline',
  inlineModuleHashes.size > 0 &&
    missingCspHashes.length === 0 &&
    !scriptSrc.includes("'unsafe-inline'"),
  missingCspHashes.join(', '),
);

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
const capabilitiesHtml = readFileSync(join(DIST, 'capabilities', 'index.html'), 'utf8');
check(
  'approved capability PDF is linked for public download',
  capabilitiesHtml.includes('href="/downloads/ses-capability-statement-2026.pdf"') &&
    capabilitiesHtml.includes('Approved for public release by SES.') &&
    !capabilitiesHtml.includes('Published copy pending SES approval'),
);

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
const projectRecords = JSON.parse(readFileSync(join(ROOT, 'src', 'content', 'projects.json'), 'utf8'));
const featuredProjects = projectRecords.filter((project) => project.featured);
const featuredProjectsWithoutImages = featuredProjects.filter(
  (project) => !project.image || !homeHtml.includes(project.image),
);
check(
  'featured project photos render on home page',
  featuredProjectsWithoutImages.length === 0,
  featuredProjectsWithoutImages.map((project) => project.title).join(', '),
);
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
check(
  'enquiry form links to privacy notice',
  contactHtml.includes('href="/privacy/"') && contactHtml.includes('Privacy Notice'),
);
const privacyHtml = readFileSync(join(DIST, 'privacy', 'index.html'), 'utf8');
check(
  'privacy notice includes client-approved retention periods',
  privacyHtml.includes('24 months after the last meaningful contact') &&
    privacyHtml.includes('12 months after the last contact') &&
    privacyHtml.includes('90 days') &&
    privacyHtml.includes('30 days'),
);
check(
  'privacy notice identifies email host',
  privacyHtml.includes('Email hosting is provided by Real Image'),
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

// 5b. Every service/sector card uses its mapped engineering image, and each
//     service detail hero reuses its corresponding card image.
const serviceVisuals = [
  ['civil-engineering', 'engineering-bg-civil.webp'],
  ['water-sanitation', 'engineering-bg-water.webp'],
  ['transportation', 'engineering-bg-transport.webp'],
  ['energy', 'engineering-bg-energy.webp'],
  ['structural-engineering', 'engineering-bg-structural.webp'],
  ['mining-engineering', 'engineering-bg-mining.webp'],
  ['project-programme-management', 'engineering-bg-coordination.webp'],
  ['industrial-commercial-buildings', 'engineering-bg-industrial.webp'],
];
const sectorVisuals = [
  ['water-sanitation', 'engineering-bg-water.webp'],
  ['energy', 'engineering-bg-energy.webp'],
  ['transportation', 'engineering-bg-transport.webp'],
  ['mining', 'engineering-bg-mining.webp'],
  ['infrastructure', 'engineering-bg-infrastructure.webp'],
  ['structures', 'engineering-bg-structural.webp'],
  ['industrial-commercial', 'engineering-bg-structural.webp'],
  ['healthcare', 'engineering-bg-healthcare.webp'],
  ['agriculture', 'engineering-bg-water.webp'],
];
const sectorHeroImages = Object.fromEntries(
  sectorVisuals.map(([sector, image]) => [sector, `/images/engineering-backgrounds/${image}`]),
);
const projectHeroesHaveImages = projectRecords.every((project) => {
  const image =
    project.image || project.sectors.map((sector) => sectorHeroImages[sector]).find(Boolean);
  const page = readFileSync(join(DIST, 'projects', project.id, 'index.html'), 'utf8');
  return Boolean(image && page.includes(image));
});
const hasLinkedImage = (html, href, image) => {
  const start = html.indexOf(`href="${href}"`);
  if (start < 0) return false;
  const end = html.indexOf('</a>', start);
  return end > start && html.slice(start, end).includes(image);
};
const servicesIndexHtml = readFileSync(join(DIST, 'services', 'index.html'), 'utf8');
const sectorsIndexHtml = readFileSync(join(DIST, 'sectors', 'index.html'), 'utf8');
const servicesOnHome = serviceVisuals.every(([id, image]) =>
  hasLinkedImage(homeHtml, `/services/${id}/`, image),
);
const servicesOnIndex = serviceVisuals.every(([id, image]) =>
  hasLinkedImage(servicesIndexHtml, `/services/${id}/`, image),
);
const serviceHeroes = serviceVisuals.every(([id, image]) => {
  const html = readFileSync(join(DIST, 'services', id, 'index.html'), 'utf8');
  return html.includes(image) && html.includes('pointer-events-none') && html.includes('aria-hidden="true"');
});
const sectorsOnHome = sectorVisuals.every(([id, image]) =>
  hasLinkedImage(homeHtml, `/sectors/#${id}`, image),
);
const sectorsOnIndex = sectorVisuals.every(([id, image]) => {
  const start = sectorsIndexHtml.indexOf(`id="${id}"`);
  const end = sectorsIndexHtml.indexOf('</section>', start);
  return start >= 0 && end > start && sectorsIndexHtml.slice(start, end).includes(image);
});
check('mapped engineering images on all 8 home service cards', servicesOnHome);
check('mapped engineering images on all 8 services index cards', servicesOnIndex);
check('matching image on all 8 service detail heroes', serviceHeroes);
check('relevant hero image on all 21 project detail pages', projectHeroesHaveImages);
check('mapped engineering images on all 9 home sector cards', sectorsOnHome);
check('mapped engineering images on all 9 sector index cards', sectorsOnIndex);
check(
  'Mining uses its dedicated visual, not the generic texture fallback',
  existsSync(join(DIST, 'images', 'engineering-backgrounds', 'engineering-bg-mining.webp')) &&
    serviceVisuals.find(([id]) => id === 'mining-engineering')?.[1] === 'engineering-bg-mining.webp' &&
    sectorVisuals.find(([id]) => id === 'mining')?.[1] === 'engineering-bg-mining.webp',
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

// 8. Unapproved AI-generated asset leakage scan (ADR-018/022 boundary, machine-
//    checked): register/CDN tokens never appear in dist pages; approved assets ship
// the derivative pipeline under neutral derivative names.
const aiAssetHits = pageHtmls.filter(([, html]) =>
  /higgsfield|creative-proposals|cloudfront/i.test(html),
);
check(
  'no unapproved AI-generated asset leakage in dist (ADR-018/022)',
  aiAssetHits.length === 0,
  aiAssetHits.map(([p]) => p).join(', '),
);

check(
  'hero cinematic backdrop (approved proposal-C2) on home',
  homeHtml.includes('hero-backdrop') && homeHtml.includes('proposal-c2-cinematic-hero-16x9.webp'),
);
// HeroBackdrop's scoped styles are small, so with inlineStylesheets:'auto'
// they compile into the page's inline <style> rather than the external CSS
// bundle — scan both surfaces, tolerating minified or pretty formatting.
const heroCss = `${cssText}\n${homeHtml}`;
check(
  'hero establishing dolly-in (one-shot, reduced-motion disabled)',
  heroCss.includes('hero-dolly') &&
    /hero-dolly\s+45s/.test(heroCss) &&
    heroCss.includes('scale(1.07)') &&
    /@media\s*\(prefers-reduced-motion\s*:\s*reduce\)\s*\{\.hero-backdrop__plate[^{]*\{animation\s*:\s*none/.test(
      heroCss,
    ),
);
check(
  'hero backdrop non-interactive (pointer-events-none, aria-hidden)',
  homeHtml.includes('pointer-events-none') && homeHtml.includes('aria-hidden'),
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

const projectImageDir = join(ROOT, 'public', 'images', 'projects');
const projectFiles = readdirSync(projectImageDir).filter((file) =>
  statSync(join(projectImageDir, file)).isFile(),
);
const mappedProjectFiles = new Set(
  projectRecords
    .map((project) => project.image)
    .filter((image) => typeof image === 'string')
    .map((image) => image.replace(/^\/images\/projects\//, '')),
);
const nonWebpProjectFiles = projectFiles.filter((file) => !file.toLowerCase().endsWith('.webp'));
const unmappedProjectFiles = projectFiles.filter((file) => !mappedProjectFiles.has(file));
const missingProjectFiles = [...mappedProjectFiles].filter(
  (file) => !existsSync(join(projectImageDir, file)),
);
check(
  'project image directory contains only mapped WebP derivatives',
  nonWebpProjectFiles.length === 0 &&
    unmappedProjectFiles.length === 0 &&
    missingProjectFiles.length === 0,
  [
    nonWebpProjectFiles.length && `non-WebP: ${nonWebpProjectFiles.join(', ')}`,
    unmappedProjectFiles.length && `unmapped: ${unmappedProjectFiles.join(', ')}`,
    missingProjectFiles.length && `missing: ${missingProjectFiles.join(', ')}`,
  ]
    .filter(Boolean)
    .join('; '),
);

// 9c. Interior hero photo backdrops (ADR-021 pipeline): supplied photography on
//     PageHero pages — decorative and non-interactive on each.
const heroPhotoPages = [
  ['about', 'engineers-golden-industrial-site.webp'],
  ['services', 'sunset-industrial-blueprint.webp'],
  ['capabilities', 'capabilities-hero.webp'],
  ['contact', 'contact-hero.webp'],
  ['leadership', 'leadership-hero.webp'],
  ['projects', 'projects-hero.webp'],
  ['sectors', 'sectors-hero.webp'],
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
  ['buy-cash-warehouse', 'buy-cash-warehouse\\.webp', 'Rehabilitation of the Buy Cash Warehouse'],
  ['emandla-solar-pv', 'emandla-solar-pv\\.webp', 'Emandla Solar Photovoltaic Plant'],
  ['galp-fuel-station-forecourt', 'galp-fueling-station-forecourt\\.webp', 'GALP Fueling Station Forecourt'],
  ['healing-power-church', 'healing-power-church\\.webp', 'Healing Power Church (HPC)'],
  ['hluti-power-substation', 'hluti-power-substation\\.webp', 'Hluti Power Sub-Station'],
  ['lavumisa-border', 'lavumisa-border\\.webp', 'Lavumisa Border Project'],
  ['luke-commission-sdc', 'luke-commission-sdc\\.webp', 'Luke Commission Staff Development Centre'],
  ['manzini-mall', 'manzini-mall\\.webp', 'Manzini Mall'],
  ['manzini-region-water', 'manzini-region-water\\.webp', 'Manzini Region Sustainable Water Supply'],
  ['mkhondvo-ngwavuma-water', 'mkhondvo-ngwavuma-water\\.webp', 'Mkhondvo-Ngwavuma Water Augmentation Programme (MNWAP) Phase 1B'],
  ['mr3-pedestrian-bridges', 'mr3-pedestrian-bridges\\.webp', 'MR3 Pedestrian Bridges'],
  ['national-healthcare-waste-facility', 'national-healthcare-waste-facility\\.webp', 'National Healthcare Waste Facility'],
  ['nsoko-solar-pv', 'nsoko-solar-pv\\.webp', 'Nsoko Solar Photovoltaic Project'],
  ['ridgeview-township-roads', 'ridgeview-township-roads\\.webp', 'Ridgeview Township Roads'],
  ['sicholo-street-drainage', 'sicholo-street-drainage\\.webp', 'Sicholo Street & Associated Drainage Works'],
  ['shonalanga-pump-station', 'shonalanga-pump-station\\.webp', 'Shonalanga Pump Station — Ubombo Sugar Limited'],
  ['undp-jet', 'undp-jet\\.webp', 'UNDP Just Energy Transition (JET) Project'],
  ['unifoods-factory-shell', 'unifoods-factory-shell\\.webp', 'Unifoods Factory Shell'],
  ['inyatsi-water-reticulation', 'water-reticulation-sewerage\\.webp', 'Water Reticulation & Gravity Sewerage Network'],
]) {
  const pageHtml = readFileSync(join(DIST, 'projects', id, 'index.html'), 'utf8');
  const imgIndex = new RegExp(`<img[^>]*${webp}[^>]*>`).exec(projectsIndexHtml)?.[0] ?? '';
  const altMatches = (img) =>
    img.match(/\balt="([^"]*)"/)?.[1]?.replace(/&amp;|&#38;/g, '&') === alt;
  const imgPage =
    [...pageHtml.matchAll(new RegExp(`<img[^>]*${webp}[^>]*>`, 'g'))]
      .map(([img]) => img)
      .find(altMatches) ?? '';
  check(
    `${alt} photo on projects index + case-study page (descriptive alt)`,
    imgIndex !== '' && imgPage !== '' && altMatches(imgIndex) && altMatches(imgPage),
  );
}

// 9g. Motion polish — count-up stats, staggered grid reveals, project-card
//     image zoom. All enhancement-only: markup carries the final values and
//     CSS/scripts honour prefers-reduced-motion.
// Markup always carries the final figures (`data-count-up="21"`); the
// animation script ships either inlined in the page (Astro inlines small
// scripts) or bundled under dist/_astro/*.js — accept both.
const statCountUps = (homeHtml.match(/data-count-up="/g) ?? []).length;
const motionJs = readdirSync(join(DIST, '_astro'))
  .filter((f) => f.endsWith('.js'))
  .map((f) => readFileSync(join(DIST, '_astro', f), 'utf8'))
  .join('\n');
const motionScript = `${motionJs}\n${homeHtml}`;
check(
  'count-up stats wired (markup values + animation script, reduced-motion safe)',
  statCountUps >= 4 &&
    motionScript.includes('data-count-up') &&
    motionScript.includes('IntersectionObserver') &&
    motionScript.includes('prefers-reduced-motion'),
  `${statCountUps} data-count-up markup attrs in home HTML`,
);
const revealDelays = (homeHtml.match(/--reveal-delay/g) ?? []).length;
check('staggered grid reveals (--reveal-delay steps on home grids)', revealDelays >= 12, `found ${revealDelays}`);
const motionCss = readdirSync(join(DIST, '_astro'))
  .filter((f) => f.endsWith('.css'))
  .map((f) => readFileSync(join(DIST, '_astro', f), 'utf8'))
  .join('\n');
check(
  'project-card image zoom (media wrapper + hover/focus CSS)',
  homeHtml.includes('ses-card-media') &&
    projectsIndexHtml.includes('ses-card-media') &&
    motionCss.includes('.ses-card') &&
    motionCss.includes('scale(1.03)'),
);

// 9h. CTA-band generative texture (ADR-018 + register): approved proposal-A
//     contour plate ships as a decorative CtaBand backdrop; the derivative
//     name deliberately avoids register/CDN tokens so check 8 stays sharp.
const ctaHtml = readFileSync(join(DIST, 'about', 'index.html'), 'utf8');
const ctaTexture = /<img[^>]*proposal-a-cta-contours\.webp[^>]*>/.exec(ctaHtml)?.[0] ?? '';
check(
  'CTA band generative texture (approved proposal-A, decorative, non-interactive)',
  ctaTexture !== '' && ctaTexture.includes('aria-hidden') && ctaTexture.includes('pointer-events-none'),
);

// 9g. Approach workflow diagram — connected five-phase timeline with the
//     lessons-learned feedback connector and the continuous-disciplines band.
//     Copy on the page is simultaneously covered by the section 7 slop guard.
const approachHtml = readFileSync(join(DIST, 'approach', 'index.html'), 'utf8');
check(
  'approach workflow: five phases + feedback connector + continuous band',
  ['Advise', 'Plan', 'structure', 'Deliver', 'Control', 'Sustain'].every((t) => approachHtml.includes(t)) &&
    approachHtml.includes('Lessons inform future projects') &&
    approachHtml.includes('Continuous Disciplines') &&
    approachHtml.includes('Applies throughout the engagement'),
);

// 9i. Values wording (capability statement p. 6 — graphical page transcribed
//     verbatim): the four published values on /about and the home summary
//     card, plus the socio-economic development paragraph. The retired
//     'Professionalism' placeholder is asserted absent on both pages. Astro
//     escapes ampersands in built HTML, so value matching runs against a
//     de-entitized copy of each page (see `unescaped` below).
const sesValues = ['Futuristic', 'Respect & Integrity', 'Playfulness', 'Participation'];
// `ctaHtml` is the full About page (read above for the 9h CTA check). Built
// HTML carries entities and wraps long source lines across whitespace, so
// matching de-entitizes AND collapses whitespace. The entity literal is
// assembled from parts so no transport can decode it.
const unescaped = (h) => h.replaceAll('&' + 'amp;', '&').replace(/\s+/g, ' ');
check(
  'SES values verbatim on about + home, SED paragraph, placeholders retired',
  sesValues.every((t) => unescaped(ctaHtml).includes(t)) &&
    sesValues.every((t) => unescaped(homeHtml).includes(t)) &&
    unescaped(ctaHtml).includes('Socio-economic development') &&
    unescaped(ctaHtml).includes('gives back to society and communities') &&
    !ctaHtml.includes('Professionalism') &&
    !homeHtml.includes('Professionalism'),
);

// Result -------------------------------------------------------------------
const passed = results.filter((r) => r.ok).length;
console.log(`SES smoke test — ${passed}/${results.length} checks passed (${indexPages.length} pages scanned in dist/).`);
if (failures.length > 0) {
  console.error('\nFailures:');
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log('✓ Artifact integrity verified.');
