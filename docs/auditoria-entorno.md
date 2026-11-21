# Auditoría y preparación del entorno — Agencia WaaS

Fecha: 2026-11-21 · Entorno: sesión cloud de Claude Code (Linux, contenedor efímero)

## 1. Versiones base

| Herramienta | Versión | Requisito más exigente | Estado |
|---|---|---|---|
| Node.js | 22.23.5 | Astro 7 pide `>=22.23.4` | OK (justo por encima; fijado `.nvmrc` = 22) |
| npm | 10.9.9 | Astro: `>=9.6.5` | OK |
| pnpm | 10.28.0 | — | Disponible, no se usa por ahora |
| Git | 2.43.0 | — | OK |
| Claude Code | 2.1.330 | — | OK |
| Chromium (Playwright) | 157.0.8103.78 | — | Preinstalado en `/opt/pw-browsers` |

## 2. Inventario: qué estaba instalado y qué se hizo

| Herramienta | Estado previo | Acción | Nivel |
|---|---|---|---|
| Anthropic Frontend Design | Instalado (plugin sincronizado de claude.ai, v1.1.1) | Ninguna | Cuenta |
| Superpowers | Instalado (plugin sincronizado, v7.0.2) | Ninguna | Cuenta |
| Playwright | Instalado (plugin MCP sincronizado + librería 1.63.0 + Chromium) | Verificado | Cuenta / sistema |
| Vercel Web Design Guidelines | No instalado | **Instalado** (revisado, SHA verificado) | **Proyecto** `.claude/skills/web-design-guidelines` |
| Context7 | No instalado | **Pendiente**: requiere host de red y clave API | — |
| UI UX Pro Max | No instalado | **No instalado**: duplica otras skills (ver §4) | — |
| Astro | — | Verificado vía `npx astro@7.4.13` (no se añade aún: no hay proyecto) | — |
| Lighthouse CI | — | Verificado vía `npx @lhci/cli@0.16.1` con prueba real | — |
| Wrangler (Cloudflare Pages) | — | Verificado vía `npx wrangler@4.166.0` (sin cuenta conectada) | — |
| GitHub | Repo conectado, rama `claude/intelligent-albattani-ak4q4y` | Ninguna | — |

Instalado antes de esta auditoría (a petición previa):

| Herramienta | Dónde | Observación |
|---|---|---|
| design-taste-frontend (taste-skill 2.5.1) | Proyecto `.agents/skills/` + enlace en `.claude/skills/` | Añade hook `Stop`; ver §4 |
| Impeccable 0.1.27 | Global `~/.claude` (efímero) | Añade hooks `SessionStart`, `PostToolUse(Edit\|Write)`, `Stop` |
| Figma (plugin) | Usuario (efímero) | Servidor MCP de Figma bloqueado por la red |
| design, small-business, feature-dev, claude-security, security-guidance, obsidian-sync | Plugins sincronizados de claude.ai | Fuera del alcance; no se tocan |

## 3. Repositorios, licencias y reputación

Datos de GitHub (estrellas, último push) a 2026-11-21. Las estrellas no prueban seguridad: el
código de lo instalado se revisó.

| Repositorio | Licencia | Estrellas | Último push | Revisión |
|---|---|---|---|---|
| anthropics/claude-code | Propietaria (términos de Anthropic) | 156k | 2026-11-21 | Solo referencia; no se instala código |
| vercel-labs/agent-skills | MIT (según README; **sin archivo LICENSE**) | 34.6k | 2026-11-20 | Skill revisada: solo texto, sin scripts ni hooks, sin red |
| nextlevelbuilder/ui-ux-pro-max-skill | MIT | 152k | 2026-11-19 | Scripts Python locales, sin llamadas de red ni `exec`; no instalado por duplicidad |
| obra/superpowers | MIT | 323k | 2026-11-03 | Ya activo vía claude.ai |
| microsoft/playwright | Apache-2.0 | 101k | 2026-11-21 | Ya disponible |
| upstash/context7 | MIT | 65k | 2026-11-20 | MCP remoto `mcp.context7.com` o paquete `@upstash/context7-mcp` 4.7.3 |
| withastro/astro | MIT (GitHub muestra NOASSERTION por avisos de terceros) | 64k | 2026-11-21 | Paquete `astro` 7.4.13, MIT |
| GoogleChrome/lighthouse-ci | Apache-2.0 | 7.2k | 2026-11-17 | Paquete `@lhci/cli` 0.16.1 |
| Leonxlnx/taste-skill | MIT | 119k | 2026-11-08 | Instalado antes; hook `Stop` ejecuta `scripts/gate.mjs` |
| pbakaus/impeccable | Apache-2.0 | 114k | 2026-11-21 | Instalado antes (global) |
| cloudflare/workers-sdk (wrangler) | MIT OR Apache-2.0 | — | — | Paquete `wrangler` 4.166.0 |

Origen exacto de la skill instalada:
`vercel-labs/agent-skills@5a37a6329fbad3666c3207392a6a7c0110e92efb` → `skills/web-design-guidelines`
(reglas fijadas a `web-interface-guidelines@434b7f9`, SHA-256 `d246b026…0234`, comprobado).

## 4. Duplicidades detectadas

Hay **cinco** fuentes de criterio de diseño activas o candidatas, con opiniones distintas:

| Herramienta | Función | Solapa con |
|---|---|---|
| frontend-design (Anthropic) | Dirección visual al construir | Todas |
| design-taste-frontend | Dirección visual muy opinada (shaders, "una sección por pantalla", fotos de stock) + gate en `Stop` | frontend-design, impeccable |
| Impeccable | Diseño + auditoría + hooks tras cada edición | frontend-design, taste-skill, web-design-guidelines |
| design (plugin claude.ai) | Crítica, accesibilidad, handoff | web-design-guidelines |
| UI UX Pro Max | Base de datos de estilos/paletas/fuentes | frontend-design |

Riesgos: instrucciones contradictorias, hooks que se ejecutan en cada edición y al terminar
cada turno (más lentitud y ruido), y resultados menos consistentes entre clientes.

## 5. Conjunto mínimo propuesto

| Necesidad | Herramienta | Estado |
|---|---|---|
| Construir UI con criterio | frontend-design | Activo |
| Revisar UI / accesibilidad | web-design-guidelines | Instalado en el proyecto |
| Proceso de trabajo | superpowers | Activo |
| Pruebas en navegador | Playwright | Activo |
| Documentación actualizada | Context7 | Pendiente de aprobación |
| Framework | Astro 7 | Se añade al crear la plantilla base |
| Calidad | Lighthouse CI (+ Playwright) | Se añade a la plantilla y a CI |
| Publicación | Cloudflare Pages (wrangler / integración Git) | Se configura por cliente |

Recomendación sobre lo sobrante (requiere tu aprobación, no se ha borrado nada):
- **Retirar `design-taste-frontend`** del repo: su estilo (shaders, fotos de stock, secciones de
  pantalla completa) choca con webs rápidas y sobrias para pymes, y añade un hook `Stop`.
- **No persistir Impeccable** (ya es efímero): sus hooks globales corren tras cada edición.
- **No instalar UI UX Pro Max**: útil como catálogo, pero duplica frontend-design.

## 6. Configuración aplicada

- `CLAUDE.md`: reglas de desarrollo, calidad, pruebas y seguridad.
- `.claude/settings.json`: deniega a Claude leer `.env*`, `*.pem` y `*.key`.
- `.claude/skills/web-design-guidelines/`: skill a nivel de proyecto.
- `.gitignore`: dependencias, builds, informes de pruebas y credenciales.
- `.nvmrc`: Node 22.
- Entorno cloud: se añadió `impeccable.style` a los hosts permitidos (para la instalación previa).

## 7. Estructura de carpetas propuesta

Este repositorio es el **kit de la agencia** (reglas, plantilla, componentes, nichos). Cada
cliente vive en **su propio repositorio**, creado desde la plantilla, con su propio proyecto de
Cloudflare Pages y sus propios secretos.

```
empresa-de-marketing/              # kit de la agencia (este repo)
├── CLAUDE.md
├── .claude/
│   ├── settings.json
│   └── skills/web-design-guidelines/
├── docs/
│   ├── auditoria-entorno.md
│   ├── procesos/                  # alta de cliente, publicación, mantenimiento
│   └── nichos/                    # guía por nicho (contenido, schema.org, secciones)
├── template/                      # plantilla Astro base (repo plantilla de GitHub)
│   ├── src/{components,layouts,pages,content,styles}/
│   ├── public/
│   ├── tests/                     # Playwright
│   ├── lighthouserc.json
│   ├── astro.config.mjs
│   └── .env.example
├── packages/ui/                   # componentes reutilizables (si se comparten entre clientes)
├── niches/                        # presets por nicho: tokens, secciones, textos de ejemplo
└── .github/workflows/             # CI de la plantilla (build + Playwright + Lighthouse)

cliente-<nombre>/                  # repo independiente por cliente
├── src/ … (desde template/)
├── .github/workflows/deploy.yml   # pruebas → Cloudflare Pages
└── secretos en GitHub/Cloudflare, nunca en el repo
```

## 8. Pruebas realizadas

| Prueba | Resultado |
|---|---|
| `node -v`, `npm -v`, `git --version`, `claude --version` | OK (tabla §1) |
| `claude plugin list` | frontend-design, superpowers, playwright cargados |
| `npx astro@7.4.13 --version` | `astro v7.4.13` |
| `npx @lhci/cli@0.16.1 --version` + `lhci collect` sobre página HTML de prueba con Chromium | Rendimiento 100, Accesibilidad 100, Buenas prácticas 96, SEO 100 |
| `npx wrangler@4.166.0 --version` | `4.166.0` |
| Playwright: lanzar Chromium y leer DOM | OK (`chromium 157.0.8103.78`) |
| SHA-256 de `web-design-guidelines/references/command.md` | Coincide con el publicado |
| Skill `web-design-guidelines` detectada por Claude Code | Sí |

## 9. Problemas detectados

1. **Node justo en el mínimo de Astro 7** (22.23.5 vs `>=22.23.4`): cualquier entorno local o CI
   debe usar Node 22 actualizado.
2. **Contenedor efímero**: lo instalado a nivel usuario/global (Impeccable, Figma) se pierde al
   cerrar la sesión. Solo persiste lo que está en el repo o en la cuenta de claude.ai.
3. **Context7** necesita acceso de red a `mcp.context7.com` y una clave API (gratuita) que debe
   guardarse como secreto del entorno, no en el repo.
4. **Cloudflare**: no hay cuenta ni token conectados; `api.cloudflare.com` no está permitido en
   la red de este entorno. Los despliegues irán por GitHub Actions o la integración Git de
   Cloudflare, con un token por cliente.
5. **Figma**: el servidor MCP de Figma está bloqueado por la red; el marketplace
   `claude-plugins-official` no existe en este entorno (se usó `anthropic-plugin-directory`).
6. **vercel-labs/agent-skills no tiene archivo LICENSE**: solo el README indica MIT. Riesgo legal
   bajo (uso interno), pero conviene tenerlo en cuenta.
7. **Duplicidad de skills de diseño y hooks** (§4).
8. **Plugins de cuenta no relacionados** (small-business, obsidian-sync…) cargan muchas skills;
   no afectan al proyecto pero añaden ruido al contexto.
9. Playwright del sistema es 1.63.0 (última 1.65.1): si la plantilla fija `@playwright/test`
   en otra versión, usar `executablePath: '/opt/pw-browsers/chromium'` en este entorno.

## 10. Próximos pasos (requieren tu aprobación)

1. Decidir sobre `design-taste-frontend`, Impeccable y UI UX Pro Max (§5).
2. Context7: aprobar añadir `mcp.context7.com` a la red y crear la clave; luego `.mcp.json`
   del proyecto sin la clave en el repo.
3. Crear `template/` con Astro 7 mínimo: layout base, SEO, i18n, páginas legales, Playwright
   y `lighthouserc.json` con los umbrales del CLAUDE.md.
4. Workflow de GitHub Actions: build → `astro check` → Playwright → Lighthouse CI → deploy a
   Cloudflare Pages.
5. Definir los 3–5 primeros nichos y sus presets.
6. Opcional: script de setup del entorno cloud para que futuras sesiones arranquen listas.
