// Pure helpers: website classification, scoring and CSV. No network access here.

const SOCIAL_HOSTS = [
  'facebook.com', 'fb.com', 'fb.me', 'instagram.com', 'linktr.ee', 'tiktok.com',
  'linkedin.com', 'youtube.com', 'x.com', 'twitter.com',
];
// Listing pages that are not the business's own site.
const LISTING_HOSTS = [
  'airbnb.', 'booking.com', 'bookabach.co.nz', 'holidayhouses.co.nz', 'vrbo.com',
  'nocowboys.co.nz', 'builderscrack.co.nz', 'yellow.co.nz', 'neighbourly.co.nz',
];
// Free-builder subdomains: usually a sign of a quick, unmaintained site.
const BUILDER_HOSTS = ['wixsite.com', 'weebly.com', 'square.site', 'godaddysites.com', 'webnode.', 'jimdosite.com', 'wordpress.com', 'blogspot.com'];
// Google Business Profile websites were shut down in 2024: these links are dead.
const DEAD_HOSTS = ['business.site'];

function hostOf(url) {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return null;
  }
}

const matches = (host, list) => list.some((h) => host === h || host.endsWith('.' + h) || (h.endsWith('.') && host.includes(h)));

/** none | social | listing | dead | builder | own */
export function classifyWebsite(url) {
  if (!url) return 'none';
  const host = hostOf(url);
  if (!host) return 'none';
  if (matches(host, DEAD_HOSTS)) return 'dead';
  if (matches(host, SOCIAL_HOSTS)) return 'social';
  if (matches(host, LISTING_HOSTS)) return 'listing';
  if (matches(host, BUILDER_HOSTS)) return 'builder';
  return 'own';
}

/**
 * Score 0-100: higher means more likely to need (and pay for) a better website.
 * `audit` is optional PageSpeed data for own sites:
 * { reachable, https, mobileFriendly, performance, seo } (scores 0-100).
 */
export function scoreProspect(p, audit = null) {
  const reasons = [];
  let score = 0;
  const add = (n, why) => { score += n; reasons.push(why); };

  switch (p.websiteType) {
    case 'none': add(40, 'sin web'); break;
    case 'social': add(40, 'solo redes sociales'); break;
    case 'listing': add(35, 'solo anuncio en portal'); break;
    case 'dead': add(45, 'web caída (Google Sites cerrado)'); break;
    case 'builder': add(20, 'web en subdominio gratuito'); break;
    default: break;
  }

  if (p.websiteType === 'own' && audit) {
    if (audit.reachable === false) add(45, 'web no responde');
    else {
      if (audit.https === false) add(10, 'sin HTTPS');
      if (audit.mobileFriendly === false) add(20, 'no adaptada a móvil');
      if (typeof audit.performance === 'number') {
        if (audit.performance < 50) add(25, `lenta en móvil (${audit.performance})`);
        else if (audit.performance < 70) add(15, `algo lenta en móvil (${audit.performance})`);
      }
      if (typeof audit.seo === 'number' && audit.seo < 80) add(5, `SEO bajo (${audit.seo})`);
    }
  }

  // Review data only exists for Google sources; null means "unknown" and is not penalised.
  if (p.userRatingCount != null) {
    const reviews = p.userRatingCount;
    if (reviews >= 20) add(20, `${reviews} reseñas: negocio activo`);
    else if (reviews >= 5) add(10, `${reviews} reseñas`);
    else if (reviews < 3) add(-10, 'muy pocas reseñas');
    if ((p.rating ?? 0) >= 4.5 && reviews >= 5) add(5, `puntuación ${p.rating}`);
  }
  if (!p.phone) add(-15, 'sin teléfono');

  score = Math.max(0, Math.min(100, score));
  const tier = score >= 60 ? 'A' : score >= 40 ? 'B' : 'C';
  return { score, tier, reasons };
}

/** Normalise a Places API (New) result into a prospect row. */
export function toProspect(place, niche, query, location) {
  const websiteUri = place.websiteUri ?? '';
  return {
    placeId: place.id,
    name: place.displayName?.text ?? '',
    niches: [niche],
    queries: [`${query} @ ${location}`],
    location,
    address: place.formattedAddress ?? '',
    serviceAreaOnly: Boolean(place.pureServiceAreaBusiness),
    phone: place.nationalPhoneNumber ?? place.internationalPhoneNumber ?? '',
    website: websiteUri,
    websiteType: classifyWebsite(websiteUri),
    rating: place.rating ?? null,
    userRatingCount: place.userRatingCount ?? 0,
    status: place.businessStatus ?? '',
    primaryType: place.primaryType ?? '',
    mapsUrl: place.googleMapsUri ?? '',
  };
}

/** Merge a prospect into a Map keyed by placeId, combining niches and queries. */
export function mergeProspect(map, p) {
  const prev = map.get(p.placeId);
  if (!prev) { map.set(p.placeId, p); return; }
  for (const n of p.niches) if (!prev.niches.includes(n)) prev.niches.push(n);
  for (const q of p.queries) if (!prev.queries.includes(q)) prev.queries.push(q);
}

export function toCsv(rows, columns) {
  const esc = (v) => {
    const s = Array.isArray(v) ? v.join(' | ') : v == null ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [columns.join(','), ...rows.map((r) => columns.map((c) => esc(r[c])).join(','))].join('\n') + '\n';
}
