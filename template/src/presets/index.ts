// Niche presets: colours and the words that change between niches.
// Everything client-specific lives in src/data/client.json, never here.

export interface Preset {
  colors: { brand: string; brandInk: string; accent: string; accentInk: string };
  copy: {
    quoteCta: string;
    servicesTitle: string;
    workTitle: string;
    aboutTitle: string;
    reviewsTitle: string;
    areaTitle: string;
    contactTitle: string;
    contactLead: string;
  };
  schemaType: string;
}

const base = {
  servicesTitle: 'What we do',
  reviewsTitle: 'What clients say',
  areaTitle: 'Where we work',
};

export const PRESETS: Record<string, Preset> = {
  'paving-landscaping': {
    colors: { brand: '#1F3D2B', brandInk: '#F5F6F4', accent: '#C8962E', accentInk: '#1C2024' },
    copy: {
      ...base,
      quoteCta: 'Get a free quote',
      workTitle: 'Recent work',
      aboutTitle: 'Who does the work',
      contactTitle: 'Tell us about your project',
      contactLead: 'Send a photo of the area and a rough size. We reply within one working day with a time for a free site visit.',
    },
    schemaType: 'HomeAndConstructionBusiness',
  },
  'house-care': {
    colors: { brand: '#1C2E4A', brandInk: '#F5F6F4', accent: '#F2C230', accentInk: '#1C2024' },
    copy: {
      ...base,
      quoteCta: 'Book a check',
      workTitle: 'What a visit looks like',
      aboutTitle: 'Who looks after your home',
      contactTitle: 'Going away? Talk to us first',
      contactLead: 'Tell us where the house is and how long it will be empty. We reply within one working day with a visit plan and price.',
    },
    schemaType: 'LocalBusiness',
  },
  'holiday-rentals': {
    colors: { brand: '#0F5257', brandInk: '#F5F6F4', accent: '#B8202F', accentInk: '#FFFFFF' },
    copy: {
      ...base,
      servicesTitle: 'The place',
      quoteCta: 'Check dates',
      workTitle: 'Look around',
      aboutTitle: 'Your hosts',
      reviewsTitle: 'What guests say',
      areaTitle: 'Getting here',
      contactTitle: 'Book direct and save',
      contactLead: 'Send your dates and number of guests. We confirm availability within a few hours, without booking-site fees.',
    },
    schemaType: 'LodgingBusiness',
  },
};
