# Chile y Uruguay: análisis y propuesta (26/11/2026)

## Por qué tienen sentido

- **Pagan en dólares o piensan en dólares.** En Uruguay los servicios se cotizan seguido en USD y mucha
  gente tiene cuenta en dólares. En Chile se paga en pesos chilenos, pero con moneda estable.
- **Muchas pymes todavía no tienen web.** En Chile, un estudio de la Cámara de Comercio de Santiago
  (2024) dice que solo el 23,1 % de las pymes tiene página web
  ([fuente](https://portalinnova.cl/?p=67175)). Para Uruguay no encontré una cifra comparable.
- **Turismo con temporada ya.** El verano (diciembre a marzo) es la temporada fuerte de la costa
  uruguaya (Maldonado, Rocha, Colonia) y del sur de Chile (Pucón, Puerto Varas, Chiloé). Cabañas,
  hostales e inmobiliarias de alquiler de temporada son exactamente nuestro nicho.
- **Mismo idioma y misma zona horaria:** se puede cerrar por WhatsApp y videollamada sin fricción.

## Competencia y precio

| | Referencia que encontré |
|---|---|
| Constructores (Wix, Tiendanube, etc.) en Chile | ~CLP 6.000 a 25.000 por mes, lo hace el propio dueño ([Tiendanube](https://www.tiendanube.com/blog/cuanto-cuesta-crear-una-pagina-web), [neolo](https://www.neolo.com/blog/cuanto-cuesta-una-pagina-web-chile.php)) |
| Agencia en Chile, pago único | ~CLP 350.000 a 2.000.000 más hosting ([GoDaddy](https://www.godaddy.com/resources/latam/clientes/cuanto-cuesta-pagina-web-chile)) |
| Uruguay | Sitios económicos con plantilla desde ~UYU 2.750 a 5.000; agencias a medida mucho más ([neolo](https://www.neolo.com/blog/?p=16825)) |

**Propuesta de precio para Chile y Uruguay: US$49 por mes** (US$39 cada web adicional), mínimo 12 meses,
armado gratis. Motivos:
- US$79 es nuestro precio para NZ/EE. UU.; en Chile equivale a una cuota que compite con agencias
  caras, y el dueño de una cabaña la compara con "hacérmela yo en Wix".
- US$49 × 12 = US$588 al año: menos que una agencia chilena por un sitio que además mantenemos.
- Sigue en dólares, que es lo que buscamos.

## Cómo cobrar (desde Argentina)

Lo que sirve para una **cuota mensual en dólares**, de más simple a más complejo:

1. **PayPal**: muy usado en Uruguay y conocido en Chile. Permite **suscripciones** (cobro automático
   todos los meses), que es justo nuestro modelo. Contra: comisiones y el retiro a Argentina.
2. **Payoneer**: le mandás al cliente una "solicitud de pago" y paga con tarjeta; vos retirás a tu
   cuenta o a Prex. Bueno para clientes que no usan PayPal.
3. **Global66 / Prex**: fintechs regionales con cuenta en USD; pueden abaratar transferencias entre
   países, pero conviene confirmar la ruta Chile → Argentina y sus costos antes de ofrecerla.
4. **Cripto (USDT)**: solo si el cliente lo propone.

**Mercado Pago:** cada país tiene su propia cuenta; por lo que encontré, un cliente chileno o uruguayo no
puede pagar fácilmente un link de una cuenta argentina. Sirve para clientes **argentinos**, no para estos.

**Impuestos:** para clientes del exterior se factura como exportación de servicios (factura E si sos
monotributista). Conviene confirmarlo con un contador antes del primer cobro.

## Prospectos

- **Chile:** registro oficial de SERNATUR (serviciosturisticos.sernatur.cl), solo formatos chicos
  (cabañas, hostales, lodges, hospedajes) en 31 comunas turísticas.
- **Uruguay:** registro oficial de operadores del Ministerio de Turismo (datos abiertos):
  alojamientos, turismo rural e inmobiliarias.
- Herramientas: `tools/prospects/find-sernatur-cl.mjs` y los CSV de MINTUR convertidos a `manual.json`.

## Cómo adaptar la web (propuesta, pendiente de aprobación)

1. **Precio por región en la versión en español:** "Chile y Uruguay: US$49/mes" junto a Argentina (ARS).
2. **Dos páginas nuevas:** "Páginas web para cabañas y alojamientos en Chile" y "Páginas web para
   alojamientos e inmobiliarias en Uruguay (Punta del Este, Rocha, Colonia)".
3. **Botón de WhatsApp** (en estos países casi todo se cierra por ahí): necesita tu número.
4. **Pregunta frecuente "¿Cómo pago desde Chile o Uruguay?"** con PayPal o tarjeta.
5. **Una web de muestra en español** (cabañas): hoy las tres muestras están en inglés y para un dueño
   chileno o uruguayo es el mayor punto débil. La plantilla necesita soportar español.

## Ley y buenas prácticas para los mails

- **Chile (Ley 19.496, art. 28 B):** el mail debe indicar de qué se trata, quién lo envía y una
  dirección válida para pedir que no le escriban más ([BCN](https://www.bcn.cl/leychile/navegar?idNorma=1142343)).
- **Uruguay (Ley 18.331 de datos personales):** escribir solo a emails publicados por el negocio, uno por
  uno, y respetar siempre el pedido de baja.
- Igual que en NZ: un mail personalizado por negocio, con la línea para darse de baja.
