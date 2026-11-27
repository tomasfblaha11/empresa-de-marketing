import type { APIRoute } from 'astro';
import { settings } from '../i18n/content';
import { pages } from '../i18n/niches';
import { countries } from '../i18n/countries';

// Every indexable page, with its translation when there is one (hreflang alternates).
const entries: { en?: string; es?: string }[] = [
  { en: '/', es: '/es/' },
  ...pages.map((p) => ({ en: p.en?.path, es: p.es?.path })),
  { en: '/privacy/', es: '/es/privacidad/' },
];
const abs = (p: string) => new URL(p, settings.url).href;
const lastmod = new Date().toISOString().slice(0, 10);

// All home page versions (international + one per country) point to each other.
const homes = [{ hreflang: 'en', path: '/' }, { hreflang: 'es', path: '/es/' }, ...countries.map((k) => ({ hreflang: k.hreflang, path: k.path }))];
const homeAlts = homes.map((h) => `    <xhtml:link rel="alternate" hreflang="${h.hreflang}" href="${abs(h.path)}"/>`).join('\n');
const homeUrls = homes.map((h) => `  <url>\n    <loc>${abs(h.path)}</loc>\n    <lastmod>${lastmod}</lastmod>\n${homeAlts}\n  </url>`);

const urls = [...homeUrls, ...entries.slice(1).flatMap((e) => {
  const alts = (['en', 'es'] as const)
    .filter((l) => e[l])
    .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${abs(e[l]!)}"/>`)
    .join('\n');
  return (['en', 'es'] as const)
    .filter((l) => e[l])
    .map((l) => `  <url>\n    <loc>${abs(e[l]!)}</loc>\n    <lastmod>${lastmod}</lastmod>\n${alts}\n  </url>`);
})];

export const GET: APIRoute = () =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
