// Ceibo Works HQ: a pane beside the chat with an isometric office. Each agency role
// (Buscador, Analista, Desarrollador, CM) has a desk; the one working comes alive with a speech
// bubble saying what it is doing, taken from the real tool calls of the session. Tomas's desk
// shows what is waiting for his approval, read from agencia/estado.json in the repository.
import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { LogEntry, Office, RoleId } from '../types'

const PANE = 'ceibo-hq'
const office = atom({ plugin: 'ceibo-hq', key: 'office' } as const, { active: null, activity: '', log: [] } as Office, {
  shape: 'office-1',
})

type Role = { id: RoleId; name: string; job: string; color: string; desk: [number, number] }
const ROLES: Role[] = [
  { id: 'buscador', name: 'Buscador', job: 'Encuentra prospectos', color: '#2f6db5', desk: [0.4, 0.4] },
  { id: 'analista', name: 'Analista', job: 'Piensa ideas', color: '#7a4fb8', desk: [3.9, 0.4] },
  { id: 'desarrollador', name: 'Desarrollador', job: 'Arma las webs', color: '#c8102e', desk: [0.4, 3.9] },
  { id: 'cm', name: 'CM', job: 'Redes sociales', color: '#d9821c', desk: [3.9, 3.9] },
]
const byId = Object.fromEntries(ROLES.map((r) => [r.id, r])) as Record<string, Role>
const COMMAND = /^\/(buscador|analista|desarrollador|cm)\b/

// ---------- which role is doing what, from a tool call ----------
type Guess = { role: RoleId | null; text: string }
const clip = (s: string, n = 46) => (s.length > n ? `${s.slice(0, n - 1)}…` : s)
const base = (p: string) => p.split('/').pop() ?? p

function guess(e: Record<string, any>): Guess {
  const t: string = e.tool
  if (t === 'Skill' && byId[e.skill]) return { role: e.skill, text: `Arranca su turno` }
  if (t.startsWith('mcp__Metricool')) {
    const what = /Analytics|BestTime|Brand/.test(t) ? 'Mirando estadísticas' : /Scheduled/.test(t) ? 'Programando publicaciones' : 'Trabajando en Metricool'
    return { role: 'cm', text: what }
  }
  if (t.startsWith('mcp__Gmail')) return { role: 'desarrollador', text: /draft/.test(t) ? 'Escribiendo un borrador de mail' : 'Revisando el correo' }
  if (t.startsWith('mcp__Vercel')) return { role: 'desarrollador', text: 'Publicando en Vercel' }
  if (t === 'WebSearch') return { role: 'analista', text: `Investigando: ${e.query ?? ''}` }
  if (t === 'WebFetch' || (t === 'Agent' && e.subagent_type === 'web-fetch')) return { role: 'analista', text: 'Leyendo una página' }
  if (t === 'Bash') {
    const cmd: string = e.command ?? ''
    const role: RoleId | null = /tools\/prospects/.test(cmd) ? 'buscador'
      : /social\//.test(cmd) ? 'cm'
      : /agency|template|demo|vercel/.test(cmd) ? 'desarrollador' : null
    return { role, text: e.description || cmd.split('\n')[0] }
  }
  if (t === 'Edit' || t === 'Write' || t === 'Read') {
    const p: string = e.file_path ?? ''
    const role: RoleId | null = /\/social\//.test(p) ? 'cm'
      : /\/(agency|template|demos?)\//.test(p) ? 'desarrollador'
      : /\/tools\/prospects\//.test(p) ? 'buscador'
      : /\/agencia\/ideas\//.test(p) ? 'analista' : null
    return { role, text: `${t === 'Read' ? 'Leyendo' : 'Editando'} ${base(p)}` }
  }
  return { role: null, text: t.replace(/^mcp__[^_]+__/, '').replace(/_/g, ' ') }
}

// ---------- the agency's numbers, written by each role at the end of its turn ----------
type Estado = {
  prospectos?: { total?: number; nuevos?: number }
  paraAprobar?: { titulo: string }[]
  listosParaEnviar?: number
  redes?: { programados?: number; seguidores?: number | null }
}
async function estado($: any): Promise<Estado> {
  try { return JSON.parse(await $.fs.read('agencia/estado.json')) } catch { return {} }
}

// ---------- the isometric office, as SVG ----------
const OX = 200, OY = 104, TW = 32, TH = 16
const iso = (x: number, y: number, z = 0): [number, number] => [OX + (x - y) * TW, OY + (x + y) * TH - z]
const pts = (...p: [number, number][]) => p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function box(x: number, y: number, sx: number, sy: number, h: number, top: string, left: string, right: string, z = 0) {
  return `<polygon points="${pts(iso(x, y, z + h), iso(x + sx, y, z + h), iso(x + sx, y + sy, z + h), iso(x, y + sy, z + h))}" fill="${top}"/>` +
    `<polygon points="${pts(iso(x, y + sy, z + h), iso(x + sx, y + sy, z + h), iso(x + sx, y + sy, z), iso(x, y + sy, z))}" fill="${left}"/>` +
    `<polygon points="${pts(iso(x + sx, y, z + h), iso(x + sx, y + sy, z + h), iso(x + sx, y + sy, z), iso(x + sx, y, z))}" fill="${right}"/>`
}

function person(x: number, y: number, color: string, isActive: boolean, label: string) {
  const [px, py] = iso(x, y)
  const bob = isActive
    ? `<animateTransform attributeName="transform" type="translate" values="0 0;0 -3;0 0" dur="0.7s" repeatCount="indefinite"/>`
    : ''
  const zzz = isActive ? '' : `<text x="${px + 9}" y="${py - 44}" font-size="9" fill="#8a918b" font-style="italic">z<animate attributeName="opacity" values="0;1;0" dur="2.4s" repeatCount="indefinite"/></text>`
  return `<ellipse cx="${px}" cy="${py}" rx="11" ry="5" fill="#000" opacity=".12"/>
    <g opacity="${isActive ? 1 : 0.6}">${bob}
      <rect x="${px - 7}" y="${py - 28}" width="14" height="24" rx="6" fill="${color}"/>
      <circle cx="${px}" cy="${py - 35}" r="7.5" fill="#f1c8a5"/>
      <path d="M${px - 7.5} ${py - 36} a7.5 7.5 0 0 1 15 0 z" fill="#3b2a20"/>
    </g>${zzz}
    <text x="${px}" y="${py + 15}" font-size="10" font-weight="600" text-anchor="middle" fill="#1f2421">${esc(label)}</text>`
}

function bubble(x: number, y: number, text: string, color: string) {
  const [px, py] = iso(x, y)
  const w = Math.min(190, 18 + text.length * 5.3)
  const bx = Math.max(4, Math.min(396 - w, px - w / 2)), by = py - 78
  return `<g><animate attributeName="opacity" values="0;1" dur=".3s" fill="freeze"/>
    <rect x="${bx}" y="${by}" width="${w}" height="22" rx="8" fill="#fff" stroke="${color}" stroke-width="1.5"/>
    <polygon points="${pts([px - 5, by + 21], [px + 5, by + 21], [px, by + 29])}" fill="#fff" stroke="${color}" stroke-width="1.5"/>
    <rect x="${px - 6}" y="${by + 19}" width="12" height="3" fill="#fff"/>
    <text x="${bx + w / 2}" y="${by + 15}" font-size="10" text-anchor="middle" fill="#1f2421">${esc(text)}</text></g>`
}

function scene(o: Office, st: Estado) {
  const pend = st.paraAprobar?.length ?? 0
  const parts: string[] = []
  // Walls, floor and a window with the river and a ceibo flower.
  parts.push(`<polygon points="${pts(iso(0, 0, 0), iso(0, 0, 84), iso(6, 0, 84), iso(6, 0, 0))}" fill="#e6e8e1"/>`)
  parts.push(`<polygon points="${pts(iso(0, 0, 0), iso(0, 0, 84), iso(0, 6, 84), iso(0, 6, 0))}" fill="#d9dcd4"/>`)
  parts.push(`<polygon points="${pts(iso(0.6, 0, 30), iso(0.6, 0, 68), iso(2.6, 0, 68), iso(2.6, 0, 30))}" fill="#bfd8e6"/>`)
  parts.push(`<polygon points="${pts(iso(0.6, 0, 30), iso(0.6, 0, 40), iso(2.6, 0, 46), iso(2.6, 0, 30))}" fill="#2f4a3a" opacity=".55"/>`)
  const [fx, fy] = iso(0, 1.6, 56)
  parts.push(`<g transform="translate(${fx},${fy})">${[0, 72, 144, 216, 288].map((a) => `<ellipse rx="3.4" ry="7" fill="#c8102e" transform="rotate(${a}) translate(0,-6)"/>`).join('')}<circle r="2.5" fill="#9b0c23"/></g>`)
  // Sign on the right wall: skewY(26.57°) follows the wall's slope (tan = 16/32), so y is shifted back by x/2.
  const [tx, ty] = iso(3.1, 0, 52)
  parts.push(`<g transform="skewY(26.565)"><text x="${tx}" y="${(ty - tx / 2).toFixed(1)}" font-size="12" font-weight="700" letter-spacing="1" fill="#2f4a3a">CEIBO WORKS</text></g>`)
  parts.push(`<polygon points="${pts(iso(0, 0), iso(6, 0), iso(6, 6), iso(0, 6))}" fill="#f3f4f0" stroke="#cfd3cc"/>`)
  for (let i = 1; i < 6; i++) {
    parts.push(`<line x1="${iso(i, 0)[0]}" y1="${iso(i, 0)[1]}" x2="${iso(i, 6)[0]}" y2="${iso(i, 6)[1]}" stroke="#e3e5df"/>`)
    parts.push(`<line x1="${iso(0, i)[0]}" y1="${iso(0, i)[1]}" x2="${iso(6, i)[0]}" y2="${iso(6, i)[1]}" stroke="#e3e5df"/>`)
  }
  // Plant in the corner.
  parts.push(box(5.3, 0.2, 0.5, 0.5, 10, '#8b6a4e', '#6f533c', '#5c4532'))
  const [plx, ply] = iso(5.55, 0.45, 10)
  parts.push(`<circle cx="${plx}" cy="${ply - 10}" r="11" fill="#3f7a4f"/><circle cx="${plx - 7}" cy="${ply - 4}" r="7" fill="#4f8f5f"/>`)

  // Desks, drawn back to front so nearer ones overlap.
  const desks = [...ROLES].sort((a, b) => a.desk[0] + a.desk[1] - (b.desk[0] + b.desk[1]))
  for (const r of desks) {
    const [x, y] = r.desk
    const on = o.active === r.id
    parts.push(box(x, y, 1.5, 0.8, 16, '#c9a27a', '#a8825e', '#94704f'))
    parts.push(box(x + 0.45, y + 0.1, 0.6, 0.12, 15, '#2b2f2c', '#2b2f2c', '#1f2421', 16))
    const [sx, sy] = iso(x + 0.75, y + 0.22, 24)
    parts.push(`<rect x="${sx - 9}" y="${sy - 6}" width="18" height="11" rx="1.5" fill="${on ? r.color : '#55605a'}" opacity="${on ? 0.9 : 0.5}">${on ? '<animate attributeName="opacity" values=".6;1;.6" dur="1.2s" repeatCount="indefinite"/>' : ''}</rect>`)
    parts.push(person(x + 0.75, y + 1.35, r.color, on, r.name))
  }
  // Tomas's desk: the approvals tray.
  // Tomas by the window, with a badge of what waits for his approval.
  parts.push(person(2.75, 0.9, '#2f4a3a', true, 'Tomás'))
  const [jx, jy] = iso(2.75, 0.9)
  parts.push(`<rect x="${jx + 12}" y="${jy - 44}" width="56" height="16" rx="8" fill="${pend ? '#c8102e' : '#e6e8e1'}"/>`)
  parts.push(`<text x="${jx + 40}" y="${jy - 32.5}" font-size="9.5" font-weight="700" text-anchor="middle" fill="${pend ? '#fff' : '#565e58'}">${pend ? `${pend} para vos` : 'al día'}</text>`)

  const act = o.active ? byId[o.active] : null
  if (act && o.activity) parts.push(bubble(act.desk[0] + 0.75, act.desk[1] + 1.35, clip(o.activity, 34), act.color))

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 330" font-family="Inter, system-ui, sans-serif">
    <rect width="400" height="330" fill="#fcfcfa"/>${parts.join('\n')}</svg>`
}

// ---------- hooks ----------
async function note($: any, g: Guess) {
  await update($, office, (o) => {
    const role = g.role ?? o.active
    const entry: LogEntry = { role: role ?? 'jefe', text: clip(g.text, 60), at: Date.now() }
    return { active: role, activity: g.text, log: [...o.log, entry].slice(-40) }
  })
}

export const register: Register = (on) => {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'oficina', description: 'Abre la oficina de Ceibo Works (panel lateral)' })
    void $.ui.open({ id: PANE, title: 'Ceibo Works HQ' })
    return next(e)
  })

  on('command.run', { command: 'oficina' }, async ($) => {
    await $.ui.open({ id: PANE, title: 'Ceibo Works HQ' })
    return { text: 'Oficina abierta.', isTextDisplayOnly: true }
  })

  // "/buscador", "/analista"... typed by Tomas: that role takes the turn.
  on('prompt.submit', async ($, e, next) => {
    const m = COMMAND.exec(((e as any).text ?? '').trim())
    if (m) await note($, { role: m[1] as RoleId, text: 'Arranca su turno' })
    return next(e)
  })

  on('tool.call', async ($, e, next) => {
    const g = guess(e as any)
    // Keep the role that holds the turn when a call doesn't say whose it is.
    await note($, g)
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    await update($, office, (o) => ({
      active: null,
      activity: '',
      log: o.active ? [...o.log, { role: o.active, text: 'Terminó su turno', at: Date.now() }].slice(-40) : o.log,
    }))
    return next(e)
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const o = await read($, office)
    const st = await estado($)
    const ui = $.ui.resolve(e) as any
    const { Box, Text } = ui
    const recent = o.log.slice(-6).reverse()
    const kpis = [
      `Prospectos: ${st.prospectos?.total ?? '–'}${st.prospectos?.nuevos ? ` (+${st.prospectos.nuevos})` : ''}`,
      `Para aprobar: ${st.paraAprobar?.length ?? 0}`,
      `Listos para enviar: ${st.listosParaEnviar ?? 0}`,
      `Posts programados: ${st.redes?.programados ?? '–'}`,
    ]
    return (
      <Box flexDirection="column" gap={1}>
        {ui.Svg
          ? <ui.Svg source={scene(o, st)} alt={o.active ? `Oficina: ${byId[o.active]?.name} ${o.activity}` : 'Oficina de Ceibo Works, todos en pausa'} isInteractive />
          : <Text bold>{o.active ? `${byId[o.active]?.name}: ${o.activity}` : 'Oficina en pausa'}</Text>}
        <Text dimColor>{kpis.join('  ·  ')}</Text>
        {(st.paraAprobar ?? []).slice(0, 4).map((p) => <Text>• {p.titulo}</Text>)}
        <Box flexDirection="column">
          {recent.length === 0 && <Text dimColor>Escribí /buscador, /analista, /desarrollador o /cm para poner a alguien a trabajar.</Text>}
          {recent.map((l) => <Text dimColor={l.role !== o.active}>{byId[l.role]?.name ?? 'Claude'}: {l.text}</Text>)}
        </Box>
      </Box>
    )
  })
}
