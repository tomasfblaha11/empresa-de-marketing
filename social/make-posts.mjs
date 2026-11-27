// Renders the Ceibo Works social media kit with the website's font, colours and assets:
// profile picture, Facebook cover and the first 12 posts (1080x1350, Instagram portrait).
// Run from the repo root: node social/make-posts.mjs   → social/out/*.png
// Captions live in social/captions.md. Keep both in sync when a post changes.

import { createRequire } from 'node:module';
// Playwright is installed in agency/ (devDependency); load it from there.
const { chromium } = createRequire(new URL('../agency/package.json', import.meta.url))('playwright');
import { readFile, mkdir } from 'node:fs/promises';

const A = 'agency';
const b64 = async (p) => (await readFile(p)).toString('base64');
const font = await b64(`${A}/node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wdth-normal.woff2`);
const img = async (p) => `data:image/jpeg;base64,${await b64(p)}`;
const mark = await readFile(`${A}/public/favicon.svg`, 'utf8');
const ceibo = await img(`${A}/src/assets/ceibo-flowers.jpg`);
const shots = {
  paving: await img(`${A}/src/assets/examples/paving-mobile.jpg`),
  housecare: await img(`${A}/src/assets/examples/housecare-mobile.jpg`),
  rental: await img(`${A}/src/assets/examples/rental-mobile.jpg`),
};

const css = `
  @font-face { font-family: IS; src: url(data:font/woff2;base64,${font}) format('woff2'); font-weight: 400 700; font-stretch: 75% 100%; }
  * { margin: 0; box-sizing: border-box; }
  :root { --paper: #fcfcfa; --paper2: #f3f4f0; --ink: #1f2421; --muted: #565e58; --ceibo: #c8102e; --dark: #9b0c23; --river: #2f4a3a; }
  body { font-family: IS, sans-serif; color: var(--ink); background: var(--paper); width: var(--w); height: var(--h); overflow: hidden; position: relative; }
  .pad { padding: 84px 84px; height: 100%; display: flex; flex-direction: column; }
  .brand { display: flex; align-items: center; gap: 14px; font-size: 30px; font-weight: 650; }
  .brand svg { width: 52px; height: 52px; }
  h1 { font-size: 92px; line-height: 1.02; font-weight: 650; font-stretch: 90%; letter-spacing: -0.02em; }
  h2 { font-size: 64px; line-height: 1.06; font-weight: 640; font-stretch: 92%; letter-spacing: -0.015em; }
  p.lead { font-size: 36px; line-height: 1.35; color: var(--muted); }
  .red { color: var(--ceibo); }
  .foot { margin-top: auto; display: flex; justify-content: space-between; align-items: center; font-size: 28px; color: var(--muted); font-weight: 500; }
  .phone { border: 14px solid var(--ink); border-radius: 56px; overflow: hidden; box-shadow: 0 50px 90px -50px rgb(31 36 33 / .6); background: #fff; }
  .phone img { display: block; width: 100%; }
  .tag { display: inline-block; padding: 10px 22px; border-radius: 999px; background: var(--ceibo); color: #fff; font-size: 26px; font-weight: 650; }
  .credit { position: absolute; right: 16px; bottom: 12px; font-size: 16px; color: #565e58; background: rgb(252 252 250 / .85); padding: 3px 8px; border-radius: 6px; }
`;
const page = (w, h, body, extra = '') => `<!doctype html><style>${css} :root{--w:${w}px;--h:${h}px} ${extra}</style>${body}`;
const brand = `<div class="brand">${mark}Ceibo Works</div>`;
const foot = (right = 'ceiboworks.com') => `<div class="foot"><span>${right}</span><span>@ceibo_works</span></div>`;

const sample = (key, label, title) => page(1080, 1350, `
  <div class="pad" style="background:var(--paper2)">
    ${brand}
    <div style="display:grid;grid-template-columns:1fr 430px;gap:56px;align-items:center;margin-top:60px;flex:1">
      <div><span class="tag">${label}</span><h2 style="margin-top:34px">${title}</h2>
        <p class="lead" style="margin-top:30px">Built for free.<br>Looked after every month.</p></div>
      <div class="phone"><img src="${shots[key]}"></div>
    </div>
    ${foot('Sample design · ceiboworks.com')}
  </div>`);

const tip = (n, title, text, bg = 'var(--paper)') => page(1080, 1350, `
  <div class="pad" style="background:${bg}">
    ${brand}
    <div style="margin-top:auto">
      <span class="tag">Website tip #${n}</span>
      <h1 style="margin-top:40px">${title}</h1>
      <p class="lead" style="margin-top:40px;max-width:24ch">${text}</p>
    </div>
    <div style="height:70px"></div>
    ${foot()}
  </div>`);

const posts = [
  ['01-hello', page(1080, 1350, `
    <div class="pad">
      ${brand}
      <h1 style="margin-top:70px;max-width:12ch">Websites for small businesses, made by someone you can <span class="red">talk to.</span></h1>
      <div style="display:flex;gap:40px;align-items:flex-end;margin-top:auto">
        <p class="lead" style="flex:1">I build your website for free and look after it every month.</p>
        <img src="${ceibo}" style="width:330px;height:420px;object-fit:cover;object-position:50% 35%;border-radius:999px 999px 18px 18px">
      </div>
      <div style="height:40px"></div>${foot()}
    </div><span class="credit">Photo: Bidgee, CC BY-SA 3.0</span>`)],
  ['02-sample-paving', sample('paving', 'Sample design', 'A website for a paving and garden business')],
  ['03-tip-broken', page(1080, 1350, `
    <div class="pad" style="background:var(--ink);color:#fff">
      ${brand.replace('class="brand"', 'class="brand" style="color:#fff"')}
      <div style="margin-top:auto">
        <p style="font-size:34px;color:#c9ced2">We checked 2,790 small business listings in New Zealand and the US.</p>
        <h1 style="margin-top:36px;font-size:120px">More than <span style="color:#ff5a6e">1 in 8</span></h1>
        <p class="lead" style="margin-top:30px;color:#e3e6e3;max-width:22ch">linked to a website that didn't load or no longer existed.</p>
      </div>
      <div style="height:70px"></div>
      <div class="foot" style="color:#c9ced2"><span>Is yours one of them?</span><span>@ceibo_works</span></div>
    </div>`)],
  ['04-how', page(1080, 1350, `
    <div class="pad">
      ${brand}
      <h2 style="margin-top:80px">How it works</h2>
      <div style="display:grid;gap:52px;margin-top:64px">
        ${[['Tell me about your business', 'A few photos of your work, your services and your area.'], ['I build a free draft', 'A real website you can open on your phone in a few days.'], ['Keep it if you like it', 'A small monthly fee. I keep it up to date.']].map(([t, d], i) => `
          <div style="display:grid;grid-template-columns:96px 1fr;gap:30px;align-items:start">
            <div style="width:96px;height:96px;border-radius:50%;background:var(--ceibo);color:#fff;display:grid;place-items:center;font-size:46px;font-weight:650">${i + 1}</div>
            <div><p style="font-size:44px;font-weight:640;line-height:1.15">${t}</p><p class="lead" style="margin-top:10px;font-size:32px">${d}</p></div>
          </div>`).join('')}
      </div>
      ${foot()}
    </div>`)],
  ['05-sample-homecare', sample('housecare', 'Sample design', 'A website for a home watch business')],
  ['06-tip-not-secure', tip(1, 'Does Chrome call your website “Not secure”?', 'Many visitors leave the moment they see that warning. A security certificate is free and should come with any website.')],
  ['07-why-ceibo', page(1080, 1350, `
    <div style="height:100%;display:grid;grid-template-rows:620px 1fr">
      <img src="${ceibo}" style="width:100%;height:100%;object-fit:cover;object-position:50% 40%">
      <div class="pad" style="padding-top:60px">
        <span class="tag" style="align-self:flex-start">Why “Ceibo”?</span>
        <p style="font-size:40px;line-height:1.35;margin-top:30px">The ceibo grows along the rivers of Entre Ríos, Argentina, where I’m from. Tough, deeply rooted, covered in red flowers. That’s the kind of work I want to do.</p>
        <div style="margin-top:auto">${foot('Tomas Blaha, founder')}</div>
      </div>
    </div><span class="credit">Photo: Bidgee, CC BY-SA 3.0</span>`)],
  ['08-sample-cottage', sample('rental', 'Sample design', 'A website for a holiday cottage')],
  ['09-tip-domain', tip(2, 'Your domain expired? Your email may go with it.', 'If your web address lapses, emails to you@yourbusiness can bounce too. Check the renewal date today.', 'var(--paper2)')],
  ['10-pricing', page(1080, 1350, `
    <div class="pad">
      ${brand}
      <h2 style="margin-top:80px">Simple pricing</h2>
      <div style="margin-top:56px;padding:56px;border-radius:24px;background:#fff;border:2px solid #e2e5df">
        <p style="font-size:34px;font-weight:650;color:var(--dark)">Building your website</p>
        <p style="font-size:110px;font-weight:650;line-height:1">Free</p>
        <p style="font-size:34px;font-weight:650;color:var(--dark);margin-top:50px">Then, if you keep it</p>
        <p style="font-size:84px;font-weight:650;line-height:1.05">One monthly fee</p>
        <p style="font-size:30px;color:var(--muted);margin-top:14px">In your currency: £, €, NZ$ or US$. Hosting, security, backups and up to 2 changes a month. No long contract.</p>
      </div>
      ${foot()}
    </div>`)],
  ['11-tip-phone', tip(3, 'Open your website on your phone. Can you call in one tap?', 'Most customers find you on a phone. Your number should be one tap away on every page.')],
  ['12-entre-rios-es', page(1080, 1350, `
    <div class="pad" style="background:var(--ceibo);color:#fff">
      ${brand.replace('class="brand"', 'class="brand" style="color:#fff"')}
      <div style="margin-top:auto">
        <h1>¿Tu negocio en Entre Ríos todavía no tiene web?</h1>
        <p class="lead" style="margin-top:40px;color:#fde8eb;max-width:22ch">Te la armo gratis. Si te gusta, pagás una cuota mensual y yo la mantengo.</p>
      </div>
      <div style="height:70px"></div>
      <div class="foot" style="color:#fde8eb"><span>ceiboworks.com/es</span><span>@ceibo_works</span></div>
    </div>`)],
  ['13-australia', page(1080, 1350, `
    <div class="pad" style="background:var(--river);color:#fff">
      ${brand.replace('class="brand"', 'class="brand" style="color:#fff"')}
      <div style="margin-top:auto">
        <span class="tag">Now in Australia</span>
        <h1 style="margin-top:40px">Websites for small businesses in Australia.</h1>
        <p class="lead" style="margin-top:40px;color:#dfe9e2;max-width:24ch">Landscapers, B&amp;Bs, guest houses and holiday homes. Built for free, A$79 a month, no long contract.</p>
      </div>
      <div style="height:70px"></div>
      <div class="foot" style="color:#dfe9e2"><span>ceiboworks.com/au</span><span>@ceibo_works</span></div>
    </div>`)],
];

// Small round avatars (Gmail, WhatsApp): the flower must still read at 40px inside a circle.
const avatar = (bg, petal, petalDark, stem) => page(1024, 1024, `<div style="height:100%;display:grid;place-items:center;background:${bg}">
  <svg viewBox="0 0 64 64" style="width:800px;height:800px;transform:translate(-62px,-6px)">
    <path d="M30 61c0-9 1.2-15 4.4-21" fill="none" stroke="${stem}" stroke-width="3" stroke-linecap="round"/>
    <path d="M28.5 41.5c3-5 8-6.5 11.5-3.2-1.6 4.6-6.2 7.2-11.5 3.2z" fill="${stem}"/>
    <path d="M33.5 38.5C19 31 17.5 12.5 29.5 3.5 33 15 44 22.5 46.5 35c-4.6 4.2-8.6 5-13 3.5z" fill="${petal}"/>
    <path d="M37 37.5c8.5-2.5 15.5-8.5 19.5-17.5-1.2 10.5-8.3 18.3-17.2 20.2z" fill="${petalDark}"/>
  </svg></div>`);

const extras = [
  ['avatar-rojo', 1024, 1024, avatar('#c8102e', '#ffffff', '#f6c9d0', '#fde8eb')],
  ['avatar-claro', 1024, 1024, avatar('#fcfcfa', '#c8102e', '#9b0c23', '#2f4a3a')],
  ['profile', 1080, 1080, page(1080, 1080, `<div style="height:100%;display:grid;place-items:center;background:var(--paper)">${mark.replace('<svg', '<svg style="width:720px;height:720px"')}</div>`)],
  ['facebook-cover', 1640, 624, page(1640, 624, `
    <div style="height:100%;display:grid;grid-template-columns:1fr 520px;background:var(--paper)">
      <div style="padding:70px 90px 70px 380px;display:flex;flex-direction:column;justify-content:center">
        <p style="font-size:58px;line-height:1.08;font-weight:650;font-stretch:90%;text-wrap:balance">Websites for small businesses, made by someone you can talk to.</p>
        <p style="font-size:30px;color:var(--ceibo);font-weight:600;margin-top:24px">Built for free · Looked after every month · ceiboworks.com</p>
      </div>
      <img src="${ceibo}" style="width:100%;height:100%;object-fit:cover;object-position:50% 35%">
    </div><span class="credit">Photo: Bidgee, CC BY-SA 3.0</span>`)],
];

await mkdir('social/out', { recursive: true });
const browser = await chromium.launch();
for (const [name, w, h, html] of [...posts.map(([n, html]) => [n, 1080, 1350, html]), ...extras]) {
  const p = await browser.newPage({ viewport: { width: w, height: h } });
  await p.setContent(html);
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: `social/out/${name}.png` });
  await p.close();
}
await browser.close();
console.log('Social kit written to social/out/');
