// Prospect search configuration: New Zealand.
// Each niche has search phrases; each phrase is combined with each location.

export const COUNTRY = { code: 'NZ', name: 'New Zealand', language: 'en' };

export const NICHES = {
  'house-care': {
    label: 'Cuidado de casas vacías',
    queries: ['property caretaker', 'bach caretaker', 'holiday home management', 'house sitting service'],
  },
  'paving-landscaping': {
    label: 'Paving y paisajismo',
    queries: ['landscaping', 'landscape design', 'driveway paving contractor', 'retaining walls contractor'],
  },
  'holiday-rentals': {
    label: 'Casas de vacaciones',
    queries: ['holiday home rental', 'bach rental', 'self contained cottage accommodation'],
  },
};

// Main cities plus holiday-home areas (baches).
export const LOCATIONS = [
  'Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Tauranga', 'Dunedin',
  'Queenstown', 'Wanaka', 'Nelson', 'Napier', 'New Plymouth', 'Whangarei',
  'Rotorua', 'Taupo', 'Coromandel', 'Whitianga', 'Kerikeri', 'Blenheim',
  'Palmerston North', 'Invercargill', 'Waihi Beach', 'Kaikoura',
];

// Hard ceiling on Places API calls per run. The Enterprise tier (needed for websiteUri)
// has 1,000 free calls per month; keep a margin.
export const MAX_REQUESTS = 600;

// Fields requested from Text Search (New). websiteUri, phone and rating bill as Enterprise.
export const FIELD_MASK = [
  'places.id', 'places.displayName', 'places.formattedAddress', 'places.nationalPhoneNumber',
  'places.internationalPhoneNumber', 'places.websiteUri', 'places.rating', 'places.userRatingCount',
  'places.businessStatus', 'places.googleMapsUri', 'places.primaryType',
  'places.pureServiceAreaBusiness', 'nextPageToken',
].join(',');
