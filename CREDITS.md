# Créditos y licencias

## Contenido propio — MIT

- `docs/` (los cuatro documentos)
- `skills/motion-graphics-es/`
- `skills/audio-post-motion/`
- `demo/` (motor del reel), `index.html`, `scripts/smoke-reel.mjs`
- `memory/` (memoria del proyecto)

Ver [`LICENSE`](LICENSE).

## Skills de terceros vendorizadas en `.claude/skills/`

Cada skill conserva la licencia de su repositorio de origen. Se instalaron con
`npx skills add <repo> -y --copy -a claude-code` y se registran en [`skills-lock.json`](skills-lock.json).

| Repo | Autor | Licencia | Skills |
|---|---|---|---|
| [iart-ai/motion-design-skills](https://github.com/iart-ai/motion-design-skills) | iart.ai | MIT | after-effects, animation-principles, beat-sync-editing, color-motion, logo-animation, motion-art-direction, motion-background, remotion-video, shot-composition |
| [iart-ai/kinetic-typography-skills](https://github.com/iart-ai/kinetic-typography-skills) | iart.ai | MIT | kinetic-typography |
| [iart-ai/explainer-video-skills](https://github.com/iart-ai/explainer-video-skills) | iart.ai | MIT | explainer-video, diagram-animation, isometric-animation, whiteboard-animation, wrapped-video |
| [iart-ai/data-animation-skills](https://github.com/iart-ai/data-animation-skills) | iart.ai | MIT | chart-animation, animated-infographic, presentation-video |
| [iart-ai/tiktok-video-skills](https://github.com/iart-ai/tiktok-video-skills) | iart.ai | MIT | short-form-video, caption-animation, countdown-video, lower-thirds |
| [iart-ai/lower-thirds-skills](https://github.com/iart-ai/lower-thirds-skills) | iart.ai | MIT | lower-thirds |
| [iart-ai/b-roll-skills](https://github.com/iart-ai/b-roll-skills) | iart.ai | MIT | talking-head-b-roll |
| [iart-ai/manim-skills](https://github.com/iart-ai/manim-skills) | iart.ai | MIT | manim |
| [nateherkai/herk-edit-kit](https://github.com/nateherkai/herk-edit-kit) | Nate Herk | MIT | cut-silences, cut-mistakes, edit-video, short-form-edit, video-storytelling, gsap, hyperframes-video-beats |
| [tuzhechen2005/opus-video-skills](https://github.com/tuzhechen2005/opus-video-skills) | tuzhechen2005 | ver LICENSE del repo | kinetic-reel, painted-animation |
| [Vincentwei1021/anything2explainer](https://github.com/Vincentwei1021/anything2explainer) | Vincentwei1021 | ver LICENSE del repo | anything2explainer |
| [Tejashmakwana/motionmaxxing](https://github.com/Tejashmakwana/motionmaxxing) | Tejashmakwana | Apache-2.0 | motionmaxxing |
| [wshuyi/remotion-video-skill](https://github.com/wshuyi/remotion-video-skill) | wshuyi | sin LICENSE declarada (uso educativo/personal) | remotion-video-templates |
| [zoubingwu/memory-skill](https://github.com/zoubingwu/memory-skill) | zoubingwu | sin LICENSE declarada | memory |

### Modificaciones realizadas

1. **`kinetic-reel`** — el frontmatter original tenía un `description:` multilínea inválido para
   YAML (dos puntos sin comillas). Se convirtió a bloque escalar (`|`) para que el cargador de
   skills lo acepte. Contenido del skill sin cambios.
2. **`remotion-video` (wshuyi)** — se renombró a `remotion-video-templates` porque colisionaba con
   `remotion-video` de iart-ai; se añadió una nota de uso al inicio del `SKILL.md`.
3. **Recortes de tamaño** (solo binarios de documentación, no de código):
   - `anything2explainer/template/public/fonts/NotoSansSC.ttf` (17 MB) eliminado.
   - `motionmaxxing/docs/media/*` (≈20 MB de mp4/gif de muestra) eliminado.
   - `painted-animation/docs/koi-gag.gif` y `kinetic-reel/docs/work-reel.gif` eliminados.
   Recuperables reinstalando el paquete; ver `docs/04-recursos-github.md` §E.

### Nota sobre `herk-edit-kit`

Su LICENSE es MIT, con una excepción explícita: los materiales de marca de *AI Automation Society*
(logo, guidelines, tokens CSS y contenido de algunos proyectos de ejemplo) siguen siendo propiedad
de AIS y no se licencian para reutilización. Esos archivos **no** se vendorizaron aquí.

## Fuentes de la investigación (documentación y enlaces)

- Domestika — <https://www.domestika.org/es/blog/4241-motion-graphics-que-es-y-para-que-sirve>
- Trazos — <https://trazos.net/motion-graphics-desde-cero/>
- The Core School — <https://www.thecoreschool.com/blog/motion-graphics/>
- Maxon — <https://www.maxon.net/es/solutions/motion-graphics>
- Antídoto 56 — <https://www.antidoto56.com/blog/15-tipos-de-videos-animados-motion-graphics-que-haran-despegar-los-contenidos-de-tu-marca>
- HeyGen — <https://www.heygen.com/es-ar/tool/ai-motion-graphics>
- YouTube — <https://www.youtube.com/watch?v=XbGzd7ks7LA>

Las marcas, productos y nombres comerciales citados pertenecen a sus respectivos dueños; se
mencionan con fines descriptivos y educativos.
