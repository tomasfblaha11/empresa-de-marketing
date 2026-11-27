// One version of the home page per country we sell to: language, currency, price, how to pay and
// a few country-specific lines. The generic home pages (/ and /es/) let visitors pick a country.
import type { Lang } from './content';

export type NicheKey = 'gardens' | 'stay' | 'homecare';

export interface Country {
  id: 'au' | 'nz' | 'us' | 'uk' | 'ie' | 'ar' | 'cl' | 'uy';
  lang: Lang;
  hreflang: string; // en-NZ, es-CL...
  path: string;
  flag: string;
  name: { en: string; es: string };
  currencyCode: string;
  price: string; // monthly fee
  extra: string; // each extra website
  title: string;
  description: string;
  pay: string; // how clients in this country pay
  niches: NicheKey[]; // what we offer here, most relevant first
  timezones: RegExp; // used to suggest the country on the first visit
}

export const countries: Country[] = [
  {
    id: 'uk', lang: 'en', hreflang: 'en-GB', path: '/uk/', flag: '🇬🇧',
    name: { en: 'United Kingdom', es: 'Reino Unido' },
    currencyCode: 'GBP', price: '£49', extra: '£39',
    title: 'Ceibo Works | Websites for small businesses in the UK',
    description: 'Websites for gardeners, landscapers, B&Bs and holiday cottages in the UK. Built for free, looked after for £49 a month. No long contract.',
    pay: 'Monthly, by UK bank transfer or by debit or credit card through a secure payment link. Prices in pounds.',
    niches: ['gardens', 'stay', 'homecare'],
    timezones: /^Europe\/(London|Belfast)|GB/,
  },
  {
    id: 'ie', lang: 'en', hreflang: 'en-IE', path: '/ie/', flag: '🇮🇪',
    name: { en: 'Ireland', es: 'Irlanda' },
    currencyCode: 'EUR', price: '€55', extra: '€45',
    title: 'Ceibo Works | Websites for small businesses in Ireland',
    description: 'Websites for landscapers, gardeners, B&Bs and holiday homes in Ireland. Built for free, looked after for €55 a month. No long contract.',
    pay: 'Monthly, by SEPA bank transfer or by debit or credit card through a secure payment link. Prices in euro.',
    niches: ['gardens', 'stay', 'homecare'],
    timezones: /^Europe\/Dublin/,
  },
  {
    id: 'au', lang: 'en', hreflang: 'en-AU', path: '/au/', flag: '🇦🇺',
    name: { en: 'Australia', es: 'Australia' },
    currencyCode: 'AUD', price: 'A$79', extra: 'A$69',
    title: 'Ceibo Works | Websites for small businesses in Australia',
    description: 'Websites for landscapers, B&Bs, guest houses and holiday homes in Australia. Built for free, looked after for A$79 a month. No long contract.',
    pay: 'Monthly, by Australian bank transfer or by debit or credit card through a secure payment link. Prices in Australian dollars.',
    niches: ['stay', 'gardens', 'homecare'],
    timezones: /^Australia\//,
  },
  {
    id: 'nz', lang: 'en', hreflang: 'en-NZ', path: '/nz/', flag: '🇳🇿',
    name: { en: 'New Zealand', es: 'Nueva Zelanda' },
    currencyCode: 'NZD', price: 'NZ$79', extra: 'NZ$69',
    title: 'Ceibo Works | Websites for small businesses in New Zealand',
    description: 'Websites for landscapers, property caretakers and holiday homes in New Zealand. Built for free, looked after for NZ$79 a month.',
    pay: 'Monthly, by debit or credit card through a secure payment link, or with PayPal. Prices in New Zealand dollars.',
    niches: ['gardens', 'homecare', 'stay'],
    timezones: /^Pacific\/(Auckland|Chatham)|^NZ/,
  },
  {
    id: 'us', lang: 'en', hreflang: 'en-US', path: '/us/', flag: '🇺🇸',
    name: { en: 'United States', es: 'Estados Unidos' },
    currencyCode: 'USD', price: 'US$79', extra: 'US$69',
    title: 'Ceibo Works | Websites for small businesses in the US',
    description: 'Websites for home watch services, landscapers, cabins and B&Bs in the United States. Built for free, looked after for US$79 a month.',
    pay: 'Monthly, by bank transfer (ACH) or by debit or credit card through a secure payment link, or with PayPal. Prices in US dollars.',
    niches: ['homecare', 'stay', 'gardens'],
    timezones: /^America\/(New_York|Chicago|Denver|Los_Angeles|Phoenix|Anchorage|Detroit|Boise|Indiana|Kentucky|North_Dakota|Menominee)|^Pacific\/Honolulu|^US\//,
  },
  {
    id: 'uy', lang: 'es', hreflang: 'es-UY', path: '/es/uy/', flag: '🇺🇾',
    name: { en: 'Uruguay', es: 'Uruguay' },
    currencyCode: 'USD', price: 'US$49', extra: 'US$39',
    title: 'Ceibo Works | Páginas web para negocios pequeños en Uruguay',
    description: 'Páginas web para posadas, cabañas, estancias e inmobiliarias de Uruguay. Te la armo gratis y la mantengo por US$49 al mes, sin contrato largo.',
    pay: 'En dólares, todos los meses, con tarjeta de débito o crédito por un link de pago seguro, o con PayPal.',
    niches: ['stay', 'homecare', 'gardens'],
    timezones: /^America\/Montevideo/,
  },
  {
    id: 'cl', lang: 'es', hreflang: 'es-CL', path: '/es/cl/', flag: '🇨🇱',
    name: { en: 'Chile', es: 'Chile' },
    currencyCode: 'USD', price: 'US$49', extra: 'US$39',
    title: 'Ceibo Works | Páginas web para negocios pequeños en Chile',
    description: 'Páginas web para cabañas, hostales, lodges y pymes de Chile. Te la armo gratis y la mantengo por US$49 al mes, sin contrato largo.',
    pay: 'En dólares, todos los meses, con tarjeta de crédito o débito por un link de pago seguro, o con PayPal.',
    niches: ['stay', 'gardens', 'homecare'],
    timezones: /^America\/(Santiago|Punta_Arenas)|^Pacific\/Easter|^Chile/,
  },
  {
    id: 'ar', lang: 'es', hreflang: 'es-AR', path: '/es/ar/', flag: '🇦🇷',
    name: { en: 'Argentina', es: 'Argentina' },
    currencyCode: 'ARS', price: 'ARS 45.000', extra: 'ARS 40.000',
    title: 'Ceibo Works | Páginas web para negocios pequeños en Argentina',
    description: 'Páginas web para cabañas, paisajistas y pequeños negocios de Argentina. Te la armo gratis y la mantengo cada mes, en pesos, sin contrato largo.',
    pay: 'En pesos, todos los meses, por transferencia bancaria o Mercado Pago.',
    niches: ['stay', 'gardens', 'homecare'],
    timezones: /^America\/(Argentina|Buenos_Aires|Cordoba|Mendoza|Catamarca|Jujuy)/,
  },
];

export const byId = Object.fromEntries(countries.map((c) => [c.id, c])) as Record<Country['id'], Country>;

// Labels for the "what kind of business?" chips and the wheel reorder (?for=...).
export const nicheLabels: Record<NicheKey, { en: string; es: string; sample: 'paving' | 'housecare' | 'rental' }> = {
  gardens: { en: 'Gardens and paving', es: 'Jardines y paisajismo', sample: 'paving' },
  stay: { en: 'Cottages, cabins and B&Bs', es: 'Cabañas y alojamientos', sample: 'rental' },
  homecare: { en: 'Home care and home watch', es: 'Cuidado de casas', sample: 'housecare' },
};
