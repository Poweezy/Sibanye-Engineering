// _gear-cut.cjs — idempotent keyword-block surgeon for the gear-porthole removal.
const fs = require('fs');
const log = [];
const rd = (p) => fs.readFileSync(p, 'utf8');
const wr = (p, t) => fs.writeFileSync(p, t);
// index of the line where parens (or braces) opened at line i close again
function bal(ls, i, o, c) {
  let d = 0;
  for (let j = i; j < ls.length; j++) {
    for (const ch of ls[j]) { if (ch === o) d++; else if (ch === c) d--; }
    if (d <= 0) return j;
  }
  return ls.length - 1;
}

// 1. smoke-test.mjs — cut check(...) blocks whose name mentions gear/porthole/watermark
{
  const p = 'scripts/smoke-test.mjs';
  const ls = rd(p).split('\n');
  const out = [];
  let cut = 0;
  for (let i = 0; i < ls.length; i++) {
    const look = (ls[i + 1] || '') + (ls[i + 2] || '');
    const isCheck = /check\(/.test(ls[i]);
    const isGear = /gear|porthole|watermark/i.test(ls[i] + (isCheck ? look : ''));
    if (isCheck && isGear) { const e = bal(ls, i, '(', ')'); cut += e - i + 1; i = e; continue; }
    // stale comment lines mentioning the porthole
    if (/^\s*(\*|\/\/)/.test(ls[i]) && /gear|porthole/i.test(ls[i])) { cut++; continue; }
    out.push(ls[i]);
  }
  wr(p, out.join('\n'));
  log.push(`smoke-test.mjs: cut ${cut} lines`);
}

// 2. global.css + HomeHero.astro style block — brace-cut any rule whose text mentions gear
for (const p of ['src/styles/global.css', 'src/components/HomeHero.astro']) {
  const ls = rd(p).split('\n');
  const out = [];
  let cut = 0;
  for (let i = 0; i < ls.length; i++) {
    if (/gear/i.test(ls[i])) {
      if (ls[i].includes('{')) { const e = bal(ls, i, '{', '}'); cut += e - i + 1; i = e; continue; }
      if (!ls[i].includes('}')) { const e = bal(ls, i, '{', '}'); cut += e - i + 1; i = e; continue; }
    }
    if (/^\s*(\/\*|\*|\/\/)/.test(ls[i]) && /gear|porthole/i.test(ls[i])) { cut++; continue; }
    out.push(ls[i]);
  }
  wr(p, out.join('\n'));
  log.push(`${p}: cut ${cut} lines`);
}

// 3. build-hero-derivatives.mjs — cut ONLY the hero-photo job (out: public/images/hero/manzini…)
{
  const p = 'scripts/build-hero-derivatives.mjs';
  const ls = rd(p).split('\n');
  const out = [];
  let cut = 0;
  for (let i = 0; i < ls.length; i++) {
    if (/out:\s*'public\/images\/hero\/manzini-mall-01\.webp'/.test(ls[i])) {
      let s = i; while (s > 0 && !ls[s].trim().startsWith('{')) s--;
      const e = bal(ls, s, '{', '}');
      cut += e - s + 1; i = e; continue;
    }
    if (/^\s*\/\/.*manzini-mall-01/.test(ls[i])) { cut++; continue; } // stale job-doc comment lines
    out.push(ls[i]);
  }
  wr(p, out.join('\n'));
  log.push(`build-hero-derivatives.mjs: cut ${cut} lines`);
}

// 4. components README — drop gear sentences (line + continuation until sentence end)
{
  const p = 'src/components/README.md';
  const ls = rd(p).split('\n');
  const out = [];
  let cut = 0;
  for (let i = 0; i < ls.length; i++) {
    if (/gear|porthole|manzini/i.test(ls[i])) {
      let j = i;
      while (j < ls.length && ls[j].trim() !== '' && !/\.\s*$/.test(ls[j])) j++;
      cut += j - i + 1; i = j; continue;
    }
    out.push(ls[i]);
  }
  wr(p, out.join('\n'));
  log.push(`README.md: cut ${cut} lines`);
}

// 5. DECISIONS.md — record ADR-024 once
{
  const p = 'docs/DECISIONS.md';
  let t = rd(p);
  if (!t.includes('ADR-024')) {
    t = t.replace(/\s*$/, '') + '\n\n### ADR-024 — Gear-porthole hero element removed (2026-10-26)\n- **Decision:** Client-requested removal of the rotating gear porthole from the home hero. `HomeHero` now composes the cinematic C2 plate (ADR-023) + atmosphere + copy shield only. Removed: `GearWatermark.astro`, `public/images/gear-mask.svg`, the hero `manzini-mall-01.webp` derivative and its pipeline job (the raw stays in `docs/raw-photography/`; the projects-section derivative is untouched). Porthole/watermark/photo-dim smoke guards cut; remaining hero checks (backdrop, dolly-in, shield, non-interactivity) retained.\n- **Why:** Client direction after the ADR-023 cinematic backdrop made the gear overlay visually redundant.\n- **Status:** Implemented 2026-10-26; `npm test` re-verified green.\n';
    wr(p, t);
    log.push('DECISIONS.md: ADR-024 appended');
  } else log.push('DECISIONS.md: ADR-024 already present');
}

console.log(log.join('\n'));
