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

// Collect every internal href/src target from the built HTML.
const refs = new Set();
const attrRe = /(?:href|src)="([^"]+)"/g;
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  for (const m of html.matchAll(attrRe)) {
    let ref = m[1].trim();
    if (!ref || ref.startsWith('#') || /^(https?:|mailto:|tel:|data:|javascript:)/.test(ref)) continue;
    ref = ref.split('#')[0].split('?')[0];
    if (ref) refs.add(ref);
  }
}

let broken = 0;
for (const ref of [...refs].sort()) {
  const target = resolve(DIST, '.' + decodeURIComponent(ref));
  const candidates = [
    target,
    target + '.html',
    join(target, 'index.html'),
  ];
  if (!candidates.some((c) => existsSync(c))) {
    // Also flag fragment-only misses on known pages? Keep to file existence.
    console.error(`BROKEN  ${ref}   (referenced from ${pages.length} scanned pages)`);
    broken++;
  }
}

console.log(`Scanned ${pages.length} HTML pages, ${refs.size} unique internal references.`);
if (broken > 0) {
  console.error(`${broken} broken internal reference(s) found.`);
  process.exit(1);
}
console.log('All internal links resolve. ✓');
