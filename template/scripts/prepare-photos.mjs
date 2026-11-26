// Normalises photos dropped into src/assets/client/ (and the demo set):
// max 2000px on the long side, rotated by EXIF, metadata stripped (removes GPS location
// of clients' homes), saved as quality-82 JPEG. Safe to run repeatedly.
// Usage: node scripts/prepare-photos.mjs [folder ...]
import { readdirSync, renameSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import sharp from 'sharp';

const folders = process.argv.slice(2).length ? process.argv.slice(2) : ['src/assets/client', 'src/assets/demo'];
const MAX = 2000;

for (const dir of folders) {
  let files;
  try { files = readdirSync(dir); } catch { continue; }
  for (const name of files) {
    if (!/\.(jpe?g|png|webp|heic|avif)$/i.test(name)) continue;
    const src = join(dir, name);
    const out = join(dir, name.replace(extname(name), '.jpg'));
    const tmp = `${out}.tmp`;
    const before = statSync(src).size;
    const meta = await sharp(src).metadata();
    const needsResize = Math.max(meta.width ?? 0, meta.height ?? 0) > MAX;
    // Already processed (JPEG, small enough, no metadata): skip, so photos are not recompressed again.
    if (/\.jpe?g$/i.test(name) && !needsResize && !meta.exif && !meta.icc && !meta.xmp) continue;
    // .rotate() applies EXIF orientation; metadata is not copied unless asked, so it is stripped.
    await sharp(src).rotate().resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true }).toFile(tmp);
    renameSync(tmp, out);
    if (out !== src) await import('node:fs').then((fs) => fs.unlinkSync(src));
    console.log(`${name}: ${(before / 1024).toFixed(0)}kB -> ${(statSync(out).size / 1024).toFixed(0)}kB${needsResize ? ' (resized)' : ''}`);
  }
}
