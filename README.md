# Arenaabys — HeyGen & HeyGen Dev Ecosystem (Repositorios + 39 Agent Skills)

Este repositorio consolida el ecosistema oficial de **HeyGen** y **HeyGen Dev** (`github.com/heygen-com`, anteriormente `HeyGen-Official`), incluyendo sus **12 repositorios principales de desarrollo** clonados en [`repos/`](./repos/) y las **39 Agent Skills oficiales y comunitarias** instaladas y listas para usar en [`skills/`](./skills/), [`.claude/skills/`](./.claude/skills/) y [`.agents/skills/`](./.agents/skills/).

---

## Estructura del Proyecto

```text
Arenaabys/
├── README.md                     # Documentación general e índice de repositorios y skills
├── CLAUDE.md / AGENTS.md         # Guía de arquitectura y contrato de ejecución para agentes IA
├── INSTALL.md                    # Guía de instalación manual de HeyGen Skills
├── INSTALL_FOR_AGENTS.md         # Guía de instalación paso a paso para agentes de código
├── .mcp.json / mcp.json          # Configuración oficial del servidor MCP de HeyGen
├── skills/                       # 39 Skills unificadas (HeyGen v3, HyperFrames, LiveAvatar, v1)
├── .claude/skills/               # Enlaces simbólicos para Claude Code / OpenClaw
├── .agents/skills/               # Enlaces simbólicos para Codex / Cursor / Arena Agent
└── repos/                        # 12 Repositorios oficiales de HeyGen clonados desde heygen-com
    ├── heygen-skills/                          # heygen-com/skills
    ├── heygen-cli/                             # heygen-com/heygen-cli
    ├── hyperframes/                            # heygen-com/hyperframes
    ├── hyperframes-community-skills/           # heygen-com/hyperframes-community-skills
    ├── liveavatar-agent-skills/                # heygen-com/liveavatar-agent-skills
    ├── liveavatar-web-sdk/                     # heygen-com/liveavatar-web-sdk
    ├── liveavatar-sales-agent/                 # heygen-com/liveavatar-sales-agent
    ├── liveavatar-starter-livekit-agent-python/# heygen-com/liveavatar-starter-livekit-agent-python
    ├── liveavatar-gpt-live-demos/              # heygen-com/liveavatar-gpt-live-demos
    ├── openclaw-plugin-heygen/                 # heygen-com/openclaw-plugin-heygen
    ├── n8n-integration-heygen-node/            # heygen-com/n8n-integration-heygen-node
    └── heygen-skills-legacy/                   # heygen-com/skills-legacy
```

---

## 1. Repositorios Oficiales de HeyGen & HeyGen Dev (`repos/`)

| Directorio Local | Repositorio GitHub | Descripción |
| :--- | :--- | :--- |
| [`repos/heygen-skills`](./repos/heygen-skills/) | [`heygen-com/skills`](https://github.com/heygen-com/skills) | **HeyGen AI Agent Skills (v3)** — Creación de avatares (`heygen-avatar`), producción de video mediante el pipeline v3 Video Agent (`heygen-video`) y traducción/doblaje (`heygen-translate`). |
| [`repos/heygen-cli`](./repos/heygen-cli/) | [`heygen-com/heygen-cli`](https://github.com/heygen-com/heygen-cli) | **HeyGen CLI Oficial** (`developers.heygen.com/cli`) — CLI escrita en Go para generar videos con IA desde la terminal y agentes de código. |
| [`repos/hyperframes`](./repos/hyperframes/) | [`heygen-com/hyperframes`](https://github.com/heygen-com/hyperframes) | **HyperFrames** (*"Write HTML. Render video. Built for agents."*) — Framework open-source de HeyGen para convertir HTML, CSS y animaciones GSAP/WebGL en videos MP4 deterministas (`packages/cli`, `core`, `engine`, `producer`, `studio`, `sdk`, `player`). |
| [`repos/hyperframes-community-skills`](./repos/hyperframes-community-skills/) | [`heygen-com/hyperframes-community-skills`](https://github.com/heygen-com/hyperframes-community-skills) | **HyperFrames Community Skills** — Colección de skills especializadas para composición 3D de subtítulos, explainers estilo Vox, animaciones p5.js y más. |
| [`repos/liveavatar-agent-skills`](./repos/liveavatar-agent-skills/) | [`heygen-com/liveavatar-agent-skills`](https://github.com/heygen-com/liveavatar-agent-skills) | **LiveAvatar Agent Skills** — Skills oficiales para integrar avatares conversacionales en tiempo real con LiveAvatar. |
| [`repos/liveavatar-web-sdk`](./repos/liveavatar-web-sdk/) | [`heygen-com/liveavatar-web-sdk`](https://github.com/heygen-com/liveavatar-web-sdk) | **LiveAvatar Web SDK (`@heygen/liveavatar-web-sdk`)** — SDK oficial en TypeScript/JavaScript y demo web para sesiones interactivas de streaming con LiveAvatar. |
| [`repos/liveavatar-sales-agent`](./repos/liveavatar-sales-agent/) | [`heygen-com/liveavatar-sales-agent`](https://github.com/heygen-com/liveavatar-sales-agent) | **LiveAvatar Sales Agent** — Agente de ventas interactivo open-source construido con LiveAvatar. |
| [`repos/liveavatar-starter-livekit-agent-python`](./repos/liveavatar-starter-livekit-agent-python/) | [`heygen-com/liveavatar-starter-livekit-agent-python`](https://github.com/heygen-com/liveavatar-starter-livekit-agent-python) | **LiveAvatar + LiveKit Python Starter** — Plantilla oficial para construir agentes de voz y video en Python con LiveKit y LiveAvatar. |
| [`repos/liveavatar-gpt-live-demos`](./repos/liveavatar-gpt-live-demos/) | [`heygen-com/liveavatar-gpt-live-demos`](https://github.com/heygen-com/liveavatar-gpt-live-demos) | **LiveAvatar × GPT-Live × HyperFrames Demos** — Demos interactivas (tutor de idiomas, soporte, poker coach) combinando LiveAvatar en tiempo real con gráficos HyperFrames. |
| [`repos/openclaw-plugin-heygen`](./repos/openclaw-plugin-heygen/) | [`heygen-com/openclaw-plugin-heygen`](https://github.com/heygen-com/openclaw-plugin-heygen) | **OpenClaw Plugin HeyGen** — Plugin proveedor oficial de HeyGen Video Agent v3 para la herramienta `video_generate` de OpenClaw. |
| [`repos/n8n-integration-heygen-node`](./repos/n8n-integration-heygen-node/) | [`heygen-com/n8n-integration-heygen-node`](https://github.com/heygen-com/n8n-integration-heygen-node) | **n8n HeyGen Node (`@heygenofficial/n8n-nodes-heygen-official`)** — Nodo oficial de integración de HeyGen para flujos de automatización en n8n. |
| [`repos/heygen-skills-legacy`](./repos/heygen-skills-legacy/) | [`heygen-com/skills-legacy`](https://github.com/heygen-com/skills-legacy) | **HeyGen Skills (v1 Legacy)** — Colección original de 11 skills modulares para endpoints individuales de HeyGen API, generación B-roll, FFmpeg y yt-dlp. |

---

## 2. Catálogo Completo de las 39 Skills Instaladas (`skills/`)

Todas las skills están instaladas en [`skills/`](./skills/) y enlazadas automáticamente en [`.claude/skills/`](./.claude/skills/), [`.agents/skills/`](./.agents/skills/) y `~/.claude/skills/`.

### A. HeyGen v3 Core Skills (`heygen-com/skills`)
| Skill | Ruta | Función Principal |
| :--- | :--- | :--- |
| **`heygen-avatar`** | [`skills/heygen-avatar/SKILL.md`](./skills/heygen-avatar/SKILL.md) | Diseña y crea avatares (Avatar V por prompt o digital twin por foto), selecciona voz y guarda perfiles `AVATAR-<NAME>.md`. |
| **`heygen-video`** | [`skills/heygen-video/SKILL.md`](./skills/heygen-video/SKILL.md) | Pipeline de producción de 7 etapas con Video Agent v3: descubrimiento de avatar, guion por escenas, estilo visual, Frame Check y renderizado. |
| **`heygen-translate`** | [`skills/heygen-translate/SKILL.md`](./skills/heygen-translate/SKILL.md) | Traducción y doblaje de videos con sincronización labial (lip-sync) y flujo de revisión (`proofreads`). |

### B. HyperFrames Core & Motion Production Skills (`heygen-com/hyperframes`)
| Skill | Ruta | Función Principal |
| :--- | :--- | :--- |
| **`hyperframes`** | [`skills/hyperframes/SKILL.md`](./skills/hyperframes/SKILL.md) | Skill principal para crear composiciones de video HTML/CSS/GSAP deterministas y renderizarlas a MP4 con HyperFrames. |
| **`hyperframes-cli`** | [`skills/hyperframes-cli/SKILL.md`](./skills/hyperframes-cli/SKILL.md) | Uso de la CLI de HyperFrames (`init`, `preview`, `render`, `lint`, `doctor`, `blocks`). |
| **`hyperframes-registry`** | [`skills/hyperframes-registry/SKILL.md`](./skills/hyperframes-registry/SKILL.md) | Exploración e inserción de bloques y componentes prediseñados del catálogo de HyperFrames. |
| **`media-use`** | [`skills/media-use/SKILL.md`](./skills/media-use/SKILL.md) | Generación y procesamiento de activos multimedia (TTS, avatares, imágenes, video B-roll, audio, FFmpeg). |
| **`remotion-to-hyperframes`** | [`skills/remotion-to-hyperframes/SKILL.md`](./skills/remotion-to-hyperframes/SKILL.md) | Migración automática de composiciones de Remotion (React) a HyperFrames (HTML/GSAP). |
| **`figma`** | [`skills/figma/SKILL.md`](./skills/figma/SKILL.md) | Conversión de diseños de Figma en composiciones animadas de HyperFrames. |
| **`slideshow`** | [`skills/slideshow/SKILL.md`](./skills/slideshow/SKILL.md) | Creación de presentaciones y slideshows animados en video. |
| **`captions-overlay`** | [`skills/captions-overlay/SKILL.md`](./skills/captions-overlay/SKILL.md) | Superposición de subtítulos animados sincronizados palabra por palabra. |
| **`changelog-video`** | [`skills/changelog-video/SKILL.md`](./skills/changelog-video/SKILL.md) | Producción automatizada de videos de lanzamiento y changelogs de producto. |
| **`cut-the-curve`** | [`skills/cut-the-curve/SKILL.md`](./skills/cut-the-curve/SKILL.md) | Diseño avanzado de curvas de animación y easings en GSAP. |
| **`motion-doctrine`** | [`skills/motion-doctrine/SKILL.md`](./skills/motion-doctrine/SKILL.md) | Doctrina de motion design, ritmo visual y validación de transiciones (`seam-gate`). |
| **`oversized-cursor`** | [`skills/oversized-cursor/SKILL.md`](./skills/oversized-cursor/SKILL.md) | Animaciones de cursor sobredimensionado para demos de UI y recorridos de producto. |
| **`seam-craft`** | [`skills/seam-craft/SKILL.md`](./skills/seam-craft/SKILL.md) | Diseño de transiciones fluidas (cortes, match-cuts, wipes) entre escenas. |

### C. HyperFrames Community Skills (`heygen-com/hyperframes-community-skills`)
| Skill | Ruta | Función Principal |
| :--- | :--- | :--- |
| **`camera-3d-captions`** | [`skills/camera-3d-captions/SKILL.md`](./skills/camera-3d-captions/SKILL.md) | Subtítulos en espacio 3D alrededor de un presentador (talking head) con cámara dinámica y palabras hero detrás del orador. |
| **`day-in-my-life`** | [`skills/day-in-my-life/SKILL.md`](./skills/day-in-my-life/SKILL.md) | Película animada estilo tinta dibujada a mano basada en el historial de sesiones del agente con banda sonora generada. |
| **`duo`** | [`skills/duo/SKILL.md`](./skills/duo/SKILL.md) | Composición de dos pantallas HTML dentro de un teléfono plegable para comparativas lado a lado. |
| **`p5-paint-animation`** | [`skills/p5-paint-animation/SKILL.md`](./skills/p5-paint-animation/SKILL.md) | Animaciones deterministas en p5.js de escritura a mano, trazos de pintura y cuadros vivos. |
| **`prod-by-claude`** | [`skills/prod-by-claude/SKILL.md`](./skills/prod-by-claude/SKILL.md) | Video musical 1080×1080 con live-coding en Strudel donde cada token de código se ilumina al sonar su nota. |
| **`session-story`** | [`skills/session-story/SKILL.md`](./skills/session-story/SKILL.md) | Anima una sesión de trabajo entre usuario y agente con música compuesta procedimentalmente. |
| **`vox-explainer`** | [`skills/vox-explainer/SKILL.md`](./skills/vox-explainer/SKILL.md) | Videos explicativos de 60–90 segundos estilo collage/Vox a partir de un tema, documento o enlace. |
| **`x-posting-license`** | [`skills/x-posting-license/SKILL.md`](./skills/x-posting-license/SKILL.md) | Renderiza un video animado de 10s de una credencial/licencia para cualquier perfil de X. |

### D. LiveAvatar Real-Time Agent Skills (`heygen-com/liveavatar-agent-skills`)
| Skill | Ruta | Función Principal |
| :--- | :--- | :--- |
| **`liveavatar-demo`** | [`skills/liveavatar-demo/SKILL.md`](./skills/liveavatar-demo/SKILL.md) | Despliega y configura demos listas para usar de LiveAvatar (Sales Agent, LiveKit Agent, GPT-Live × HyperFrames). |
| **`liveavatar-integrate`** | [`skills/liveavatar-integrate/SKILL.md`](./skills/liveavatar-integrate/SKILL.md) | Guía paso a paso para integrar LiveAvatar en un proyecto existente (modos Embed, FULL o LITE). |
| **`liveavatar-debug`** | [`skills/liveavatar-debug/SKILL.md`](./skills/liveavatar-debug/SKILL.md) | Diagnóstico basado en síntomas para problemas de audio, WebRTC/LiveKit, autenticación y sesiones de LiveAvatar. |
| **`liveavatar-feedback`** | [`skills/liveavatar-feedback/SKILL.md`](./skills/liveavatar-feedback/SKILL.md) | Recolección estructurada de feedback sobre la integración con LiveAvatar. |

### E. HeyGen v1 API & Media Skills (`heygen-com/skills-legacy`)
| Skill | Ruta | Función Principal |
| :--- | :--- | :--- |
| **`heygen`** | [`skills/heygen/SKILL.md`](./skills/heygen/SKILL.md) | Referencia general de endpoints de HeyGen API (avatares, voces, plantillas, webhooks, gestión de activos). |
| **`create-video`** | [`skills/create-video/SKILL.md`](./skills/create-video/SKILL.md) | Creación directa de videos mediante prompts con Video Agent API. |
| **`avatar-video`** | [`skills/avatar-video/SKILL.md`](./skills/avatar-video/SKILL.md) | Control detallado de escenas, fondos, dimensiones y avatares mediante `v2/video/generate`. |
| **`text-to-speech`** | [`skills/text-to-speech/SKILL.md`](./skills/text-to-speech/SKILL.md) | Generación independiente de voz (TTS), diseño de voces y clonación con Starfish. |
| **`video-translate`** | [`skills/video-translate/SKILL.md`](./skills/video-translate/SKILL.md) | Traducción directa de videos por API (modo rápido y modo calidad). |
| **`ai-video-gen`** | [`skills/ai-video-gen/SKILL.md`](./skills/ai-video-gen/SKILL.md) | Generación de clips de video B-roll con IA (VEO, Kling, Sora, Runway, Seedance). |
| **`faceswap`** | [`skills/faceswap/SKILL.md`](./skills/faceswap/SKILL.md) | Intercambio de rostros (face swap) en fotos y videos. |
| **`visual-style`** | [`skills/visual-style/SKILL.md`](./skills/visual-style/SKILL.md) | Sistemas de diseño visual portátiles (paletas, tipografía, iluminación) para producciones de video. |
| **`video-download`** | [`skills/video-download/SKILL.md`](./skills/video-download/SKILL.md) | Descarga y extracción de video/audio desde URLs con `yt-dlp`. |
| **`video-edit`** | [`skills/video-edit/SKILL.md`](./skills/video-edit/SKILL.md) | Edición local de video con `ffmpeg` (cortes, concatenación, subtítulos, mezcla de audio, cromas). |
| **`video-understand`** | [`skills/video-understand/SKILL.md`](./skills/video-understand/SKILL.md) | Análisis local de video mediante extracción de fotogramas (`ffmpeg`) y transcripción (`Whisper`). |

---

## 3. Configuración Rápida y Uso

### Opción 1: Servidor MCP Oficial de HeyGen (Sin API Key manual)
El archivo [`.mcp.json`](./.mcp.json) en la raíz ya apunta al servidor remoto oficial de HeyGen:
- **URL MCP:** `https://mcp.heygen.com/mcp/v1/`
- Utiliza OAuth con tu cuenta de HeyGen y consume créditos de tu plan.

### Opción 2: API Key + HeyGen CLI
1. Obtén tu API key en [app.heygen.com/api](https://app.heygen.com/api) (*Settings → API → New Key*).
2. Exporta la variable de entorno:
   ```bash
   export HEYGEN_API_KEY="hg_tu_api_key_aqui"
   ```
3. Instala el binario de la CLI oficial (o compílalo desde `repos/heygen-cli`):
   ```bash
   curl -fsSL https://static.heygen.ai/cli/install.sh | bash
   ```

### Opción 3: Uso de HyperFrames
Desde [`repos/hyperframes`](./repos/hyperframes/) o mediante `npx`:
```bash
npx hyperframes init mi-video
npx hyperframes preview
npx hyperframes render
```
