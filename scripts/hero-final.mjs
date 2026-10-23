// scripts/hero-final.mjs — ADR-021 asset endgame. Guarded + idempotent:
// originals preserved out of the deploy tree, .gitignore law, derivative cross-check.
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rel = (...f) => path.join(ROOT, ...f);
let failures = 0;
const fail = m => { failures++; console.error('  FAIL ' + m); };
const good = m => console.log('  ok   ' + m);

// [1] Originals preserved out of the deploy tree (idempotent — extracts from git HEAD if absent)
console.log('[1] Preserve originals -> source-photos/');
mkdirSync(rel('source-photos'), { recursive: true });
const ls = spawnSync('git', ['ls-files', 'public/images'], { cwd: ROOT, encoding: 'utf8' });
const tracked = (ls.stdout || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean);
for (const f of tracked) {
  const dest = rel('source-photos', path.basename(f));
  if (existsSync(dest)) { good('already preserved  ' + path.basename(f)); continue; }
  const r = spawnSync('git', ['show', 'HEAD:' + f], { cwd: ROOT, maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0 || !r.stdout?.length) { fail('git show ' + f); continue; }
  writeFileSync(dest, r.stdout);
  good('preserved  ' + path.basename(f) + '  (' + Math.round(r.stdout.length / 1024) + ' KB)');
}
if (!tracked.length) good('nothing tracked under public/images any more');
console.log('       source-photos holds ' + readdirSync(rel('source-photos')).length + ' file(s)');

// [2] .gitignore — originals stay local (OneDrive-synced), never committed or deployed
const giPath = rel('.gitignore');
const gi = readFileSync(giPath, 'utf8');
if (/^source-photos\/?$/m.test(gi)) good('.gitignore already ignores source-photos/');
else {
  writeFileSync(giPath, gi.replace(/\n*$/, '\n') + '\n# Original client photography — preserved locally (OneDrive), never deployed or committed\nsource-photos/\n');
  good('.gitignore: source-photos/ added');
}

// [3] Derivative cross-check (component builds paths dynamically -> verify the full 11-set)
console.log('[3] Derivative cross-check');
const bd = readFileSync(rel('src', 'components', 'HeroBackdrop.astro'), 'utf8');
if (!bd.includes('/images/hero/') || !bd.includes('manzini-mall-')) fail('HeroBackdrop.astro missing expected derivative path pattern');
else good('backdrop references /images/hero/ + manzini-mall- pattern');
const heroDir = rel('public', 'images', 'hero');
const derivs = existsSync(heroDir) ? readdirSync(heroDir).filter(f => f.endsWith('.webp')).sort() : [];
for (let i = 1; i <= 11; i++) {
  const name = `manzini-mall-${String(i).padStart(2, '0')}.webp`;
  existsSync(rel('public', 'images', 'hero', name)) ? good('present  ' + name) : fail('MISSING  ' + name);
}
if (derivs.length !== 11) fail(`expected 11 derivatives on disk, found ${derivs.length}`);
else {
  const totalKB = Math.round(derivs.reduce((a, f) => a + statSync(rel('public', 'images', 'hero', f)).size, 0) / 1024);
  good(`derivatives on disk: ${derivs.length}, total ${totalKB} KB`);
}

console.log(failures ? `RESULT: ${failures} FAILURE(S)` : 'RESULT: assets green');
process.exit(failures ? 1 : 0);
