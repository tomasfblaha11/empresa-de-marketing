#!/usr/bin/env node
// Step 1 (United States, no API key): collect businesses from YellowPages.com category pages,
// same idea as find-yellow.mjs (NZ). Keeps name, address, phone, website and the email the
// business published on its own listing.
//
// Usage: NODE_USE_ENV_PROXY=1 node tools/prospects/find-yp-us.mjs <out-folder> \
//          --cats home-watch,landscape-contractors --locs naples-fl,sarasota-fl [--delay 900]
// Writes <out-folder>/yp-us.json (cache by profile URL; re-runs continue where they stopped).

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

const { values: args, positionals } = parseArgs({
  allowPositionals: true,
  options: { cats: { type: 'string' }, locs: { type: 'string' }, delay: { type: 'string', default: '900' } },
});
const dir = positionals[0];
if (!dir || !args.cats || !args.locs) throw new Error('Usage: find-yp-us.mjs <out-folder> --cats a,b --locs x-st,y-st');
mkdirSync(dir, { recursive: true });
const out = join(dir, 'yp-us.json');
const db = existsSync(out) ? JSON.parse(readFileSync(out, 'utf8')) : { listings: {}, pagesDone: [] };
const save = () => writeFileSync(out, JSON.stringify(db, null, 2));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';
const BASE = 'https://www.yellowpages.com';

async function get(url) {
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30_000) });
      if (res.status === 404) return null;
      if (res.ok) return await res.text();
    } catch {}
    await sleep(4000 * (i + 1));
  }
  return null;
}
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
const text = (s) => decode(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
function decodeCfEmail(hex) {
  const key = parseInt(hex.slice(0, 2), 16);
  let s = '';
  for (let i = 2; i < hex.length; i += 2) s += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ key);
  return s;
}

function parseListings(html, cat, loc) {
  return html.split('class="result"').slice(1).map((b) => {
    const href = b.match(/class="business-name" href="([^"]+)"/)?.[1];
    if (!href || !href.includes('/mip/')) return null;
    return {
      name: text(b.match(/class="business-name"[^>]*>([\s\S]*?)<\/a>/)?.[1] ?? ''),
      profile: BASE + href.split('?')[0],
      address: text(b.match(/<div class="adr">([\s\S]*?)<\/div><\/div>/)?.[1] ?? ''),
      phone: text(b.match(/class="phones phone primary">([^<]+)/)?.[1] ?? ''),
      website: b.match(/class="track-visit-website" href="([^"]+)"/)?.[1] ?? '',
      category: text(b.match(/<div class="categories">([\s\S]*?)<\/div>/)?.[1] ?? ''),
      foundIn: `${loc}/${cat}`,
    };
  }).filter(Boolean);
}

async function emailFromProfile(url) {
  const html = await get(url);
  if (!html) return '';
  const direct = html.match(/mailto:([^"?]+)/)?.[1];
  if (direct) return decodeURIComponent(direct).trim().toLowerCase();
  const cf = html.match(/email-protection#([0-9a-f]+)/)?.[1];
  const decoded = cf ? decodeCfEmail(cf) : '';
  return /@/.test(decoded) ? decoded.toLowerCase() : '';
}

const delay = Number(args.delay);
for (const loc of args.locs.split(',')) {
  for (const cat of args.cats.split(',')) {
    const key = `${loc}/${cat}`;
    if (db.pagesDone.includes(key)) continue;
    const html = await get(`${BASE}/${key}`);
    await sleep(delay);
    if (!html) { db.pagesDone.push(key); continue; }
    const found = parseListings(html, cat, loc);
    let added = 0;
    for (const l of found) {
      if (db.listings[l.profile]) continue;
      l.email = await emailFromProfile(l.profile);
      await sleep(delay);
      db.listings[l.profile] = l;
      added++;
    }
    db.pagesDone.push(key);
    save();
    console.log(`${key}: ${found.length} listings, ${added} new (total ${Object.keys(db.listings).length})`);
  }
}
save();
