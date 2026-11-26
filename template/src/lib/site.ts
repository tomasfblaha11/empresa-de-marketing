// Loads and validates the client sheet (src/data/client.json) once, at build time.
// A missing required field fails the build with a clear message instead of shipping a broken page.

import { z } from 'astro/zod';
import type { ImageMetadata } from 'astro';
import raw from '../data/client.json';
import { PRESETS } from '../presets';

const photo = z.object({ file: z.string(), alt: z.string().min(1, 'every photo needs alt text') });

const schema = z.object({
  niche: z.enum(Object.keys(PRESETS) as [string, ...string[]]),
  lang: z.string().default('en-NZ'),
  demo: z.boolean().default(false),
  // Sample sites shown on the agency website: fictional business, banner with a link back.
  sample: z.object({ by: z.string(), backUrl: z.string() }).optional(),
  siteUrl: z.url(),
  business: z.object({
    name: z.string().min(1),
    tagline: z.string().min(1),
    yearsInTrade: z.number().int().positive().optional(),
    credentials: z.array(z.string()).default([]),
  }),
  contact: z.object({
    phone: z.string().min(1),
    whatsapp: z.string().regex(/^\d*$/, 'whatsapp: international number, digits only').default(''),
    email: z.email(),
    address: z.string().default(''),
    areas: z.array(z.string()).min(1),
    hours: z.array(z.object({ days: z.string(), time: z.string() })).default([]),
    formEndpoint: z.string().default(''),
  }),
  services: z.array(z.object({ name: z.string(), description: z.string(), priceFrom: z.string().optional() })).min(1).max(8),
  highlights: z.array(z.string()).default([]),
  about: z.object({ story: z.string(), photo: z.string().optional(), photoAlt: z.string().optional() }),
  reviews: z.array(z.object({ quote: z.string(), author: z.string(), place: z.string().optional() })).default([]),
  googleReviews: z.object({ rating: z.number().optional(), count: z.number().optional(), url: z.string().default('') }).default({ url: '' }),
  social: z.object({ facebook: z.string().default(''), instagram: z.string().default('') }).default({ facebook: '', instagram: '' }),
  photos: z.object({
    hero: photo,
    gallery: z.array(photo.extend({ caption: z.string().optional() })).min(2, 'the gallery needs at least 2 photos'),
  }),
  legal: z.object({ responsible: z.string(), country: z.string().default('NZ') }),
});

const parsed = schema.safeParse(raw);
if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
  throw new Error(`src/data/client.json is incomplete:\n${issues}`);
}

export const site = parsed.data;
export const preset = PRESETS[site.niche];

// Photos live in src/assets/client/ (real client) or src/assets/demo/ (template demo).
const images = import.meta.glob<{ default: ImageMetadata }>('../assets/{client,demo}/*.{jpg,jpeg,png,webp,avif}', { eager: true });

export function img(file: string): ImageMetadata {
  const hit = Object.entries(images).find(([path]) => path.endsWith(`/client/${file}`))
    ?? Object.entries(images).find(([path]) => path.endsWith(`/demo/${file}`));
  if (!hit) throw new Error(`Photo "${file}" not found in src/assets/client/ or src/assets/demo/`);
  return hit[1].default;
}

// Links that work both at the domain root and inside a sub-folder (e.g. /examples/paving/).
const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
export const link = (path = '') => `${base}${path.replace(/^\//, '')}`;
const siteRoot = site.siteUrl.endsWith('/') ? site.siteUrl : `${site.siteUrl}/`;
export const absolute = (path = '') => new URL(path.replace(/^\//, ''), siteRoot).href;
export const fromOrigin = (path: string) => new URL(path, new URL(site.siteUrl).origin).href;
export const noindex = site.demo || Boolean(site.sample);

export const tel = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
export const whatsappUrl = (n: string, text: string) => `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
