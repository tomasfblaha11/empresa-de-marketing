// Builds the client template (../template) once per sample in ./examples/*.json and writes the
// static output to ./public/examples/<slug>/, so the agency site serves real, browsable samples.
// Usage (from agency/): node scripts/build-examples.mjs   (needs ../template/node_modules)
import { readdirSync, readFileSync, writeFileSync, rmSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';

const agency = resolve(import.meta.dirname, '..');
const template = resolve(agency, '../template');
const clientFile = join(template, 'src/data/client.json');
const original = readFileSync(clientFile, 'utf8');

try {
  for (const file of readdirSync(join(agency, 'examples')).filter((f) => f.endsWith('.json'))) {
    const slug = file.replace(/\.json$/, '');
    const out = join(agency, 'public/examples', slug);
    rmSync(out, { recursive: true, force: true });
    copyFileSync(join(agency, 'examples', file), clientFile);
    console.log(`Building example "${slug}"...`);
    execFileSync('npx', ['astro', 'build'], {
      cwd: template,
      stdio: ['ignore', 'ignore', 'inherit'],
      env: { ...process.env, SITE_BASE: `/examples/${slug}/`, SITE_OUT_DIR: out },
    });
  }
} finally {
  writeFileSync(clientFile, original); // always restore the template's own client sheet
}
console.log('Examples built into public/examples/');
