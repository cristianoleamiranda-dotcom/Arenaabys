# AGENTS.md — protocolo de trabajo del agente

Este repositorio es un **hub de producción audiovisual**. Cualquier agente (Claude Code, Codex,
Cursor, Copilot, Gemini CLI…) que trabaje aquí sigue estas cinco reglas.

## 0 · Contexto en 10 segundos

- Pieza de motion graphics → activa `motion-graphics-es`.
- Audio, música, SFX, mezcla → activa `audio-post-motion`.
- Cada formato tiene su skill especialista (tabla de ruteo abajo).
- Todo el criterio está en `docs/`; todo lo ejecutable está en `.claude/skills/` y `demo/`.
- La memoria del proyecto está en `memory/memory.jsonl` (no la dupliques en el chat).

## 1 · Recuerda antes de actuar

```bash
export MEMORY_FILE="$PWD/memory/memory.jsonl"
source .claude/skills/memory/scripts/memory.sh
memory_search '{"q":"motion graphics","limit":10}'
```

Busca por temas reales: `perfil`, `preferencia`, `audioloudness`, `BPM`, `herramientas`,
`entregables`, `decision`. Si no hay memoria del tema, continúa y **propón** guardar lo nuevo.

Guarda solo cuando el usuario lo pida o cuando sea un dato estable y reutilizable:

```bash
memory_write '{"type":"knowledge","content":"…","tags":["…"]}'
```

Tipos usados aquí: `profile`, `preference`, `decision`, `knowledge`, `state`.

## 2 · Activa la skill correcta (ruteo)

| La tarea es… | Skill |
|---|---|
| Cualquier pieza de motion graphics (visión general, brief, entregables) | `motion-graphics-es` |
| Ritmo, cortes, sincronía musical, mezcla, loudness, SFX | `audio-post-motion` + `beat-sync-editing` |
| Animación que “se siente mal” (stiff, robótica, flotante) | `animation-principles` |
| Tipografía animada, títulos, lyric video | `kinetic-typography`, `kinetic-reel` |
| Logo, intro, stinger, splash | `logo-animation` |
| After Effects (expresiones, rigging, export, performance) | `after-effects` |
| Video en React / render por CLI / data-driven | `remotion-video`, `remotion-video-templates` |
| Gráficas, barras, contadores, infografía animada | `chart-animation`, `animated-infographic` |
| Explainer educativo completo | `explainer-video`, `diagram-animation`, `whiteboard-animation`, `isometric-animation` |
| Matemática / física / algoritmos | `manim` |
| Reel vertical, hook, captions, countdown | `short-form-video`, `caption-animation`, `countdown-video` |
| Overlay transparente (OBS, Premiere, Resolve) | `lower-thirds` |
| B-roll sobre talking head | `talking-head-b-roll`, `hyperframes-video-beats` |
| Editar material rodado (silencios, errores, storytelling) | `cut-silences` → `cut-mistakes` → `video-storytelling` / `short-form-edit` |
| Mundo visual persistente en video largo | `video-storytelling` |
| Criterio de dirección de arte / “no parezca IA” | `motion-art-direction`, `motionmaxxing` |
| Fondos animados, gradientes, shaders | `motion-background`, `color-motion` |
| Composición, grid, safe areas, cámara | `shot-composition` |
| Animación web (GSAP, timelines) | `gsap`, `kinetic-typography` |
| Un reel de principio a fin con criterio senior | `motionmaxxing` + `kinetic-reel` |

Si dos skills pueden aplicar, **gana la más específica**; la general solo aporta criterio.

## 3 · Produce con los valores por defecto del repo

No inventes timing. Usa el sistema declarado (está en `motion-graphics-es` y en
`docs/02-guia-edicion-audiovisual.md`):

```
entrada        ease-out expo, 0.35–0.6 s
salida         ease-in quad, 0.25–0.35 s
stagger        2–4 frames
overshoot      ≤ 6 %
tipografía     96 / 64 / 40 / 24 / 16 px en 1080p
ritmo          frames_por_pulso = (60 / BPM) * fps   (120 BPM @30 fps → 15)
loudness       −14 LUFS web · −23 LUFS broadcast · true peak ≤ −1 dBTP
```

Entrega siempre, como mínimo: **master ProRes + MP4 H.264 + versión muda + poster**.
Con voz: **`.srt`**. Overlays: **WebM alpha + ProRes 4444**.

## 4 · Verifica (no confíes en que “se ve bien”)

```bash
# 1) sintaxis del demo (sin navegador)
cp demo/reel.js /tmp/reel.mjs && node --check /tmp/reel.mjs

# 2) render headless de todos los frames con un canvas simulado
node scripts/smoke-reel.mjs

# 3) levantar la demo
python3 -m http.server 8080   # → /index.html y /demo/

# 4) audio: medir y normalizar (requiere ffmpeg)
skills/audio-post-motion/scripts/loudness.sh medir pieza.wav
```

Checklist de QC completo: `motion-graphics-es` §QC y `docs/02` §5.

## 5 · Convenciones del repo

- Idioma de trabajo y de los documentos: **español**. Código y nombres de archivo: ASCII, sin
  espacios, `kebab-case`.
- Skills propias → `skills/<nombre>/SKILL.md` + `references/`; se enlazan en `.claude/skills/`
  con un symlink relativo (`ln -s ../../skills/<nombre> .claude/skills/<nombre>`).
- Skills de terceros → solo vía `npx skills add <repo> -y --copy -a claude-code` (queda registrado
  en `skills-lock.json`). No edites su contenido salvo para corregir un frontmatter inválido, y
  anótalo en `CREDITS.md`.
- Nada de binarios pesados: si un skill trae fuentes/videos de documentación, recórtalos y deja
  la instrucción de reinstalación.
- Commits: `feat|docs|fix(skills|demo|memory): resumen en una línea`.
- Artefactos generados (MP4, PNG seq, node_modules) **no** entran al repo (ver `.gitignore`).

## 6 · Al terminar una sesión útil

1. Escribe (o actualiza) una entrada `state` en la memoria con lo producido y dónde quedó.
2. Si tomaste una decisión de arquitectura o de criterio, guárdala como `decision`.
3. Deja el repo verificable: `node --check`, smoke test y preview funcionando.
