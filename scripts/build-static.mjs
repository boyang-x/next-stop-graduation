import { mkdirSync, rmdirSync, unlinkSync, lstatSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.resolve(root, 'dist');
if (path.relative(root, output) !== 'dist' || lstatSync(output, { throwIfNoEntry: false })?.isSymbolicLink()) {
  throw new Error('Static output must be the project dist directory.');
}
mkdirSync(output, { recursive: true });
// Avoid Node 24's recursive rm bug on Windows paths containing Chinese text.
clearDirectory(output);
copy(path.join(root, 'assets'), path.join(output, 'assets'));

// The original stylesheet order is significant for desktop/mobile overrides.
const sourceHTML = readFileSync(path.join(root, 'index.html'), 'utf8');
const cssLinks = [...sourceHTML.matchAll(/<link rel="stylesheet" href="\/([^"?]+)">/g)];
if (!cssLinks.length || !sourceHTML.includes('src="/src/main.js"')) throw new Error('Missing source entry points.');
const style = await build({
  absWorkingDir: root,
  stdin: { contents: cssLinks.map(x => `@import "./${x[1]}";`).join('\n'), resolveDir: root, sourcefile: 'site.css', loader: 'css' },
  bundle: true, minify: true, charset: 'utf8', outdir: output, entryNames: 'assets/styles-[hash]', metafile: true,
  target: ['chrome100', 'safari15.4'], logLevel: 'warning'
});
const script = await build({
  absWorkingDir: root, entryPoints: { game: 'src/main.js' }, outdir: output,
  bundle: true, splitting: true, format: 'esm', platform: 'browser', minify: true, charset: 'utf8',
  entryNames: 'assets/[name]-[hash]', chunkNames: 'assets/[name]-[hash]', metafile: true,
  target: ['chrome100', 'safari15.4'], logLevel: 'warning',
  banner: { js: '/*! 下一站，毕业 · © 2026 boyang-x · 保留权利 */' }
});
const publicPath = p => '/' + path.relative(output, path.resolve(root, p)).split(path.sep).join('/');
const styleEntry = Object.keys(style.metafile.outputs).find(p => p.endsWith('.css'));
const scriptEntry = Object.entries(script.metafile.outputs).find(([, x]) => x.entryPoint === 'src/main.js')?.[0];
if (!styleEntry || !scriptEntry) throw new Error('Bundled entry points missing.');
// Preload eager dependencies. Do not load the PNG exporter during startup.
const eager = new Set();
function collect(p) {
  if (eager.has(p)) return;
  eager.add(p);
  for (const i of script.metafile.outputs[p].imports) if (i.kind === 'import-statement' && !i.external) collect(i.path);
}
collect(scriptEntry);
let html = sourceHTML.replace(/\s*<link rel="stylesheet" href="\/[^"?]+">/g, '');
html = html.replace('</head>', `  <link rel="stylesheet" href="${publicPath(styleEntry)}">\n${[...eager].map(p => `  <link rel="modulepreload" href="${publicPath(p)}">`).join('\n')}\n</head>`);
html = html.replace('src="/src/main.js"', `src="${publicPath(scriptEntry)}"`);
writeFileSync(path.join(output, 'index.html'), html);
console.log(`Static site bundled: ${eager.size} startup JS file(s), 1 CSS file, deferred PNG exporter; hashed assets in dist/.`);

function copy(source, destination) {
  const stat = lstatSync(source);
  if (stat.isDirectory()) {
    mkdirSync(destination, { recursive: true });
    for (const entry of readdirSync(source)) copy(path.join(source, entry), path.join(destination, entry));
  } else if (stat.isFile()) {
    writeFileSync(destination, readFileSync(source));
  } else {
    throw new Error(`Static source must contain only regular files: ${source}`);
  }
}

function clearDirectory(directory) {
  for (const name of readdirSync(directory)) {
    const entry = path.join(directory, name), stat = lstatSync(entry);
    if (stat.isDirectory() && !stat.isSymbolicLink()) { clearDirectory(entry); rmdirSync(entry); }
    else unlinkSync(entry);
  }
}
