# CLAUDE.md

Este repositorio se rige por **[`AGENTS.md`](./AGENTS.md)**. Léelo antes de trabajar.

Resumen ejecutivo para Claude Code / Codex / Cursor:

1. **Recuerda**: `source .claude/skills/memory/scripts/memory.sh` con
   `MEMORY_FILE=$PWD/memory/memory.jsonl`, y `memory_search '{"q":"…"}'`.
2. **Activa**: las 39 skills de `.claude/skills/` se descubren solas; para piezas de motion
   graphics usa `motion-graphics-es` y para audio `audio-post-motion`.
3. **Produce** con los valores por defecto (`AGENTS.md` §3) y entrega master + MP4 + versión muda.
4. **Verifica** con `scripts/smoke-reel.mjs` y el checklist de QC.
5. **Registra** en `memory/memory.jsonl` cuando el usuario lo pida.

Documentos de criterio en [`docs/`](./docs) · demo ejecutable en [`demo/`](./demo) ·
servidor de desarrollo con MIME correcto en [`scripts/serve.py`](./scripts/serve.py).
