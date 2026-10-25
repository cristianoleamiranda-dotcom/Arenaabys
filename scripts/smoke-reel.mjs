#!/usr/bin/env node
/**
 * smoke-reel.mjs — verifica que el reel se dibuje en todos sus frames sin errores de runtime,
 * sin navegador ni dependencias: simula un canvas 2D, el DOM y (ausente) WebAudio.
 *
 * Uso:  node scripts/smoke-reel.mjs
 * Sale con código 1 si algún frame falla.
 */
import { readFile, writeFile, unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'demo', 'reel.js');
const TMP = join(tmpdir(), `arenaabys-reel-${process.pid}.mjs`);

// ─── Stubs de navegador ─────────────────────────────────────────────────────
const noop = () => {};
const gradient = { addColorStop: noop };

const ctxStub = new Proxy(
  {
    measureText: (s) => ({ width: String(s).length * 9 }),
    createLinearGradient: () => gradient,
    createRadialGradient: () => gradient,
    canvas: { width: 1280, height: 720 },
  },
  {
    get(target, prop) {
      if (prop in target) return target[prop];
      if (typeof prop === 'symbol') return undefined;
      return noop;
    },
    set() { return true; },
  },
);

function makeEl(id) {
  return {
    id, style: {}, textContent: '', className: '', dataset: {},
    classList: { add: noop, remove: noop, toggle: noop },
    addEventListener: noop, appendChild: noop,
    setAttribute: noop, getAttribute: () => null,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 1280, height: 720 }),
    clientWidth: 1280, clientHeight: 720,
    parentElement: { clientWidth: 1280, clientHeight: 720 },
    getContext: () => ctxStub,
    width: 1280, height: 720,
  };
}

const els = {};
globalThis.document = {
  getElementById: (id) => (els[id] ||= makeEl(id)),
  createElement: (tag) => makeEl(tag),
  querySelector: () => makeEl('q'),
  fonts: undefined,
  addEventListener: noop,
};
globalThis.window = globalThis;
globalThis.devicePixelRatio = 1;
globalThis.addEventListener = noop;
globalThis.requestAnimationFrame = () => 0;
globalThis.AudioContext = undefined;
globalThis.location = { search: '' };

// ─── Ejecución ──────────────────────────────────────────────────────────────
let code = await readFile(SRC, 'utf8');
code += '\nexport const __meta = { DUR, FPS, BPM, SCENES };\n';
await writeFile(TMP, code);

try {
  const mod = await import(pathToFileURL(TMP).href);
  const reel = globalThis.window.__reel;
  const { DUR, FPS, SCENES } = mod.__meta;

  let frames = 0;
  const failures = [];

  for (let t = 0; t <= DUR + 1e-9; t += 1 / FPS) {
    const tt = Math.min(DUR, t);
    try {
      reel.render(tt);
      frames++;
    } catch (e) {
      failures.push({ t: tt.toFixed(2), message: e.message });
      if (failures.length > 5) break;
    }
  }

  // Cobertura por escena (ninguna escena sin dibujar)
  const uncovered = SCENES.filter(s => s.in >= DUR).map(s => s.id);

  console.log(`▸ ${SRC.replace(ROOT + '/', '')}: ${DUR}s · ${FPS} fps · ${SCENES.length} escenas`);
  console.log(`▸ frames renderizados: ${frames}`);
  console.log(`▸ escenas: ${SCENES.map(s => `${s.id}(${s.in}–${s.out}s)`).join(' · ')}`);

  if (uncovered.length) console.log(`⚠ escenas fuera de rango: ${uncovered.join(', ')}`);

  if (failures.length) {
    console.error(`✗ ${failures.length} frame(s) con error:`);
    failures.forEach(f => console.error(`   t=${f.t}s → ${f.message}`));
    process.exitCode = 1;
  } else {
    console.log('✓ smoke test OK: todos los frames se dibujan sin errores');
  }
} finally {
  await unlink(TMP).catch(() => {});
}
