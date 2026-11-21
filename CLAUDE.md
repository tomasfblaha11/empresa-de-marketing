# CLAUDE.md — Agencia WaaS europea

Agencia de desarrollo web por suscripción para pequeñas empresas europeas: webs profesionales,
rápidas, adaptadas a cada nicho y fáciles de mantener.

> Estado actual: **entorno preparado, sin desarrollo**. No crear páginas de clientes, plantillas
> ni plataforma hasta que el responsable lo apruebe explícitamente.

## Alcance

- Sí: webs empresariales estáticas (landing, sitio corporativo, catálogo simple, contacto).
- No, por ahora: cobros/pagos, CRM, portal de clientes, cuentas de usuario, plataforma SaaS.
  Si una tarea lo requiere, parar y preguntar.

## Stack

- **Astro** (salida estática por defecto). Islas de JS solo cuando una interacción lo justifique.
- **Node.js 22** (Astro 7 exige `>=22.23.4`). Gestor: npm, salvo decisión contraria.
- **GitHub** para control de versiones; **Vercel (plan Pro)** para publicar;
  **Lighthouse CI** y **Playwright** para pruebas.
- CSS propio con tokens (variables CSS). Sin frameworks de UI ni librerías de componentes
  salvo aprobación.

## Reglas de arquitectura

1. Rendimiento, accesibilidad y SEO son requisitos, no extras.
2. Evitar dependencias innecesarias. Antes de añadir una: ¿la plataforma o Astro ya lo resuelven?
   Toda dependencia nueva se justifica en el PR (licencia, tamaño, mantenimiento).
3. Componentes reutilizables y agnósticos del cliente; lo específico de cada cliente va en
   configuración y contenido, no en el código de los componentes.
4. Cada cliente aislado: su propio repositorio, su propio proyecto de Vercel y sus
   propias credenciales. Nunca mezclar datos, contenido ni secretos entre clientes.
5. No copiar textos, imágenes, logos ni diseños protegidos de competidores. Usar contenido del
   cliente, material propio o recursos con licencia verificada (anotar la licencia).
6. Ejecutar las pruebas antes de cada publicación. Nada se despliega con pruebas en rojo.
7. Todo cambio pasa por Git/GitHub: ramas, commits pequeños y PR.

## Calidad mínima por página

- Lighthouse (móvil): Rendimiento ≥ 90, Accesibilidad ≥ 95, Buenas prácticas ≥ 95, SEO ≥ 95.
- WCAG 2.1 AA: contraste, foco visible, navegación por teclado, `alt` en imágenes,
  jerarquía de encabezados, `lang` correcto.
- SEO: `<title>` y `meta description` únicos, URL canónica, Open Graph, `sitemap.xml`,
  `robots.txt`, datos estructurados (schema.org `LocalBusiness` u otro según nicho).
- Imágenes optimizadas (`astro:assets`, AVIF/WebP, dimensiones explícitas, lazy loading
  fuera del primer pantallazo). Fuentes autoalojadas y con `font-display: swap`.
- Europa: textos en el idioma del cliente (multi-idioma con i18n de Astro si hace falta),
  aviso legal, política de privacidad y cookies conformes al RGPD; sin cookies ni rastreo
  de terceros sin consentimiento. Preferir analítica sin cookies.
- Responsive verificado a 390, 768, 1024 y 1440 px.

## Demos para prospectos

Una demo es una propuesta para un negocio que todavía no es cliente. Siempre:

1. `noindex` (meta robots + cabecera `X-Robots-Tag`): nunca debe aparecer en buscadores.
2. URL no adivinable (`demo-<código>.vercel.app`), nunca con el nombre del negocio.
3. Aviso visible: "Propuesta de diseño para <negocio>. No es su web oficial."
4. Solo datos públicos del negocio (nombre, servicios, zona). Nada de sus fotos, logos ni
   reseñas sin permiso; usar imágenes propias o con licencia verificada.
5. Borrar la demo si no hay respuesta en 30 días. Si contratan, pasa a un proyecto propio.

## Datos de cada cliente

Todos los clientes entregan la misma ficha: `docs/ficha-cliente.md`. El código lee esa ficha;
no se escribe contenido de un cliente directamente en los componentes.

## Pruebas antes de publicar

1. `astro check` y build sin errores.
2. Playwright: carga de páginas clave, enlaces rotos, formulario de contacto, vista móvil.
3. Lighthouse CI con los umbrales de arriba (`lighthouserc` en cada repo de cliente).
4. Revisión con la skill `web-design-guidelines` sobre los componentes cambiados.

## Seguridad y credenciales

- Nunca escribir claves API, tokens ni contraseñas en el código, en commits, en este archivo
  ni en el chat. Usar secretos de GitHub Actions / Vercel por cliente.
- `.env*` está en `.gitignore`; solo se versiona `.env.example` sin valores.
- No instalar paquetes, skills, plugins ni servidores MCP desconocidos sin revisar antes su
  código, licencia, permisos y hooks. Fijar versiones (lockfile, commit de skills).

## Herramientas de Claude Code en este proyecto

- `frontend-design` (Anthropic): dirección visual al construir componentes y páginas.
- `web-design-guidelines` (Vercel, en `.claude/skills/`): revisión de UI/accesibilidad.
- `superpowers`: proceso (brainstorming, planes, TDD, verificación antes de dar algo por hecho).
- Playwright (plugin MCP + Chromium preinstalado): verificación en navegador real.
- Context7: documentación actualizada de Astro y librerías (pendiente de configurar).

Ver `docs/auditoria-entorno.md` para versiones, licencias y decisiones.

## Convenciones

- Código y nombres de archivos en inglés; contenido y documentación interna en español.
- Commits en imperativo y concisos. Un PR por cambio lógico.
