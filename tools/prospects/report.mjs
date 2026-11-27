#!/usr/bin/env node
// Step 3: turn checked.json into the list Tomas works from: only small businesses with a real
// problem (no website, broken website or clear deficiencies) and an email they published.
// Usage: node tools/prospects/report.mjs <folder>
// Writes <folder>/prospectos.csv (for Google Sheets/Excel) and <folder>/prospectos.md (to read).

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { toCsv } from './lib.mjs';

const dir = process.argv[2];
if (!dir) throw new Error('Usage: report.mjs <folder>');
const checked = Object.values(JSON.parse(readFileSync(join(dir, 'checked.json'), 'utf8')));

// Large companies, chains, suppliers and agencies: not our clients.
const EXCLUDE = /cement|aggregate|quarr|consultant|council|mitre ?10|bunnings|placemakers|fulton hogan|downer|harcourts|ray white|bayleys|realty|real estate|realtor|quinovic|bachcare|sotheby|university|school|wsp|opus international|winstone|firth|landscape suppl|garden (centre|center)|nursery|home depot|lowe'?s|trugreen|brightview|davey|vacasa|evolve|airbnb|homewatch caregivers|caregiver|senior care|insurance|bank|hotel|resort|motel group|top 10|holiday park|camping|campground|rv park|storage|plumb|electric|roofing|pest|pool supply|mortgage|law firm|attorney|escriban|contador|abogad|estudio jur|\bcra\.|\bdra?\.|rematador|tasador/i;
const FREE_MAIL = /@(gmail|googlemail|xtra|hotmail|outlook|live|yahoo|ymail|icloud|me|msn|aol|slingshot|orcon|vodafone|clear|paradise|actrix|inspire|kinect|farmside|bigpond|comcast|att|sbcglobal|verizon|bellsouth|cox|charter|earthlink)\./i;

// Directories mix in unrelated businesses: the niche comes from the business's own categories,
// and anything that matches none of ours is left out.
const OFF_NICHE = /baker|dair|child|beauty|midwi|photograph|event|wedding|plumb|electric|refrigerat|roofing|chimney|plaster|ceiling|floor sand|painter|engineer|architect|carrier|freight|real estate agents|valuer|community|hire - plants|hardware|pump|insulation/i;
function niche(p) {
  const s = (p.category || '').toLowerCase();
  if (/home ?watch|house ?watch|property ?watch|caretak/i.test(p.name)) return 'Cuidado de casas';
  if (!s || OFF_NICHE.test(s)) return '';
  if (/inmobiliaria/.test(s)) return 'Inmobiliarias (alquiler de temporada)';
  if (/alojamiento|caba(ñ|n)a|hostal|hospedaje|posada|refugio|turismo rural|estancia|departamentos tur|complejo tur|residencial|turismo de naturaleza/.test(s)) return 'Alojamiento (cabañas, B&B, casas de vacaciones)';
  if (/bed & breakfast|bed and breakfast|bed &|holiday|farmstay|homestay|accommodation|cottage|cabin|chalet|lodg|inn\b|inns|vacation|guest/.test(s)) return 'Alojamiento (cabañas, B&B, casas de vacaciones)';
  if (/property manag|property maint|building maint|handyman|caretak|home watch|house sit|sitting services|property care|home services|concierge/.test(s)) return 'Cuidado de casas';
  if (/landscap|paving|driveway|concret|lawn|turf|garden maint|gardening|tar seal|asphalt|stonemason|tree serv|earthmov|hardscap|sod|patio/.test(s)) return 'Paisajismo y pavimentos';
  return '';
}
const city = (p) => (p.foundIn ?? '').split('/')[0].replace(/-([a-z]{2})$/, (_, st) => `, ${st.toUpperCase()}`).replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const PRIORITY = { caida: 1, 'sin-web': 2, deficiente: 3 };
const LABEL = { caida: 'Web caída o rota', 'sin-web': 'Sin página web', deficiente: 'Web deficiente' };

const seen = new Set();
const rows = [];
for (const p of checked) {
  const c = p.check ?? {};
  if (!PRIORITY[c.verdict]) continue;
  // In Chile and Uruguay small family hotels are fine prospects; elsewhere hotels are left out.
  const exclude = ['CL', 'UY'].includes(p.country) ? new RegExp(EXCLUDE.source.replace('|hotel|resort', '|resort|enjoy|conrad|sheraton|radisson|hilton|ibis|wyndham|cumbres|& beyond'), 'i') : EXCLUDE;
  if (exclude.test(`${p.name} ${p.category}`)) continue;
  if (!niche(p)) continue;
  const email = (p.email || c.emails?.find((e) => !/noreply|no-reply|wix|example/.test(e)) || '').trim();
  if (!email || !/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)) continue;
  const domain = (c.finalUrl || c.url || '').replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
  const key = [email, domain && !FREE_MAIL.test(`@${domain}`) ? domain : ''].filter(Boolean);
  if (key.some((k) => seen.has(k))) continue;
  key.forEach((k) => seen.add(k));
  rows.push({
    prioridad: PRIORITY[c.verdict],
    pais: p.country ?? (p.profile?.includes('yellowpages.com') ? 'US' : 'NZ'),
    tipo: LABEL[c.verdict],
    nicho: niche(p),
    negocio: p.name,
    ciudad: city(p),
    deficiencia: [...(c.problems ?? []), c.builder && c.verdict === 'deficiente' ? `Hecha con ${c.builder}` : ''].filter(Boolean).join('. '),
    email,
    telefono: p.phone ?? '',
    web: c.finalUrl || c.url || '',
    ficha: p.profile ?? '',
  });
}
rows.sort((a, b) => a.pais.localeCompare(b.pais) || a.prioridad - b.prioridad || a.nicho.localeCompare(b.nicho) || a.ciudad.localeCompare(b.ciudad));

const cols = ['pais', 'tipo', 'nicho', 'negocio', 'ciudad', 'deficiencia', 'email', 'telefono', 'web', 'ficha'];
writeFileSync(join(dir, 'prospectos.csv'), toCsv(rows, cols));

const count = (f) => rows.filter(f).length;
const NAMES = { AU: 'Australia', NZ: 'Nueva Zelanda', US: 'Estados Unidos', UK: 'Reino Unido', IE: 'Irlanda', CL: 'Chile', UY: 'Uruguay' };
const countries = Object.keys(NAMES).filter((k) => rows.some((r) => r.pais === k));
let md = `# Prospectos ${countries.map((k) => NAMES[k]).join(', ')}\n\n`;
md += `Generado el ${new Date().toISOString().slice(0, 10)}. ${rows.length} negocios con un problema concreto y un email publicado por ellos mismos `;
md += `(en un registro oficial, un directorio o su propia web).\n\n`;
md += `| | ${countries.map((k) => NAMES[k]).join(' | ')} |\n|---|${countries.map(() => '---').join('|')}|\n`;
for (const t of Object.values(LABEL)) md += `| ${t} | ${countries.map((k) => count((r) => r.pais === k && r.tipo === t)).join(' | ')} |\n`;
md += `\n**Antes de escribir:** mirá la web vos mismo (a veces vuelven a funcionar), escribí uno por uno y siempre con la línea para darse de baja. `;
if (countries.includes('US')) md += `A Estados Unidos, la ley (CAN-SPAM) exige además poner una dirección postal al pie del mail.`;
if (countries.some((k) => ['UK', 'IE'].includes(k))) md += ` En Reino Unido e Irlanda escribir solo a estas sociedades (Ltd/Limited): a trabajadores independientes no se puede sin permiso previo.`;
if (countries.includes('CL')) md += ` En Chile (Ley 19.496, art. 28 B) el mail debe decir de qué se trata, quién lo envía y dar una forma de darse de baja.`;
md += `\n`;
for (const pais of countries) {
  md += `\n## ${NAMES[pais]}\n`;
  for (const t of Object.values(LABEL)) {
    const list = rows.filter((r) => r.pais === pais && r.tipo === t);
    if (!list.length) continue;
    md += `\n### ${t} (${list.length})\n\n| Negocio | Ciudad | Rubro | Deficiencia | Email |\n|---|---|---|---|---|\n`;
    for (const r of list) md += `| ${r.negocio.replace(/\|/g, '/')}${r.web ? ` ([web](${r.web}))` : ''} | ${r.ciudad} | ${r.nicho.split(' (')[0]} | ${r.deficiencia.replace(/\|/g, '/')} | ${r.email} |\n`;
  }
}
writeFileSync(join(dir, 'prospectos.md'), md);
console.log(`${rows.length} prospects → prospectos.csv / prospectos.md`, Object.fromEntries(countries.map((k) => [k, count((r) => r.pais === k)])));
