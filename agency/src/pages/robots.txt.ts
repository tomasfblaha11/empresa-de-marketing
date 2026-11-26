import type { APIRoute } from 'astro';
import { settings } from '../i18n/content';
export const GET: APIRoute = () =>
  new Response(settings.preview ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\n\nSitemap: ${settings.url}/sitemap.xml\n`, { headers: { 'Content-Type': 'text/plain' } });
