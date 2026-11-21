// @ts-check
import { defineConfig } from 'astro/config';
import client from './src/data/client.json' with { type: 'json' };

export default defineConfig({
  site: client.siteUrl,
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  image: { responsiveStyles: false },
});
