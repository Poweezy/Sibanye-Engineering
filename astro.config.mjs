// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// NOTE: `site` confirmed via the SES 2026 capability statement
// (www.sibanyeengineering.com). See docs/content-open-items.md.
export default defineConfig({
  site: 'https://www.sibanyeengineering.com',
  vite: {
    plugins: [tailwindcss()],
  },
});
