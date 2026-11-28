// Renders the Ceibo Works reels (1080x1920, 30 fps, H.264) with the site's font and colours.
// Each reel is an HTML page whose animations are built with the Web Animations API; the page is
// paused at every frame time, screenshotted with Playwright and stitched with ffmpeg.
// Run from the repo root:
//   node social/reels/make-reels.mjs            → every reel, English and Spanish
//   node social/reels/make-reels.mjs test 3     → only reel "test", one PNG at second 3 (to check layout)
// Screenshots of the sample sites live in social/reels/shots/: full-page captures of
// agency/public/examples/<site>/ at 390px wide (deviceScaleFactor 2), taken with Playwright.
// Captions and hook notes live in social/reels/guiones.md.

import { createRequire } from 'node:module';
const { chromium } = createRequire(new URL('../../agency/package.json', import.meta.url))('playwright');
import { readFile, mkdir, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const FPS = 30;
const OUT = 'social/reels/out';
const A = 'agency';
const b64 = async (p) => (await readFile(p)).toString('base64');
const font = await b64(`${A}/node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wdth-normal.woff2`);
const mark = await readFile(`${A}/public/favicon.svg`, 'utf8');
const shot = async (s) => `data:image/jpeg;base64,${await b64(`social/reels/shots/${s}.jpg`)}`;
const shots = { cottage: await shot('holiday-cottage'), paving: await shot('paving'), homecare: await shot('home-care') };

// ---------- shared look ----------
const css = `
  @font-face { font-family: IS; src: url(data:font/woff2;base64,${font}) format('woff2'); font-weight: 400 700; font-stretch: 75% 100%; }
  * { margin: 0; box-sizing: border-box; }
  :root { --paper: #fcfcfa; --paper2: #f3f4f0; --ink: #1f2421; --muted: #565e58; --ceibo: #c8102e; --dark: #9b0c23; --river: #2f4a3a; }
  body { font-family: IS, sans-serif; color: var(--ink); background: var(--paper); width: 1080px; height: 1920px; overflow: hidden; position: relative; }
  .abs { position: absolute; }
  .hook { position: absolute; left: 70px; right: 70px; font-size: 92px; line-height: 1.02; font-weight: 680; font-stretch: 88%; letter-spacing: -0.02em; }
  .big { font-size: 120px; }
  .sub { font-size: 50px; line-height: 1.2; font-weight: 520; color: var(--muted); }
  .red { color: var(--ceibo); }
  .card { background: var(--paper); border-radius: 28px; padding: 30px 40px; box-shadow: 0 30px 80px -30px rgb(0 0 0 / .45); }
  .pill { display: inline-block; padding: 12px 28px; border-radius: 999px; background: var(--ceibo); color: #fff; font-size: 38px; font-weight: 650; }
  .phone { position: absolute; border: 16px solid var(--ink); border-radius: 64px; overflow: hidden; background: #fff; box-shadow: 0 60px 120px -50px rgb(31 36 33 / .7); }
  .phone .scroll { position: absolute; left: 0; top: 0; width: 100%; }
  .phone img { display: block; width: 100%; }
  .brand { display: flex; align-items: center; gap: 18px; font-size: 44px; font-weight: 650; }
  .brand svg { width: 76px; height: 76px; }
  .note { position: absolute; left: 0; right: 0; top: 452px; text-align: center; font-size: 26px; color: var(--muted); }
  .tap { position: absolute; width: 120px; height: 120px; margin: -60px 0 0 -60px; border-radius: 50%; border: 8px solid var(--ceibo); background: rgb(200 16 46 / .18); }
`;
const brand = `<div class="brand">${mark}Ceibo Works</div>`;

// Animation helpers, run inside the page. All times in seconds.
const helpers = `
  const $ = (s) => document.querySelector(s);
  const anim = (sel, frames, at, dur, opts = {}) => document.querySelectorAll(sel).forEach((el) =>
    el.animate(frames, { delay: at * 1000, duration: dur * 1000, fill: opts.fill ?? 'both', easing: opts.easing ?? 'cubic-bezier(.2,.7,.2,1)' }));
  // Visible from 'from' to 'to' (pop in, fade out). The out animation only fills forwards so it does not hide the element early.
  const show = (sel, from, to = 999, kind = 'up') => {
    const start = kind === 'up' ? { opacity: 0, transform: 'translateY(40px)' } : kind === 'pop' ? { opacity: 0, transform: 'scale(.6)' } : { opacity: 0 };
    anim(sel, [start, { opacity: 1, transform: 'none' }], from, .35);
    if (to < 999) anim(sel, [{ opacity: 1 }, { opacity: 0 }], to, .25, { fill: 'forwards' });
  };
`;

const page = (body, script, extra = '') =>
  `<!doctype html><html lang="${page.lang}"><meta charset="utf-8"><style>${css}${extra}</style>${body}<script>{${helpers}${script}}</script>`;

// Closing card shared by every reel.
const endCard = (t, from) => ({
  html: `<div id="end" class="abs" style="inset:0;background:var(--river);color:#fff;padding:300px 80px 0">
      <div class="brand" style="color:#fff">${mark}Ceibo Works</div>
      <div class="hook" style="position:static;margin-top:90px;font-size:96px">${t.end1}</div>
      <div class="sub" style="color:#dfe7e1;margin-top:50px;font-size:54px">${t.end2}</div>
      <div style="margin-top:80px"><span class="pill" style="font-size:44px">${t.end3}</span></div>
      <div class="sub" style="color:#dfe7e1;margin-top:60px;font-size:44px">@ceibo_works · ceiboworks.com</div>
    </div>`,
  js: `show('#end', ${from}, 999, 'fade');`,
});

// ---------- the fictional "old website" used in reels 1 and 3 ----------
// Made up for these videos (name, text and phone number are fictional; 03 5550 xxxx is an
// Australian number range reserved for drama and film). Labelled on screen as an example.
const oldSite = `
  <div style="font-family:'Liberation Serif',serif;background:#fffbe6;color:#555;padding:14px 16px;font-size:15px;line-height:1.25">
    <div style="background:#2a3d8f;color:#ffef5a;text-align:center;font-size:30px;font-weight:bold;padding:10px;border:4px ridge #c0c0c0">~ PINECREST COTTAGES ~</div>
    <div style="text-align:center;color:#c00;font-size:16px;margin:8px 0"><b>*** WELCOME TO OUR WEBSITE!!! ***</b></div>
    <div style="display:flex;gap:6px;font-size:13px;color:#00e;text-decoration:underline;flex-wrap:wrap;justify-content:center;margin-bottom:10px">
      <span>Home</span>|<span>About Us</span>|<span>Our History</span>|<span>Rates (PDF)</span>|<span>Guestbook</span>|<span>Links</span>|<span>Sitemap</span></div>
    <div style="height:150px;background:linear-gradient(135deg,#7b8a6a,#a9b08f);border:3px inset #999;display:grid;place-items:center;color:#eee;font-size:14px">[ image loading... ]</div>
    <p style="margin:10px 0;color:#888">Pinecrest Cottages was established in 1987 by the family and has been welcoming guests ever since. We pride ourselves on our hospitality and our beautiful location near the lake and the forest, where guests may enjoy many activities including walking, fishing, birdwatching and relaxing. Our cottages are fully self contained and include linen, heating, a kitchenette and much more. Please see our rates page for current rates and seasonal specials which change throughout the year.</p>
    <p style="margin:10px 0;color:#999">Bookings are essential during school holidays and long weekends. A deposit of 50% is required to confirm all bookings. Cancellation policy applies. Please read our terms and conditions before booking. Pets are not permitted. Smoking is not permitted inside the cottages. Check in is from 2pm and check out is by 10am. Late check out may be available on request, subject to availability.</p>
    <div style="text-align:center;margin:12px 0"><span style="background:#ffff00;color:#f00;font-weight:bold;padding:4px 10px;border:2px dashed #f00">!! SITE UNDER CONSTRUCTION !!</span></div>
    <p style="margin:10px 0;color:#999">Nearby attractions include the historic township, the winery trail, the waterfall walk, the Sunday markets, the golf course and the lookout. Maps are available from reception. We also recommend the local bakery and the pub for a counter meal. Gift vouchers are available all year round, please enquire. We look forward to welcoming you to Pinecrest Cottages.</p>
    <div style="height:120px;background:linear-gradient(135deg,#6d7f8e,#9aa9b3);border:3px inset #999;margin:10px 0"></div>
    <p style="margin:10px 0;color:#999">Our guestbook: "Lovely stay" - J. "Very nice" - M &amp; K. "Will be back" - The Smiths. Please sign our guestbook! Click <span style="color:#00e;text-decoration:underline">here</span> to sign. You are visitor number <span style="background:#000;color:#0f0;font-family:monospace;padding:0 4px">004817</span></p>
    <p style="margin:10px 0;color:#999">Rates are available in our brochure. Download the brochure (PDF, 4.2MB). Adobe Reader is required to view this file. Best viewed in Internet Explorer at 1024x768.</p>
    <div style="height:110px;background:linear-gradient(135deg,#8e7d6d,#b3a59a);border:3px inset #999;margin:10px 0"></div>
    <p style="margin:10px 0;color:#aaa;font-size:13px">Copyright 2009 Pinecrest Cottages. All rights reserved. Website by a friend. Last updated March 2011.</p>
    <p id="old-phone" style="margin:4px 0 30px;color:#bbb;font-size:11px">Enquiries: ph (03) 5550 1234 &nbsp;fax (03) 5550 1235 &nbsp;Postal: PO Box 12</p>
  </div>`;

// ---------- the reels ----------
// Each reel: id and per-language text; its length and scene times come from the voice cues. Hook notes for each one in guiones.md.
const reels = {
  // 1 · Challenge hook: the viewer plays along (find the phone number in 5 seconds).
  'reel-01-five-seconds': {
    text: {
      en: {
        hook: 'Find the phone number.<br><span class="red">You have 5 seconds.</span>',
        lost: 'Time’s up.<br>They already called <span class="red">the next business.</span>',
        after: 'Same cottage.<br>One tap to call.',
        note: 'Example website made up for this video',
        end1: 'Is your number one tap away?',
        end2: 'I build websites for small businesses. Free to build, a small monthly fee if you keep it.',
        end3: 'Send this to someone with a B&amp;B',
      },
      es: {
        hook: 'Encontrá el teléfono.<br><span class="red">Tenés 5 segundos.</span>',
        lost: '¡Tiempo!<br>Tu cliente ya llamó <span class="red">a otro negocio.</span>',
        after: 'La misma cabaña.<br>Un toque para llamar.',
        note: 'Web de ejemplo inventada para este video',
        end1: '¿Tu teléfono está a un toque?',
        end2: 'Armo páginas web para negocios pequeños. Te la hago gratis y, si te la quedás, pagás una cuota mensual.',
        end3: 'Mandáselo a alguien con cabañas',
      },
    },
    // Voice cues (voice/lines.json): 0 hook, 1-3 "three, two, one", 4 time's up, 5 same cottage, 6 closing line.
    build: (t, c) => {
      const end = endCard(t, c[6].at - .2);
      return page(`
        <div class="abs" style="inset:0;background:#d9dcd4"></div>
        <div id="ph1" class="phone" style="left:150px;top:520px;width:780px;height:1340px">
          <div class="scroll" id="old" style="width:390px;transform-origin:top left">${oldSite}</div>
        </div>
        <div id="hook" class="hook card" style="top:150px;font-size:80px">${t.hook}</div>
        ${[5, 4, 3, 2, 1].map((n) => `<div class="cd abs" id="n${n}" style="right:60px;top:560px;width:220px;height:220px;border-radius:50%;background:var(--ceibo);color:#fff;font-size:150px;font-weight:700;display:grid;place-items:center">${n}</div>`).join('')}
        <div id="lost" class="hook card" style="top:640px;font-size:84px">${t.lost}</div>
        <div id="ph2" class="phone" style="left:200px;top:470px;width:680px;height:1300px"><div class="scroll"><img src="${shots.cottage}"></div></div>
        <div id="tap" class="tap" style="left:808px;top:640px"></div>
        <div id="after" class="hook" style="top:170px">${t.after}</div>
        <div class="note" id="note">${t.note}</div>
        ${end.html}`, `
        show('#hook', 0, ${c[4].at - .2}, 'pop');
        // The old site fills the phone (1.92x) and scrolls slowly while the viewer searches; then it
        // jumps to the bottom, where the number was hiding in tiny grey text, and highlights it.
        const k = 1.92, bottom = -($('#old').offsetHeight * k - 1300);
        anim('#old', [{ transform: \`scale(\${k}) translateY(0)\` }, { transform: \`scale(\${k}) translateY(\${bottom * .45 / k}px)\` }], 0.4, ${c[4].at - .6}, { easing: 'linear' });
        // Countdown: 3, 2, 1 land on the spoken words; 5 and 4 come one second apart before them.
        ${[c[1].at - 2, c[1].at - 1, c[1].at, c[2].at, c[3].at].map((s, i) => `show('#n${5 - i}', ${s}, ${i < 4 ? [c[1].at - 1, c[1].at, c[2].at, c[3].at][i] - .05 : c[3].at + .95}, 'pop');`).join('\n')}
        show('#note', 0.3, ${c[5].at - .1}, 'fade');
        anim('#old', [{ transform: \`scale(\${k}) translateY(\${bottom * .45 / k}px)\` }, { transform: \`scale(\${k}) translateY(\${bottom / k}px)\` }], ${c[4].at - .2}, .6, { fill: 'forwards' });
        anim('#old-phone', [{ background: 'transparent', color: '#bbb' }, { background: '#ffef5a', color: '#000' }], ${c[4].at + .4}, .3);
        show('#lost', ${c[4].at + .5}, ${c[5].at - .1}, 'up');
        anim('#ph1', [{ opacity: 1 }, { opacity: 0 }], ${c[5].at - .1}, .3, { fill: 'forwards' });
        show('#ph2', ${c[5].at}, 999, 'up');
        show('#after', ${c[5].at + .1}, 999, 'up');
        // The sample's "Call" button: tap ring pulses twice.
        anim('#tap', [{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(1.6)' }], ${c[5].end - 1.9}, .8);
        anim('#tap', [{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(1.6)' }], ${c[5].end - 1}, .8, { fill: 'forwards' });
        ${end.js}`, '#old-phone{outline:0}');
    },
  },

  // 2 · Data hook: a real number from our own research, then a question that makes them check their own site.
  'reel-02-one-in-eight': {
    text: {
      en: {
        a: 'We checked',
        b: 'small business listings.',
        c: 'More than <span class="red">1 in 8</span> linked to a website that didn’t load.',
        d: 'The owners had no idea.',
        e: 'When did you last open <span class="red">yours?</span>',
        errors: ['This site can’t be reached', 'Domain for sale', '404 Not Found', 'Account suspended'],
        end1: 'Open your website now. I’ll wait.',
        end2: 'If it’s broken, I’ll build you a new one for free. You keep it for a small monthly fee.',
        end3: 'ceiboworks.com',
      },
      es: {
        a: 'Revisamos',
        b: 'negocios en directorios.',
        c: 'Más de <span class="red">1 de cada 8</span> tenía una web que no cargaba.',
        d: 'Los dueños no lo sabían.',
        e: '¿Cuándo fue la última vez que abriste <span class="red">la tuya?</span>',
        errors: ['No se puede acceder a este sitio', 'Dominio en venta', 'Error 404', 'Cuenta suspendida'],
        end1: 'Abrí tu web ahora. Te espero.',
        end2: 'Si está caída, te armo una nueva gratis. Si te la quedás, pagás una cuota mensual.',
        end3: 'ceiboworks.com/es',
      },
    },
    // Voice cues: 0 the count, 1 one in eight, 2 when did you last open yours, 3 closing line.
    build: (t, c) => {
      const end = endCard(t, c[3].at - .1);
      // 8 x 8 grid of mini browser windows; every 8th one breaks.
      const tiles = Array.from({ length: 64 }, (_, i) => {
        const bad = i % 8 === 3;
        const err = t.errors[(i >> 3) % t.errors.length];
        return `<div class="tile ${bad ? 'bad' : ''}"><i></i><b></b><b style="width:60%"></b><b style="width:80%"></b>${bad ? `<em>${err}</em>` : ''}</div>`;
      }).join('');
      return page(`
        <div id="clock" hidden></div>
        <div id="t1" class="hook" style="top:260px;font-size:84px;color:var(--muted)">${t.a}</div>
        <div id="count" class="hook big" style="top:360px;font-size:220px;color:var(--ink)">0</div>
        <div id="t2" class="hook" style="top:620px;font-size:84px;color:var(--muted)">${t.b}</div>
        <div id="grid" class="abs" style="left:70px;right:70px;top:820px;display:grid;grid-template-columns:repeat(8,1fr);gap:12px">${tiles}</div>
        <div id="t3" class="hook card" style="top:200px;font-size:80px">${t.c}</div>
        <div id="t4" class="hook" style="top:1480px;font-size:80px">${t.d}</div>
        <div id="t5" class="hook big" style="top:560px">${t.e}</div>
        ${end.html}`, `
        show('#t1', 0, ${c[1].at - .1}, 'fade');
        show('#count', 0, ${c[1].at - .1}, 'fade');
        // Count up to 2,790 in the first 1.6 s (driven by the animation clock so frames are exact).
        const c = $('#count'); const ca = $('#clock').animate([{ opacity: 0 }, { opacity: 0 }], { duration: 1600, fill: 'both' });
        window.__tick = () => { const p = Math.min(1, Math.max(0, (ca.currentTime ?? 0) / 1600)); c.textContent = Math.round(2790 * (1 - Math.pow(1 - p, 3))).toLocaleString(document.documentElement.lang); };
        show('#t2', .9, ${c[1].at - .1}, 'fade');
        show('#grid', 1.4, ${c[2].at - .1}, 'fade');
        // Broken tiles turn red one after another.
        document.querySelectorAll('.tile.bad').forEach((el, i) => el.animate([{ background: '#fff', borderColor: '#cfd3cc' }, { background: '#fde8eb', borderColor: '#c8102e' }], { delay: (${c[1].at - 1.2} + i * .12) * 1000, duration: 200, fill: 'both' }));
        show('.tile.bad em', ${c[1].at - 1.1}, ${c[2].at - .1}, 'pop');
        show('#t3', ${c[1].at}, ${c[2].at - .1}, 'up');
        show('#t4', ${c[1].end - .6}, ${c[2].at - .1}, 'up');
        show('#t5', ${c[2].at}, ${c[3].at - .1}, 'up');
        ${end.js}`, `
        .tile { position: relative; height: 68px; border: 3px solid #cfd3cc; border-radius: 10px; background: #fff; padding: 18px 8px 0; overflow: hidden; }
        .tile i { position: absolute; left: 0; right: 0; top: 0; height: 12px; background: #e7e9e3; }
        .tile b { display: block; height: 7px; background: #e1e4dd; border-radius: 4px; margin-bottom: 6px; }
        .tile em { position: absolute; inset: 0; display: grid; place-items: center; text-align: center; font-style: normal; font-size: 14px; line-height: 1.05; font-weight: 650; color: var(--ceibo); background: #fde8eb; padding: 4px; }`);
    },
  },

  // 3 · Comparison hook: two versions side by side; the question invites a comment (A or B).
  'reel-03-which-one': {
    text: {
      en: {
        hook: 'Same cottage. Same price.<br><span class="red">Which one do you book?</span>',
        a: 'A', b: 'B',
        q: 'Comment A or B 👇',
        ans: 'If you picked B, so do your guests.<br>In seconds.',
        note: 'Website A is made up for this video. B is a sample by Ceibo Works.',
        end1: 'Want your own B?',
        end2: 'I build it for free. You keep it for a small monthly fee, with no long contract.',
        end3: 'ceiboworks.com',
      },
      es: {
        hook: 'La misma cabaña. El mismo precio.<br><span class="red">¿Cuál reservás?</span>',
        a: 'A', b: 'B',
        q: 'Comentá A o B 👇',
        ans: 'Si elegiste la B, tus huéspedes también.<br>En segundos.',
        note: 'La web A es inventada para este video. La B es una muestra de Ceibo Works.',
        end1: '¿Querés tu propia B?',
        end2: 'Te la armo gratis. Si te la quedás, pagás una cuota mensual, sin contrato largo.',
        end3: 'ceiboworks.com/es',
      },
    },
    // Voice cues: 0 hook, 1 "A or B?", 2 comment, 3 if you picked B, 4 closing line.
    build: (t, c) => {
      const end = endCard(t, c[4].at - .1);
      const out = c[4].at - .1;
      return page(`
        <div class="abs" style="inset:0;background:#d9dcd4"></div>
        <div id="hook" class="hook" style="top:150px;font-size:82px">${t.hook}</div>
        <div id="pa" class="phone" style="left:40px;top:520px;width:480px;height:980px;border-width:12px;border-radius:48px"><div class="scroll" id="sa" style="width:390px;transform-origin:top left">${oldSite}</div></div>
        <div id="pb" class="phone" style="left:560px;top:520px;width:480px;height:980px;border-width:12px;border-radius:48px"><div class="scroll" id="sb"><img src="${shots.cottage}"></div></div>
        <div id="la" class="pill abs" style="left:230px;top:1530px;font-size:56px;background:var(--ink)">${t.a}</div>
        <div id="lb" class="pill abs" style="left:750px;top:1530px;font-size:56px">${t.b}</div>
        <div id="q" class="hook card" style="top:700px;text-align:center;font-size:88px">${t.q}</div>
        <div id="ans" class="hook card" style="top:640px;font-size:68px">${t.ans}</div>
        <div class="note" id="note" style="top:1650px">${t.note}</div>
        ${end.html}`, `
        show('#hook', 0, ${out}, 'pop');
        show('#pa', .3, ${out}, 'up'); show('#pb', .5, ${out}, 'up');
        show('#la', .8, ${out}, 'pop'); show('#lb', .9, ${out}, 'pop');
        show('#note', .8, ${out}, 'fade');
        anim('#sa', [{ transform: 'scale(1.17) translateY(0)' }, { transform: 'scale(1.17) translateY(-600px)' }], 1, ${c[2].at - 1}, { easing: 'ease-in-out' });
        anim('#sb', [{ transform: 'translateY(0)' }, { transform: 'translateY(-2600px)' }], 1, ${c[2].at - 1}, { easing: 'ease-in-out' });
        // "A... or B?": each label pulses as it is said.
        anim('#la', [{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(1)' }], ${c[1].at}, .5, { fill: 'none' });
        anim('#lb', [{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(1)' }], ${c[1].end - .6}, .5, { fill: 'none' });
        show('#q', ${c[2].at}, ${c[3].at - .1}, 'pop');
        show('#ans', ${c[3].at}, ${out}, 'up');
        ${end.js}`);
    },
  },
};

// ---------- render ----------
const [only, at] = process.argv.slice(2);
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const pg = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
pg.on('pageerror', (e) => { console.error('page error:', e.message); process.exitCode = 1; });

// Voice cues per reel and language, from make-voice.mjs. Without them the reels can't be timed.
const clips = JSON.parse(await readFile('social/reels/voice/clips.json', 'utf8'));

const seek = (t) => pg.evaluate((ms) => {
  document.getAnimations().forEach((a) => { a.pause(); a.currentTime = ms; });
  window.__tick?.();
}, t * 1000);

for (const [id, reel] of Object.entries(reels)) {
  if (only && !id.includes(only)) continue;
  for (const lang of Object.keys(reel.text)) {
    page.lang = lang === 'es' ? 'es-AR' : 'en';
    const cues = clips[`${id}-${lang}`];
    // The reel lasts until the closing line ends, plus a beat of silence on the end card.
    const seconds = Math.ceil((cues.at(-1).end + 1.2) * 2) / 2;
    await pg.setContent(reel.build(reel.text[lang], cues), { waitUntil: 'load' });
    await pg.evaluate(() => document.fonts.ready);
    if (at !== undefined) {
      await seek(Number(at));
      await pg.screenshot({ path: `${OUT}/${id}-${lang}-${at}s.png` });
      console.log('frame', id, lang, at);
      continue;
    }
    const dir = `${OUT}/frames-${id}-${lang}`;
    await rm(dir, { recursive: true, force: true });
    await mkdir(dir, { recursive: true });
    const n = Math.round(seconds * FPS);
    for (let f = 0; f < n; f++) {
      await seek(f / FPS);
      await pg.screenshot({ path: `${dir}/${String(f).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 92 });
    }
    const mp4 = `${OUT}/${id}-${lang}.mp4`;
    // Voice: each clip delayed to its cue and mixed into one track, padded with silence to the end.
    const inputs = cues.flatMap((q) => ['-i', q.file]);
    const mix = cues.map((q, i) => `[${i + 1}:a]adelay=${Math.round(q.at * 1000)}:all=1[v${i}]`).join(';') +
      `;${cues.map((_, i) => `[v${i}]`).join('')}amix=inputs=${cues.length}:normalize=0,apad,loudnorm=I=-14:TP=-1.5[a]`;
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', `${dir}/%04d.jpg`, ...inputs,
      '-filter_complex', mix, '-map', '0:v', '-map', '[a]', '-t', String(seconds), '-ar', '44100',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-profile:v', 'high',
      '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', mp4]);
    await rm(dir, { recursive: true, force: true });
    console.log('video', mp4);
  }
}
await browser.close();
