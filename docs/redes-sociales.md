# Redes sociales con Metricool: cómo funciona

## Qué es Metricool

Una herramienta para planificar, publicar y medir redes sociales. Lo que nos sirve:

- **Planificador:** se programan publicaciones de Instagram (feed, carruseles, reels, historias) y
  Facebook; Metricool las publica sola a la hora indicada.
- **Mejor hora para publicar:** sugiere horarios según cuándo está conectada la audiencia.
- **Estadísticas:** alcance, seguidores, clics y qué publicaciones funcionan mejor.
- **Conector para Claude (MCP):** funciona **en cualquier plan, incluido el gratis**; el acceso
  por API, en cambio, es solo para planes Advanced ([Metricool](https://help.metricool.com/es/limites-del-mcp-y-requisitos-del-plan-h72jg)).

**Plan gratis:** 1 marca, sin tarjeta, hasta **20 publicaciones por mes**. Alcanza para nuestro
ritmo (3 por semana ≈ 13 por mes). Si un día no alcanza, el plan Starter ronda los US$20–25 por mes.

## Privacidad: nadie ve la contraseña

- La contraseña de Instagram/Facebook se escribe **solo dentro de Metricool**, una vez, al conectar
  las cuentas. La de Metricool se escribe **solo en Metricool**, al autorizar el conector.
- Claude **no recibe ninguna contraseña**: el conector usa un permiso (OAuth) que se puede **revocar
  en cualquier momento** desde Metricool o desde la configuración de conectores de claude.ai.
- **Nunca** pegar contraseñas ni códigos en el chat: una conversación no es un lugar seguro para
  guardarlas.
- Activar la verificación en dos pasos en Instagram, Facebook y Metricool.

## Cómo trabajamos (cada mes)

1. **Yo preparo** las publicaciones del mes: imágenes con el estilo de la marca (`social/out/`) y
   textos en inglés y español (`social/captions.md`).
2. **Te muestro el calendario** del mes (fecha, hora, imagen y texto).
3. **Vos aprobás** (o pedís cambios). Nada se programa sin tu OK.
4. **Yo lo programo** en Metricool con el conector. Metricool publica solo.
5. **A fin de mes** reviso las estadísticas y ajusto: qué temas funcionan y a qué hora publicar.

Las imágenes se suben desde la web (`ceiboworks.com/social/...`), porque Metricool necesita poder
descargarlas. Son las mismas que se van a publicar, así que no hay nada privado en ellas.

## Calendario propuesto (primeras 12 publicaciones)

Lunes, miércoles y viernes a las **19 h de Argentina**: mediodía/tarde en EE. UU., noche en
Uruguay/Chile/Argentina y 11 h del día siguiente en Nueva Zelanda. Metricool nos va a decir después
la mejor hora real.

| Fecha | Publicación |
|---|---|
| Lun 30/11 | 01 · Hola, esto es Ceibo Works |
| Mar 1/12 | Reel 1 · Find the phone number in 5 seconds |
| Mié 2/12 | 02 · Web de muestra: jardines y pavimentos |
| Jue 3/12 | Reel 3 · Same cottage: A or B? |
| Vie 4/12 | 03 · Dato: más de 1 de cada 8 webs no cargaba |
| Lun 7/12 | 04 · Cómo funciona |
| Mar 8/12 | Reel 2 · 1 in 8 websites didn't load |
| Mié 9/12 | 05 · Web de muestra: cuidado de casas |
| Vie 11/12 | 06 · Consejo: "No seguro" en Chrome |
| Lun 14/12 | 07 · Por qué "Ceibo" |
| Mié 16/12 | 08 · Web de muestra: cabaña |
| Vie 18/12 | 09 · Consejo: el vencimiento del dominio |
| Lun 21/12 | 10 · Precios |
| Mié 23/12 | 11 · Consejo: llamar con un toque |
| Lun 28/12 | 13 · Now in Australia (reemplaza a la 12, que era solo en español) |

## Pasos para conectar (los hace Tomas, una sola vez)

1. Crear cuenta gratis en metricool.com con `ceiboworks@gmail.com`.
2. En Metricool: conectar la página de Facebook y el Instagram de Ceibo Works (cuenta profesional
   vinculada a la página).
3. En claude.ai → Configuración → Conectores → **Metricool** → Conectar → autorizar.
4. Avisar a Claude para programar el calendario.

## Reels

Los reels se publican **solo en inglés**: el público objetivo son Australia, Nueva Zelanda, el Reino Unido
e Irlanda. Los genera `social/reels/` (ver `social/reels/guiones.md`).

- **Voz:** Jessica, de ElevenLabs.
- **Etiqueta de IA:** los reels van marcados como "contenido generado con IA" en Instagram, porque la voz
  es sintética. Instagram pide declararlo.
- **Horario:** martes y jueves a las 19 h de Argentina (23 h en Madrid, la zona horaria de Metricool).
- **Publicaciones en diciembre:** 14 de las 20 que permite el plan gratis.
