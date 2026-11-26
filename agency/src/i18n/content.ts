// All copy and business settings for the Ceibo Works site, in English and Spanish.
// Change prices, contact details and texts here; components only read this file.

export const settings = {
  url: 'https://ceiboworks.com',
  // PENDING: the domain is not bought yet. Until then this address does not receive mail.
  email: 'hello@ceiboworks.com',
  whatsapp: '', // international number, digits only, e.g. 5493430000000
  demoUrl: 'https://demo-tpn0fpa8.vercel.app',
  preview: true, // true = noindex (site not launched yet)
};

export type Lang = 'en' | 'es';

export const t = {
  en: {
    htmlLang: 'en',
    meta: {
      title: 'Ceibo Works | Websites for small businesses',
      description: 'A small studio that builds your website for free and looks after it every month. You always deal with the same person.',
    },
    nav: { how: 'How it works', pricing: 'Pricing', about: 'About', contact: 'Contact', switchLabel: 'Español', switchHref: '/es/' },
    hero: {
      title: 'Websites for small businesses, made by someone you can actually talk to.',
      lead: 'Ceibo Works is a small studio. I build your website for free, look after it every month, and you always deal with the same person.',
      cta: 'Get a free draft',
      secondary: 'See an example',
      note: 'No upfront cost. I reply within 24 hours.',
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
      lead: 'Building the site is free. The monthly fee depends on where your business is.',
      per: 'per month',
      regions: [
        { name: 'New Zealand', price: 'NZ$79' },
        { name: 'United States', price: 'US$79' },
        { name: 'Central America and the Caribbean', price: 'US$39' },
      ],
      foot: '12-month minimum, billed monthly. Each extra website for the same owner costs 10 less per month. Your domain is around US$15 a year, paid by you and registered in your name.',
    },
    work: {
      title: 'An example',
      text: 'A sample site for a paving and garden business. Every site is built around the client’s own photos and words.',
      alt: 'Home page of a sample website for a paving and garden business, with a large photo of a stone driveway',
      link: 'Open the example',
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
    footer: { privacy: 'Privacy', privacyHref: '/privacy/' },
  },
  es: {
    htmlLang: 'es',
    meta: {
      title: 'Ceibo Works | Páginas web para negocios pequeños',
      description: 'Un estudio pequeño que te arma la web gratis y la mantiene cada mes. Siempre tratas con la misma persona.',
    },
    nav: { how: 'Cómo funciona', pricing: 'Precios', about: 'Quién soy', contact: 'Contacto', switchLabel: 'English', switchHref: '/' },
    hero: {
      title: 'Páginas web para negocios pequeños, hechas por alguien con quien puedes hablar.',
      lead: 'Ceibo Works es un estudio pequeño. Te armo la web gratis, la mantengo cada mes y siempre tratas con la misma persona.',
      cta: 'Pide un borrador gratis',
      secondary: 'Ver un ejemplo',
      note: 'Sin costo inicial. Respondo en menos de 24 horas.',
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
      lead: 'Armar la web es gratis. La cuota mensual depende de dónde está tu negocio.',
      per: 'por mes',
      regions: [
        { name: 'Nueva Zelanda', price: 'NZ$79' },
        { name: 'Estados Unidos', price: 'US$79' },
        { name: 'Centroamérica y el Caribe', price: 'US$39' },
      ],
      foot: 'Mínimo 12 meses, con pago mensual. Cada web adicional del mismo dueño cuesta 10 menos por mes. El dominio cuesta unos US$15 al año, lo pagas tú y queda a tu nombre.',
    },
    work: {
      title: 'Un ejemplo',
      text: 'Una web de muestra para una empresa de pavimentos y jardines. Cada web se arma con las fotos y las palabras del propio cliente.',
      alt: 'Página de inicio de una web de muestra para una empresa de pavimentos y jardines, con una foto grande de una entrada de piedra',
      link: 'Abrir el ejemplo',
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
    footer: { privacy: 'Privacidad', privacyHref: '/es/privacidad/' },
  },
} as const;
