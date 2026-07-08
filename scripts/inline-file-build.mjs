import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDirName = process.argv[2] || 'dist-file';
const outDir = join(repoRoot, outDirName);
const indexPath = join(outDir, 'index.html');

if (!existsSync(indexPath)) {
  throw new Error(`Cannot find ${indexPath}. Run vite build before inlining.`);
}

const readAsset = (assetPath) => {
  const normalized = assetPath.replace(/^\.\//, '');
  const fullPath = join(outDir, normalized);

  if (!existsSync(fullPath)) {
    throw new Error(`Cannot inline missing asset: ${assetPath}`);
  }

  return readFileSync(fullPath, 'utf8');
};

let html = readFileSync(indexPath, 'utf8');

html = html.replace(
  /<link\s+([^>]*?)href="([^"]+\.css)"([^>]*?)>/g,
  (_match, before, href, after) => {
    if (!/rel="stylesheet"/.test(`${before} ${after}`)) return _match;
    return `<style>\n${readAsset(href)}\n</style>`;
  },
);

html = html.replace(
  /<script\s+([^>]*?)src="([^"]+\.js)"([^>]*?)><\/script>/g,
  (_match, _before, src) => `<script>\n${readAsset(src)}\n</script>`,
);

html = html.replace(/<link\s+[^>]*rel="modulepreload"[^>]*>\s*/g, '');

writeFileSync(indexPath, html);
console.log(`Offline HTML is ready: ${join(outDirName, 'index.html')}`);
