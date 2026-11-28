// Generates the reel voiceover clips with ElevenLabs, one clip per line in voice/lines.json.
// Run from the repo root: node social/reels/make-voice.mjs
// The API key is never read here: the session's network proxy adds it to requests to
// api.elevenlabs.io. Run elsewhere, set ELEVENLABS_API_KEY in the environment.
// Clips are cached by text (voice/clips/<hash>.mp3), so editing one line only regenerates that line.
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const DIR = 'social/reels/voice';
const LANGS = ['en']; // English only from now on (Spanish lines kept for reference)
const cfg = JSON.parse(await readFile(`${DIR}/lines.json`, 'utf8'));
await mkdir(`${DIR}/clips`, { recursive: true });
const key = process.env.ELEVENLABS_API_KEY ?? 'proxy-injected';
const durations = {};

for (const [reel, langs] of Object.entries(cfg.reels)) {
  for (const [lang, lines] of Object.entries(langs).filter(([l]) => LANGS.includes(l))) {
    let prevEnd = 0;
    for (const [i, [earliest, text]] of lines.entries()) {
      const hash = createHash('sha1').update(JSON.stringify([cfg.voice, text])).digest('hex').slice(0, 12);
      const file = `${DIR}/clips/${hash}.mp3`;
      const exists = await access(file).then(() => true, () => false);
      if (!exists) {
        const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${cfg.voice.id}?output_format=mp3_44100_128`, {
          method: 'POST',
          headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text, model_id: cfg.voice.model, voice_settings: cfg.voice.settings,
            // Neighbouring lines keep the intonation consistent across clips.
            previous_text: lines[i - 1]?.[1], next_text: lines[i + 1]?.[1],
          }),
        });
        if (!res.ok) throw new Error(`${reel} ${lang} line ${i}: ${res.status} ${await res.text()}`);
        await writeFile(file, Buffer.from(await res.arrayBuffer()));
      }
      const d = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString());
      // Each line starts at its earliest time or just after the previous line, whichever is later.
      // The reel's scenes are timed from these cues (make-reels.mjs reads voice/clips.json).
      const at = +Math.max(earliest, prevEnd + 0.15).toFixed(2);
      prevEnd = at + d;
      (durations[`${reel}-${lang}`] ??= []).push({ at, end: +(at + d).toFixed(2), file, text });
    }
  }
}
await writeFile(`${DIR}/clips.json`, JSON.stringify(durations, null, 1));
for (const [k, list] of Object.entries(durations)) {
  console.log(k);
  list.forEach((c, i) => {
    console.log(`  ${c.at.toFixed(1)} → ${c.end.toFixed(1)}  ${c.text}`);
  });
}
