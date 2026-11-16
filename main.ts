import { cpSync, existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';
const root = dirname(fileURLToPath(import.meta.url));
const output = resolve(process.env.MAKEFUN_OUTPUT_DIR || '/output');
if (output === root || output.startsWith(join(root, 'app') + '/') || output === join(root, 'app') || output === join(root, 'screenshots') || output.startsWith(join(root, 'screenshots') + '/')) throw new Error('Output must be separate from source directories.');
mkdirSync(output, { recursive: true });
for (const folder of ['app', 'screenshots']) {
  const target = join(output, folder);
  rmSync(target, { recursive: true, force: true });
  if (existsSync(join(root, folder))) cpSync(join(root, folder), target, { recursive: true });
  else mkdirSync(target, { recursive: true });
}
rmSync(join(output, 'dossier.json'), { force: true });
const dossier = buildDossier(output, { text_max_bytes: 163840, screenshots: { max: 3, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 });
writeFileSync(join(output, 'dossier.json'), dossier);
console.log(`Copied app and screenshots; dossier.json: ${dossier.byteLength} bytes`);
