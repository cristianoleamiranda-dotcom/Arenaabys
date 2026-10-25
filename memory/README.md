# Memoria del proyecto

Memoria de largo plazo del hub, en un solo archivo append-only: `memory.jsonl`.
Una línea = un recuerdo. Nada de estado efímero ni secretos.

```
memory/
├── memory.jsonl   # el almacén (JSON Lines, una entrada por línea)
└── README.md      # este documento
```

## Formato de una entrada

```json
{"ts":"2026-10-25T18:07:22+00:00","type":"decision","content":"…","tags":["repo","skills"],"meta":null}
```

| Campo | Descripción |
|---|---|
| `ts` | ISO-8601, lo pone el script |
| `type` | `profile` · `preference` · `decision` · `knowledge` · `state` |
| `content` | una idea completa, autosuficiente (se lee sin contexto) |
| `tags` | 1–5 etiquetas en minúsculas |
| `meta` | objeto libre (rutas, versiones, fuentes) o `null` |

## Uso

```bash
export MEMORY_FILE="$PWD/memory/memory.jsonl"
source .claude/skills/memory/scripts/memory.sh

# buscar (el campo es "q", no "query")
memory_search '{"q":"loudness","limit":10}'
memory_search '{"q":"decision","limit":5}'

# guardar
memory_write '{"type":"knowledge","content":"…","tags":["audio"]}'
```

`memory_search` busca subcadena literal en una ventana reciente y la amplía si hace falta.
Para leer todo: `cat memory/memory.jsonl | jq -c '{type,content}'`.

## Qué se guarda (y qué no)

**Sí**
- Perfil y preferencias estables del usuario (idioma, estilo de entrega, herramientas).
- Decisiones de arquitectura o de criterio, con su motivo.
- Conocimiento reutilizable (parámetros, estándares, recetas que funcionaron).
- Estado del proyecto al cerrar una sesión: qué se produjo y dónde quedó.

**No**
- Secretos, tokens, rutas con credenciales.
- Detalles de una sola conversación que no van a servir después.
- Razonamiento intermedio ni borradores.

## Entradas actuales

| tipo | tema |
|---|---|
| `profile` | idioma y dominio: español (Chile), motion graphics y audiovisual |
| `preference` | buscar en GitHub, activar skills y usar memoria antes de producir |
| `decision` | este repo como hub: 39 skills + 2 propias + docs + demo |
| `knowledge` | stack de herramientas (Remotion, canvas/WebGL, Manim, GSAP, AE, Blender, Resolve) y repos open source destacados |
| `knowledge` | parámetros por defecto de timing, easing y loudness |
| `state` | demo/reel interactivo como referencia ejecutable |

## Mantenimiento

- El archivo crece poco; si supera ~2.000 líneas, consolida por tema en una entrada nueva
  (`meta.consolida` con la lista de `ts` absorbidos) en lugar de borrar historia.
- Revisa que cada `content` se entienda solo: sin “esto”, “lo de antes”, “el archivo ese”.
