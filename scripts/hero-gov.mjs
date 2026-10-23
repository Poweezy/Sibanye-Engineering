// scripts/hero-gov.mjs — ADR-021 governance sync. Append-safe + idempotent.
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rel = (...f) => path.join(ROOT, ...f);
let failures = 0;
const fail = m => { failures++; console.error('  FAIL ' + m); };
const good = m => console.log('  ok   ' + m);

const ADR = `\n## ADR-021 — Hero photographic backdrop from client-supplied photography (2026-10-23)\n\n**Context.** The client supplied eleven photographs of the completed Manzini Mall project and directed their use as a premium homepage hero background, with mandatory protection of the headline, CTA buttons and the animated gear watermark.\n\n**Decision.**\n1. Documentary integrity — the real photographs are the background layer; no AI re-imagining of real projects (ADR-018 boundary holds). Higgsfield image-to-video is not available on the current plan (documented limitation); cinematic motion is pure CSS (66s sequential crossfade + slow architectural zoom) with zero JS.\n2. Deploy hygiene — original JPEGs (~15 MB each) leave public/ and git tracking entirely, preserved in gitignored source-photos/ (OneDrive-synced). Only optimized WebP derivatives (~2048px) ship via public/images/hero/.\n3. Foreground protection — the backdrop renders at -z-10 with pointer-events-none and aria-hidden inside the hero's isolated stacking context; reduced-motion users receive a static first photograph; the gear watermark, headline and CTAs are untouched.\n\n**Consequences.** Smoke gate extended with four ADR-021 checks (backdrop presence, non-interference, wheel integrity, derivative payload guard). Any future hero motion must preserve these invariants.\n`;
const decPath = rel('docs', 'DECISIONS.md');
const dec = readFileSync(decPath, 'utf8');
if (dec.includes('ADR-021')) good('DECISIONS: ADR-021 already present');
else if (!dec.includes('ADR-020')) fail('DECISIONS: ADR-020 baseline missing — appended nothing');
else { if (!dec.endsWith('\n')) writeFileSync(decPath, dec + '\n'); appendFileSync(decPath, ADR); good('DECISIONS: ADR-021 appended'); }

const ST = `\n### 2026-10-23 — Hero photographic backdrop activated (ADR-021)\n- Client-supplied Manzini Mall photography (11 images) activated as the homepage hero background; originals preserved in gitignored source-photos/, only WebP derivatives (public/images/hero/) deploy.\n- HeroBackdrop.astro: -z-10 / pointer-events-none / aria-hidden, 66s crossfade + slow zoom, two-axis ink grade, static first-photo fallback under reduced motion; headline, CTAs and the animated gear wheel untouched.\n- Smoke gate extended with four ADR-021 checks.\n`;
const staPath = rel('docs', 'STATUS.md');
const sta = readFileSync(staPath, 'utf8');
if (sta.includes('(ADR-021)')) good('STATUS: ADR-021 entry already present');
else { if (!sta.endsWith('\n')) writeFileSync(staPath, sta + '\n'); appendFileSync(staPath, ST); good('STATUS: entry appended'); }

const coiPath = rel('docs', 'content-open-items.md');
const coiLines = readFileSync(coiPath, 'utf8').split('\n');
const note = '  - **2026-10-23 update:** Hero photography approved by client direction — the eleven supplied Manzini Mall photographs now back the homepage hero (ADR-021). Broader photography permissions remain open.';
const idx = coiLines.findIndex(l => /photograph/i.test(l));
if (idx === -1) fail('content-open-items: no photography line found');
else if (coiLines.some(l => l.includes('Hero photography approved by client direction'))) good('content-open-items: note already present');
else { coiLines.splice(idx + 1, 0, note); writeFileSync(coiPath, coiLines.join('\n')); good('content-open-items: approval note inserted after line ' + (idx + 1)); }

console.log(failures ? `RESULT: ${failures} FAILURE(S)` : 'RESULT: governance green');
process.exit(failures ? 1 : 0);
