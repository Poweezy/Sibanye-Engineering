/**
 * Extract text from a PDF for content identification (analysis only —
 * source PDFs are never modified).
 * Usage: node scripts/extract-pdf-text.mjs <input.pdf> [out.txt]
 */
import { readFile, writeFile } from 'node:fs/promises';

const input = process.argv[2] ?? 'DOC-20260825-WA0079.pdf';
const output = process.argv[3] ?? null;

const buf = await readFile(input);
let text = '';
let pages = null;

const mod = await import('pdf-parse');
if (mod.PDFParse) {
  // pdf-parse v2
  const parser = new mod.PDFParse({ data: new Uint8Array(buf) });
  const res = await parser.getText();
  text = res.text ?? '';
  pages = res.pages?.length ?? res.total ?? null;
  await parser.destroy();
} else {
  // pdf-parse v1
  const fn = mod.default ?? mod;
  const res = await fn(buf);
  text = res.text ?? '';
  pages = res.numpages ?? null;
}

if (output) await writeFile(output, text, 'utf8');
console.log(JSON.stringify({ input, pages, chars: text.length }));
console.log('--- first 1600 chars ---');
console.log(text.slice(0, 1600));
