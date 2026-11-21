# Base de prospectos (Nueva Zelanda)

Busca negocios de los nichos configurados en Google Maps (API oficial Places, Text Search New),
audita su web en móvil con PageSpeed Insights y los ordena por potencial.

```bash
npm run prospects:find -- --dry-run          # cuántas consultas haría, sin gastar
npm run prospects:find                        # todos los nichos y ciudades
npm run prospects:find -- --niche house-care --location Tauranga
npm run prospects:rank -- data/prospects/nz/<fecha>
```

Resultado: `data/prospects/nz/<fecha>/prospects.csv` (fuera de Git).

## Puntaje (0–100)

| Señal | Puntos |
|---|---|
| Sin web / solo redes / web caída / solo anuncio en portal | +40 / +40 / +45 / +35 |
| Web en subdominio gratuito | +20 |
| Web propia: no responde / no adaptada a móvil / lenta (<50) / algo lenta (<70) / sin HTTPS / SEO <80 | +45 / +20 / +25 / +15 / +10 / +5 |
| ≥20 reseñas / ≥5 reseñas / <3 reseñas | +20 / +10 / −10 |
| Puntuación ≥4,5 (con ≥5 reseñas) | +5 |
| Sin teléfono | −15 |

Nivel A ≥ 60 (contactar primero), B 40–59, C < 40.

## Reglas

- La clave de Google nunca va en el repo: el proxy del entorno la inyecta en la cabecera
  `X-Goog-Api-Key`. En local, variable `GOOGLE_MAPS_API_KEY` (nunca versionada).
- Límite de 600 consultas por ejecución (`config.mjs`); el nivel Enterprise tiene 1.000 gratis al mes.
- Condiciones de Google Maps Platform: el `placeId` puede guardarse; el resto de los datos se
  renueva o se borra a los 30 días.
- Nueva Zelanda (Unsolicited Electronic Messages Act 2007): nada de emails masivos. Contacto
  uno a uno, por teléfono o por el formulario del negocio. Guardar solo lo necesario.
