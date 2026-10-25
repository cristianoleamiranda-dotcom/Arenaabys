# Demo · Reel de motion graphics (canvas + WebAudio)

Una pieza de 28 s dibujada **frame a frame** en canvas 2D, con banda sonora sintetizada en
WebAudio. Sin dependencias, sin fuentes externas, sin assets: se abre y funciona.

```bash
python3 scripts/serve.py 8080      # desde la raíz del repo
# → http://localhost:8080/demo/
# → http://localhost:8080/            hub con el reel embebido
```

`scripts/serve.py` solo aporta tipos MIME correctos (`.md`, `.mjs`, `.jsonl`) y `no-store`;
el reel funciona igual con cualquier servidor estático.

| Tecla | Acción |
|---|---|
| `espacio` | play / pausa |
| `←` `→` | −1 s / +1 s |
| `m` | mute |
| `g` | guías de composición (safe area 5%, 12 columnas, tercios) |
| `l` | loop |
| `Home` | ir al inicio |

## Qué demuestra (y dónde está el criterio)

| Técnica | En el código | Documento |
|---|---|---|
| Frame = función pura de `t` | `render(t)` | `docs/03` §Fase 3 |
| Timing derivado del BPM | `BEAT = 60/BPM` | `docs/02` §1 |
| Tipografía cinética con stagger | `textStagger()`, `wordsReveal()` | skill `kinetic-typography` |
| Entrada por máscara con barrido | `maskReveal()` | skill `animation-principles` |
| Overshoot controlado (≤6%) | `ease.outBack` | skill `motion-graphics-es` |
| Score sincronizado al frame | `buildScore()` + `scheduleAudio()` (lookahead 150 ms) | skill `audio-post-motion` |
| Beat como variable de diseño | `beatPhase` en `drawBackground()` | `docs/02` §1 |
| Jerarquía y grid | escala 96/64/40/24 y márgenes de 56 px | skill `shot-composition` |
| Privacidad de la marca | paleta de 4 colores en `C` | skill `color-motion` |
| Determinismo (export repetible) | `rand()` con PRNG por semilla | `docs/03` §Fase 3 |

## Estructura

```
demo/
├── index.html   # player, timeline, HUD, controles
├── reel.js      # motor: easings, escenas, score, reloj, UI
└── README.md
```

`reel.js` está dividido en secciones: configuración → utilidades → estado → canvas → tipografía →
fondo → escenas (`drawHook`, `drawTitle`, `drawStatement`, `drawPipeline`, `drawSting`) → audio →
reloj → UI → arranque.

## Exportar stills y hojas de contacto

```bash
# un frame suelto, sin chrome de la UI
google-chrome --headless --screenshot=frame-12s.png --window-size=1280,720 \
  "http://localhost:8080/demo/?t=12&still=1"
```

Parámetros: `?t=<segundos>` fija el frame; `&still=1` oculta header, footer y el bucle de
animación. Para una hoja de contacto, repite con distintos `t` y une con ImageMagick:

```bash
montage frame-*.png -tile 4x -geometry +6+6 contact-sheet.png
```

## Exportar a MP4

El navegador no trae encoder, así que el camino profesional es **frame a frame**:

```js
// en la consola del navegador
for (let f = 0; f < 28 * 30; f++) { __reel.render(f / 30); /* capturar canvas */ }
```

O con `puppeteer` (si está disponible):

```js
const page = await browser.newPage();
await page.goto('http://localhost:8080/demo/?still=1');
for (let f = 0; f < 840; f++) {
  await page.evaluate(t => window.__reel.render(t), f / 30);
  await page.locator('canvas').screenshot({ path: `frames/${String(f).padStart(5, '0')}.png` });
}
```

Y luego:

```bash
ffmpeg -framerate 30 -i frames/%05d.png -c:v libx264 -pix_fmt yuv420p -crf 18 reel.mp4
```

> El audio del MP4 se exporta por separado (una sesión de WebAudio no se puede “grabar” de forma
> determinista). Opciones: renderizar el score con un motor offline (`OfflineAudioContext`) o
> reconstruirlo en ffmpeg/otro DAW con la misma rejilla de BPM.

## Verificación automática

```bash
node scripts/smoke-reel.mjs
# → 841 frames, 5 escenas, sin errores de runtime
```

Cualquier cambio en `reel.js` debe pasar ese test antes de commitear.
