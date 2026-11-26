#!/usr/bin/env node
// Step 2: check each prospect's website and describe what is wrong with it, in plain Spanish.
// Input: <folder>/yellow.json (find-yellow.mjs), yp-us.json (find-yp-us.mjs) and/or <folder>/manual.json ([{name, website, email, ...}]).
// Output: <folder>/checked.json (cache) — then run report.mjs.
// Usage: NODE_USE_ENV_PROXY=1 node tools/prospects/check-sites.mjs <folder> [--concurrency 6]
//
// Only looks at the public home page (and a contact page when no email is known). No forms are
// submitted and nothing is stored beyond what the business itself publishes.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { createRequire } from 'node:module';

// A real browser (preinstalled Playwright Chromium) double-checks pages that look empty in raw
// HTML, because many modern sites only show their content after JavaScript runs.
let browser;
async function renderedText(url) {
  try {
    if (!browser) {
      const { chromium } = createRequire(import.meta.url)('playwright');
      browser = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined });
    }
    const page = await browser.newPage();
    try {
      await page.goto(url, { timeout: 30_000, waitUntil: 'networkidle' });
      return (await page.innerText('body')).replace(/\s+/g, ' ').trim();
    } finally { await page.close(); }
  } catch { return null; }
}
const BOT_WALL = /request is being verified|checking your browser|just a moment|verify you are human|captcha|access denied|attention required/i;

const { values: args, positionals } = parseArgs({ allowPositionals: true, options: { concurrency: { type: 'string', default: '6' } } });
const dir = positionals[0];
if (!dir) throw new Error('Usage: check-sites.mjs <folder>');
const read = (f) => (existsSync(join(dir, f)) ? JSON.parse(readFileSync(join(dir, f), 'utf8')) : null);
const outFile = join(dir, 'checked.json');
const cache = read('checked.json') ?? {};

const fromYellow = Object.values(read('yellow.json')?.listings ?? {}).map((l) => ({ ...l, country: 'NZ', source: 'Yellow.co.nz' }));
const fromYpUs = Object.values(read('yp-us.json')?.listings ?? {}).map((l) => ({ ...l, country: 'US', source: 'YellowPages.com' }));
const fromSernatur = Object.values(read('sernatur-cl.json')?.listings ?? {}).map((l) => ({ ...l, country: 'CL', source: 'SERNATUR' }));
const manual = read('manual.json') ?? [];
const all = [...fromYellow, ...fromYpUs, ...fromSernatur, ...manual];

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';
const FREE_MAIL = /@(gmail|adinet|vera|movistar|entelchile|vtr|terra|googlemail|xtra|hotmail|outlook|live|yahoo|ymail|icloud|me|msn|aol|slingshot|orcon|vodafone|clear|paradise|actrix|inspire|kinect|farmside|woosh|ihug|windowslive|protonmail|bigpond|comcast|att|sbcglobal|verizon|bellsouth|cox|charter|earthlink)\./i;
const SOCIAL = /facebook\.com|instagram\.com|linktr\.ee|business\.site|g\.page|google\.com\/maps/i;

function candidateUrl(p) {
  if (p.website) return p.website.startsWith('http') ? p.website : `http://${p.website}`;
  if (p.email && !FREE_MAIL.test(p.email)) return `http://${p.email.split('@')[1]}`; // site guessed from the email domain
  return '';
}

async function fetchPage(url) {
  // Follows redirects by hand so the final URL is known. This environment can only reach HTTPS,
  // so every address is tried over HTTPS; a redirect to plain HTTP is reported, not followed.
  let current = url.replace(/^http:/, 'https:');
  for (let hop = 0; hop < 6; hop++) {
    let res;
    try {
      res = await fetch(current, { redirect: 'manual', headers: { 'User-Agent': UA, Accept: 'text/html' }, signal: AbortSignal.timeout(25_000) });
    } catch (e) {
      const why = String(e?.cause?.message ?? e?.cause?.code ?? e?.message ?? e);
      return { error: /certificate|SSL|TLS/i.test(why) ? 'ssl' : /timeout|aborted/i.test(why) ? 'timeout' : 'unreachable', detail: why.slice(0, 160), url: current };
    }
    const loc = res.headers.get('location');
    if (res.status >= 300 && res.status < 400 && loc) {
      const next = new URL(loc, current).href;
      if (next.startsWith('http:')) return { insecureRedirect: true, url: next };
      current = next; continue;
    }
    const html = (await res.text().catch(() => '')).slice(0, 600_000);
    return { status: res.status, url: current, html };
  }
  return { error: 'redirect-loop', url: current };
}

const PARKED = /domain (name )?(is )?for sale|buy this domain|this domain (has expired|is parked|may be for sale)|parked (free|domain)|sedoparking|hugedomains|dan\.com|afternic|domain has expired|account (has been )?suspended|this account has been suspended|website (is )?coming soon|site (is )?under construction|under construction|default web site page|welcome to nginx|apache2 ubuntu default|index of \/|future home of|launching soon/i;
const BUILDERS = [[/wix\.com|wixstatic/i, 'Wix'], [/weebly/i, 'Weebly'], [/godaddy|websitebuilder|img1\.wsimg/i, 'GoDaddy'], [/squarespace/i, 'Squarespace'], [/jimdo/i, 'Jimdo'], [/site123/i, 'Site123'], [/wp-content|wordpress/i, 'WordPress'], [/webnode/i, 'Webnode'], [/yola/i, 'Yola']];

function findEmails(html) {
  const found = new Set();
  for (const m of html.matchAll(/mailto:([^"'?>\s]+)/gi)) found.add(decodeURIComponent(m[1]).toLowerCase());
  for (const m of html.matchAll(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/g)) found.add(m[0].toLowerCase());
  return [...found].filter((e) => !/\.(png|jpe?g|gif|webp|svg)$|sentry|wixpress|example\.|yourdomain|domain\.com|@2x|godaddy|squarespace|wordpress/.test(e));
}

// Public DNS lookup (this environment has no resolver of its own): 'none' when the domain no longer exists.
async function dnsStatus(host) {
  try {
    const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(host)}&type=A`, { signal: AbortSignal.timeout(15_000) });
    const j = await res.json();
    if (j.Status === 3) return 'none';
    return j.Answer?.length ? 'ok' : 'empty';
  } catch { return 'unknown'; }
}

async function check(p) {
  const url = candidateUrl(p);
  const r = { url, problems: [], notes: [], emails: [] };
  if (!url) { r.verdict = 'sin-web'; r.problems.push('No tiene página web (solo aparece en directorios)'); return r; }
  if (SOCIAL.test(url)) { r.verdict = 'sin-web'; r.problems.push('No tiene web propia: su "web" es una página de Facebook o Google'); return r; }
  const page = await fetchPage(url);
  r.finalUrl = page.url;
  const guessed = !p.website;
  if (page.insecureRedirect) {
    r.verdict = 'deficiente';
    r.problems.push('Sin HTTPS: la web solo funciona sin conexión segura y Chrome la marca como "No seguro"');
    return r;
  }
  if (page.error) {
    if (guessed) { r.verdict = 'sin-web'; r.problems.push('No tiene página web (el dominio de su email no tiene web activa)'); return r; }
    const host = new URL(page.url).hostname;
    // Check both the bare domain and www: a site can live on either.
    const bare = host.replace(/^www\./, '');
    const statuses = page.error === 'unreachable' ? [await dnsStatus(bare), await dnsStatus(`www.${bare}`)] : ['ok'];
    const dns = statuses.includes('ok') ? 'ok' : statuses.includes('none') ? 'none' : statuses[0];
    if (dns === 'none' || dns === 'empty') {
      r.verdict = 'caida';
      r.problems.push('El dominio de su web venció o ya no existe: quien entra desde Google o desde su ficha no encuentra nada');
      return r;
    }
    if (page.error === 'unreachable') {
      r.verdict = 'deficiente';
      r.problems.push('Su web no abre en versión segura (https). Si funciona, es sin seguridad y Chrome muestra "No seguro"');
      return r;
    }
    r.verdict = 'caida';
    r.problems.push(page.error === 'ssl' ? 'La web da error de seguridad (certificado vencido o inválido): el navegador avisa "no seguro" y la mayoría se va'
      : page.error === 'timeout' ? 'La web no termina de cargar (tarda más de 25 segundos)'
      : 'La web no abre con conexión segura (https): o está caída, o solo funciona sin seguridad y Chrome la marca como "No seguro"');
    return r;
  }
  if ([401, 403, 429].includes(page.status)) { r.verdict = 'ok'; r.notes.push(`Bloquea revisiones automáticas (${page.status}); revisar a mano`); return r; }
  if (page.status === 404 && new URL(page.url).pathname.length > 1) {
    const root = await fetchPage(new URL('/', page.url).href);
    if (root.html && root.status < 400) { r.verdict = 'ok'; r.notes.push('El enlace de su ficha apunta a una página que ya no existe, pero la web principal funciona'); return r; }
  }
  if (page.status >= 400) {
    if (guessed) { r.verdict = 'sin-web'; r.problems.push('No tiene página web (el dominio de su email no tiene web activa)'); return r; }
    r.verdict = 'caida'; r.problems.push(`La web da error ${page.status}: los clientes ven una página de error`); return r;
  }
  const html = page.html;
  const visible = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  r.title = (html.match(/<title[^>]*>([^<]*)/i)?.[1] ?? '').trim().slice(0, 120);
  r.emails = findEmails(html);
  if (BOT_WALL.test(visible.slice(0, 2000)) && visible.trim().length < 400) { r.verdict = 'ok'; r.notes.push('Tiene filtro anti-robots; revisar a mano'); return r; }
  let looksEmpty = PARKED.test(visible.slice(0, 5000)) || visible.trim().length < 200;
  if (looksEmpty) {
    const rendered = await renderedText(page.url);
    if (rendered && BOT_WALL.test(rendered.slice(0, 500)) && rendered.length < 400) { r.verdict = 'ok'; r.notes.push('Tiene filtro anti-robots; revisar a mano'); return r; }
    if (rendered && rendered.length > 600 && !PARKED.test(rendered.slice(0, 3000))) looksEmpty = false;
    else if (rendered && rendered.length >= 200 && !PARKED.test(rendered.slice(0, 3000))) {
      r.verdict = 'deficiente'; r.problems.push('La web es casi una página en blanco: solo un nombre y un teléfono, sin fotos ni servicios'); return r;
    }
  }
  if (looksEmpty) {
    r.verdict = guessed ? 'sin-web' : 'caida';
    r.problems.push(guessed ? 'No tiene página web (su dominio está vacío o en construcción)' : 'La web está vacía, "en construcción" o el dominio está estacionado/en venta');
    return r;
  }
  if (guessed) r.notes.push(`Web encontrada por el dominio de su email: ${page.url}`);
  if (page.url.startsWith('http:')) r.problems.push('Sin HTTPS: Chrome la marca como "No seguro"');
  if (!/<meta[^>]+name=["']?viewport/i.test(html)) r.problems.push('No se adapta al teléfono (en el móvil se ve diminuta)');
  const years = [...visible.matchAll(/(?:©|&copy;|copyright)\s*(?:[^0-9]{0,30})?((?:19|20)\d{2})(?:\s*[-–]\s*((?:19|20)\d{2}))?/gi)].map((m) => Number(m[2] ?? m[1]));
  if (years.length) {
    const y = Math.max(...years);
    r.copyright = y;
    if (y <= 2021) r.problems.push(`Desactualizada: el pie de página dice © ${y}`);
  }
  if (/<frameset|<font |<marquee|<center>|bgcolor=/i.test(html)) r.problems.push('Diseño muy antiguo (tecnología de los años 2000)');
  if (/flash|\.swf/i.test(html) && /<object|<embed/i.test(html)) r.problems.push('Usa Flash, que ya no funciona en ningún navegador');
  const builder = BUILDERS.find(([re]) => re.test(html));
  if (builder) r.builder = builder[1];
  r.verdict = r.problems.length ? 'deficiente' : 'ok';
  if (!r.emails.length && !p.email) {
    for (const path of ['/contact', '/contact-us', '/contact/']) {
      const c = await fetchPage(new URL(path, page.url).href);
      if (c.html) { r.emails = findEmails(c.html); if (r.emails.length) break; }
    }
  }
  return r;
}

const todo = all.filter((p) => !cache[p.profile ?? p.name]);
console.log(`${all.length} prospects, ${todo.length} to check`);
let i = 0;
async function worker() {
  while (i < todo.length) {
    const p = todo[i++];
    try { cache[p.profile ?? p.name] = { ...p, check: await check(p) }; }
    catch (e) { cache[p.profile ?? p.name] = { ...p, check: { verdict: 'error', problems: [String(e).slice(0, 120)] } }; }
    if (i % 20 === 0) { writeFileSync(outFile, JSON.stringify(cache, null, 2)); console.log(`${i}/${todo.length}`); }
  }
}
await Promise.all(Array.from({ length: Number(args.concurrency) }, worker));
await browser?.close();
writeFileSync(outFile, JSON.stringify(cache, null, 2));
const counts = {};
for (const v of Object.values(cache)) counts[v.check.verdict] = (counts[v.check.verdict] ?? 0) + 1;
console.log('done', counts);
