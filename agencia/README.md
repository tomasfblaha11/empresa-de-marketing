# La agencia dentro de Claude

Cuatro "empleados", cada uno un comando que Tomas escribe cuando quiere ponerlo a trabajar. No hay nada
automático: con el plan de US$20 conviene usar un rol por vez y cuando haga falta.

| Comando | Rol | Qué entrega |
|---|---|---|
| `/buscador` | Busca negocios nuevos con la web caída, sin web o deficiente (AU, NZ, UK e IE Ltd) | Prospectos verificados |
| `/analista` | Elige los mejores y propone qué web hacerles y qué decirles | Ideas **para aprobar** |
| `/desarrollador` | Arma la muestra y el borrador de mail de cada idea aprobada | Muestras y borradores **listos para enviar** |
| `/cm` | Revisa Metricool, informa qué funcionó y propone reels | Informe semanal y reels **para aprobar** |

Ritmo sugerido: lunes `/cm`, martes `/buscador`, miércoles `/analista`, jueves `/desarrollador` (si
aprobaste algo). Tomas aprueba escribiendo, por ejemplo, "apruebo 1 y 3".

## Dónde queda cada cosa

- `agencia/estado.json`: los números de la oficina (se versiona; sin emails ni datos personales).
  Cada rol lo actualiza al terminar.
- `data/agencia/` (no se versiona, como todo `data/`): ideas, informes y detalles con datos de negocios.
  Vive en el contenedor de la sesión: si la sesión se cierra, se pierde, salvo lo resumido en `estado.json`.
- `tools/agencia-mod/`: la oficina animada (mod de Claude Code). Para verla en otra sesión, pedile a
  Claude "cargá la oficina": la copia a la carpeta de mods de la sesión y se abre con `/oficina`.

## Reglas para todos los roles

- Nadie envía mails, publica ni compra nada sin el OK de Tomas. Los mails quedan como borrador en Gmail.
- Solo mercados de habla inglesa: Australia, Nueva Zelanda, Reino Unido e Irlanda (en UK e IE, solo
  empresas Ltd). Contenido en inglés.
- Datos de negocios: solo públicos, verificados (web en el navegador y registro MX del email).
- Demos: siguen las reglas de `CLAUDE.md` (noindex, URL no adivinable, aviso visible, borrar a los 30 días).
- Ahorrar uso: preferir los scripts de `tools/` a hacer las cosas a mano, y trabajar en tandas chicas.
