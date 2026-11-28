# Reels de Ceibo Works: análisis de ganchos y guiones

Videos en `social/reels/out/` (1080×1920, 15–17 s, inglés y español), con locución de **Jessica**
(voz de ElevenLabs).

**Para regenerarlos:**
1. `NODE_USE_ENV_PROXY=1 node social/reels/make-voice.mjs`: genera las frases de la voz.
2. `node social/reels/make-reels.mjs`: arma los videos y mezcla la voz.

Los textos de la voz están en `social/reels/voice/lines.json`. Cada escena empieza cuando arranca su
frase, así que si cambia un texto, el video se reacomoda solo. Las capturas de las webs de muestra están en
`social/reels/shots/`; para actualizarlas, ver el comentario al principio del script.

## Qué se analizó y con qué límite

No puedo mirar videos de Instagram ni de TikTok directamente: esas plataformas no se pueden leer sin
una sesión iniciada. El análisis se basa en lo que está publicado sobre esos videos:
- desgloses de formatos y ganchos;
- lo que dijo Adam Mosseri (jefe de Instagram) sobre cómo se ordenan los reels;
- estudios de retención;
- casos de diseñadores web que consiguen clientes con reels.

Muchas cifras vienen de blogs y herramientas que venden servicios, así que se usan como
orientación, no como verdad.

## Lo que coincide en todas las fuentes

1. **Los primeros 1,5 segundos deciden.** La mayor caída de espectadores ocurre antes del segundo
   3. El gancho tiene que estar escrito en pantalla desde el cuadro 1, sin logo ni "hola" de
   entrada.
2. **Instagram mide tres cosas, siempre en relación con cuántos lo vieron:**
   - el tiempo que lo miran;
   - los "me gusta" (pesan más entre quienes ya te siguen);
   - las veces que lo **envían por mensaje** (pesan más para llegar a gente nueva).

   Mosseri lo resume así: hacé algo que la gente quiera mandarle a un amigo.
3. **Los reels cortos se miran completos.** Los de 7–15 s se terminan de ver mucho más que los de
   30–60 s. Los nuestros duran 13–15 s.
4. **Hay que ser original.** Instagram muestra menos los videos reciclados o con marca de agua de
   otra app (por ejemplo, de TikTok). Los nuestros son propios y sin marca de agua.
5. **No hace falta mostrar la cara.** Para diseño web funcionan bien las grabaciones de pantalla
   con texto encima. Mostrar la cara suma confianza más adelante, pero no es obligatorio.

## Los ganchos que mejor funcionan para diseño web, desglosados

| Gancho | Ejemplo típico | Por qué funciona | Riesgo |
|---|---|---|---|
| **Antes y después** | Web vieja → web nueva en 10 s | Muestra dos estados con un corte, y el cambio se entiende sin leer | Si el "antes" se exagera, pierde credibilidad |
| **Desafío** | "Encontrá el teléfono en 5 segundos" | El espectador juega y se queda hasta el final para ver la respuesta | Necesita una cuenta regresiva visible |
| **Dato propio** | "Revisamos 2.790 webs…" | Es específico, no se encuentra en otro lado y genera autoridad | El dato tiene que ser real y verificable |
| **Comparación A/B** | "¿Cuál reservás?" | Invita a comentar, y los comentarios hacen que llegue a más gente | Hay que dar la respuesta al final |
| **Problema primero** | "Si tu web dice 'No seguro'…" | El dueño se reconoce en el problema | Tiene que ser concreto, no "tu web te hace perder clientes" |
| **Punto de vista (POV)** | "POV: buscás cabañas en el celular y…" | El espectador se pone en el lugar de su propio cliente | Funciona mejor con escenas reconocibles |
| **Lista de errores** | "3 errores que veo en webs de B&B" | Se guarda y se comparte, y da autoridad | Si es larga, se abandona: máximo 3 |
| **Revisión de una web real ("roast")** | Criticar la web de un negocio | Es muy viral en EE. UU. | **No lo hacemos con negocios reales:** riesgo legal y de reputación, y además son nuestros posibles clientes |

## Nuestras reglas para los reels

- Gancho escrito en pantalla en el primer segundo y en letra grande.
- Sin cara, por ahora: pantallas, webs de muestra y texto.
- Las webs "viejas" son **inventadas**, y se aclara en pantalla. Nunca se usa la web de un negocio
  real.
- Los datos que se citan son nuestros y reales (por ejemplo, 2.790 fichas revisadas y más de 1 de
  cada 8 con la web caída).
- La llamada a la acción final pide **enviarlo** a alguien o **comentar**, no "seguinos": eso es
  lo que más hace crecer el alcance.
- El texto en pantalla va lejos de los bordes de abajo y de la derecha, donde Instagram pone sus
  botones.
- Inglés para Australia, Nueva Zelanda y el Reino Unido; español para Chile, Uruguay y Argentina.
  Se publica cada versión por separado: no conviene mezclar los dos idiomas en un mismo video.

## Los 3 reels hechos

### Reel 1 · "Encontrá el teléfono en 5 segundos" (desafío)
- **0–1 s:** gancho "Find the phone number. You have 5 seconds" sobre una web vieja inventada.
- **1–6 s:** cuenta regresiva del 5 al 1, mientras la web baja con texto gris, chico y sin orden.
- **6–9 s:** se ve dónde estaba el teléfono, al pie y en letra mínima. "Time's up. Your customer
  already called the next business."
- **9–12 s:** la misma cabaña con nuestra web, y un toque en "Call".
- **12–15 s:** cierre: "Is your number one tap away?" y "Send this to someone with a B&B".

Texto para la publicación (EN):
> Could you find it? Most customers won't look that hard: if the number isn't one tap away, they call the next business on the list.
> I build websites for small businesses: free to build, a small monthly fee if you keep it. Link in bio.
> #smallbusiness #bnb #holidayrental #webdesign #smallbusinessaustralia #smallbusinessnz

Texto para la publicación (ES):
> ¿Lo encontraste? La mayoría de los clientes no busca tanto: si el teléfono no está a un toque, llaman al siguiente.
> Armo páginas web para negocios pequeños: gratis para empezar y una cuota mensual si te la quedás. Link en la bio.
> #cabañas #turismo #paginasweb #emprendedores #pymes

### Reel 2 · "1 de cada 8" (dato propio)
- **0–2 s:** contador que sube hasta 2.790 fichas revisadas.
- **2–7 s:** grilla de 64 webs, y cada octava se pone roja con su error ("Dominio en venta", "404"…).
  "More than 1 in 8 linked to a website that didn't load. The owners had no idea."
- **7–11 s:** "When did you last open yours?"
- **11–14 s:** cierre: "Open your website now. I'll wait."

Texto (EN):
> We checked 2,790 small business listings in New Zealand and the US. More than 1 in 8 linked to a website that was down, expired or for sale.
> Open yours now. If it's broken, I'll build you a new one for free.
> #smallbusinesstips #website #webdesign #smallbusinessowner

Texto (ES):
> Revisamos 2.790 negocios en directorios. Más de 1 de cada 8 tenía una web caída, vencida o en venta, y los dueños no lo sabían.
> Abrí la tuya ahora. Si está caída, te armo una nueva gratis.
> #pymes #paginasweb #emprendedores #negocioslocales

### Reel 3 · "¿Cuál reservás?" (comparación A/B)
- **0–1 s:** "Same cottage. Same price. Which one do you book?", con las dos webs lado a lado.
- **1–6 s:** las dos bajan al mismo tiempo.
- **6–8 s:** "Comment A or B 👇".
- **8–10 s:** "If you picked B, so do your guests. And they decide in seconds."
- **10–13 s:** cierre: "Want your own B?".

Texto (EN):
> A or B? Tell me in the comments 👇 Guests make this call in seconds, usually on their phone.
> I build websites for cottages, B&Bs and guest houses: free to build, a small monthly fee if you keep it.
> #bnb #guesthouse #holidayhomes #directbooking #webdesign

Texto (ES):
> ¿A o B? Contame en los comentarios 👇 Los huéspedes deciden en segundos, casi siempre desde el celular.
> Armo webs para cabañas y alojamientos: gratis para empezar y una cuota mensual si te la quedás.
> #cabañas #alojamiento #turismo #paginasweb

## Próximos reels (ideas listas para hacer)

| # | Gancho | Formato |
|---|---|---|
| 4 | "Your website says 'Not secure'. Here's what your customers see." | Problema primero: la barra de Chrome, y después el arreglo |
| 5 | "POV: you're looking for a cabin on your phone at 11pm" | POV: tres webs que no cargan, y una que sí, con "Reservar" |
| 6 | "Your domain expires. This is what happens next." | Historia: la web se cae, los mails rebotan y la llamada nunca llega |
| 7 | "3 things every landscaper's website needs" | Lista de 3, con la web de muestra de jardines |
| 8 | "Booking.com takes 15%. Here's the maths." | Dato: comisión anual contra la cuota mensual (hay que verificar el porcentaje de cada país) |
| 9 | "I built this website in 3 days. Here's how." | Proceso acelerado: del borrador a la web publicada |
| 10 | "From Argentina to your town" | Historia personal con la flor del ceibo, para generar confianza (ideal con tu cara o tu voz) |

## Cómo publicarlos

- **Ritmo:** 2 reels por semana, además de los 3 posts que ya están programados. El plan gratis de
  Metricool permite 20 publicaciones por mes: alcanza.
- **Sonido:** los videos traen la voz de Jessica normalizada al volumen de Instagram (-14 LUFS), y
  el texto en pantalla se mantiene para quien mira sin sonido. Si se publican desde la app, se
  puede sumar música de fondo al 5–10% de volumen; desde Metricool salen solo con la voz.
- **Reels de prueba:** Instagram permite mostrar un reel primero solo a gente que no te sigue.
  Sirve para probar qué gancho funciona sin llenar el perfil.
- **A fin de mes:** comparar en Metricool cuánto los miraron, cuántas veces los enviaron y cuántos
  seguidores sumaron. Del formato que gane, hacer más.

## Fuentes

- [Mosseri: tiempo de reproducción, "me gusta" y envíos, cada uno en relación con el alcance (Kompozy)](https://kompozy.io/news/instagram-mosseri-ranking-signals-guidance)
- [Envíos por alcance (Influencer Marketing Hub)](https://influencermarketinghub.com/instagram-sends-per-reach-playbook/)
- [La retención se decide antes de los 3 segundos (CreatorHouse)](https://creatorhouse.app/blog/3-second-rule-instagram-reels-2026)
- [Señales de los reels en 2026 (SocialScaleHub)](https://www.socialscalehub.com/academy/instagram-reels-algorithm-update-2026-what-changed-and-how)
- [Duración y retención (promote.sh)](https://promote.sh/blog/how-to-grow-on-instagram-reels)
- [Formato antes y después: riesgos (noobclaw)](https://noobclaw.com/blog/tiktok-hook-examples/)
- [Antes y después: tiempos (Nemo)](https://www.nemovideo.com/templates/before-and-after-tiktok-template)
- [Ideas de reels para diseñadores web (Socialmon)](https://www.socialmon.ai/blog/62-web-designer-instagram-post-ideas-with-examples-that-convert)
- [Ganchos para diseño (Instapdown)](https://instapdown.com/hooks/design)
- [Reels sin cara y contenido reciclado (DesignerBox)](https://designerbox.ai/blog/faceless-reels/)
- [Clientes de diseño web con videos (podcast de Josh Hall)](https://www.iheart.com/podcast/269-web-design-business-with-j-52371436/episode/374-how-to-get-web-design-clients-through-social-media-videos-with-blaze-smith-271914831)
- [Errores de webs que hacen perder clientes (Samaroo)](https://samaroosolutions.com/small-business-website-costing-you-customers/)
