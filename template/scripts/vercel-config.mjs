// Writes vercel.json from the client sheet before each build.
// Demos get X-Robots-Tag: noindex on every response (rule 1 for demos in CLAUDE.md).
import { readFileSync, writeFileSync } from 'node:fs';

const client = JSON.parse(readFileSync(new URL('../src/data/client.json', import.meta.url), 'utf8'));

const headers = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  ...(client.demo ? [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] : []),
];

const config = {
  $schema: 'https://openapi.vercel.sh/vercel.json',
  framework: 'astro',
  cleanUrls: true,
  headers: [
    { source: '/(.*)', headers },
    { source: '/_astro/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
  ],
};

writeFileSync(new URL('../vercel.json', import.meta.url), JSON.stringify(config, null, 2) + '\n');
console.log(`vercel.json written (demo: ${Boolean(client.demo)})`);
