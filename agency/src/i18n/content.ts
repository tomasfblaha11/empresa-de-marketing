// All copy and business settings for the Ceibo Works site, in English and Spanish.
// Change prices, contact details and texts here; components only read this file.

export const settings = {
  url: 'https://ceiboworks.com',
  // Free Gmail for now; move to an address on ceiboworks.com once there are paying clients.
  email: 'ceiboworks@gmail.com',
  whatsapp: '', // international number, digits only, e.g. 5493430000000
  // Sample sites built from ../template into public/examples/<slug>/ (see scripts/build-examples.mjs).
  examples: { paving: '/examples/paving/', housecare: '/examples/home-care/', rental: '/examples/holiday-cottage/' },
  preview: false, // true = noindex (site not launched yet)
  // Monthly prices per region. `langs` says in which version of the site each option appears.
  // ARS is provisional: confirm and review regularly for inflation.
  currencies: [
    { id: 'nzd', currency: 'NZD', label: { en: 'NZD', es: 'NZD' }, price: 'NZ$79', extra: 'NZ$69', langs: ['en'] },
    { id: 'latam', currency: 'USD', label: { en: 'Chile · Uruguay', es: 'Chile y Uruguay' }, price: 'US$49', extra: 'US$39', langs: ['es'] },
    { id: 'ars', currency: 'ARS', label: { en: 'ARS', es: 'Argentina' }, price: 'ARS 45.000', extra: 'ARS 40.000', langs: ['es'] },
    { id: 'usd', currency: 'USD', label: { en: 'USD', es: 'Otro país' }, price: 'US$79', extra: 'US$69', langs: ['en', 'es'] },
  ],
};

export type Lang = 'en' | 'es';

export const t = {
  en: {
    htmlLang: 'en',
    meta: {
      title: 'Ceibo Works | Custom websites for small businesses',
      description: 'Custom websites for small businesses in New Zealand, the US and Latin America. Built for free, looked after every month, always by the same person.',
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
      foot: 'No long contract: a 3-month minimum, then month to month, cancel any time. Pay a year upfront and get 2 months free. Your domain is around US$15 a year, paid by you and registered in your name.',
      defaultCurrency: 'nzd',
      payTitle: 'How you pay',
      pay: [
        { where: 'New Zealand and the US', how: 'Monthly, by debit or credit card through a secure payment link, or with PayPal.' },
      ],
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
        { q: 'Is there a long contract?', a: 'No. There is a 3-month minimum, because building the site is free; after that it is month to month and you can cancel whenever you like. If you prefer to pay a year upfront, you get 2 months free.' },
        { q: 'Who owns the domain?', a: 'You do. It is registered in your name from day one.' },
        { q: 'How do I pay?', a: 'Monthly, by debit or credit card through a secure payment link, or with PayPal. Building the site is free.' },
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
    footer: { privacy: 'Privacy', privacyHref: '/privacy/', photo: 'Ceibo photo', servicesLabel: 'Websites for', place: 'Made in Entre Ríos, Argentina' },
    niches: {
      title: 'Built for your kind of business',
      lead: 'I know these trades well, so your site starts from what your customers actually look for.',
      more: 'Read more',
    },
    niche: { home: 'Home', from: 'From', per: 'per month', priceNote: 'Building the site is free. 3-month minimum, then month to month.', allPrices: 'See pricing details', open: 'Open the sample website', email: 'Email me', faq: 'Questions', others: 'Other kinds of business' },
  },
  es: {
    htmlLang: 'es',
    meta: {
      title: 'Ceibo Works | Páginas web a medida para negocios pequeños',
      description: 'Páginas web a medida para negocios pequeños de Argentina y Latinoamérica. Te la armo gratis, la mantengo cada mes y siempre tratas con la misma persona.',
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
      lead: 'Armar la web es gratis. Elige dónde está tu negocio.',
      legend: 'País',
      per: 'por mes',
      extra: 'Cada web adicional del mismo dueño:',
      foot: 'Sin contrato largo: mínimo 3 meses y después mes a mes, cancelas cuando quieras. Si pagas el año por adelantado, 2 meses gratis. El dominio cuesta unos US$15 al año, lo pagas tú y queda a tu nombre.',
      defaultCurrency: 'latam',
      payTitle: 'Cómo pagas',
      pay: [
        { where: 'Chile y Uruguay', how: 'En dólares, todos los meses, con tarjeta de débito o crédito (Visa o Mastercard) por un link de pago seguro, o con PayPal.' },
        { where: 'Argentina', how: 'En pesos, por transferencia bancaria o Mercado Pago.' },
        { where: 'Otros países', how: 'En dólares, con tarjeta o PayPal.' },
      ],
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
        { q: '¿Hay que firmar un contrato largo?', a: 'No. Hay un mínimo de 3 meses, porque armar la web es gratis; después es mes a mes y cancelas cuando quieras. Si prefieres pagar el año por adelantado, tienes 2 meses gratis.' },
        { q: '¿De quién es el dominio?', a: 'Tuyo. Queda registrado a tu nombre desde el primer día.' },
        { q: '¿Cómo pago desde Chile o Uruguay?', a: 'En dólares (US$49 por mes), con tarjeta de débito o crédito por un link de pago seguro, o con PayPal. No hace falta abrir ninguna cuenta nueva.' },
        { q: '¿Dónde estás?', a: 'En Argentina, en Entre Ríos. Trabajo a distancia con negocios de Chile, Uruguay, Argentina, Nueva Zelanda y Estados Unidos, por correo, WhatsApp o videollamada.' },
      ],
    },
    contact: {
      title: 'Hablemos',
      lead: 'Cuéntame qué hace tu negocio y dónde está. Respondo en menos de 24 horas.',
      email: 'Escríbeme',
      whatsapp: 'Escribir por WhatsApp',
      waText: 'Hola Tomas, me interesa un borrador gratis de mi web.',
    },
    footer: { privacy: 'Privacidad', privacyHref: '/es/privacidad/', photo: 'Foto del ceibo', servicesLabel: 'Páginas web para', place: 'Hecho en Entre Ríos, Argentina' },
    niches: {
      title: 'Pensadas para tu tipo de negocio',
      lead: 'Conozco bien estos rubros, así que tu web arranca desde lo que tus clientes realmente buscan.',
      more: 'Ver más',
    },
    niche: { home: 'Inicio', from: 'Desde', per: 'por mes', priceNote: 'Armar la web es gratis. Mínimo 3 meses y después mes a mes.', allPrices: 'Ver detalle de precios', open: 'Abrir la web de muestra', email: 'Escríbeme', faq: 'Preguntas', others: 'Otros tipos de negocio' },
  },
} as const;
