# Arenaabys · Motion Skills Hub

Hub de producción de **motion graphics y edición audiovisual** para agentes de IA.
Aquí no hay teoría suelta: hay **skills instaladas**, **documentos de oficio** y una
**memoria** que persiste entre sesiones.

> Todo en español. Cada pieza de este repo existe para que un agente (o una persona)
> pueda pasar de una idea a un MP4 entregable sin improvisar el criterio.

---

## Qué hay aquí

| | Contenido | Dónde |
|---|---|---|
| 🧠 | **39 skills activas** (37 de terceros + 2 propias) con activación automática | [`.claude/skills/`](.claude/skills) · [skills/](skills) |
| 📚 | **4 documentos**: teoría, edición audiovisual, tutorial con ejercicios, catálogo de GitHub | [`docs/`](docs) |
| 🎬 | **Reel interactivo** en canvas + WebAudio (sin dependencias, sin assets) | [`demo/`](demo) · [index.html](index.html) |
| 📖 | **Visor de docs** (markdown → HTML, sin dependencias) con índice y buscador de secciones | [`viewer.html`](viewer.html) |
| ◎ | **Memoria de largo plazo** en JSONL + protocolo de recuerdos | [`memory/`](memory) |
| ⌘ | **Protocolo del agente**: cómo buscar, activar y recordar | [`AGENTS.md`](AGENTS.md) |

## Arranque rápido

```bash
# servidor de desarrollo (sin dependencias, .md con su MIME correcto)
python3 scripts/serve.py 8080
# → http://localhost:8080             hub con el reel embebido
# → http://localhost:8080/demo/       reel a pantalla completa
# → http://localhost:8080/viewer.html lector de docs con índice

# ver las skills instaladas
npx skills list
ls .claude/skills

# verificar antes de commitear
node scripts/smoke-reel.mjs    # 841 frames del reel sin errores
node scripts/check-docs.mjs    # renderizado y enlaces de los 15 documentos

# buscar en la memoria
export MEMORY_FILE="$PWD/memory/memory.jsonl"
source .claude/skills/memory/scripts/memory.sh
memory_search '{"q":"motion graphics"}'
```

Dentro del reel: `espacio` play/pausa · `←/→` ±1 s · `m` mute · `g` guías de composición ·
`l` loop. Con `?t=12.5&still=1` se pinta un frame suelto (hojas de contacto y export).

## Las dos skills propias

### [`motion-graphics-es`](skills/motion-graphics-es/SKILL.md)
Pipeline completo en 7 pasos (brief → guion → ritmo → sistema → animatic → producción → QC),
valores por defecto de timing y easing, escala tipográfica, lenguaje de movimiento, antipatrones,
árbol de decisión de herramienta y matriz de entregables.

### [`audio-post-motion`](skills/audio-post-motion/SKILL.md)
Objetivos de loudness por plataforma (−14 LUFS web · −23 LUFS broadcast), cadena de mezcla con
ffmpeg (ducking, loudnorm, ebur128), detección de BPM, alineación de SFX al frame, licencias de
música y síntesis de score sincronizado en WebAudio.

## Las skills de terceros (vendorizadas)

| Origen | Qué aporta | Skills |
|---|---|---|
| [iart-ai](https://github.com/iart-ai/motion-design-skills) · MIT | Fundamentos, motores y formato | `animation-principles`, `color-motion`, `shot-composition`, `motion-art-direction`, `after-effects`, `beat-sync-editing`, `remotion-video`, `logo-animation`, `motion-background`, `kinetic-typography`, `explainer-video`, `diagram-animation`, `isometric-animation`, `whiteboard-animation`, `wrapped-video`, `chart-animation`, `animated-infographic`, `presentation-video`, `short-form-video`, `caption-animation`, `countdown-video`, `lower-thirds`, `talking-head-b-roll`, `manim` |
| [nateherkai/herk-edit-kit](https://github.com/nateherkai/herk-edit-kit) · MIT | Edición de video con agentes | `cut-silences`, `cut-mistakes`, `edit-video`, `short-form-edit`, `video-storytelling`, `gsap`, `hyperframes-video-beats` |
| [tuzhechen2005/opus-video-skills](https://github.com/tuzhechen2005/opus-video-skills) | Reels y pintura animada | `kinetic-reel`, `painted-animation` |
| [Vincentwei1021/anything2explainer](https://github.com/Vincentwei1021/anything2explainer) | Tema → explainer completo | `anything2explainer` |
| [Tejashmakwana/motionmaxxing](https://github.com/Tejashmakwana/motionmaxxing) · Apache-2.0 | Dirección de arte anti-“IA slop” | `motionmaxxing` |
| [wshuyi/remotion-video-skill](https://github.com/wshuyi/remotion-video-skill) | Plantillas de proyecto Remotion | `remotion-video-templates` |
| [zoubingwu/memory-skill](https://github.com/zoubingwu/memory-skill) | Memoria persistente | `memory` |

Metadatos, fuentes y hashes: [`skills-lock.json`](skills-lock.json) y [`CREDITS.md`](CREDITS.md).

> Las skills de terceros se copiaron con `npx skills add … --copy` para que queden versionadas.
> Los archivos pesados que no son texto (fuentes TTF de 17 MB, mp4/gif de documentación) se
> recortaron para mantener el repo liviano; se recuperan reinstalando el paquete.

## Documentos

1. [**Qué es el motion graphics**](docs/01-que-es-motion-graphics.md) — definición, diferencias
   con disciplinas vecinas, taxonomía de piezas, herramientas, glosario, pirámide de decisión.
2. [**Edición audiovisual aplicada**](docs/02-guia-edicion-audiovisual.md) — BPM a frames, tipos
   de corte, capas de sonido, loudness, códecs, safe areas, QC, nomenclatura.
3. [**Tutorial práctico**](docs/03-tutorial-practico.md) — de la idea al MP4, con tres ejercicios
   (stinger de 8 s, tipografía cinética de 15 s, explainer de datos de 30 s).
4. [**Recursos de GitHub**](docs/04-recursos-github.md) — skills, herramientas open source,
   librerías y assets con estrellas y licencias.

## Memoria

`memory/memory.jsonl` guarda perfil, preferencias, decisiones y conocimiento en líneas JSON
(append-only). El skill `memory` expone `memory_write` / `memory_search`; el protocolo está en
[`memory/README.md`](memory/README.md) y en [`AGENTS.md`](AGENTS.md).

## Licencia

El contenido propio (documentos, skills `motion-graphics-es` y `audio-post-motion`, demo) es
**MIT**. Las skills de terceros conservan su licencia original — ver [`CREDITS.md`](CREDITS.md).
