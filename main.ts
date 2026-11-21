// Spot the Difference — Sunny Garden: hand-in program (Node 22, standard library only).
// Copies game/ and screenshots/ from this repository into the output directory and
// writes dossier.json with the vendored make.fun dossier library, the summary the
// judge reads. Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'game'), join(outputDir, 'game'), { recursive: true });
const shotsSrc = join(repoRoot, 'screenshots');
const shotsDst = join(outputDir, 'screenshots');
mkdirSync(shotsDst, { recursive: true });
if (existsSync(shotsSrc)) cpSync(shotsSrc, shotsDst, { recursive: true });

// The scorer's own caps: only text_max_bytes shapes the bytes; the others refuse
// an entry the scorer would refuse (more than 4 screenshots or one over 256 KiB;
// more than 993 files in game/ or 48 MiB of game files in all, or a path under
// game/ over 1000 bytes).
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);

console.log(`hand-in written to ${outputDir}`);
