// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// NOTE: `site` is a placeholder pending domain confirmation from SES.
// See docs/content-open-items.md (item: Domain and hosting access).
export default defineConfig({
  site: 'https://www.sibanyeengineering.com',
  vite: {
    plugins: [tailwindcss()],
  },
});
