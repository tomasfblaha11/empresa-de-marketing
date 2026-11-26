// Landing pages for each kind of business we build for, plus a local page for Entre Ríos.
// Each page exists in English, Spanish or both; when both exist they are linked as translations.
// Copy must stay genuinely useful to a business owner: no keyword stuffing, no invented clients.

export type SampleKey = 'paving' | 'housecare' | 'rental';

export interface NicheCopy {
  path: string;
  short: string; // link text in the footer and in "other pages"
  title: string; // <title>
  description: string; // meta description, ~150 characters
  serviceType: string; // schema.org Service.serviceType
  h1: string;
  lead: string;
  whyTitle: string;
  why: string[];
  includesTitle: string;
  includes: string[];
  sampleTitle: string;
  sampleText: string;
  faq: { q: string; a: string }[];
  ctaTitle: string;
  ctaText: string;
}

export interface NichePage {
  id: string;
  sample: SampleKey;
  areaServed: string[];
  en?: NicheCopy;
  es?: NicheCopy;
}

const careEn = 'Hosting, security, backups and up to 2 changes a month';
const careEs = 'Alojamiento, seguridad, copias de respaldo y hasta 2 cambios por mes';

export const pages: NichePage[] = [
  {
    id: 'landscaping',
    sample: 'paving',
    areaServed: ['NZ', 'US', 'AR'],
    en: {
      path: '/websites-for-landscapers/',
      short: 'Websites for landscapers',
      title: 'Websites for Landscapers and Paving Companies | Ceibo Works',
      description: 'Websites for landscaping, paving and garden businesses: big photos of your work, fast on any phone, built for free and looked after every month.',
      serviceType: 'Website design for landscaping and paving businesses',
      h1: 'Websites for landscapers and paving companies',
      lead: 'Your work is what sells. I build landscaping, paving and garden businesses a website that shows your finished jobs in big photos, loads fast on a phone and turns visitors into quote requests.',
      whyTitle: 'Why your own website matters',
      why: [
        'Homeowners want to see finished driveways, patios and gardens before they ask for a quote. A gallery of your own jobs does more than any sales pitch.',
        'Most people search on their phone, often standing in their own backyard. If your site takes more than a few seconds to load, they call the next name on the list.',
        'A Facebook page on its own is easy to miss on Google. Your own site, with your services and the suburbs you cover, is what shows up when someone searches for a landscaper near them.',
      ],
      includesTitle: 'What your website includes',
      includes: [
        'A photo gallery of your projects, easy to add to as you finish jobs',
        'Your services, with “from” prices if you want to show them',
        'The towns and suburbs you cover, written so Google can match local searches',
        'A quote button that is always one tap away',
        'Your Google reviews and Google Business profile connected',
        careEn,
      ],
      sampleTitle: 'See a sample website',
      sampleText: 'A sample site I made for a fictional paving and garden business. Yours would be built around your own photos and words.',
      faq: [
        { q: 'Do I need professional photos?', a: 'No. Phone photos of your finished jobs work well. I crop, straighten and optimise them so they load fast.' },
        { q: 'Can I show prices?', a: 'Yes, as “from” prices, or not at all. Many landscapers prefer to offer a free site visit, and the site can say that instead.' },
        { q: 'Will my site show up on Google?', a: 'It is built with what Google looks for: fast loading, clear services and areas, and structured data for local businesses. I also set up your Google Business profile, which is usually where local customers find you first.' },
      ],
      ctaTitle: 'Want a free draft for your business?',
      ctaText: 'Send me a few photos of your work and the areas you cover. In a few days you get a real website to look at, with no obligation.',
    },
    es: {
      path: '/es/paginas-web-paisajismo/',
      short: 'Páginas web para paisajistas',
      title: 'Páginas web para paisajistas, jardineros y empresas de pavimentos | Ceibo Works',
      description: 'Páginas web para paisajismo, jardinería y pavimentos: fotos grandes de tus trabajos, rápidas en el teléfono, armadas gratis y mantenidas cada mes.',
      serviceType: 'Diseño de páginas web para paisajistas y empresas de pavimentos',
      h1: 'Páginas web para paisajistas, jardineros y empresas de pavimentos',
      lead: 'Lo que vende es tu trabajo. Armo páginas web para negocios de paisajismo, jardinería y pavimentos que muestran tus obras terminadas en fotos grandes, cargan rápido en el teléfono y convierten visitas en pedidos de presupuesto.',
      whyTitle: 'Por qué te conviene una web propia',
      why: [
        'Antes de pedir un presupuesto, la gente quiere ver entradas, patios y jardines terminados. Una galería con tus propios trabajos convence más que cualquier folleto.',
        'Casi todos buscan desde el teléfono. Si tu web tarda más de unos segundos en cargar, llaman al siguiente de la lista.',
        'Una página de Facebook sola es difícil de encontrar en Google. Tu propia web, con tus servicios y las zonas donde trabajas, es la que aparece cuando alguien busca un paisajista cerca.',
      ],
      includesTitle: 'Qué incluye tu web',
      includes: [
        'Una galería de fotos de tus obras, fácil de ir ampliando',
        'Tus servicios, con precios “desde” si quieres mostrarlos',
        'Las ciudades y barrios donde trabajas, escritos para que Google los relacione con búsquedas locales',
        'Un botón para pedir presupuesto siempre a mano',
        'Tus reseñas de Google y tu perfil de Google Business conectados',
        careEs,
      ],
      sampleTitle: 'Mira una web de muestra',
      sampleText: 'Una web de muestra que armé para una empresa ficticia de pavimentos y jardines (en inglés). La tuya se arma con tus fotos y tus palabras.',
      faq: [
        { q: '¿Necesito fotos profesionales?', a: 'No. Las fotos de tus trabajos sacadas con el teléfono funcionan bien. Yo las recorto, enderezo y optimizo para que carguen rápido.' },
        { q: '¿Puedo mostrar precios?', a: 'Sí, como precios “desde” o ninguno. Muchos prefieren ofrecer una visita sin cargo, y la web puede decir eso.' },
        { q: '¿Mi web va a aparecer en Google?', a: 'Está hecha con lo que Google tiene en cuenta: carga rápida, servicios y zonas claros y datos estructurados para negocios locales. Además configuro tu perfil de Google Business, que suele ser donde te encuentran primero.' },
      ],
      ctaTitle: '¿Quieres un borrador gratis para tu negocio?',
      ctaText: 'Envíame algunas fotos de tus trabajos y las zonas donde trabajas. En pocos días tienes una web real para ver, sin compromiso.',
    },
  },
  {
    id: 'housecare',
    sample: 'housecare',
    areaServed: ['NZ', 'US', 'AR'],
    en: {
      path: '/websites-for-house-sitters/',
      short: 'Websites for house sitters and caretakers',
      title: 'Websites for House Sitters, Caretakers and Home Watch Services | Ceibo Works',
      description: 'Websites for house sitting, property caretaking and home watch businesses. Earn owners’ trust before the first call. Built for free, looked after monthly.',
      serviceType: 'Website design for house sitting, caretaking and home watch businesses',
      h1: 'Websites for house sitters, caretakers and home watch services',
      lead: 'People leaving a house empty hand their keys to someone they found online. I build caretaking and home watch businesses a website that earns that trust before the first phone call.',
      whyTitle: 'Why your own website matters',
      why: [
        'Owners going away, or living overseas, choose a caretaker mostly from what they see online: who you are, what you check and how you report back.',
        'Many insurers expect regular checks once a home has been empty for a few weeks, so owners start searching well before they leave.',
        'Holiday-home owners compare a few options at once. A clear site with your visit plans makes you the easy choice.',
      ],
      includesTitle: 'What your website includes',
      includes: [
        'Your visit plans explained simply: what you check and how often',
        'Photos and a short story about you, so owners know who holds their keys',
        'The areas you cover',
        'A simple enquiry form and your phone number on every page',
        'Reviews from the owners you already look after',
        careEn,
      ],
      sampleTitle: 'See a sample website',
      sampleText: 'A sample site I made for a fictional home care business. Yours would be built around you, your area and your own photos.',
      faq: [
        { q: 'I work on my own. Is that a problem?', a: 'No, it is an advantage. Owners want to know exactly who will be in their home, and the site puts you front and centre.' },
        { q: 'Can the site explain different visit plans?', a: 'Yes. Weekly checks, holiday checks, key holding, garden care: each can have its own short description, and a price if you want to show one.' },
        { q: 'Do you work with home watch businesses in the United States?', a: 'Yes. I work with businesses in New Zealand, the United States and Latin America, and you can pay in NZD or USD.' },
      ],
      ctaTitle: 'Want a free draft for your business?',
      ctaText: 'Tell me what you offer and where. In a few days you get a real website to look at, with no obligation.',
    },
    es: {
      path: '/es/paginas-web-cuidado-de-casas/',
      short: 'Páginas web para cuidado de casas',
      title: 'Páginas web para cuidado de casas y administración de propiedades | Ceibo Works',
      description: 'Páginas web para cuidadores de casas, caseros y administradores de propiedades. Genera confianza antes del primer llamado. Armada gratis, mantenida cada mes.',
      serviceType: 'Diseño de páginas web para cuidado de casas y administración de propiedades',
      h1: 'Páginas web para cuidado de casas y administración de propiedades',
      lead: 'Quien deja su casa vacía le entrega las llaves a alguien que encontró en internet. Armo páginas web para cuidadores y administradores de propiedades que generan esa confianza antes del primer llamado.',
      whyTitle: 'Por qué te conviene una web propia',
      why: [
        'Los dueños que se van de viaje, o que viven lejos, eligen a quién confiarle su casa casi siempre por lo que ven en internet: quién eres, qué revisas y cómo les informas.',
        'Los dueños de casas de fin de semana comparan varias opciones a la vez. Una web clara con tus servicios te convierte en la opción fácil.',
        'Una web propia también te da una imagen más seria que un perfil en redes, y eso pesa cuando se trata de llaves y alarmas.',
      ],
      includesTitle: 'Qué incluye tu web',
      includes: [
        'Tus servicios explicados de forma simple: qué revisas y cada cuánto',
        'Fotos y una breve historia sobre ti, para que sepan quién tiene sus llaves',
        'Las zonas donde trabajas',
        'Un formulario de consulta simple y tu teléfono en todas las páginas',
        'Reseñas de los dueños con los que ya trabajas',
        careEs,
      ],
      sampleTitle: 'Mira una web de muestra',
      sampleText: 'Una web de muestra que armé para un negocio ficticio de cuidado de casas (en inglés). La tuya se arma contigo, tu zona y tus fotos.',
      faq: [
        { q: 'Trabajo solo. ¿Es un problema?', a: 'No, es una ventaja. Los dueños quieren saber exactamente quién va a entrar a su casa, y la web te pone a ti en primer plano.' },
        { q: '¿La web puede explicar distintos servicios?', a: 'Sí. Visitas semanales, controles durante las vacaciones, guarda de llaves, mantenimiento del jardín: cada uno con una descripción corta y su precio, si quieres mostrarlo.' },
        { q: '¿Trabajas con negocios de otros países?', a: 'Sí. Trabajo con negocios de Argentina, Latinoamérica, Nueva Zelanda y Estados Unidos, a distancia, por correo, WhatsApp o videollamada.' },
      ],
      ctaTitle: '¿Quieres un borrador gratis para tu negocio?',
      ctaText: 'Cuéntame qué ofreces y dónde. En pocos días tienes una web real para ver, sin compromiso.',
    },
  },
  {
    id: 'rentals',
    sample: 'rental',
    areaServed: ['NZ', 'US', 'AR'],
    en: {
      path: '/websites-for-holiday-rentals/',
      short: 'Websites for holiday homes and cottages',
      title: 'Websites for Holiday Homes, Cottages and B&Bs | Ceibo Works',
      description: 'Websites for holiday homes, cottages, B&Bs and small motels. Take direct bookings without commission. Built for free and looked after every month.',
      serviceType: 'Website design for holiday homes, cottages and B&Bs',
      h1: 'Websites for holiday homes, cottages and B&Bs',
      lead: 'Booking sites bring you guests, but take a commission every time. Your own website lets returning guests, and the friends they send, book directly with you.',
      whyTitle: 'Why your own website matters',
      why: [
        'Guests who loved their stay often look you up again. If they only find you on a booking platform, you pay commission on a guest you had already won.',
        'Big, fast photos of the place, the view and the area do most of the selling, especially on a phone.',
        'A site of your own looks more established, which helps guests feel safe booking with you directly.',
      ],
      includesTitle: 'What your website includes',
      includes: [
        'A large photo gallery of the rooms, the view and the surroundings',
        'Rates, minimum stays and what is included',
        'A direct enquiry form, or a link to your booking calendar',
        'Directions and things to do nearby',
        'Guest reviews',
        careEn,
      ],
      sampleTitle: 'See a sample website',
      sampleText: 'A sample site I made for a fictional holiday cottage. Yours would be built around your place and your own photos.',
      faq: [
        { q: 'Can it connect to my booking calendar?', a: 'Yes. If you already use a booking system or channel manager, the site links to it or shows its booking button. For small places, a simple enquiry form works well too.' },
        { q: 'Do I have to leave Airbnb or Booking.com?', a: 'No. Most owners keep the platforms for new guests and use their own site for direct and returning bookings.' },
        { q: 'Can the site be in more than one language?', a: 'Yes. I can build it in English and Spanish.' },
      ],
      ctaTitle: 'Want a free draft for your place?',
      ctaText: 'Send me a few photos and tell me about your place. In a few days you get a real website to look at, with no obligation.',
    },
    es: {
      path: '/es/paginas-web-cabanas/',
      short: 'Páginas web para cabañas y alquileres temporarios',
      title: 'Páginas web para cabañas, alquileres temporarios y hosterías | Ceibo Works',
      description: 'Páginas web para cabañas, casas de alquiler temporario, hosterías y B&B. Recibe reservas directas sin comisión. Armada gratis y mantenida cada mes.',
      serviceType: 'Diseño de páginas web para cabañas, alquileres temporarios y hosterías',
      h1: 'Páginas web para cabañas, alquileres temporarios y hosterías',
      lead: 'Las plataformas de reservas te traen huéspedes, pero se quedan con una comisión cada vez. Con tu propia web, los huéspedes que vuelven, y los amigos que te recomiendan, reservan directamente contigo.',
      whyTitle: 'Por qué te conviene una web propia',
      why: [
        'Los huéspedes que la pasaron bien suelen buscarte de nuevo. Si solo te encuentran en una plataforma, pagas comisión por un huésped que ya habías ganado.',
        'Fotos grandes y rápidas del lugar, la vista y los alrededores hacen casi todo el trabajo de venta, sobre todo en el teléfono.',
        'Una web propia da una imagen más establecida, y eso ayuda a que el huésped se anime a reservar directo.',
      ],
      includesTitle: 'Qué incluye tu web',
      includes: [
        'Una galería grande de fotos de las cabañas, la vista y los alrededores',
        'Tarifas, estadías mínimas y qué está incluido',
        'Un formulario de consulta directa, o un enlace a tu calendario de reservas',
        'Cómo llegar y qué hacer cerca',
        'Reseñas de huéspedes',
        careEs,
      ],
      sampleTitle: 'Mira una web de muestra',
      sampleText: 'Una web de muestra que armé para una cabaña ficticia (en inglés). La tuya se arma con tu lugar y tus fotos.',
      faq: [
        { q: '¿Se puede conectar con mi calendario de reservas?', a: 'Sí. Si ya usas un sistema de reservas, la web lo enlaza o muestra su botón de reserva. Para lugares chicos, un formulario de consulta también funciona muy bien.' },
        { q: '¿Tengo que dejar Airbnb o Booking?', a: 'No. La mayoría sigue usando las plataformas para huéspedes nuevos y su propia web para las reservas directas y los que vuelven.' },
        { q: '¿La web puede estar en más de un idioma?', a: 'Sí. Puedo armarla en español e inglés, ideal si recibes turistas de otros países.' },
      ],
      ctaTitle: '¿Quieres un borrador gratis para tu lugar?',
      ctaText: 'Envíame algunas fotos y cuéntame de tu lugar. En pocos días tienes una web real para ver, sin compromiso.',
    },
  },
  {
    id: 'entre-rios',
    sample: 'rental',
    areaServed: ['Paraná', 'Entre Ríos', 'AR'],
    es: {
      path: '/es/paginas-web-parana-entre-rios/',
      short: 'Páginas web en Paraná, Entre Ríos',
      title: 'Diseño de páginas web en Paraná, Entre Ríos | Ceibo Works',
      description: 'Diseño de páginas web para negocios de Paraná y toda Entre Ríos: rápidas, fáciles de encontrar en Google y con alguien que te responde. Borrador gratis.',
      serviceType: 'Diseño de páginas web para negocios',
      h1: 'Páginas web para negocios de Paraná y Entre Ríos',
      lead: 'Soy de Entre Ríos y armo páginas web para negocios de la provincia: rápidas, fáciles de encontrar en Google y con una persona que te responde cuando escribes.',
      whyTitle: 'Por qué una web propia, y no solo Instagram',
      why: [
        'Cuando alguien busca en Google un servicio en Paraná, Concordia, Gualeguaychú o Colón, aparecen primero los negocios con web y perfil de Google bien armados.',
        'Instagram sirve para mostrarte, pero la web es tuya: no depende de un algoritmo, se encuentra en Google y explica todo en un solo lugar.',
        'Para cabañas y alojamientos de la costa del Uruguay y del Paraná, una web propia permite recibir reservas directas sin pagar comisión.',
      ],
      includesTitle: 'Qué incluye tu web',
      includes: [
        'Diseño hecho a medida para tu negocio, con tus fotos y tus textos',
        'Botón de WhatsApp y tu teléfono siempre a mano',
        'Tus servicios, horarios y la zona donde trabajas',
        'Configuración de tu perfil de Google Business',
        'Una web que carga rápido en cualquier teléfono',
        careEs,
      ],
      sampleTitle: 'Mira una web de muestra',
      sampleText: 'Una web de muestra que armé para una cabaña ficticia (en inglés). La tuya se arma en español, con tu negocio y tus fotos.',
      faq: [
        { q: '¿Trabajas solo con negocios de Paraná?', a: 'No. Trabajo con negocios de toda Entre Ríos y del resto de Argentina, y también con clientes de Nueva Zelanda y Estados Unidos.' },
        { q: '¿Qué tipo de negocios?', a: 'Sobre todo cabañas y alojamientos, paisajismo y jardinería, cuidado de casas y servicios para el hogar, pero cualquier negocio chico que necesite una web clara puede consultarme.' },
        { q: '¿Cuánto cuesta?', a: 'Armar la web es gratis. Si te gusta, pagas una cuota mensual que cubre alojamiento, mantenimiento y cambios. Los precios están en esta misma página, en pesos o en dólares.' },
      ],
      ctaTitle: '¿Quieres un borrador gratis para tu negocio?',
      ctaText: 'Cuéntame qué hace tu negocio y dónde está. En pocos días tienes una web real para ver, sin compromiso.',
    },
  },
];
