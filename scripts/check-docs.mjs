#!/usr/bin/env node
/**
 * check-docs.mjs — verifica el visor de documentación y los enlaces internos.
 *
 *   node scripts/check-docs.mjs
 *
 * Qué comprueba:
 *   1. Que el renderizador markdown de viewer.html no deje marcadores sin resolver
 *      ni etiquetas desbalanceadas en ningún documento del repo.
 *   2. Que todos los enlaces relativos de los .md apunten a archivos existentes.
 *   3. Que cada `viewer.html?doc=…` enlazado desde index.html exista.
 *   4. Que los documentos tengan título (H1) y que el índice (TOC) no esté vacío.
 *
 * Sin dependencias: extrae el renderizador del propio viewer.html para probar
 * exactamente el código que corre en el navegador.
 */
import { readFileSync, existsSync, readdirSync, statSync, writeFileSync, unlinkSync } from 'node:fs';
import { join, dirname, relative, resolve as resolvePath, extname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const VIEWER = join(ROOT, 'viewer.html');

// ─── 1. Extraer el motor markdown del visor ────────────────────────────────
const viewer = readFileSync(VIEWER, 'utf8');
const start = viewer.indexOf('const esc = (s) =>');
const end = viewer.indexOf('/* ── carga y estado');
if (start < 0 || end < 0 || end <= start) {
  console.error('✗ no se pudo extraer el renderizador de viewer.html (¿cambiaron los marcadores?)');
  process.exit(1);
}
const engine = viewer.slice(start, end);
const tmp = join(tmpdir(), `arenaabys-mdrender-${process.pid}.mjs`);
writeFileSync(tmp, `${engine}\nexport { render };\n`);

// ─── 2. Recolectar documentos ──────────────────────────────────────────────
function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (name === '.git' || name === '.claude' || name === 'node_modules') continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, acc);
    else if (extname(name) === '.md') acc.push(full);
  }
  return acc;
}

const docs = walk(ROOT).sort();

// ─── 3. Probar cada documento ──────────────────────────────────────────────
const { render } = await import(pathToFileURL(tmp).href);
const problems = [];
let tables = 0, blocks = 0, links = 0;

for (const file of docs) {
  const rel = relative(ROOT, file);
  const md = readFileSync(file, 'utf8');
  const { html, toc } = render(md, rel);

  const count = (re) => (html.match(re) || []).length;
  tables += count(/<table>/g);
  blocks += count(/<pre>/g);

  if (html.includes('\u0000')) problems.push(`${rel}: quedaron marcadores de código sin resolver`);
  if (count(/<table>/g) !== count(/<\/table>/g)) problems.push(`${rel}: tabla desbalanceada`);
  if (count(/<pre>/g) !== count(/<\/pre>/g)) problems.push(`${rel}: bloque de código desbalanceado`);
  if (count(/<ul>/g) !== count(/<\/ul>/g)) problems.push(`${rel}: lista <ul> desbalanceada`);
  if (count(/<ol>/g) !== count(/<\/ol>/g)) problems.push(`${rel}: lista <ol> desbalanceada`);
  if (count(/<h1/g) === 0) problems.push(`${rel}: sin título H1`);
  if (toc.length === 0 && /^##\s/m.test(md)) problems.push(`${rel}: tiene secciones H2 pero el índice quedó vacío`);

  // enlaces relativos del markdown
  const baseDir = dirname(rel);
  for (const m of md.matchAll(/\]\((?!https?:|mailto:|#)([^)\s]+)\)/g)) {
    const [p] = m[1].split('#');
    if (!p || p.startsWith('?doc=')) continue;
    const target = resolvePath(ROOT, baseDir, p);
    links++;
    if (!existsSync(target)) problems.push(`${rel}: enlace roto → ${p}`);
  }
}

// ─── 4. Enlaces del hub al visor ───────────────────────────────────────────
const hub = readFileSync(join(ROOT, 'index.html'), 'utf8');
for (const m of hub.matchAll(/viewer\.html\?doc=([^"&]+)/g)) {
  const target = join(ROOT, decodeURIComponent(m[1]));
  if (!existsSync(target)) problems.push(`index.html: viewer apunta a un archivo inexistente → ${m[1]}`);
}

// ─── 5. Reporte ────────────────────────────────────────────────────────────
unlinkSync(tmp);

console.log(`▸ documentos verificados : ${docs.length}`);
console.log(`▸ tablas renderizadas    : ${tables}`);
console.log(`▸ bloques de código      : ${blocks}`);
console.log(`▸ enlaces internos       : ${links}`);

if (problems.length) {
  console.error(`\n✗ ${problems.length} problema(s):`);
  problems.forEach(p => console.error(`   · ${p}`));
  process.exitCode = 1;
} else {
  console.log('\n✓ check-docs OK: renderizado y enlaces en orden');
}
