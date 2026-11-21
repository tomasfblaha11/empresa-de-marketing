import type { APIRoute } from 'astro';
import { site } from '../lib/site';

// Demos must never be indexed; real sites point crawlers to the sitemap.
export const GET: APIRoute = () => {
  const body = site.demo
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', site.siteUrl).href}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
