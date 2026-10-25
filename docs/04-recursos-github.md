# 04 · Recursos de GitHub: skills, motores, librerías y assets

> Catálogo curado con búsquedas reales en GitHub (octubre 2026), con estrellas aproximadas y
> licencia. Los paquetes marcados con ✅ están **instalados y activos** en este repositorio
> (`.claude/skills/`).

## A. Skills para agentes de IA (lo que “enseña” al agente a hacer motion)

### ✅ [iart-ai/motion-design-skills](https://github.com/iart-ai/motion-design-skills) — 1.0k ⭐ · MIT
**9 skills** de fundamentos y motores. Es el núcleo de este repo.
`animation-principles` · `color-motion` · `shot-composition` · `motion-art-direction` ·
`after-effects` · `beat-sync-editing` · `remotion-video` · `logo-animation` · `motion-background`

### ✅ Packs de formato de [iart-ai](https://github.com/iart-ai) — MIT
| Pack | Skills instalados |
|---|---|
| [kinetic-typography-skills](https://github.com/iart-ai/kinetic-typography-skills) | `kinetic-typography` |
| [explainer-video-skills](https://github.com/iart-ai/explainer-video-skills) | `explainer-video`, `diagram-animation`, `isometric-animation`, `whiteboard-animation`, `wrapped-video` |
| [data-animation-skills](https://github.com/iart-ai/data-animation-skills) | `chart-animation`, `animated-infographic`, `presentation-video` |
| [tiktok-video-skills](https://github.com/iart-ai/tiktok-video-skills) | `short-form-video`, `caption-animation`, `countdown-video`, `lower-thirds` |
| [lower-thirds-skills](https://github.com/iart-ai/lower-thirds-skills) | `lower-thirds` (WebM alpha / ProRes 4444) |
| [b-roll-skills](https://github.com/iart-ai/b-roll-skills) | `talking-head-b-roll` |
| [manim-skills](https://github.com/iart-ai/manim-skills) | `manim` |

Índice general con 19 packs y 56 skills: [iart-ai/motion-skills](https://github.com/iart-ai/motion-skills) (MIT).

### ✅ [nateherkai/herk-edit-kit](https://github.com/nateherkai/herk-edit-kit) — 2.2k ⭐ · MIT
Kit de **edición de video** para agentes: pipeline transcript-first + HyperFrames.
Instalados: `cut-silences` · `cut-mistakes` · `edit-video` · `short-form-edit` ·
`video-storytelling` · `gsap` · `hyperframes-video-beats`.
Trae además `MOTION_PHILOSOPHY.md`, *style library*, 406 tarjetas de motion y plantillas.—el repo
completo pesa ~450 MB, aquí solo se vendorizaron los skills de texto.

### ✅ [tuzhechen2005/opus-video-skills](https://github.com/tuzhechen2005/opus-video-skills) — 331 ⭐
`kinetic-reel` (reels kinéticos con three.js + ffmpeg) y `painted-animation` (p5.brush).
Nota: el frontmatter de `kinetic-reel` no era YAML válido; se corrigió aquí.

### ✅ [Vincentwei1021/anything2explainer](https://github.com/Vincentwei1021/anything2explainer) — 2.7k ⭐
Tema → video explicativo con voz, subtítulos y barra de capítulos, todo en Remotion.
Incluye plantilla compilable, librería de primitivas y protocolo multi-agente.

### ✅ [Tejashmakwana/motionmaxxing](https://github.com/Tejashmakwana/motionmaxxing) — 1.0k ⭐ · Apache-2.0
“Looksmaxxing para motion graphics”: criterio de dirección de arte para que una pieza no parezca
generada por IA. Trae `library/`, `taste/`, `studies/` y runtime WebGL.

### ✅ [wshuyi/remotion-video-skill](https://github.com/wshuyi/remotion-video-skill) — 430 ⭐
Skill de Remotion con **plantillas de proyecto** y scripts de render (instalado como
`remotion-video-templates` para no chocar con el `remotion-video` de iart).

### ✅ [zoubingwu/memory-skill](https://github.com/zoubingwu/memory-skill) — MIT
Memoria de largo plazo en JSONL (`memory_write` / `memory_search`). Base del directorio
[`memory/`](../memory/README.md) de este repo.

### Otros que vale la pena mirar
- [notivn/AIEV](https://github.com/notivn/AIEV) — 138 ⭐ · MIT — edición automática: HyperFrames (GSAP) + Remotion.
- [bangtutorial/bang-motion](https://github.com/bangtutorial/bang-motion) — 720 ⭐ — motion para navegador: openers, bumpers, explainers.
- [veedstudio/open-edit](https://github.com/veedstudio/open-edit) — 1.7k ⭐ · Apache-2.0 — pipeline de edición agent-driven.
- [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) — 78k ⭐ — directorio general de skills.
- [abubakarsiddik31/claude-skills-collection](https://github.com/abubakarsiddik31/claude-skills-collection) — 1.1k ⭐ — colección curada.

## B. Herramientas de escritorio open source

| Repo | ⭐ | Qué es |
|---|---|---|
| [GraphiteEditor/Graphite](https://github.com/GraphiteEditor/Graphite) | 27.7k | Editor 2D procedural node-based (diseño + motion en tiempo real), Rust/WASM |
| [storytold/effectcraft](https://github.com/storytold/effectcraft) | 7.9k | Motion graphics y compositing en Rust puro |
| [tixl3d/tixl](https://github.com/tixl3d/tixl) | 5.2k | Motion graphics en tiempo real (estilo TouchDesigner/VVVV) |
| [alyssaxuu/motionity](https://github.com/alyssaxuu/motionity) | 4.1k | Editor de motion graphics en el navegador |
| [JacquesLucke/animation_nodes](https://github.com/JacquesLucke/animation_nodes) | 2.4k | Visual scripting para motion en Blender |
| [astrofox-io/astrofox](https://github.com/astrofox-io/astrofox) | 2.0k | Convierte audio en visuales |
| [toadstorm/MOPS](https://github.com/toadstorm/MOPS) | 963 | Toolkit de motion graphics para Houdini |
| [kyletmartinez/after-effects-scripts](https://github.com/kyletmartinez/after-effects-scripts) | 288 | Scripts para AE |
| [docsforadobe/after-effects-scripting-guide](https://github.com/docsforadobe/after-effects-scripting-guide) | 183 | Guía oficial de scripting de AE (ExtendScript) |
| [BenZed/after-effects](https://github.com/BenZed/after-effects) | 163 | Controlar AE desde Node.js |

## C. Librerías de animación (web y código)

| Librería | Uso | Para qué en MG |
|---|---|---|
| [GSAP](https://gsap.com/) | timelines JS | El estándar web para secuencias complejas; `SplitText` para tipografía |
| [mo.js](https://github.com/mojs/mojs) (18.8k) | micro-interacciones | Pops, bursts, iconos animados |
| [Remotion](https://github.com/remotion-dev/remotion) | video en React | Render por CLI, data-driven, versionable en Git |
| [Manim Community](https://github.com/ManimCommunity/manim) | matemática | Ecuaciones, gráficas, 3Blue1Brown style |
| [three.js](https://github.com/mrdoob/three.js) | WebGL | Escenas 3D, shaders, partículas |
| [p5.js](https://github.com/processing/p5.js) | creative coding | Ilustración generativa, brush, hand-drawn |
| [Lottie / lottie-web](https://github.com/airbnb/lottie-web) | vectores AE → web | Exportar animaciones vectoriales ligeras |
| [Rive](https://rive.app/) | interactive motion | Motion de producto con estado |
| [Motion One / Framer Motion](https://motion.dev/) | UI | Transiciones de interfaz |
| [anime.js](https://github.com/juliangarnier/anime) | micro-librería | Alternativa ligera a GSAP |

## D. Assets y referencias (con licencia, para no meterse en líos)

| Recurso | Qué aporta | Licencia |
|---|---|---|
| [Google Fonts](https://fonts.google.com/) | Tipografía display y variable | OFL/Apache |
| [Fontshare](https://www.fontshare.com/) | Display contemporánea gratis | Uso libre (leer términos) |
| [Lucide](https://lucide.dev/) / [Tabler Icons](https://tabler.io/icons) | Íconos SVG | ISC / MIT |
| [Freesound](https://freesound.org/) | SFX y ambientes | CC0 / CC-BY (varía) |
| [Pexels](https://www.pexels.com/) / [Unsplash](https://unsplash.com/) | Foto y video | Pexels/Unsplash License |
| [Coverr](https://coverr.co/) | Video de stock | Uso libre |
| [Coolors](https://coolors.co/) | Paletas | — |
| [OKLCH Color Picker](https://oklch.com/) | Interpolación perceptual | — |
| [easings.net](https://easings.net/) | Curvas de easing con nombres | — |
| [Mobbin](https://mobbin.com/) / [Dribbble](https://dribbble.com/) | Referencia visual | Solo inspiración |
| [Rive Community](https://rive.app/community/) | Archivos animados | Varía por archivo |

> ⚠️ **Regla de oro legal:** música y SFX necesitan licencia explícita para uso comercial. Los
> recursos “gratis” de las plataformas de stock suelen prohibir el uso standalone o en plantillas
> revendidas. Guarda el comprobante de licencia junto al proyecto.

## E. Cómo instalar más skills en este repo

El CLI [`skills`](https://www.npmjs.com/package/skills) descubre, instala y versiona paquetes:

```bash
# listar sin instalar
npx skills add iart-ai/motion-design-skills -l

# instalar todas las skills de un pack, copiando archivos (commiteable)
npx skills add iart-ai/motion-design-skills -y --copy -a claude-code

# instalar una sola skill
npx skills add iart-ai/motion-design-skills -y --copy -a claude-code -s logo-animation

# ver las instaladas
npx skills list
```

El resultado queda en `.claude/skills/` (descubrible por Claude Code, Cursor, Codex y +40 agentes)
y en `skills-lock.json` (fuente + hash de cada skill, para reproducibilidad).

## F. Investigación original (fuentes en español)

- Domestika — <https://www.domestika.org/es/blog/4241-motion-graphics-que-es-y-para-que-sirve>
- Trazos — <https://trazos.net/motion-graphics-desde-cero/>
- The Core School — <https://www.thecoreschool.com/blog/motion-graphics/>
- Maxon — <https://www.maxon.net/es/solutions/motion-graphics>
- Antídoto 56 — <https://www.antidoto56.com/blog/15-tipos-de-videos-animados-motion-graphics-que-haran-despegar-los-contenidos-de-tu-marca>
- HeyGen — <https://www.heygen.com/es-ar/tool/ai-motion-graphics>
- YouTube (referencia visual) — <https://www.youtube.com/watch?v=XbGzd7ks7LA>
