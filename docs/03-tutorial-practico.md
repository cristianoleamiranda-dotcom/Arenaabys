# 03 · Tutorial práctico: de la idea al MP4

> Un recorrido completo y ejecutable. Al final tienes tres ejercicios: uno de 8 s (stinger),
> uno de 15 s (kinetic typography) y uno de 30 s (explainer con datos).
> Todos se pueden hacer con After Effects/Blender **o** con código (Remotion / canvas / GSAP),
> que es lo que este repo permite automatizar.

## Fase 0 · Brief en una página (10 min)

Rellena esto antes de tocar software. Si no puedes, el proyecto no está listo.

```
MENSAJE      : ________________________________________  (una frase, ≤ 12 palabras)
PUBLICO      : ________________________________________
FORMATO      : 16:9 / 9:16 / 1:1 / 4:5     DURACIÓN: ___ s
PLATAFORMA   : YouTube / Reels / Web / Presentación / Broadcast
TONO         : (3 adjetivos) ____________________________
BPM / MÚSICA : ___ BPM  |  referencia: __________________
PALETA       : 4 colores (hex) __________________________
TIPOGRAFÍA   : display _______ / texto _______ / dato _______
CTA / CIERRE : ________________________________________
ENTREGABLES  : MP4 H.264 + (¿alpha? ¿MOGRT? ¿loop? ¿subtítulos?)
REFERENCIAS  : 3 links
```

## Fase 1 · Guion gráfico y animatic (30–60 min)

1. Escribe **una línea de texto por beat** (máx. 8 beats para 15 s).
2. Boceta en papel 6 cuadros por beat: entrada, estado, salida.
3. Convierte los beats a una **tabla de tiempo** (esto es el EDL de diseño):

| # | Escena | In | Out | Contenido | Movimiento | SFX |
|---|---|---|---|---|---|---|
| 1 | Hook | 0,00 | 1,00 | “¿Y si…?” | split-text stagger | riser + impact |
| 2 | Idea | 1,00 | 4,00 | definición | mask reveal | whoosh suave |
| 3 | Datos | 4,00 | 9,00 | 3 métricas | count-up + barras | clicks en cada valor |
| 4 | Cierre | 9,00 | 12,00 | claim | scale + hold | impact + cola |

4. **Animatic**: pon los cuadros en la línea de tiempo con la música. Si el ritmo no funciona en
   cutre, no va a funcionar en bonito.

## Fase 2 · Sistema visual (1–2 h)

Define una vez y reutiliza:

- **Grid**: 12 columnas, márgenes 5–8%.
- **Escala tipográfica**: 96 / 64 / 40 / 24 px (ratio ~1.5). Un solo display, un solo cuerpo.
- **Paleta**: fondo (neutro oscuro o claro), 1 color de acento, 1 color de soporte, 1 de alerta.
  Comprueba contraste ≥ 4.5:1 para texto pequeño.
- **Lenguaje de movimiento** (esto es lo que hace que todo parezca del mismo autor):
  - Entrada: `ease-out expo`, 0.35–0.6 s
  - Salida: `ease-in quad`, 0.25–0.35 s
  - Stagger: 3 frames entre elementos
  - Overshoot máximo: 6% de la escala
  - Nada de rotaciones decorativas sin motivo.

En código (equivalente a los presets de AE):

```js
// easings base — mismos valores que usarías en el Graph Editor
const easeOutExpo = t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeInQuad  = t => t * t;
const easeInOutCubic = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
const overshoot = (t, s = 1.70158) => 1 + (s+1)*Math.pow(t-1,3) + s*Math.pow(t-1,2);
```

## Fase 3 · Producción

### Ruta A · After Effects

1. Composición a la resolución final y fps final (no reescales al exportar).
2. Crea un **precomp de sistema**: fondo, tipografía, elementos con expresiones reutilizables.
3. Expresiones útiles:
   ```javascript
   // loop de rotación
   time * 45
   // wiggle suave
   wiggle(1.5, 25)
   // overshoot de entrada sobre escala
   s = effect("Slider Control")("Slider");
   easeOut = 1 - Math.pow(2, -10 * clamp((time - inPoint) / 0.4, 0, 1));
   100 + (s - 100) * easeOut
   // contador numérico
   Math.round(effect("Slider Control")("Slider"))
   ```
4. Audio: importa la música, marca beats con Layer ▸ Markers ▸ Add Marker en cada downbeat.
5. Exporta master ProRes y luego H.264 (ver tabla de códecs en `02-guia-edicion-audiovisual.md`).

### Ruta B · Código (recomendada para piezas repetibles y data-driven)

Tres motores, según el caso:

| Motor | Cuándo | Skill en este repo |
|---|---|---|
| **Remotion** (React) | Video con datos, plantillas por registro, render por CLI | `remotion-video`, `remotion-video-templates` |
| **Canvas 2D / WebGL + Chrome headless** | Control total frame-a-frame, sin dependencias | `kinetic-reel`, `motionmaxxing`, `lower-thirds` |
| **Manim** | Matemática, física, algoritmos | `manim` |
| **GSAP / CSS / Lottie** | Motion para web y UI | `gsap`, `kinetic-typography`, `motion-background` |

Esqueleto de un renderer determinista (el patrón que usan todos los skills de video):

```js
// un frame es una función pura de t
function renderFrame(t, ctx, W, H) {
  ctx.clearRect(0, 0, W, H);
  // escena activa según t
  const scene = scenes.find(s => t >= s.in && t < s.out);
  scene.draw(t - scene.in, ctx, W, H);
}

// reloj de render (no de pantalla)
const FPS = 30, DUR = 12;
for (let f = 0; f < FPS * DUR; f++) {
  renderFrame(f / FPS, ctx, W, H);
  saveFrame(f);           // PNG seq o stream a ffmpeg
}
```

Y el render real, sin dependencias raras:

```bash
# PNG seq → MP4 (lo más robusto)
ffmpeg -framerate 30 -i frames/%05d.png -c:v libx264 -pix_fmt yuv420p -crf 18 out.mp4
# con audio
ffmpeg -framerate 30 -i frames/%05d.png -i music.wav -c:v libx264 -crf 20 \
  -c:a aac -b:a 192k -shortest final.mp4
```

## Fase 4 · Sonido

1. Elige música con licencia (o sintetízala; ver `audio-post-motion`).
2. Coloca la voz primero, sin música.
3. Añade SFX en cada beat visual: whoosh en transiciones, pop en apariciones, impact en cortes.
4. Aplica ducking de música bajo la voz (receta en `02-guia-edicion-audiovisual.md`).
5. Normaliza a −14 LUFS (web) y verifica true peak ≤ −1 dBTP.

## Fase 5 · QC y entrega

Usa el checklist de la sección 5 del documento 02. Añade además:

- **Versión muda** (por si la plataforma autoplaya sin sonido).
- **Subtítulos** quemados o `.srt` si hay voz (el 80% ve en silencio).
- **Miniatura / poster frame** exportado aparte.

---

# Los tres ejercicios

## Ejercicio 1 · Stinger de 8 s (nivel básico)

**Objetivo:** logo reveal con impacto sincronizado.

1. Elige 120 BPM → cada pulso son 15 frames a 30 fps.
2. Escena 1 (0–1 s): fondo negro, un destello sigue la diagonal.
3. Escena 2 (1–2 s): el logo entra con `easeOutExpo` y overshoot 6%, el sonido de impacto cae
   exactamente al frame 30.
4. Escena 3 (2–3 s): hold con el logo quieto (sí, quieto: es lo que lo hace ver caro).
5. Escena 4 (3–4 s): salida con `easeInQuad` + wipe diagonal.
6. SFX: riser de 1 s (0–1 s), impact (1,0 s), whoosh (3,0 s).
7. **Entrega:** MP4 H.264 + WebM con alpha para usarlo como transición en OBS.

**Criterio de éxito:** en mute se reconoce la marca y el golpe visual coincide con el auditivo.

## Ejercicio 2 · Kinetic typography de 15 s (nivel intermedio)

**Objetivo:** una frase del documento 01 animada con intención, sin imágenes.

1. Toma la frase: *“Motion graphics = diseño gráfico con la variable tiempo añadida.”*
2. Divide por palabras clave: `DISEÑO` `+` `TIEMPO` `=` `MENSAJE`.
3. Asigna un gesto a cada palabra:
   - `DISEÑO` → mask reveal de izquierda a derecha
   - `+` → pop con overshoot
   - `TIEMPO` → entra letra por letra con stagger de 2 frames
   - `=` → línea que se dibuja (stroke-dashoffset)
   - `MENSAJE` → scale down desde 130% con `easeOutExpo`
4. Rejilla de 128 BPM: cada palabra cae en un pulso (14 frames).
5. Añade un kick suave en cada aparición y un hat en los contratiempos.
6. **Entrega:** 16:9 y 9:16 (reencuadre, no rediseño), MP4 + `.srt` si hay voz.

**Criterio de éxito:** leyendo solo los primeros 0,4 s de cada palabra ya se entiende la frase.

## Ejercicio 3 · Explainer de datos de 30 s (nivel avanzado)

**Objetivo:** explicar un dato con motion graphics, sin stock footage.

1. Elige un dataset pequeño (3–5 filas). Por ejemplo: tiempo medio de atención por plataforma,
   o tus propias métricas de proyecto.
2. Estructura: pregunta (0–4 s) → contexto (4–10 s) → dato clave (10–20 s) → remate (20–30 s).
3. Anima: count-up de números (con `easeOutExpo`, duración fija, nunca más de 1,2 s), barras que
   crecen desde la línea base, y una anotación que aparece 2 frames antes del número.
4. Reglas de honestidad visual: eje desde cero en barras, misma escala entre comparaciones, y
   muestra la fuente en pantalla.
5. **Entrega:** MP4 16:9 + versión 9:16 + CSV de datos junto al video (trazabilidad).

**Criterio de éxito:** alguien que ve el video en mute puede repetir el dato con su cifra exacta.

---

## Plantilla de arranque en este repo

```bash
# demo interactiva (canvas + WebAudio, sin dependencias)
python3 -m http.server 8080 --directory demo
# → http://localhost:8080

# skills disponibles para el agente
ls .claude/skills
cat AGENTS.md
```
