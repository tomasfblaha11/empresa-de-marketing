#!/usr/bin/env node
// Step 1: search Google Places (Text Search, New) for each niche x location.
// Usage: node tools/prospects/find.mjs [--niche house-care] [--location Tauranga] [--pages 1] [--dry-run]
// The API key is injected by the environment's network proxy; never put it in this repo.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { COUNTRY, NICHES, LOCATIONS, MAX_REQUESTS, FIELD_MASK } from './config.mjs';
import { toProspect, mergeProspect } from './lib.mjs';

const { values: args } = parseArgs({
  options: {
    niche: { type: 'string', multiple: true },
    location: { type: 'string', multiple: true },
    pages: { type: 'string', default: '1' },
    'dry-run': { type: 'boolean', default: false },
    out: { type: 'string', default: `data/prospects/${COUNTRY.code.toLowerCase()}/${new Date().toISOString().slice(0, 10)}` },
  },
});

const niches = args.niche ?? Object.keys(NICHES);
const locations = args.location ?? LOCATIONS;
const maxPages = Math.min(3, Number(args.pages) || 1);
const API_KEY = process.env.GOOGLE_MAPS_API_KEY || 'proxy-injected'; // replaced by the proxy

for (const n of niches) if (!NICHES[n]) throw new Error(`Unknown niche: ${n}`);

const jobs = niches.flatMap((niche) =>
  NICHES[niche].queries.flatMap((query) => locations.map((location) => ({ niche, query, location }))));

const estimate = jobs.length * maxPages;
console.log(`${jobs.length} searches x up to ${maxPages} page(s) = at most ${estimate} requests (cap ${MAX_REQUESTS}).`);
if (args['dry-run']) process.exit(0);

async function search(textQuery, pageToken) {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': API_KEY, 'X-Goog-FieldMask': FIELD_MASK },
    body: JSON.stringify({
      textQuery, regionCode: COUNTRY.code, languageCode: COUNTRY.language,
      includePureServiceAreaBusinesses: true, pageSize: 20, ...(pageToken ? { pageToken } : {}),
    }),
  });
  if (!res.ok) throw new Error(`Places API ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

const prospects = new Map();
let requests = 0;
for (const { niche, query, location } of jobs) {
  let token;
  for (let page = 0; page < maxPages; page++) {
    if (requests >= MAX_REQUESTS) { console.warn('Request cap reached; stopping.'); break; }
    requests++;
    const data = await search(`${query} in ${location}, ${COUNTRY.name}`, token);
    for (const place of data.places ?? []) {
      if (place.businessStatus && place.businessStatus !== 'OPERATIONAL') continue;
      mergeProspect(prospects, toProspect(place, niche, query, location));
    }
    token = data.nextPageToken;
    if (!token) break;
    await new Promise((r) => setTimeout(r, 1500)); // next page token needs a moment
  }
  process.stdout.write(`\r${requests} requests, ${prospects.size} unique businesses`);
}
console.log();

mkdirSync(args.out, { recursive: true });
const file = join(args.out, 'places.json');
writeFileSync(file, JSON.stringify({ fetchedAt: new Date().toISOString(), requests, prospects: [...prospects.values()] }, null, 2));
console.log(`Saved ${prospects.size} businesses to ${file}. Next: node tools/prospects/rank.mjs ${args.out}`);
