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

const escapeInlineScript = (content) => content.replace(/<\/script/gi, '<\\/script');
const escapeInlineStyle = (content) => content.replace(/<\/style/gi, '<\\/style');
const makeFileSafeScript = (content) =>
  escapeInlineScript(
    content.replace(
      /\bimport\.meta\.url\b/g,
      '(document.currentScript && document.currentScript.src || location.href)',
    ),
  );

let html = readFileSync(indexPath, 'utf8');
const inlineScripts = [];

html = html.replace(
  /<link\s+([^>]*?)href="([^"]+\.css)"([^>]*?)>/g,
  (_match, before, href, after) => {
    if (!/rel="stylesheet"/.test(`${before} ${after}`)) return _match;
    return `<style>\n${escapeInlineStyle(readAsset(href))}\n</style>`;
  },
);

html = html.replace(
  /<script\s+([^>]*?)src="([^"]+\.js)"([^>]*?)><\/script>/g,
  (_match, _before, src) => {
    inlineScripts.push(`<script>\n${makeFileSafeScript(readAsset(src))}\n</script>`);
    return '';
  },
);

html = html.replace(/<link\s+[^>]*rel="modulepreload"[^>]*>\s*/g, '');

if (inlineScripts.length > 0) {
  const scriptBlock = inlineScripts.map((script) => `    ${script}`).join('\n');
  if (html.includes('</body>')) {
    html = html.replace(/\s*<\/body>/, `\n${scriptBlock}\n  </body>`);
  } else {
    html += `\n${scriptBlock}\n`;
  }
}

writeFileSync(indexPath, html);
console.log(`Offline HTML is ready: ${join(outDirName, 'index.html')}`);
