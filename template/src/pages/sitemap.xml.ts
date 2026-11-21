import type { APIRoute } from 'astro';
import { site } from '../lib/site';

const PAGES = ['/', '/privacy/'];

export const GET: APIRoute = () => {
  const urls = PAGES.map((p) => `  <url><loc>${new URL(p, site.siteUrl).href}</loc></url>`).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
