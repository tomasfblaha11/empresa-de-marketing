#!/usr/bin/env node
// Step 1 (UK and Ireland): small *limited companies* only. In the UK (PECR) and Ireland (ePrivacy
// Regulations) first-contact marketing email is allowed to companies, not to sole traders or
// ordinary partnerships, so every prospect here comes from a register that proves it is a company:
//   --source ch      UK Companies House advanced search (by SIC code and registered-office town)
//   --source failte  Ireland: Fáilte Ireland accommodation register (open data CSV) where the
//                    owner on the register is a Limited/DAC/Teoranta company
// Neither register publishes websites or emails, so the website is found by trying the domains the
// company name suggests (greenleaflandscapes.co.uk...) and confirming the page mentions the name.
// Emails are then read from that website by check-sites.mjs.
//
// Usage:
//   NODE_USE_ENV_PROXY=1 node tools/prospects/find-limited-companies.mjs <out> --source ch --sic 81300,55209 --towns Truro,Keswick
//   NODE_USE_ENV_PROXY=1 node tools/prospects/find-limited-companies.mjs <out> --source failte --csv <failte-accommodation.csv>
// Writes <out>/manual.json (merged with what is already there).

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

const { values: a, positionals } = parseArgs({
  allowPositionals: true,
  options: { source: { type: 'string' }, sic: { type: 'string' }, towns: { type: 'string' }, csv: { type: 'string' }, max: { type: 'string', default: '60' } },
});
const dir = positionals[0];
if (!dir || !a.source) throw new Error('Usage: see header');
mkdirSync(dir, { recursive: true });
const outFile = join(dir, 'manual.json');
const out = existsSync(outFile) ? JSON.parse(readFileSync(outFile, 'utf8')) : [];
const seen = new Set(out.map((p) => p.profile));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';

async function get(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(25_000) });
    return res.ok ? await res.text() : null;
  } catch { return null; }
}
const title = (s) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
const STOP = /\b(the|limited|ltd|dac|teoranta|llp|company|co|services|service|and|&|of|uk|ireland|t\/a)\b/gi;

// Candidate domains from a company or trading name: "Green Leaf Landscapes Ltd" → greenleaflandscapes.co.uk, ...
function domainsFor(name, tlds) {
  const base = name.toLowerCase().replace(/\(.*?\)/g, ' ').replace(/[’'`]/g, '').replace(STOP, ' ').replace(/[^a-z0-9 ]/g, ' ').trim();
  const words = base.split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const joined = words.join('');
  const dashed = words.join('-');
  const set = new Set();
  for (const t of tlds) { set.add(joined + t); if (words.length > 1) set.add(dashed + t); }
  return [...set].filter((d) => d.length <= 63 + 6);
}
async function dnsOk(host) {
  try {
    const j = await (await fetch(`https://dns.google/resolve?name=${host}&type=A`, { signal: AbortSignal.timeout(15_000) })).json();
    return j.Status === 0 && (j.Answer?.length ?? 0) > 0;
  } catch { return false; }
}
// Confirm the site belongs to this business: the page must mention its name (two distinctive words,
// or the only one) AND its place (town, county or postcode district). Pages that do not load cannot be
// confirmed and are skipped: we never tell a business about a website that may not be theirs.
async function findSite(name, tlds, places) {
  const words = name.toLowerCase().replace(STOP, ' ').replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w) => w.length > 3);
  const need = Math.min(2, words.length);
  const placeRe = new RegExp(places.filter(Boolean).map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i');
  for (const d of domainsFor(name, tlds)) {
    if (!(await dnsOk(d)) && !(await dnsOk(`www.${d}`))) continue;
    const html = (await get(`https://${d}`)) ?? (await get(`https://www.${d}`));
    if (!html) continue;
    const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').toLowerCase();
    const hits = words.filter((w) => text.includes(w)).length;
    if (hits >= need && placeRe.test(text)) return { website: `https://${d}`, confirmed: true };
  }
  return null;
}

const NICHE_81300 = /landscap|garden|lawn|mow|paving|patio|grounds|tree|hedge|turf|outdoor|driveway|green|horticult|arbor|fenc/i;
const STREET = '(?! (road|street|lane|avenue|close|way|drive|terrace|place|gardens|crescent|grove|park|square|walk|row|mews|hill))';

const max = Number(a.max);
let added = 0;

if (a.source === 'ch') {
  for (const town of a.towns.split(',')) {
    for (const sic of a.sic.split(',')) {
      let html = '';
      for (let page = 1; page <= 3; page++) { // up to 60 companies per town and activity
        const part = await get(`https://find-and-update.company-information.service.gov.uk/advanced-search/get-results?sicCodes=${sic}&registeredOfficeAddress=${encodeURIComponent(town)}&status=active&type=ltd&page=${page}`);
        await sleep(800);
        if (!part || !part.includes('/company/')) break;
        html += part;
      }
      if (!html) continue;
      const rows = [...html.matchAll(/href=\/company\/(\w+) target="_blank">([^<]+)<span[\s\S]*?<li>([^<]*Incorporated on[^<]*)<\/li>\s*<li><\/li>\s*<li>([^<]+)<\/li>\s*<li>SIC codes - ([^<]+)<\/li>/g)];
      let n = 0;
      const inTown = new RegExp(`\\b${town}\\b${STREET}`, 'i');
      for (const [, number, rawName, inc, address] of rows) {
        const profile = `https://find-and-update.company-information.service.gov.uk/company/${number}`;
        if (seen.has(profile) || n >= max) continue;
        const name = rawName.replace(/&amp;/g, '&').trim();
        if (!inTown.test(address) || /\blondon\b/i.test(address)) continue; // registered elsewhere
        if (sic === '81300' && !NICHE_81300.test(name)) continue; // same SIC code, different trade
        n++;
        const postcode = address.match(/\b([A-Z]{1,2}\d{1,2}[A-Z]?) ?\d[A-Z]{2}\b/)?.[1];
        const county = address.match(/(Cornwall|Devon|Cumbria|North Yorkshire|Yorkshire|Norfolk|Gloucestershire|Pembrokeshire|Gwynedd|Conwy|Highland|Argyll|Dorset|Somerset|Northumberland|Suffolk|Kent|Sussex)/i)?.[1];
        const site = await findSite(name, ['.co.uk', '.com', '.uk'], [town, county, postcode]);
        seen.add(profile);
        if (!site) continue;
        out.push({
          name: title(name), legalForm: 'Private limited company', companyNumber: number, incorporated: inc.replace(/^.*Incorporated on /, ''),
          address: address.trim(), website: site.website, siteConfirmed: site.confirmed, email: '', phone: '',
          category: sic === '81300' ? 'Landscaping' : 'Holiday accommodation', foundIn: `${town}/${sic}`, country: 'UK',
          source: 'Companies House', profile,
        });
        added++;
      }
      writeFileSync(outFile, JSON.stringify(out, null, 1));
      console.log(`${town} ${sic}: ${rows.length} companies, ${added} with a website so far`);
    }
  }
}

if (a.source === 'failte') {
  const text = readFileSync(a.csv, 'utf8').replace(/^﻿/, '');
  const lines = text.split(/\r?\n/).filter(Boolean);
  const parse = (l) => { const o = []; let c = '', q = false; for (let i = 0; i < l.length; i++) { const ch = l[i]; if (q) { if (ch === '"' && l[i + 1] === '"') { c += '"'; i++; } else if (ch === '"') q = false; else c += ch; } else if (ch === '"') q = true; else if (ch === ',') { o.push(c); c = ''; } else c += ch; } o.push(c); return o; };
  const head = parse(lines[0]);
  const rows = lines.slice(1).map((l) => Object.fromEntries(parse(l).map((v, i) => [head[i], v])));
  const small = rows.filter((r) => r.Sector !== 'Hotel' && /\b(limited|ltd|dac|teoranta|unlimited company)\b/i.test(r['Owner(s) as it appears on Register'] ?? '') && Number(r['Total Units'] || 0) <= 25);
  console.log(`${small.length} small accommodation businesses owned by companies`);
  for (const r of small) {
    const profile = `failte-${r['Property Reg Number']}`;
    if (seen.has(profile)) continue;
    seen.add(profile);
    const name = r['Account Name'].trim();
    const site = await findSite(name, ['.ie', '.com'], [r['Address City/Town'], r['Address County'], (r['Eircode/Postal code'] || '').slice(0, 3)]);
    if (!site) continue;
    out.push({
      name, legalForm: 'Company', owner: r['Owner(s) as it appears on Register'], address: `${r['Address Line 1']}, ${r['Address City/Town']}, ${r['Address County']}`,
      website: site.website, siteConfirmed: site.confirmed, email: '', phone: '',
      category: `Accommodation (${r.Sector})`, foundIn: `${r['Address City/Town']} (${r['Address County']})/accommodation`, country: 'IE',
      source: 'Fáilte Ireland register', profile,
    });
    added++;
    if (added % 10 === 0) { writeFileSync(outFile, JSON.stringify(out, null, 1)); console.log(`${added} with a website`); }
  }
  writeFileSync(outFile, JSON.stringify(out, null, 1));
}
console.log(`done: ${added} added (total ${out.length})`);
