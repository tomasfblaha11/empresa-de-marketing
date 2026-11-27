#!/usr/bin/env node
// Step 1 (New Zealand, no API key): collect businesses from Yellow.co.nz category pages.
// For each listing it keeps the name, address, phone, website and, when the business published
// one in its listing, its email (read from the listing's own profile page).
//
// Usage: NODE_USE_ENV_PROXY=1 node tools/prospects/find-yellow.mjs <out-folder> \
//          --cats landscaping,paving --locs nelson,timaru [--delay 800]
// Writes <out-folder>/yellow.json. Re-running reuses what is already there (cache by profile URL).
// Be polite: one request at a time, with a delay. Only public listing data is stored.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

const { values: args, positionals } = parseArgs({
  allowPositionals: true,
  options: { cats: { type: 'string' }, locs: { type: 'string' }, delay: { type: 'string', default: '800' }, country: { type: 'string', default: 'NZ' } },
});
const dir = positionals[0];
if (!dir || !args.cats || !args.locs) throw new Error('Usage: find-yellow.mjs <out-folder> --cats a,b --locs x,y');
mkdirSync(dir, { recursive: true });
const out = join(dir, 'yellow.json');
const db = existsSync(out) ? JSON.parse(readFileSync(out, 'utf8')) : { listings: {}, pagesDone: [] };
const save = () => writeFileSync(out, JSON.stringify(db, null, 2));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';
// Yellow NZ and Yellow Pages Australia run on the same platform.
const BASE = args.country === 'AU' ? 'https://www.yellowpages.com.au' : 'https://www.yellow.co.nz';

async function get(url) {
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30_000) });
      if (res.status === 404) return null;
      if (res.ok) return await res.text();
    } catch {}
    await sleep(3000 * (i + 1));
  }
  return null;
}

const decodeEntities = (s) => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const text = (s) => decodeEntities(s.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();

// Cloudflare email obfuscation: first byte is the XOR key for the rest.
export function decodeCfEmail(hex) {
  const key = parseInt(hex.slice(0, 2), 16);
  let s = '';
  for (let i = 2; i < hex.length; i += 2) s += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ key);
  return s;
}

function parseListings(html, cat, loc) {
  const blocks = html.split('class="srp-listing').slice(1);
  return blocks.map((b) => {
    const href = b.match(/class="business-name" href="([^"]+)"/)?.[1];
    if (!href) return null;
    const name = text(b.match(/class="business-name"[^>]*>([\s\S]*?)<\/a>/)?.[1] ?? '');
    // (the listing may append a "Claimed" badge to the name)
    const adr = b.match(/<p class="adr">([\s\S]*?)<\/p>/)?.[1];
    // NZ marks the website link as "weblink-button", Australia as "yp-website-cta".
    const website = b.match(/class="(?:weblink-button|[^"]*yp-website-cta)[^"]*" href="([^"]+)"/)?.[1] ?? '';
    const phone = text(b.match(/class="call-number">([\s\S]*?)<\/span>/)?.[1] ?? '');
    const category = text(b.match(/<div class="categories">([\s\S]*?)<\/div>/)?.[1] ?? '');
    return { name: name.replace(/Claimed$/, '').trim(), profile: BASE + href.split('?')[0], address: adr ? text(adr) : '', phone, website, category, foundIn: `${loc}/${cat}`, country: args.country };
  }).filter(Boolean);
}

async function emailFromProfile(url) {
  const html = await get(url);
  if (!html) return '';
  const direct = html.match(/"email":"mailto:([^"]+)"/)?.[1];
  if (direct) return direct.trim().toLowerCase();
  const cf = html.match(/data-cfemail="([0-9a-f]+)"/)?.[1];
  const decoded = cf ? decodeCfEmail(cf) : '';
  return /@/.test(decoded) && !/ypcdn|yellow/.test(decoded) ? decoded.toLowerCase() : '';
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
    // Profile pages are fetched three at a time, each worker pausing between requests.
    const fresh = found.filter((l) => !db.listings[l.profile]);
    let next = 0;
    await Promise.all([0, 1, 2].map(async () => {
      while (next < fresh.length) {
        const l = fresh[next++];
        l.email = await emailFromProfile(l.profile);
        db.listings[l.profile] = l;
        await sleep(delay);
      }
    }));
    const added = fresh.length;
    db.pagesDone.push(key);
    save();
    console.log(`${key}: ${found.length} listings, ${added} new (total ${Object.keys(db.listings).length})`);
  }
}
save();
