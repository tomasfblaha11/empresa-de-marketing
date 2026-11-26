import type { APIRoute } from 'astro';
import { site, absolute, noindex } from '../lib/site';

// Demos must never be indexed; real sites point crawlers to the sitemap.
export const GET: APIRoute = () => {
  const body = noindex
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${absolute('sitemap.xml')}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
