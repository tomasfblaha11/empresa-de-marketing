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
const EXCLUDE = /cement|aggregate|quarr|consultant|council|mitre ?10|bunnings|placemakers|fulton hogan|downer|harcourts|ray white|bayleys|realty|real estate|realtor|quinovic|bachcare|sotheby|university|school|wsp|opus international|winstone|firth|landscape suppl|garden (centre|center)|nursery|home depot|lowe'?s|trugreen|brightview|davey|vacasa|evolve|airbnb|homewatch caregivers|caregiver|senior care|insurance|bank|hotel|resort|motel group|top 10|holiday park|camping|campground|rv park|storage|plumb|electric|roofing|pest|pool supply|mortgage|law firm|attorney/i;
const FREE_MAIL = /@(gmail|googlemail|xtra|hotmail|outlook|live|yahoo|ymail|icloud|me|msn|aol|slingshot|orcon|vodafone|clear|paradise|actrix|inspire|kinect|farmside|bigpond|comcast|att|sbcglobal|verizon|bellsouth|cox|charter|earthlink)\./i;

function niche(p) {
  const s = `${p.foundIn} ${p.category}`.toLowerCase();
  if (/cottage|bed-and-breakfast|bed-breakfast|holiday-home|cabin|vacation|bed & breakfast|accommodation|lodg/.test(s)) return 'Alojamiento (cabañas, B&B, casas de vacaciones)';
  if (/home-watch|property-maintenance|house-sitting|property maintenance|home watch/.test(s)) return 'Cuidado de casas';
  return 'Paisajismo y pavimentos';
}
const city = (p) => (p.foundIn ?? '').split('/')[0].replace(/-([a-z]{2})$/, (_, st) => `, ${st.toUpperCase()}`).replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const PRIORITY = { caida: 1, 'sin-web': 2, deficiente: 3 };
const LABEL = { caida: 'Web caída o rota', 'sin-web': 'Sin página web', deficiente: 'Web deficiente' };

const seen = new Set();
const rows = [];
for (const p of checked) {
  const c = p.check ?? {};
  if (!PRIORITY[c.verdict]) continue;
  if (EXCLUDE.test(`${p.name} ${p.category}`)) continue;
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
let md = `# Prospectos Nueva Zelanda y Estados Unidos\n\n`;
md += `Generado el ${new Date().toISOString().slice(0, 10)}. ${rows.length} negocios con un problema concreto y un email publicado por ellos mismos `;
md += `(en su ficha de Yellow / YellowPages o en su propia web).\n\n`;
md += `| | Nueva Zelanda | Estados Unidos |\n|---|---|---|\n`;
for (const t of Object.values(LABEL)) md += `| ${t} | ${count((r) => r.pais === 'NZ' && r.tipo === t)} | ${count((r) => r.pais === 'US' && r.tipo === t)} |\n`;
md += `\n**Antes de escribir:** mirá la web vos mismo (a veces vuelven a funcionar), escribí uno por uno y siempre con la línea para darse de baja. `;
md += `A Estados Unidos, la ley (CAN-SPAM) exige además poner una dirección postal al pie del mail.\n`;
for (const pais of ['NZ', 'US']) {
  md += `\n## ${pais === 'NZ' ? 'Nueva Zelanda' : 'Estados Unidos'}\n`;
  for (const t of Object.values(LABEL)) {
    const list = rows.filter((r) => r.pais === pais && r.tipo === t);
    if (!list.length) continue;
    md += `\n### ${t} (${list.length})\n\n| Negocio | Ciudad | Rubro | Deficiencia | Email |\n|---|---|---|---|---|\n`;
    for (const r of list) md += `| ${r.negocio.replace(/\|/g, '/')}${r.web ? ` ([web](${r.web}))` : ''} | ${r.ciudad} | ${r.nicho.split(' (')[0]} | ${r.deficiencia.replace(/\|/g, '/')} | ${r.email} |\n`;
  }
}
writeFileSync(join(dir, 'prospectos.md'), md);
console.log(`${rows.length} prospects → prospectos.csv / prospectos.md`, { NZ: count((r) => r.pais === 'NZ'), US: count((r) => r.pais === 'US') });
