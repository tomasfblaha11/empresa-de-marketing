// All copy and business settings for the Ceibo Works site, in English and Spanish.
// Change prices, contact details and texts here; components only read this file.

export const settings = {
  url: 'https://ceiboworks.com',
  // PENDING: the domain is not bought yet. Until then this address does not receive mail.
  email: 'hello@ceiboworks.com',
  whatsapp: '', // international number, digits only, e.g. 5493430000000
  // Sample sites built from ../template into public/examples/<slug>/ (see scripts/build-examples.mjs).
  examples: { paving: '/examples/paving/', housecare: '/examples/home-care/', rental: '/examples/holiday-cottage/' },
  preview: true, // true = noindex (site not launched yet)
  // Monthly prices per currency. ARS is provisional: confirm and review regularly for inflation.
  currencies: [
    { id: 'nzd', label: 'NZD', name: 'New Zealand dollar', price: 'NZ$79', extra: 'NZ$69' },
    { id: 'usd', label: 'USD', name: 'US dollar', price: 'US$79', extra: 'US$69' },
    { id: 'ars', label: 'ARS', name: 'Peso argentino', price: 'ARS 45.000', extra: 'ARS 40.000' },
  ],
};

export type Lang = 'en' | 'es';

export const t = {
  en: {
    htmlLang: 'en',
    meta: {
      title: 'Ceibo Works | Websites for small businesses',
      description: 'A small studio that builds your website for free and looks after it every month. You always deal with the same person.',
    },
    nav: { how: 'How it works', pricing: 'Pricing', about: 'About', contact: 'Contact', language: 'Language' },
    hero: {
      title: 'Websites for small businesses, made by someone you can actually talk to.',
      lead: 'Ceibo Works is a small studio. I build your website for free, look after it every month, and you always deal with the same person.',
      cta: 'Get a free draft',
      secondary: 'See an example',
      note: 'No upfront cost. I reply within 24 hours.',
      special: 'Every website is made by hand for one business: yours.',
      photoAlt: 'Bright red ceibo flowers hanging from a branch among green leaves',
      photoCaption: 'Ceibo, the national flower of Argentina. It grows along the rivers of Entre Ríos, where I’m from.',
    },
    examples: {
      title: 'Websites we could build for you',
      lead: 'A few sample designs. Yours is built around your own photos, your words and your customers.',
      label: 'Sample design',
      phone: 'on a phone',
      items: { paving: 'Paving and gardens', housecare: 'Home care', rental: 'Holiday cottage' },
      alt: { desktop: 'Home page of a sample website for', mobile: 'Mobile view of a sample website for' },
      open: 'Explore a sample website:',
      note: '',
    },
    draft: {
      title: 'Want one like these for your business?',
      text: 'Tell me what you do. In a few days you get a free draft to look at, with no obligation.',
      cta: 'Get a free draft',
    },
    steps: {
      title: 'How it works',
      items: [
        { title: 'Tell me about your business', text: 'Send a few photos of your work, your services and the areas you cover. A short email is enough.' },
        { title: 'I build a free draft', text: 'Within a few days you get a real website to look at on your phone. Change anything you like.' },
        { title: 'Keep it if you like it', text: 'If you are happy, it goes live on your own domain. You pay a small monthly fee and I keep it up to date.' },
      ],
    },
    included: {
      title: 'What the monthly fee covers',
      items: [
        'Hosting, security and backups',
        'Up to 2 changes a month: texts, photos, prices, hours',
        'A monthly report of the enquiries your site brings in',
        'Setting up your Google Business profile',
        'A site that loads fast on any phone',
        'Your domain stays in your name',
      ],
    },
    pricing: {
      title: 'Pricing',
      lead: 'Building the site is free. Choose the currency you would like to pay in.',
      legend: 'Currency',
      per: 'per month',
      extra: 'Each extra website for the same owner:',
      foot: '12-month minimum, billed monthly. Your domain is around US$15 a year, paid by you and registered in your name.',
      defaultCurrency: 'nzd',
    },
    about: {
      title: 'Who’s behind it',
      text: [
        'I’m Tomas Blaha, from Entre Ríos, Argentina. The ceibo is the tree that grows along our rivers: tough, deeply rooted and covered in red flowers through spring and summer. That is the kind of work I want to do.',
        'Ceibo Works is small on purpose. I take on a limited number of clients, so each one gets a site that fits their business and a person who answers when they write.',
      ],
      photoAlt: 'Tomas Blaha',
    },
    faq: {
      title: 'Questions',
      items: [
        { q: 'Is the draft really free?', a: 'Yes. If you don’t like it, you don’t pay anything and you don’t owe me anything.' },
        { q: 'How long does it take?', a: 'A first draft usually takes 3 to 5 days after I receive your photos and details.' },
        { q: 'What happens after 12 months?', a: 'You can carry on month to month, or cancel whenever you like.' },
        { q: 'Who owns the domain?', a: 'You do. It is registered in your name from day one.' },
        { q: 'Where are you based?', a: 'In Argentina. I work remotely with businesses in New Zealand, the United States and Latin America, by email, WhatsApp or video call.' },
      ],
    },
    contact: {
      title: 'Let’s talk',
      lead: 'Tell me what your business does and where it is. I reply within 24 hours.',
      email: 'Email me',
      whatsapp: 'Message on WhatsApp',
      waText: 'Hi Tomas, I’d like a free website draft.',
    },
    footer: { privacy: 'Privacy', privacyHref: '/privacy/', photo: 'Ceibo photo' },
  },
  es: {
    htmlLang: 'es',
    meta: {
      title: 'Ceibo Works | Páginas web para negocios pequeños',
      description: 'Un estudio pequeño que te arma la web gratis y la mantiene cada mes. Siempre tratas con la misma persona.',
    },
    nav: { how: 'Cómo funciona', pricing: 'Precios', about: 'Quién soy', contact: 'Contacto', language: 'Idioma' },
    hero: {
      title: 'Páginas web para negocios pequeños, hechas por alguien con quien puedes hablar.',
      lead: 'Ceibo Works es un estudio pequeño. Te armo la web gratis, la mantengo cada mes y siempre tratas con la misma persona.',
      cta: 'Pide un borrador gratis',
      secondary: 'Ver un ejemplo',
      note: 'Sin costo inicial. Respondo en menos de 24 horas.',
      special: 'Cada web se hace a mano para un solo negocio: el tuyo.',
      photoAlt: 'Flores de ceibo de un rojo intenso colgando de una rama entre hojas verdes',
      photoCaption: 'El ceibo, flor nacional de Argentina. Crece a orillas de los ríos de Entre Ríos, de donde soy.',
    },
    examples: {
      title: 'Webs que podríamos armar para ti',
      lead: 'Algunos diseños de muestra. La tuya se arma con tus fotos, tus palabras y tus clientes.',
      label: 'Diseño de muestra',
      phone: 'en el teléfono',
      items: { paving: 'Pavimentos y jardines', housecare: 'Cuidado de casas', rental: 'Cabaña de vacaciones' },
      alt: { desktop: 'Página de inicio de una web de muestra para', mobile: 'Vista en teléfono de una web de muestra para' },
      open: 'Recorre una web de muestra:',
      note: 'Las webs de muestra están en inglés.',
    },
    draft: {
      title: '¿Quieres una así para tu negocio?',
      text: 'Cuéntame qué haces. En pocos días tienes un borrador gratis para ver, sin compromiso.',
      cta: 'Pide un borrador gratis',
    },
    steps: {
      title: 'Cómo funciona',
      items: [
        { title: 'Cuéntame de tu negocio', text: 'Envíame algunas fotos de tu trabajo, tus servicios y las zonas donde trabajas. Un correo corto alcanza.' },
        { title: 'Armo un borrador gratis', text: 'En pocos días tienes una web real para ver en tu teléfono. Cambia lo que quieras.' },
        { title: 'Si te gusta, te la quedas', text: 'Si estás conforme, se publica con tu propio dominio. Pagas una cuota mensual baja y yo la mantengo al día.' },
      ],
    },
    included: {
      title: 'Qué incluye la cuota mensual',
      items: [
        'Alojamiento, seguridad y copias de respaldo',
        'Hasta 2 cambios por mes: textos, fotos, precios, horarios',
        'Un informe mensual de las consultas que recibe tu web',
        'Configuración de tu perfil de Google Business',
        'Una web que carga rápido en cualquier teléfono',
        'Tu dominio queda a tu nombre',
      ],
    },
    pricing: {
      title: 'Precios',
      lead: 'Armar la web es gratis. Elige la moneda en la que prefieres pagar.',
      legend: 'Moneda',
      per: 'por mes',
      extra: 'Cada web adicional del mismo dueño:',
      foot: 'Mínimo 12 meses, con pago mensual. El dominio cuesta unos US$15 al año, lo pagas tú y queda a tu nombre.',
      defaultCurrency: 'usd',
    },
    about: {
      title: 'Quién está detrás',
      text: [
        'Soy Tomas Blaha, de Entre Ríos, Argentina. El ceibo es el árbol que crece a orillas de nuestros ríos: firme, de raíces profundas y cubierto de flores rojas en primavera y verano. Así quiero que sea el trabajo.',
        'Ceibo Works es pequeño a propósito. Tomo pocos clientes, para que cada uno tenga una web pensada para su negocio y una persona que responde cuando escribe.',
      ],
      photoAlt: 'Tomas Blaha',
    },
    faq: {
      title: 'Preguntas',
      items: [
        { q: '¿El borrador es gratis de verdad?', a: 'Sí. Si no te gusta, no pagas nada y no me debes nada.' },
        { q: '¿Cuánto tarda?', a: 'El primer borrador suele estar en 3 a 5 días desde que recibo tus fotos y datos.' },
        { q: '¿Qué pasa después de los 12 meses?', a: 'Puedes seguir mes a mes o cancelar cuando quieras.' },
        { q: '¿De quién es el dominio?', a: 'Tuyo. Queda registrado a tu nombre desde el primer día.' },
        { q: '¿Dónde estás?', a: 'En Argentina. Trabajo a distancia con negocios de Nueva Zelanda, Estados Unidos y Latinoamérica, por correo, WhatsApp o videollamada.' },
      ],
    },
    contact: {
      title: 'Hablemos',
      lead: 'Cuéntame qué hace tu negocio y dónde está. Respondo en menos de 24 horas.',
      email: 'Escríbeme',
      whatsapp: 'Escribir por WhatsApp',
      waText: 'Hola Tomas, me interesa un borrador gratis de mi web.',
    },
    footer: { privacy: 'Privacidad', privacyHref: '/es/privacidad/', photo: 'Foto del ceibo' },
  },
} as const;
