# Plantilla base de la agencia

Web estática en Astro para oficios y servicios. **Todo lo del cliente está en un solo archivo**
(`src/data/client.json`) y en sus fotos; el código es el mismo para todos.

## Crear la web de un cliente

1. Crear su repositorio desde esta plantilla (un repo y un proyecto de Vercel por cliente).
2. Completar `src/data/client.json` con su ficha (`docs/ficha-cliente.md`):
   - `niche`: `paving-landscaping`, `house-care` o `holiday-rentals` (colores y textos del nicho).
   - `demo`: `true` para una propuesta (noindex, aviso, formulario desconectado); `false` para la web real.
   - `contact.formEndpoint`: URL del servicio de formularios. Vacío = el formulario avisa que no está conectado.
3. Copiar sus fotos a `src/assets/client/` y ejecutar `node scripts/prepare-photos.mjs`
   (máx. 2000 px, quita los metadatos y la ubicación GPS). Las fotos de `client/` tienen prioridad
   sobre las de `demo/` con el mismo nombre.
4. `npm run build`: valida la ficha (si falta algo obligatorio, dice qué), escribe `vercel.json`,
   ejecuta `astro check` y compila.
5. `npm test` (Playwright, escritorio y móvil) y `npm run lhci` (Lighthouse con los umbrales de CLAUDE.md).
6. Publicar en Vercel.

## Estructura

```
src/
  data/client.json      ficha del cliente (lo único que cambia)
  presets/index.ts      colores y textos por nicho
  lib/site.ts           valida la ficha y resuelve fotos
  components/           Header, Hero, Facts, Services, Gallery, About, Reviews, Contact, Footer, MobileBar
  pages/                inicio, privacidad, 404, robots.txt, sitemap.xml
  assets/demo/          fotos CC0 de ejemplo (ver LICENSES.md)
scripts/
  vercel-config.mjs     genera vercel.json (noindex en demos, cabeceras de seguridad, caché)
  prepare-photos.mjs    normaliza fotos
tests/site.spec.ts      pruebas Playwright
lighthouserc.cjs        umbrales Lighthouse
```

## Dependencias

| Paquete | Licencia | Para qué |
|---|---|---|
| astro 7.4.13 | MIT | framework (incluye sharp para imágenes) |
| @fontsource-variable/archivo 5.3.0 | OFL-1.1 | tipografía autoalojada |
| @astrojs/check, typescript 6 (dev) | MIT / Apache-2.0 | `astro check` |
| @playwright/test 1.63.0 (dev) | Apache-2.0 | pruebas (misma versión que el Chromium del entorno) |
| @lhci/cli 0.16.1 (dev) | Apache-2.0 | Lighthouse CI |

En el entorno cloud, Lighthouse necesita
`CHROME_PATH=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`.
