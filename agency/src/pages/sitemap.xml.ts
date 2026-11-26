import type { APIRoute } from 'astro';
import { settings } from '../i18n/content';
const pages = ['/', '/es/', '/privacy/', '/es/privacidad/'];
export const GET: APIRoute = () =>
  new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `  <url><loc>${settings.url}${p}</loc></url>`).join('\n')}\n</urlset>\n`, { headers: { 'Content-Type': 'application/xml' } });
