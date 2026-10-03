import { mkdirSync, rmSync, lstatSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.resolve(root, 'dist');
if (path.relative(root, output) !== 'dist' || lstatSync(output, { throwIfNoEntry: false })?.isSymbolicLink()) {
  throw new Error('Static output must be the project dist directory.');
}
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
for (const entry of ['index.html', 'src', 'assets']) {
  copy(path.join(root, entry), path.join(output, entry));
}
console.log('Static site prepared in dist/ (index.html, src/, assets/).');

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
