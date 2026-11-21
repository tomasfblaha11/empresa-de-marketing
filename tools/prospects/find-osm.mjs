#!/usr/bin/env node
// Step 1 (free alternative): find prospects in OpenStreetMap via the Overpass API.
// No key or billing needed. Coverage of small businesses is partial, and OSM has no reviews.
// Usage: node tools/prospects/find-osm.mjs [--niche paving-landscaping] [--print-query]
// Data © OpenStreetMap contributors, ODbL. Internal prospect list only; do not republish.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { COUNTRY, NICHES } from './config.mjs';
import { classifyWebsite, mergeProspect } from './lib.mjs';

const { values: args } = parseArgs({
  options: {
    niche: { type: 'string', multiple: true },
    'print-query': { type: 'boolean', default: false },
    endpoint: { type: 'string', default: 'https://overpass-api.de/api/interpreter' },
    out: { type: 'string', default: `data/prospects/${COUNTRY.code.toLowerCase()}/${new Date().toISOString().slice(0, 10)}-osm` },
  },
});

// OSM tag filters per niche. Name patterns catch businesses tagged generically.
export const OSM_FILTERS = {
  'house-care': [
    '["office"="property_management"]',
    '["name"~"caretak|house.?sit|bach (care|management)|holiday home (care|management)|property care|home watch",i]',
  ],
  'paving-landscaping': [
    '["craft"~"^(gardener|landscaper|paver|stonemason)$"]',
    '["name"~"landscap|paving|driveway|hardscap|retaining wall",i]["shop"!="garden_centre"]',
  ],
  'holiday-rentals': [
    '["tourism"~"^(chalet|apartment|guest_house)$"]["name"]',
  ],
};

const niches = args.niche ?? Object.keys(OSM_FILTERS);
for (const n of niches) if (!OSM_FILTERS[n] || !NICHES[n]) throw new Error(`Unknown niche: ${n}`);

function buildQuery(niche) {
  const parts = OSM_FILTERS[niche].map((f) => `nwr${f}(area.nz);`).join('\n  ');
  return `[out:json][timeout:180];\narea["ISO3166-1"="${COUNTRY.code}"][admin_level=2]->.nz;\n(\n  ${parts}\n);\nout center tags;`;
}

if (args['print-query']) {
  for (const n of niches) console.log(`# ${n}\n${buildQuery(n)}\n`);
  process.exit(0);
}

const tag = (t, ...keys) => keys.map((k) => t[k]).find(Boolean) ?? '';

function toProspect(el, niche) {
  const t = el.tags ?? {};
  const website = tag(t, 'website', 'contact:website', 'url') || tag(t, 'contact:facebook', 'facebook', 'contact:instagram');
  const town = tag(t, 'addr:city', 'addr:town', 'addr:village', 'addr:suburb', 'is_in:city');
  return {
    placeId: `osm:${el.type}/${el.id}`,
    name: t.name ?? '',
    niches: [niche],
    queries: ['openstreetmap'],
    location: town,
    address: [tag(t, 'addr:housenumber'), tag(t, 'addr:street'), town].filter(Boolean).join(' '),
    serviceAreaOnly: false,
    phone: tag(t, 'phone', 'contact:phone', 'contact:mobile', 'mobile'),
    website,
    websiteType: classifyWebsite(website),
    rating: null,
    userRatingCount: null, // OSM has no reviews; scoring skips this signal
    status: 'OPERATIONAL',
    primaryType: tag(t, 'craft', 'office', 'tourism', 'shop'),
    mapsUrl: `https://www.openstreetmap.org/${el.type}/${el.id}`,
  };
}

const prospects = new Map();
for (const niche of niches) {
  process.stdout.write(`Querying ${niche}... `);
  const res = await fetch(args.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'prospect-finder/0.1 (internal research)' },
    body: new URLSearchParams({ data: buildQuery(niche) }),
    signal: AbortSignal.timeout(240_000),
  });
  if (!res.ok) throw new Error(`Overpass ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const { elements = [] } = await res.json();
  let kept = 0;
  for (const el of elements) {
    if (!el.tags?.name || el.tags.disused || el.tags['disused:shop']) continue;
    mergeProspect(prospects, toProspect(el, niche));
    kept++;
  }
  console.log(`${kept} businesses`);
  await new Promise((r) => setTimeout(r, 5000)); // be polite to the public Overpass server
}

mkdirSync(args.out, { recursive: true });
const file = join(args.out, 'places.json');
writeFileSync(file, JSON.stringify({ source: 'openstreetmap', license: 'ODbL', fetchedAt: new Date().toISOString(), prospects: [...prospects.values()] }, null, 2));
console.log(`Saved ${prospects.size} businesses to ${file}. Next: node tools/prospects/rank.mjs ${args.out}`);
