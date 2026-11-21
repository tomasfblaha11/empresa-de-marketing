#!/usr/bin/env node
// Step 2: audit businesses that have their own site (PageSpeed Insights, mobile) and rank all.
// Usage: node tools/prospects/rank.mjs <run-folder> [--no-audit] [--concurrency 4]
// Writes prospects.csv (all, sorted by score) and audit.json (cache, so reruns skip audited sites).

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { scoreProspect, toCsv } from './lib.mjs';
import { NICHES } from './config.mjs';

const { values: args, positionals } = parseArgs({
  allowPositionals: true,
  options: { 'no-audit': { type: 'boolean', default: false }, concurrency: { type: 'string', default: '4' } },
});
const dir = positionals[0];
if (!dir) throw new Error('Usage: rank.mjs <run-folder>');

const { prospects } = JSON.parse(readFileSync(join(dir, 'places.json'), 'utf8'));
const auditFile = join(dir, 'audit.json');
const audits = existsSync(auditFile) ? JSON.parse(readFileSync(auditFile, 'utf8')) : {};
const API_KEY = process.env.GOOGLE_MAPS_API_KEY || 'proxy-injected'; // replaced by the proxy

async function audit(url) {
  const api = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
  api.searchParams.set('url', url);
  api.searchParams.set('strategy', 'mobile');
  for (const c of ['performance', 'seo']) api.searchParams.append('category', c);
  const res = await fetch(api, { headers: { 'X-Goog-Api-Key': API_KEY }, signal: AbortSignal.timeout(90_000) });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = body?.error?.message ?? `HTTP ${res.status}`;
    // PageSpeed reports unreachable sites as a 4xx/5xx with a FAILED_DOCUMENT_REQUEST-type error.
    const unreachable = /FAILED_DOCUMENT_REQUEST|ERRORED_DOCUMENT_REQUEST|DNS|unable to resolve|NO_FCP/i.test(msg);
    return unreachable ? { reachable: false, error: msg.slice(0, 200) } : { error: msg.slice(0, 200) };
  }
  const lh = body.lighthouseResult ?? {};
  const pct = (c) => (lh.categories?.[c]?.score == null ? null : Math.round(lh.categories[c].score * 100));
  const viewport = lh.audits?.viewport?.score;
  return {
    reachable: true,
    finalUrl: lh.finalDisplayedUrl ?? lh.finalUrl ?? url,
    https: (lh.finalDisplayedUrl ?? lh.finalUrl ?? url).startsWith('https://'),
    mobileFriendly: viewport == null ? null : viewport === 1,
    performance: pct('performance'),
    seo: pct('seo'),
  };
}

if (!args['no-audit']) {
  const todo = prospects.filter((p) => p.websiteType === 'own' && !audits[p.website]);
  console.log(`Auditing ${todo.length} websites with PageSpeed Insights...`);
  let done = 0;
  const worker = async () => {
    while (todo.length) {
      const p = todo.shift();
      try { audits[p.website] = await audit(p.website); } catch (e) { audits[p.website] = { error: String(e).slice(0, 200) }; }
      writeFileSync(auditFile, JSON.stringify(audits, null, 2));
      process.stdout.write(`\r${++done} audited`);
    }
  };
  await Promise.all(Array.from({ length: Number(args.concurrency) || 4 }, worker));
  console.log();
}

const rows = prospects.map((p) => {
  const a = audits[p.website];
  const { score, tier, reasons } = scoreProspect(p, a && !a.error ? a : a?.reachable === false ? a : null);
  return {
    ...p,
    niches: p.niches.map((n) => NICHES[n]?.label ?? n),
    score, tier, reasons,
    performance: a?.performance ?? '', mobileFriendly: a?.mobileFriendly ?? '', auditError: a?.error ?? '',
    contactStatus: '', notes: '',
  };
}).sort((x, y) => y.score - x.score || y.userRatingCount - x.userRatingCount);

const columns = ['tier', 'score', 'name', 'niches', 'location', 'phone', 'website', 'websiteType', 'performance',
  'mobileFriendly', 'rating', 'userRatingCount', 'reasons', 'address', 'serviceAreaOnly', 'mapsUrl', 'placeId',
  'auditError', 'contactStatus', 'notes'];
writeFileSync(join(dir, 'prospects.csv'), toCsv(rows, columns));

const count = (t) => rows.filter((r) => r.tier === t).length;
console.log(`${rows.length} prospects: A=${count('A')} B=${count('B')} C=${count('C')} -> ${join(dir, 'prospects.csv')}`);
