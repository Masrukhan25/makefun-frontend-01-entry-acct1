import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const outputRoot = process.env.MAKEFUN_OUTPUT_DIR || '/output';

function copyDirectory(name: string): void {
  cpSync(join(projectRoot, name), join(outputRoot, name), { recursive: true });
}

mkdirSync(outputRoot, { recursive: true });
copyDirectory('app');
copyDirectory('screenshots');

const dossier = buildDossier(outputRoot, {
  text_max_bytes: 163840,
  screenshots: { max: 3, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
const dossierPath = join(outputRoot, 'dossier.json');
writeFileSync(dossierPath, dossier);
