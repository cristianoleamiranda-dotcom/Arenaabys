/* ============================================================================
   Arenaabys · Motion Graphics Reel
   ----------------------------------------------------------------------------
   Reel interactivo en canvas 2D + score sintetizado en WebAudio.
   Sin dependencias, sin assets: todo se dibuja y se suena en el navegador.

   Principios que demuestra (ver docs/ y skills/):
   · Un frame es una función pura de t  → render(t) determinista y exportable.
   · Todo el timing se deriva del BPM     → frames_por_pulso = (60/BPM)*fps
   · Audio e imagen leen el mismo reloj   → sincronía por construcción.
   · Sistema visual único (paleta, escala, easings) para toda la pieza.
   ========================================================================== */

// ─── Configuración de la pieza ────────────────────────────────────────────────
const W = 1280, H = 720;
const BPM = 120;
const BEAT = 60 / BPM;          // 0.5 s
const BAR = BEAT * 4;           // 2.0 s
const FPS = 30;                 // fps de referencia para el export
const DUR = 28;                 // duración total en segundos

const C = {
  ink:   '#0b0b0c',
  paper: '#f2efe6',
  lime:  '#c7f94a',
  blue:  '#7ba7ff',
  alert: '#ff5c39',
  line:  '#232327',
};

// ─── Utilidades matemáticas y de easing ──────────────────────────────────────
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, k) => a + (b - a) * k;
const inv = (a, b, v) => clamp((v - a) / (b - a));
const TAU = Math.PI * 2;

const ease = {
  linear:     t => t,
  inQuad:     t => t * t,
  outQuad:    t => 1 - (1 - t) * (1 - t),
  inCubic:    t => t * t * t,
  outCubic:   t => 1 - Math.pow(1 - t, 3),
  inOutCubic: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  outExpo:    t => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  outBack:    t => 1 + 2.9 * Math.pow(t - 1, 3) + 1.9 * Math.pow(t - 1, 2),
  outElastic: t => (t === 0 || t === 1 ? t : Math.pow(2, -9 * t) * Math.sin((t * 10 - 0.75) * (TAU / 3)) + 1),
};

/** Progreso 0..1 de un tramo [start, start+dur] con easing opcional. */
function prog(t, start, dur, fn = ease.linear) {
  return fn(clamp((t - start) / dur));
}

/** Entrada con hold: sube en `inDur` desde `start`, se queda en 1, y sale antes de `end`. */
function inOut(t, start, end, inDur = 0.4, outDur = 0.3, fin = ease.outExpo, fout = ease.inQuad) {
  const a = prog(t, start, inDur, fin);
  const b = 1 - prog(t, end - outDur, outDur, fout);
  return Math.min(a, b);
}

const rand = (seed) => {
  // PRNG determinista: mismo frame, mismo píxel (requisito de render frame-accurate)
  let s = Math.sin(seed * 127.1) * 43758.5453;
  return s - Math.floor(s);
};

// ─── Estado de reproducción ──────────────────────────────────────────────────
const state = {
  playing: false,
  t: 0,
  loop: true,
  audioOn: true,
  guides: false,
  fps: 0,
};

// ─── Canvas ──────────────────────────────────────────────────────────────────
const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');
const DPR = Math.min(window.devicePixelRatio || 1, 2);

/** Escala el documento lógico 1280×720 al espacio disponible conservando 16:9. */
function fitCanvas() {
  const wrap = canvas.parentElement;
  const availW = wrap ? wrap.clientWidth : W;
  const availH = wrap ? wrap.clientHeight : H;
  const scale = Math.max(0.2, Math.min(availW / W, availH / H));
  canvas.style.width = `${Math.round(W * scale)}px`;
  canvas.style.height = `${Math.round(H * scale)}px`;
  canvas.width = Math.round(W * scale * DPR);
  canvas.height = Math.round(H * scale * DPR);
}
fitCanvas();
window.addEventListener('resize', fitCanvas);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitCanvas);

// Documento virtual de 1280×720 escalado al tamaño real del canvas
function beginFrame() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.scale(canvas.width / W, canvas.height / H);
}

// ─── Tipografía ──────────────────────────────────────────────────────────────
const DISPLAY = '"Inter","Helvetica Neue",Helvetica,Arial,sans-serif';
const MONO = '"SF Mono",ui-monospace,"Roboto Mono",Menlo,Consolas,monospace';

function font(size, weight = 700, family = DISPLAY, spacing = null) {
  ctx.font = `${weight} ${size}px ${family}`;
  ctx.letterSpacing = spacing === null ? '0px' : `${spacing}px`;
  ctx.textBaseline = 'alphabetic';
}

function text(str, x, y, o = {}) {
  const {
    size = 32, weight = 700, family = DISPLAY, color = C.paper,
    align = 'left', alpha = 1, spacing = null, baseline = 'alphabetic',
  } = o;
  if (alpha <= 0.001) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  font(size, weight, family, spacing);
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.fillText(str, x, y);
  ctx.restore();
}

function measure(str, size, weight = 700, family = DISPLAY, spacing = null) {
  ctx.save();
  font(size, weight, family, spacing);
  const w = ctx.measureText(str).width;
  ctx.restore();
  return w;
}

/** Dibuja texto carácter por carácter con stagger (tipografía cinética). */
function textStagger(str, x, y, t, start, o = {}) {
  const {
    size = 64, weight = 700, family = DISPLAY, color = C.paper,
    stagger = 0.035, dur = 0.45, rise = 34, align = 'left',
    spacing = null, alpha = 1, slide = 0,
  } = o;
  ctx.save();
  font(size, weight, family, spacing);
  ctx.textAlign = 'left';
  const total = ctx.measureText(str).width;
  let cx = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;
  const chars = [...str];
  chars.forEach((ch, i) => {
    const p = prog(t, start + i * stagger, dur, ease.outExpo);
    if (p > 0) {
      const a = clamp(p * 1.4) * alpha;
      const dy = (1 - p) * rise;
      const dx = (1 - p) * slide;
      ctx.globalAlpha = a;
      ctx.fillStyle = color;
      ctx.fillText(ch, cx + dx, y + dy);
    }
    cx += ctx.measureText(ch).width;
  });
  ctx.restore();
}

/** Aparición palabra por palabra (más legible que por carácter en frases largas). */
function wordsReveal(str, x, y, t, start, o = {}) {
  const { size = 56, weight = 600, color = C.paper, stagger = 0.09, dur = 0.5, align = 'left', alpha = 1 } = o;
  const words = str.split(' ');
  const space = measure(' ', size, weight);
  const widths = words.map(w => measure(w, size, weight));
  const total = widths.reduce((a, b) => a + b, 0) + space * (words.length - 1);
  let cx = align === 'center' ? x - total / 2 : x;
  words.forEach((w, i) => {
    const p = prog(t, start + i * stagger, dur, ease.outExpo);
    if (p > 0) {
      ctx.save();
      ctx.globalAlpha = alpha * clamp(p * 1.6);
      font(size, weight, DISPLAY);
      ctx.fillStyle = color;
      ctx.fillText(w, cx, y + (1 - p) * 22);
      ctx.restore();
    }
    cx += widths[i] + space;
  });
  return total;
}

/** Revelado por máscara horizontal (el gesto clásico de motion graphics). */
function maskReveal(str, x, y, t, start, o = {}) {
  const { size = 120, weight = 800, color = C.paper, dur = 0.55, align = 'left', spacing = -4 } = o;
  const p = prog(t, start, dur, ease.inOutCubic);
  if (p <= 0) return;
  const w = measure(str, size, weight, DISPLAY, spacing);
  const x0 = align === 'center' ? x - w / 2 : x;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x0 - 8, y - size * 1.1, (w + 16) * p, size * 1.5);
  ctx.clip();
  text(str, x0, y, { size, weight, color, spacing });
  ctx.restore();
  // borde del barrido
  if (p < 1) {
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = C.lime;
    ctx.fillRect(x0 + w * p - 2, y - size * 0.95, 3, size * 1.18);
    ctx.restore();
  }
}

function rule(x1, x2, y, p, color = C.lime, h = 2) {
  if (p <= 0) return;
  ctx.fillStyle = color;
  ctx.fillRect(x1, y, (x2 - x1) * p, h);
}

// ─── Fondo ───────────────────────────────────────────────────────────────────
function drawBackground(t) {
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#0b0b0c');
  g.addColorStop(0.55, '#0e0f10');
  g.addColorStop(1, '#080809');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // halo que respira con el pulso
  const beatPhase = (t / BEAT) % 1;
  const pulse = Math.pow(1 - beatPhase, 3);
  const glow = ctx.createRadialGradient(W * 0.72, H * 0.28, 20, W * 0.72, H * 0.28, 620);
  glow.addColorStop(0, `rgba(199,249,74,${0.05 + 0.045 * pulse})`);
  glow.addColorStop(0.45, 'rgba(123,167,255,0.03)');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // retícula técnica muy tenue, alineada al compás
  ctx.save();
  ctx.strokeStyle = 'rgba(242,239,230,0.035)';
  ctx.lineWidth = 1;
  const step = 64;
  const shift = (t / BAR) * step; // se desplaza un módulo por compás
  for (let x = -step + (shift % step); x < W + step; x += step) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += step) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
  ctx.restore();

  // viñeta
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.95);
  v.addColorStop(0, 'rgba(0,0,0,0)');
  v.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
}

// ─── Escenas ─────────────────────────────────────────────────────────────────
const SCENES = [
  { id: 'hook',     in: 0,      out: 2,   label: 'HOOK' },
  { id: 'title',    in: 2,      out: 8,   label: 'TÍTULO' },
  { id: 'statement',in: 8,      out: 16,  label: 'KINETIC TYPE' },
  { id: 'pipeline', in: 16,     out: 24,  label: 'PIPELINE' },
  { id: 'sting',    in: 24,     out: DUR, label: 'STING' },
];

// ── Escena 1 · hook: cuatro palabras estampadas en cada pulso ────────────────
const HOOK_WORDS = [
  { txt: 'DISEÑO', color: C.paper },
  { txt: 'RITMO', color: C.lime },
  { txt: 'SONIDO', color: C.blue },
  { txt: 'TIEMPO', color: C.alert },
];

function drawHook(t) {
  const idx = Math.min(HOOK_WORDS.length - 1, Math.floor(t / BEAT));
  for (let i = 0; i < HOOK_WORDS.length; i++) {
    const start = i * BEAT;
    const local = t - start;
    const alive = i === idx ? 1 : 0;
    if (local < 0) continue;
    const w = HOOK_WORDS[i];
    const scale = local < 0.18
      ? lerp(1.35, 1, ease.outExpo(clamp(local / 0.18)))
      : lerp(1, 1.06, ease.outCubic(clamp((local - 0.18) / (BEAT - 0.18))));
    const alpha = alive ? (local > BEAT - 0.09 ? 0.0 : 1) : 0;
    if (alpha <= 0) continue;

    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.scale(scale, scale);
    ctx.globalAlpha = alpha;
    // flash de fondo
    ctx.fillStyle = `rgba(242,239,230,${0.03 * (1 - clamp(local / 0.2))})`;
    ctx.fillRect(-W / 2, -H / 2, W, H);
    text(w.txt, 0, 18, { size: 132, weight: 800, color: w.color, align: 'center', spacing: -6 });
    ctx.restore();
  }
  // HUD mínimo
  text('01 / ¿QUÉ HACE QUE ALGO SE MUEVA BIEN?', 56, H - 52, {
    size: 13, weight: 600, family: MONO, color: '#6f6f68', spacing: 1.5,
  });
}

// ── Escena 2 · título ───────────────────────────────────────────────────────
function drawTitle(t) {
  const t0 = 0; // local
  const outP = prog(t, 5.4, 0.6, ease.inQuad);

  ctx.save();
  ctx.globalAlpha = 1 - outP;
  ctx.translate(0, -26 * outP);

  // Filetes superiores
  const p1 = prog(t, 0.05, 0.7, ease.inOutCubic);
  rule(56, 56 + 300 * p1, 118, 1, '#3a3a40');
  text('MOTION GRAPHICS', 56, 104, {
    size: 12, weight: 600, family: MONO, color: '#7d7d75', spacing: 3,
  });

  // Título principal: dos palabras, dos gestos
  maskReveal('MOTION', 52, 268, t, 0.10, { size: 132, weight: 800, spacing: -6 });
  maskReveal('GRAPHICS', 52, 392, t, 0.28, { size: 132, weight: 800, color: C.lime, spacing: -6 });

  // Subtítulo: definición operativa
  const sp = prog(t, 1.05, 0.45, ease.outExpo);
  ctx.save();
  ctx.globalAlpha = sp;
  ctx.translate(0, (1 - sp) * 18);
  text('diseño gráfico + la variable tiempo', 58, 462, { size: 30, weight: 500, color: C.paper });
  ctx.restore();

  rule(56, 56 + 1070 * prog(t, 1.3, 1.0, ease.inOutCubic), 520, 1, C.lime);

  // Datos técnicos alineados a la derecha (jerarquía secundaria)
  const d = prog(t, 1.6, 0.5, ease.outExpo);
  ctx.globalAlpha = d;
  const rows = [
    ['MENSAJE', 'antes que decoración'],
    ['RITMO', '120 BPM · 15 f por pulso'],
    ['ENTREGA', '9:16 · 16:9 · 1:1 · 4:5'],
  ];
  rows.forEach(([k, v], i) => {
    const y = 590 + i * 30;
    text(k, 56, y, { size: 12, weight: 700, family: MONO, color: C.lime, spacing: 2 });
    text(v, 190, y, { size: 13, weight: 500, family: MONO, color: '#8b8b84' });
  });

  // Marco de encuadre que se dibuja
  const fp = prog(t, 1.9, 0.9, ease.inOutCubic);
  if (fp > 0) {
    ctx.strokeStyle = 'rgba(242,239,230,0.16)';
    ctx.lineWidth = 1;
    const m = 526;
    ctx.beginPath();
    ctx.moveTo(W - 56 - 220 * fp, 56);
    ctx.lineTo(W - 56, 56);
    ctx.lineTo(W - 56, 56 + 220 * fp);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(W - 56, 56 + 220 * fp);
    ctx.lineTo(W - 56 - 220 * fp, 56 + 220 * fp);
    ctx.lineTo(W - 56 - 220 * fp, 56);
    ctx.stroke();
  }
  ctx.restore();

  text('02 / DEFINICIÓN OPERATIVA', 56, H - 40, {
    size: 13, weight: 600, family: MONO, color: '#6f6f68', spacing: 1.5,
  });
}

// ── Escena 3 · kinetic typography ───────────────────────────────────────────
function drawStatement(t) {
  const phaseB = t >= 4; // ecuación

  if (!phaseB) {
    wordsReveal('El mensaje manda.', 64, 250, t, 0.15, { size: 76, weight: 700 });
    wordsReveal('El movimiento argumenta.', 64, 344, t, 0.75, { size: 76, weight: 700, color: C.lime });
    const lp = prog(t, 1.5, 0.6, ease.outExpo);
    ctx.save();
    ctx.globalAlpha = lp * 0.9;
    text('si quitas el audio y aún se entiende, el diseño funciona', 68, 420, {
      size: 22, weight: 500, family: MONO, color: '#8b8b84',
    });
    ctx.restore();
    // puntos del compás
    for (let i = 0; i < 8; i++) {
      const bp = prog(t, 1.8 + i * 0.12, 0.3, ease.outBack);
      ctx.save();
      ctx.globalAlpha = 0.25 * bp;
      ctx.fillStyle = i % 4 === 0 ? C.lime : '#4a4a52';
      ctx.beginPath();
      ctx.arc(68 + i * 26, 470, i % 4 === 0 ? 4 : 2.5, 0, TAU);
      ctx.fill();
      ctx.restore();
    }
  } else {
    // DISEÑO + TIEMPO = MENSAJE
    const u = t - 4;
    const items = [
      { txt: 'DISEÑO', at: 0.0, color: C.paper, size: 76, weight: 600 },
      { txt: '+', at: 0.5, color: '#6f6f68', size: 64, weight: 400 },
      { txt: 'TIEMPO', at: 1.0, color: C.blue, size: 76, weight: 600 },
      { txt: '=', at: 1.5, color: '#6f6f68', size: 64, weight: 400 },
      { txt: 'MENSAJE', at: 2.0, color: C.lime, size: 76, weight: 800 },
    ];
    const y = 330;
    const gap = 22;
    // 1) medir todo antes de dibujar (así el bloque se autoajusta sin desbordar)
    const widths = items.map(it => measure(it.txt, it.size, it.weight, DISPLAY, -3));
    const raw = widths.reduce((a, b) => a + b, 0) + gap * (items.length - 1);
    const fit = Math.min(1, (W - 128) / raw);
    let x = (W - raw * fit) / 2;
    items.forEach((it, i) => {
      const p = prog(u, it.at, 0.45, i === 4 ? ease.outBack : ease.outExpo);
      const a = clamp(p * 1.6);
      if (a > 0) {
        ctx.save();
        ctx.globalAlpha = a;
        ctx.translate(x, y + (1 - clamp(p)) * 30);
        ctx.scale(fit, fit);
        text(it.txt, 0, 0, { size: it.size, weight: it.weight, color: it.color, spacing: -3 });
        ctx.restore();
      }
      x += (widths[i] + gap) * fit;
    });

    // barra de subrayado que sigue el pulso
    const bp = prog(u, 2.4, 0.8, ease.outExpo);
    rule(64, 64 + 700 * bp, 372, 1, C.lime, 4);

    wordsReveal('una frase clara, con ritmo propio, es toda la pieza', 66, 440, u, 2.6, {
      size: 24, weight: 500, color: '#b9b9b0',
    });
  }

  text('03 / TIPOGRAFÍA CINÉTICA', 64, H - 40, {
    size: 13, weight: 600, family: MONO, color: '#6f6f68', spacing: 1.5,
  });
}

// ── Escena 4 · pipeline ─────────────────────────────────────────────────────
const STEPS = [
  ['01', 'BRIEF'],
  ['02', 'GUION'],
  ['03', 'RITMO'],
  ['04', 'SISTEMA'],
  ['05', 'ANIMATIC'],
  ['06', 'PRODUCCIÓN'],
  ['07', 'QC'],
];

function drawPipeline(t) {
  const stepDur = 1.0;              // 2 pulsos por paso
  const boxW = 148, boxH = 96, gap = 14;
  const totalW = STEPS.length * boxW + (STEPS.length - 1) * gap;
  const x0 = (W - totalW) / 2;
  const y0 = 300;

  // Título
  const tp = prog(t, 0, 0.5, ease.outExpo);
  ctx.save();
  ctx.globalAlpha = tp;
  text('PIPELINE DE PRODUCCIÓN', 64, 196, { size: 15, weight: 700, family: MONO, color: C.lime, spacing: 3 });
  text('siete pasos, un entregable por paso', 64, 240, { size: 34, weight: 600 });
  ctx.restore();

  STEPS.forEach((s, i) => {
    const start = 0.25 + i * stepDur;
    const p = prog(t, start, 0.5, ease.outExpo);
    const active = t >= start;
    const x = x0 + i * (boxW + gap);
    const lift = (1 - p) * 26;

    if (!active) return;

    ctx.save();
    ctx.globalAlpha = clamp(p * 1.5);
    ctx.translate(0, lift);

    // caja
    ctx.fillStyle = i === STEPS.length - 1 ? 'rgba(199,249,74,0.10)' : 'rgba(242,239,230,0.045)';
    ctx.strokeStyle = i === STEPS.length - 1 ? 'rgba(199,249,74,0.55)' : 'rgba(242,239,230,0.16)';
    ctx.lineWidth = 1;
    roundRect(x, y0, boxW, boxH, 8);
    ctx.fill();
    ctx.stroke();

    // número + etiqueta
    text(s[0], x + 16, y0 + 32, { size: 13, weight: 700, family: MONO, color: C.lime, spacing: 1 });
    text(s[1], x + 16, y0 + 66, { size: 17, weight: 700, color: C.paper, spacing: -0.2 });

    // barra de progreso interna (muestra el tiempo asignado)
    const ip = prog(t, start, 0.6, ease.outCubic);
    ctx.fillStyle = 'rgba(242,239,230,0.10)';
    ctx.fillRect(x + 16, y0 + boxH - 20, boxW - 32, 3);
    ctx.fillStyle = C.lime;
    ctx.fillRect(x + 16, y0 + boxH - 20, (boxW - 32) * ip, 3);

    ctx.restore();

    // conector
    if (i < STEPS.length - 1) {
      const cp = prog(t, start + 0.5, 0.35, ease.outCubic);
      ctx.save();
      ctx.globalAlpha = cp * 0.8;
      ctx.fillStyle = '#3a3a40';
      ctx.fillRect(x + boxW + 2, y0 + boxH / 2, Math.max(0, (gap - 4) * cp), 1);
      ctx.restore();
    }
  });

  // entregables finales
  const fp = prog(t, 0.25 + STEPS.length * stepDur, 0.6, ease.outExpo);
  if (fp > 0) {
    ctx.save();
    ctx.globalAlpha = fp;
    text('ENTREGABLES', 64, 480, { size: 13, weight: 700, family: MONO, color: C.lime, spacing: 3 });
    const outs = ['MASTER ProRes', 'MP4 H.264', 'versión muda', 'alpha (si aplica)', 'poster + SRT'];
    let ox = 64;
    outs.forEach((o, i) => {
      const w = measure(o, 15, 600, MONO) + 28;
      const p = prog(t, 0.25 + STEPS.length * stepDur + 0.08 * i, 0.4, ease.outBack);
      ctx.save();
      ctx.globalAlpha = fp * clamp(p * 1.4);
      ctx.strokeStyle = 'rgba(242,239,230,0.2)';
      ctx.beginPath();
      roundRect(ox, 498, w, 32, 16);
      ctx.stroke();
      text(o, ox + 14, 520, { size: 15, weight: 600, family: MONO, color: '#cfcfc6' });
      ctx.restore();
      ox += w + 10;
    });
    // nota de audio
    ctx.globalAlpha = fp * 0.85;
    text('−14 LUFS web · −23 LUFS broadcast · true peak ≤ −1 dBTP', 64, 588, {
      size: 15, weight: 500, family: MONO, color: '#8b8b84',
    });
    ctx.restore();
  }

  text('04 / SISTEMA', 64, H - 40, {
    size: 13, weight: 600, family: MONO, color: '#6f6f68', spacing: 1.5,
  });
}

// ── Escena 5 · sting de cierre ──────────────────────────────────────────────
function drawSting(t) {
  const outP = prog(t, 3.1, 0.55, ease.inOutCubic);   // wipe de salida
  const impact = prog(t, 0, 0.45, ease.outExpo);

  // flash de impacto
  if (t < 0.25) {
    ctx.fillStyle = `rgba(199,249,74,${0.16 * (1 - t / 0.25)})`;
    ctx.fillRect(0, 0, W, H);
  }

  ctx.save();
  ctx.translate(0, -40 * outP);
  ctx.globalAlpha = 1 - outP;

  const word = 'ARENAABYS';
  // letras que convergen desde el centro
  const total = measure(word, 96, 800, DISPLAY, 2);
  let cx = W / 2 - total / 2;
  ctx.save();
  font(96, 800, DISPLAY, 2);
  [...word].forEach((ch, i) => {
    const p = prog(t, 0.05 + i * 0.035, 0.5, ease.outExpo);
    const dir = i < word.length / 2 ? -1 : 1;
    const dx = (1 - p) * 90 * dir;
    const a = clamp(p * 1.5);
    ctx.globalAlpha = a * (1 - outP);
    ctx.fillStyle = C.paper;
    ctx.fillText(ch, cx + dx, 348);
    cx += ctx.measureText(ch).width;
  });
  ctx.restore();

  // regla que se abre
  const rp = prog(t, 0.5, 0.7, ease.inOutCubic);
  rule(W / 2 - 260 * rp, W / 2 + 260 * rp, 396, 1, C.lime, 3);

  // tagline
  const tp = prog(t, 0.85, 0.55, ease.outExpo);
  ctx.save();
  ctx.globalAlpha = tp * (1 - outP);
  text('MOTION SKILLS HUB', W / 2, 442, {
    size: 15, weight: 700, family: MONO, color: C.lime, align: 'center', spacing: 5,
  });
  text('39 skills activas · 4 documentos · 1 memoria', W / 2, 478, {
    size: 15, weight: 500, family: MONO, color: '#8b8b84', align: 'center', spacing: 1,
  });
  ctx.restore();

  // punto de loop
  const lp = prog(t, 2.2, 0.5, ease.outBack);
  if (lp > 0) {
    ctx.save();
    ctx.globalAlpha = lp * (1 - outP) * 0.8;
    ctx.beginPath();
    ctx.arc(W / 2, 540, 5 + 3 * Math.sin(t * 6), 0, TAU);
    ctx.fillStyle = C.lime;
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();

  // wipe de salida
  if (outP > 0) {
    ctx.save();
    ctx.fillStyle = C.ink;
    ctx.fillRect(0, H * outP, W, H);
    ctx.fillStyle = C.lime;
    ctx.fillRect(0, H * outP, W, 2);
    ctx.restore();
  }

  text('05 / CIERRE', 64, H - 40, {
    size: 13, weight: 600, family: MONO, color: '#6f6f68', spacing: 1.5,
  });
}

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// ─── Guías de composición (tecla G) ─────────────────────────────────────────
function drawGuides() {
  ctx.save();
  ctx.strokeStyle = 'rgba(123,167,255,0.35)';
  ctx.fillStyle = 'rgba(123,167,255,0.9)';
  ctx.lineWidth = 1;
  const m = 0.05;
  ctx.strokeRect(W * m, H * m, W * (1 - m * 2), H * (1 - m * 2));
  text('SAFE 5%', W * m + 8, H * m + 20, { size: 11, weight: 600, family: MONO, color: 'rgba(123,167,255,.9)' });

  // columnas
  const cols = 12, colW = (W * (1 - m * 2)) / cols, gutter = 16;
  for (let i = 0; i < cols; i++) {
    ctx.strokeStyle = 'rgba(199,249,74,0.18)';
    ctx.strokeRect(W * m + i * colW + gutter / 2, H * m, colW - gutter, H * (1 - m * 2));
  }
  // tercios
  ctx.strokeStyle = 'rgba(255,92,57,0.4)';
  ctx.beginPath();
  ctx.moveTo(W / 3, 0); ctx.lineTo(W / 3, H);
  ctx.moveTo((W / 3) * 2, 0); ctx.lineTo((W / 3) * 2, H);
  ctx.moveTo(0, H / 3); ctx.lineTo(W, H / 3);
  ctx.moveTo(0, (H / 3) * 2); ctx.lineTo(W, (H / 3) * 2);
  ctx.stroke();
  ctx.restore();
}

// ─── Render de un frame ─────────────────────────────────────────────────────
function render(t) {
  beginFrame();
  drawBackground(t);

  const scene = SCENES.find(s => t >= s.in && t < s.out) || SCENES[SCENES.length - 1];
  const local = t - scene.in;
  const drawers = { hook: drawHook, title: drawTitle, statement: drawStatement, pipeline: drawPipeline, sting: drawSting };
  drawers[scene.id](local);

  // barra de progreso inferior dentro del lienzo (útil al exportar)
  ctx.fillStyle = 'rgba(242,239,230,0.10)';
  ctx.fillRect(0, H - 4, W, 2);
  ctx.fillStyle = C.lime;
  ctx.fillRect(0, H - 4, (t / DUR) * W, 2);

  if (state.guides) drawGuides();
}

// ════════════════════════════════════════════════════════════════════════════
//  AUDIO · score sintetizado, agendado contra el mismo reloj que la imagen
// ════════════════════════════════════════════════════════════════════════════
const audio = {
  ctx: null,
  master: null,
  anchor: 0,          // ctxTime correspondiente a t=0
  events: [],
  ptr: 0,
  noise: null,
};

function initAudio() {
  if (audio.ctx) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  const ac = new AC();
  const master = ac.createGain();
  master.gain.value = 0.75;
  const comp = ac.createDynamicsCompressor();
  comp.threshold.value = -14;
  comp.knee.value = 12;
  comp.ratio.value = 3;
  comp.attack.value = 0.004;
  comp.release.value = 0.18;
  master.connect(comp).connect(ac.destination);

  // buffer de ruido reutilizable (hats, whooshes, risers)
  const len = ac.sampleRate * 2;
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;

  audio.ctx = ac;
  audio.master = master;
  audio.noise = buf;
  audio.events = buildScore();
}

/** Genera la lista de eventos del score a partir de la misma rejilla temporal. */
function buildScore() {
  const ev = [];
  const at = (t, kind, extra = {}) => ev.push({ t, kind, ...extra });

  // kick en cada pulso, hat en contratiempos, bass cada 2 pulsos
  const totalBeats = Math.round(DUR / BEAT);
  for (let b = 0; b < totalBeats; b++) {
    const t = b * BEAT;
    at(t, 'kick', { gain: b % 4 === 0 ? 1 : 0.72 });
    at(t + BEAT / 2, 'hat', { gain: 0.32 + 0.1 * (b % 2) });
    if (b % 2 === 0) at(t, 'bass', { gain: 0.5, step: (b / 2) % 4 });
    if (b % 8 === 0) at(t, 'chord', { gain: 0.30, step: (b / 8) % 4 });
  }

  // impactos en los cortes de escena
  [0, 2, 8, 16, 24].forEach(t => { at(t, 'impact', { gain: t === 24 ? 1 : 0.8 }); });

  // risers antes de cada corte
  [1.2, 7.4, 15.3, 23.2].forEach(t => at(t, 'riser', { gain: 0.34, dur: 0.8 }));

  // ticks del pipeline (uno por paso)
  STEPS.forEach((_, i) => at(16 + 0.25 + i * 1.0, 'tick', { gain: 0.3 }));
  at(16 + 0.25 + STEPS.length * 1.0, 'pop', { gain: 0.4 });

  // hook: un pop por palabra
  HOOK_WORDS.forEach((_, i) => at(i * BEAT, 'pop', { gain: 0.42 }));

  // whoosh de salida en el sting
  at(27.1, 'whoosh', { gain: 0.35 });
  at(27.35, 'impact', { gain: 0.5 });

  return ev.sort((a, b) => a.t - b.t);
}

const CHORDS = [
  [110.00, 164.81, 220.00, 261.63], // Am
  [87.31, 130.81, 174.61, 220.00],  // F
  [130.81, 196.00, 261.63, 329.63], // C
  [98.00, 146.83, 196.00, 246.94],  // G
];
const BASS_STEPS = [55, 55, 43.65, 65.41];

function playEvent(e, when) {
  const ac = audio.ctx;
  const out = audio.master;
  const g = ac.createGain();

  if (e.kind === 'kick') {
    const o = ac.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(160, when);
    o.frequency.exponentialRampToValueAtTime(44, when + 0.13);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(0.95 * e.gain, when + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.30);
    o.connect(g).connect(out);
    o.start(when); o.stop(when + 0.32);
  }

  if (e.kind === 'hat') {
    const s = ac.createBufferSource();
    s.buffer = audio.noise;
    s.playbackRate.value = 1.7;
    const hp = ac.createBiquadFilter();
    hp.type = 'highpass'; hp.frequency.value = 7800;
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(0.12 * e.gain, when + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.06);
    s.connect(hp).connect(g).connect(out);
    s.start(when); s.stop(when + 0.08);
  }

  if (e.kind === 'bass') {
    const f = BASS_STEPS[(e.step ?? 0) % BASS_STEPS.length];
    const o = ac.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(f, when);
    const lp = ac.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(420, when);
    lp.frequency.exponentialRampToValueAtTime(140, when + 0.28);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(0.28 * e.gain, when + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.34);
    o.connect(lp).connect(g).connect(out);
    o.start(when); o.stop(when + 0.36);
  }

  if (e.kind === 'chord') {
    const notes = CHORDS[(e.step ?? 0) % CHORDS.length];
    notes.forEach((f, i) => {
      const o = ac.createOscillator();
      o.type = i === 0 ? 'triangle' : 'sine';
      o.frequency.value = f;
      const cg = ac.createGain();
      cg.gain.setValueAtTime(0.0001, when);
      cg.gain.exponentialRampToValueAtTime(0.05 * e.gain, when + 0.35);
      cg.gain.exponentialRampToValueAtTime(0.0001, when + BAR * 1.9);
      o.connect(cg).connect(out);
      o.start(when); o.stop(when + BAR * 2);
    });
  }

  if (e.kind === 'impact') {
    const o = ac.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(120, when);
    o.frequency.exponentialRampToValueAtTime(30, when + 0.5);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(0.7 * e.gain, when + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.9);
    o.connect(g).connect(out);
    o.start(when); o.stop(when + 1.0);

    // aire del impacto
    const s = ac.createBufferSource();
    s.buffer = audio.noise;
    const bp = ac.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = 1800; bp.Q.value = 0.9;
    const ng = ac.createGain();
    ng.gain.setValueAtTime(0.25 * e.gain, when);
    ng.gain.exponentialRampToValueAtTime(0.0001, when + 0.35);
    s.connect(bp).connect(ng).connect(out);
    s.start(when); s.stop(when + 0.4);
  }

  if (e.kind === 'riser') {
    const s = ac.createBufferSource();
    s.buffer = audio.noise;
    s.loop = true;
    const bp = ac.createBiquadFilter();
    bp.type = 'bandpass'; bp.Q.value = 3.5;
    bp.frequency.setValueAtTime(320, when);
    bp.frequency.exponentialRampToValueAtTime(7200, when + (e.dur ?? 0.8));
    g.gain.setValueAtTime(0.0001, when);
    g.gain.linearRampToValueAtTime(0.16 * e.gain, when + (e.dur ?? 0.8) * 0.9);
    g.gain.exponentialRampToValueAtTime(0.0001, when + (e.dur ?? 0.8) + 0.12);
    s.connect(bp).connect(g).connect(out);
    s.start(when); s.stop(when + (e.dur ?? 0.8) + 0.2);
  }

  if (e.kind === 'tick' || e.kind === 'pop') {
    const o = ac.createOscillator();
    o.type = 'square';
    const base = e.kind === 'tick' ? 2100 : 880;
    o.frequency.setValueAtTime(base, when);
    o.frequency.exponentialRampToValueAtTime(base * 0.6, when + 0.05);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(0.10 * e.gain, when + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.09);
    o.connect(g).connect(out);
    o.start(when); o.stop(when + 0.1);
  }

  if (e.kind === 'whoosh') {
    const s = ac.createBufferSource();
    s.buffer = audio.noise;
    const bp = ac.createBiquadFilter();
    bp.type = 'bandpass'; bp.Q.value = 1.2;
    bp.frequency.setValueAtTime(5200, when);
    bp.frequency.exponentialRampToValueAtTime(600, when + 0.45);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.linearRampToValueAtTime(0.2 * e.gain, when + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.5);
    s.connect(bp).connect(g).connect(out);
    s.start(when); s.stop(when + 0.55);
  }
}

/** Lookahead de 150 ms: agenda solo lo que viene, nunca todo el tema. */
function scheduleAudio() {
  if (!audio.ctx || !state.audioOn || !state.playing) return;
  const now = audio.ctx.currentTime;
  const lookahead = 0.15;
  const horizon = now - audio.anchor + lookahead;
  while (audio.ptr < audio.events.length && audio.events[audio.ptr].t <= horizon) {
    const e = audio.events[audio.ptr];
    const when = audio.anchor + e.t;
    if (when > now - 0.05) playEvent(e, Math.max(when, now + 0.005));
    audio.ptr++;
  }
}

// ─── Reloj ──────────────────────────────────────────────────────────────────
function clockTime() {
  if (audio.ctx && state.playing) return audio.ctx.currentTime - audio.anchor;
  return state.t;
}

function seek(t) {
  state.t = ((t % DUR) + DUR) % DUR;
  if (audio.ctx) {
    audio.anchor = audio.ctx.currentTime - state.t;
    // recolocar el puntero del score
    audio.ptr = audio.events.findIndex(e => e.t >= state.t);
    if (audio.ptr < 0) audio.ptr = audio.events.length;
  }
  render(state.t);
  updateChrome();
}

async function play() {
  initAudio();
  if (audio.ctx && audio.ctx.state !== 'running') {
    try { await audio.ctx.resume(); } catch (_) {}
  }
  if (audio.ctx) {
    audio.anchor = audio.ctx.currentTime - state.t;
    audio.ptr = audio.events.findIndex(e => e.t >= state.t);
    if (audio.ptr < 0) audio.ptr = audio.events.length;
  }
  state.playing = true;
  setStatus('reproduciendo');
  syncButtons();
}

async function pause() {
  if (audio.ctx) state.t = Math.min(DUR, audio.ctx.currentTime - audio.anchor);
  state.playing = false;
  if (audio.ctx && audio.ctx.state === 'running') {
    try { await audio.ctx.suspend(); } catch (_) {}
  }
  setStatus('pausa');
  syncButtons();
}

function toggle() { state.playing ? pause() : play(); }

// ─── Bucle principal ────────────────────────────────────────────────────────
let last = performance.now();
let frames = 0, fpsAcc = 0;

function loop(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;

  if (state.playing && !audio.ctx) state.t += dt;   // reloj de respaldo sin WebAudio

  if (state.playing) {
    let t = clockTime();
    if (t >= DUR) {
      if (state.loop) {
        state.t = 0;
        if (audio.ctx) {
          audio.anchor = audio.ctx.currentTime;
          audio.ptr = 0;
        }
      } else {
        state.t = DUR;
        pause();
      }
    } else {
      state.t = t;
    }
    scheduleAudio();
  }

  render(state.t);
  updateChrome();

  // medidor de fps
  frames++; fpsAcc += dt;
  if (fpsAcc >= 0.5) {
    state.fps = Math.round(frames / fpsAcc);
    frames = 0; fpsAcc = 0;
    document.getElementById('fps').textContent = `${state.fps} fps`;
  }

  requestAnimationFrame(loop);
}

// ─── UI ─────────────────────────────────────────────────────────────────────
const el = {
  play: document.getElementById('play'),
  mute: document.getElementById('mute'),
  grid: document.getElementById('grid'),
  loop: document.getElementById('loop'),
  timeline: document.getElementById('timeline'),
  fill: document.getElementById('fill'),
  head: document.getElementById('head'),
  tc: document.getElementById('tc'),
  beat: document.getElementById('beat'),
  status: document.getElementById('status'),
  track: document.getElementById('track'),
};

function setStatus(s) { el.status.textContent = s; }

function syncButtons() {
  el.play.textContent = state.playing ? '❚❚ Pausa' : '▶ Reproducir';
  el.mute.textContent = state.audioOn ? '♪ Audio on' : '♪ Mudo';
  el.mute.setAttribute('aria-pressed', String(!state.audioOn));
  el.grid.setAttribute('aria-pressed', String(state.guides));
  el.loop.setAttribute('aria-pressed', String(state.loop));
}

function timecode(t) {
  const f = Math.floor((t % 1) * FPS);
  const s = Math.floor(t) % 60;
  const m = Math.floor(t / 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
}

function updateChrome() {
  const p = clamp(state.t / DUR);
  el.fill.style.width = `${p * 100}%`;
  el.head.style.left = `${p * 100}%`;
  el.tc.textContent = timecode(state.t);
  const b = Math.floor(state.t / BEAT);
  el.beat.textContent = `beat ${b + 1} · ${(b % 4) + 1}/4`;
}

el.play.addEventListener('click', toggle);
el.mute.addEventListener('click', () => {
  state.audioOn = !state.audioOn;
  if (audio.master) audio.master.gain.value = state.audioOn ? 0.75 : 0.0;
  syncButtons();
});
el.grid.addEventListener('click', () => { state.guides = !state.guides; syncButtons(); });
el.loop.addEventListener('click', () => { state.loop = !state.loop; syncButtons(); });

el.timeline.addEventListener('click', (ev) => {
  const r = el.track.getBoundingClientRect();
  seek(((ev.clientX - r.left) / r.width) * DUR);
});

window.addEventListener('keydown', (ev) => {
  if (ev.code === 'Space') { ev.preventDefault(); toggle(); }
  if (ev.key === 'ArrowRight') seek(state.t + 1);
  if (ev.key === 'ArrowLeft') seek(state.t - 1);
  if (ev.key.toLowerCase() === 'm') el.mute.click();
  if (ev.key.toLowerCase() === 'g') el.grid.click();
  if (ev.key.toLowerCase() === 'l') el.loop.click();
  if (ev.key === 'Home') seek(0);
});

// marcas de escena en el timeline
SCENES.forEach(s => {
  const m = document.createElement('div');
  m.className = 'mark';
  m.style.left = `${(s.in / DUR) * 100}%`;
  el.track.appendChild(m);
});

// ─── Arranque ───────────────────────────────────────────────────────────────
// Parámetros de URL para exportar stills y hojas de contacto:
//   index.html?t=12.5&still=1   → pinta un único frame (útil con chrome --screenshot)
const params = new URLSearchParams(globalThis.location?.search ?? '');
const stillT = params.has('t') ? parseFloat(params.get('t')) : null;
const stillMode = params.get('still') === '1';

syncButtons();
if (stillT !== null) {
  state.t = clamp(stillT, 0, DUR);
  document.querySelector('footer')?.style.setProperty('display', stillMode ? 'none' : '');
  document.querySelector('header')?.style.setProperty('display', stillMode ? 'none' : '');
  render(state.t);
  updateChrome();
} else {
  render(0);
}
if (!stillMode) requestAnimationFrame(loop);

// API mínima para exportar frames desde consola o chrome headless:
//   __reel.render(12.5)  → pinta el frame del segundo 12.5
//   __reel.seek(12.5)
window.__reel = { render: (t) => { state.t = t; render(t); }, seek, play, pause, get t() { return state.t; }, DUR, FPS };
