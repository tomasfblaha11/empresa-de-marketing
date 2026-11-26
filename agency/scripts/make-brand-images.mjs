// Renders the brand images in public/ with the site's own font and colours:
// og-en.png / og-es.png (1200x630 link previews), logo-512.png (Google) and apple-touch-icon.png.
// Run: node scripts/make-brand-images.mjs   (needs the preinstalled Chromium via Playwright)
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';

const font = (await readFile('node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wdth-normal.woff2')).toString('base64');
const photo = (await readFile('src/assets/ceibo-flowers.jpg')).toString('base64');
const mark = (await readFile('public/favicon.svg', 'utf8'));

const base = `
  @font-face { font-family: IS; src: url(data:font/woff2;base64,${font}) format('woff2'); font-weight: 400 700; font-stretch: 75% 100%; }
  * { margin: 0; box-sizing: border-box; }
  body { font-family: IS, sans-serif; background: #fcfcfa; color: #1f2421; }`;

const og = (title, sub, url) => `<!doctype html><style>${base}
  body { width: 1200px; height: 630px; display: grid; grid-template-columns: 1fr 400px; gap: 56px; padding: 64px 72px; align-items: center; }
  .brand { display: flex; align-items: center; gap: 16px; font-size: 34px; font-weight: 650; }
  .brand svg { width: 64px; height: 64px; }
  h1 { margin-top: 44px; font-size: 62px; line-height: 1.06; font-weight: 640; font-stretch: 92%; letter-spacing: -0.015em; }
  p { margin-top: 26px; font-size: 28px; color: #c8102e; font-weight: 600; }
  .url { margin-top: 40px; font-size: 24px; color: #565e58; font-weight: 500; }
  .credit { position: absolute; right: 24px; bottom: 14px; font-size: 13px; color: #8a918c; }
  img { width: 400px; height: 500px; object-fit: cover; object-position: 50% 35%; border-radius: 999px 999px 16px 16px; }
</style><div><div class="brand">${mark}Ceibo Works</div><h1>${title}</h1><p>${sub}</p><div class="url">${url}</div></div>
<img src="data:image/jpeg;base64,${photo}"><span class="credit">Photo: Bidgee, CC BY-SA 3.0</span>`;

const icon = (size, pad) => `<!doctype html><style>${base}
  body { width: ${size}px; height: ${size}px; display: grid; place-items: center; background: #fcfcfa; }
  svg { width: ${size - pad * 2}px; height: ${size - pad * 2}px; }
</style>${mark}`;

const browser = await chromium.launch();
const shots = [
  ['public/og-en.png', 1200, 630, og('Websites for small businesses, made by someone you can talk to.', 'Built for free. Looked after every month.', 'ceiboworks.com')],
  ['public/og-es.png', 1200, 630, og('Páginas web para negocios pequeños, hechas por alguien con quien puedes hablar.', 'Te la armo gratis. La mantengo cada mes.', 'ceiboworks.com/es')],
  ['public/logo-512.png', 512, 512, icon(512, 56)],
  ['public/apple-touch-icon.png', 180, 180, icon(180, 22)],
];
for (const [file, width, height, html] of shots) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.setContent(html);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: file });
  await page.close();
}
await browser.close();
console.log('Brand images written to public/');
