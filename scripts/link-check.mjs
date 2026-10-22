/**
 * Link-check QA — scans every built HTML file in dist/ for internal href/src
 * references and verifies the target exists in dist/. Exit code 1 on any
 * broken internal link. Run after `npm run build`.
 *
 * Usage: node scripts/link-check.mjs
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist', import.meta.url));
const pages = [];

const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (entry.endsWith('.html')) pages.push(full);
  }
};
walk(DIST);

// Collect every internal href/src target from the built HTML, remembering
// which page(s) referenced each one so failures can be traced.
const refs = new Map(); // ref -> Set of referencing pages (dist-relative paths)
const attrRe = /(?:href|src)="([^"]+)"/g;
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  for (const m of html.matchAll(attrRe)) {
    let ref = m[1].trim();
    if (!ref || ref.startsWith('#') || /^(https?:|mailto:|tel:|data:|javascript:)/.test(ref)) continue;
    ref = ref.split('#')[0].split('?')[0];
    if (!ref) continue;
    if (!refs.has(ref)) refs.set(ref, new Set());
    refs.get(ref).add(page.slice(DIST.length + 1).replaceAll('\\', '/'));
  }
}

let broken = 0;
for (const ref of [...refs.keys()].sort()) {
  const target = resolve(DIST, '.' + decodeURIComponent(ref));
  const candidates = [
    target,
    target + '.html',
    join(target, 'index.html'),
  ];
  if (!candidates.some((c) => existsSync(c))) {
    // Also flag fragment-only misses on known pages? Keep to file existence.
    const from = [...refs.get(ref)].sort().join(', ');
    console.error(`BROKEN  ${ref}   (referenced from ${from})`);
    broken++;
  }
}

console.log(`Scanned ${pages.length} HTML pages, ${refs.size} unique internal references.`);
if (broken > 0) {
  console.error(`${broken} broken internal reference(s) found.`);
  process.exit(1);
}
console.log('All internal links resolve. ✓');
