#!/usr/bin/env node
// Step 1 (Chile): small accommodation businesses from SERNATUR's official registry of tourism
// services (serviciosturisticos.sernatur.cl). Each registered business publishes its type,
// phone, email and website there. Only small formats are kept (cabañas, hostales, lodges...).
//
// Usage: NODE_USE_ENV_PROXY=1 node tools/prospects/find-sernatur-cl.mjs <out-folder> --comunas Pucon,Puerto Varas [--delay 700]
// Writes <out-folder>/sernatur-cl.json (cache; re-runs continue where they stopped).

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

const { values: args, positionals } = parseArgs({ allowPositionals: true, options: { comunas: { type: 'string' }, delay: { type: 'string', default: '700' } } });
const dir = positionals[0];
if (!dir || !args.comunas) throw new Error('Usage: find-sernatur-cl.mjs <out-folder> --comunas A,B');
mkdirSync(dir, { recursive: true });
const out = join(dir, 'sernatur-cl.json');
const db = existsSync(out) ? JSON.parse(readFileSync(out, 'utf8')) : { listings: {}, comunasDone: [] };
const save = () => writeFileSync(out, JSON.stringify(db, null, 2));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';
const BASE = 'https://serviciosturisticos.sernatur.cl';
// Small formats only: hotels, apart-hotels, motels, campings and resorts are left out.
const SMALL = /caba(ñ|n)a|hostal|hospedaje|bed|lodge|refugio|casa de hu|departamentos tur|turismo de naturaleza|complejo tur|residencial|posada/i;

async function get(url) {
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30_000) });
      if (res.ok) return await res.text();
      if (res.status === 404) return null;
    } catch {}
    await sleep(3000 * (i + 1));
  }
  return null;
}
const clean = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/\s+/g, ' ').trim();

function parseList(html) {
  return [...html.matchAll(/href="(\/\d+-[a-z0-9-]+)">\s*<div class="caja-resultado[\s\S]*?<span class="clase-b">([^<]*)<\/span>\s*<h3[^>]*>([\s\S]*?)<\/h3>/g)]
    .map((m) => ({ profile: BASE + m[1], type: clean(m[2]), name: clean(m[3]) }));
}

function parseDetail(html) {
  const text = clean(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' '));
  const pick = (label) => text.match(new RegExp(`${label}:\\s*(.*?)\\s+(?:Localidad|Teléfono|Email|sitio web|Contáctanos|Cumple|Registro|Dirección):`, 'i'))?.[1]?.trim() ?? '';
  const email = html.match(/mailto:([^"?]+)/)?.[1]?.trim().toLowerCase() ?? '';
  const site = [...html.matchAll(/href="(https?:\/\/[^"]+)"/g)].map((m) => m[1])
    .find((h) => !/sernatur|fontawesome|gstatic|googleapis|facebook\.com\/pages\/Sernatur|instagram\.com\/sernatur|youtube|wa\.me\/56994580453|chileestuyo|chile\.travel|jsdelivr|bootstrap|jquery|google|clarity/i.test(h)) ?? '';
  return { address: pick('Dirección'), phone: pick('Teléfono'), email, website: site };
}

const delay = Number(args.delay);
for (const comuna of args.comunas.split(',')) {
  if (db.comunasDone.includes(comuna)) continue;
  let added = 0;
  for (let page = 1; page < 40; page++) {
    const html = await get(`${BASE}/resultado.php?tipo_servicio=1&nombre=&comuna_nombre=${encodeURIComponent(comuna)}&page=${page}`);
    await sleep(delay);
    const items = html ? parseList(html) : [];
    if (!items.length) break;
    const fresh = items.filter((i) => SMALL.test(i.type) && !db.listings[i.profile]);
    let next = 0;
    await Promise.all([0, 1, 2].map(async () => {
      while (next < fresh.length) {
        const it = fresh[next++];
        const d = await get(it.profile);
        db.listings[it.profile] = { name: it.name, category: it.type, foundIn: `${comuna}/alojamiento`, ...(d ? parseDetail(d) : {}), profile: it.profile };
        await sleep(delay);
      }
    }));
    added += fresh.length;
    if (!html.includes(`page=${page + 1}`)) break;
  }
  db.comunasDone.push(comuna);
  save();
  console.log(`${comuna}: ${added} small accommodation businesses (total ${Object.keys(db.listings).length})`);
}
save();
