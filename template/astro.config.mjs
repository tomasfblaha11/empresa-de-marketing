// @ts-check
import { defineConfig } from 'astro/config';
import client from './src/data/client.json' with { type: 'json' };

export default defineConfig({
  site: client.siteUrl,
  // Overridable so the same site can be built into a sub-folder (agency examples).
  base: process.env.SITE_BASE || '/',
  outDir: process.env.SITE_OUT_DIR || './dist',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  image: { responsiveStyles: false },
});
