# 02 · Edición audiovisual aplicada a motion graphics

> Cómo se piensa el ritmo, el sonido y la entrega de una pieza de motion graphics.
> Complementa al skill [`audio-post-motion`](../skills/audio-post-motion/SKILL.md), que trae las
> recetas ejecutables (ffmpeg / WebAudio) y los objetivos de loudness.

## 1. El ritmo manda: del BPM a los frames

El error más común del principiante es animar sin reloj. Un motion graphics profesional se
construye sobre una rejilla temporal.

```
BPM 120  →  1 pulso = 60/120 = 0,500 s
fps 30   →  1 pulso = 15 frames
compás 4/4 →  1 compás = 2,0 s = 60 frames
```

Fórmulas de bolsillo:

```
segundos_por_pulso   = 60 / BPM
frames_por_pulso     = (60 / BPM) * fps
duración_compás (4/4) = 4 * 60 / BPM
```

Tabla rápida (fps 30):

| BPM | pulso | compás 4/4 | frames/pulso |
|---|---|---|---|
| 90 | 0,667 s | 2,667 s | 20 |
| 100 | 0,600 s | 2,400 s | 18 |
| 120 | 0,500 s | 2,000 s | 15 |
| 128 | 0,469 s | 1,875 s | 14 |
| 140 | 0,429 s | 1,714 s | 13 |

**Regla práctica:** los cortes y los “golpes” de entrada caen en pulso o en medio pulso; las
salidas, entre pulsos (off-beat). Si todo cae en el pulso, se siente militar.

### Detección de BPM

- **Audacity / Reverb / Waves**: análisis de tempo y marcadores.
- **ffmpeg**: `ffmpeg -i music.mp3 -af "astats=metadata=1" -f null -` da estadísticas;
  para tempo usa `aubio`: `aubio tempo music.mp3`.
- **En código**: `essentia.js` o `web-audio-beat-detector` en el navegador.
- **A mano**: marca 10 golpes, mide el tiempo total, `BPM = 600 / segundos`.

### Cortes clásicos de edición (aplicables a MG)

| Corte | Qué hace | Cuándo usarlo |
|---|---|---|
| **Hard cut** | Cambio seco | Base del ritmo; en MG es el default |
| **J-cut** | El audio del plano siguiente entra antes | Anticipar una idea o voz |
| **L-cut** | El audio del plano anterior continúa | Dar continuidad a la narración |
| **Match cut** | Continuidad de forma/movimiento entre planos | Transición “premium” sin efecto |
| **Whip pan / swipe** | Barrido rápido | Unir escenas con energía |
| **Speed ramp** | Acelerar y frenar | Enfatizar un impacto |
| **Smash cut** | Corte a un plano opuesto (silencio → ruido) | Comedia, contraste, hook |

## 2. Estructura de una pieza corta (6–30 s)

```
0.0–0.7s   HOOK visual: algo se mueve y promete información
0.7–3.0s   PREMISA: qué se va a decir (texto mínimo, 3-5 palabras)
3.0–...    DESARROLLO: 2-4 beats, uno por idea, un foco por beat
final-3s   REMATE: la frase que se recuerda
final-0.5s LOGO / CTA / loop point
```

Para **loops** (fondo animado, sticker, web): el último frame debe coincidir con el primero.
Verifica con: `ffmpeg -i loop.mp4 -vf "select=eq(n\,0)+eq(n\,$((N-1))),tile=2x1" -frames:v 1 cmp.png`.

## 3. Sonido: el 50% que se olvida

### Capas de una banda sonora de motion graphics

1. **Música** — base rítmica (loop, track con licencia, o score sintetizado en código).
2. **Voz / VO** — si hay explicación. Siempre la capa que manda en inteligibilidad.
3. **SFX de diseño** — whoosh, impact, riser, click, pop, glitch. Deben caer *exactamente* en
   el frame donde ocurre el movimiento, no 3 frames después.
4. **Ambiente / room tone** — devuelve sensación de espacio, incluso en piezas 100% gráficas.
5. **Silencio** — recurso expresivo. Un corte a negro con silencio total antes de un impacto
   duplica la percepción de energía.

### Sincronía: los 3 offsets que importan

- **Impacto visual ↔ SFX**: mismo frame. Si el SFX está *antes*, se siente anticipado (a veces
  deseado, con 1–2 frames); si está *después*, se siente flojo.
- **Voz ↔ gráfico**: el gráfico aparece 2–4 frames **antes** de la palabra clave que ilustra.
- **Música ↔ corte**: el corte cae 1 frame **antes** del downbeat para compensar la latencia
  perceptiva (aprox. 20–30 ms).

### Loudness (objetivos prácticos)

| Destino | Target integrado | True peak |
|---|---|---|
| YouTube / web / Reels / TikTok | **-14 LUFS** (rango -14 a -12) | ≤ -1 dBTP |
| Podcast / voz manda | -16 LUFS (mono −19) | ≤ -1 dBTP |
| Broadcast / TV (EBU R128) | **-23 LUFS** | ≤ -1 dBTP |
| Cine / sala | -27 a -24 LUFS (dialnorm) | ≤ -2 dBTP |

Nunca normalices “a ojo” con picos: normaliza con LUFS integrado.

### Ducking (música bajo la voz)

Baja la música 4–8 dB cuando habla la voz, con ataque 5–15 ms y release 200–400 ms, no con un
fade manual. En ffmpeg:

```bash
ffmpeg -i voz.wav -i musica.wav -filter_complex \
"[1:a]volume=0.55[m];[m][0:a]sidechaincompress=threshold=0.05:ratio=6:attack=10:release=280[duck]; \
 [0:a][duck]amix=inputs=2:duration=first:dropout_transition=0,alimiter=limit=0.891[a]" \
-map "[a]" salida.wav
```

### Cadena de post de audio mínima

```bash
# 1) limpiar voz: high-pass + de-esser suave + compresión
ffmpeg -i vo.wav -af "highpass=f=90,acompressor=threshold=-18dB:ratio=3:attack=8:release=180, \
afftdn=nf=-25" vo_clean.wav

# 2) normalizar a -14 LUFS con true peak -1 dBTP
ffmpeg -i mezcla.wav -af "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=summary" -ar 48000 mezcla_norm.wav

# 3) medir y verificar
ffmpeg -i mezcla_norm.wav -af "ebur128=peak=true" -f null -
```

## 4. Imagen: color, códecs y entrega

### Color

- Trabaja en **Rec.709 / sRGB** para web; **Rec.2100 PQ/HLG** solo si entregas HDR de verdad.
- Anima en **espacios perceptuales** (OKLCH/Lab), no en RGB: los degradados quedan limpios y sin
  el “gris muerto” del centro. Ver skill `color-motion`.
- Si el render sale “lavado” respecto al preview: casi siempre es un desajuste de gamma
  (2.2 vs 2.4) o un LUT aplicado dos veces.

### Códec de salida según uso

| Uso | Códec / contenedor | Notas |
|---|---|---|
| Master de archivo | **ProRes 422 HQ** (.mov) | Grande, robusto, editable |
| Entrega web / social | **H.264** High, `.mp4`, yuv420p | `-crf 18` (master) a `-crf 23` (streaming) |
| Alta calidad / HDR | **HEVC / H.265** o **AV1** | Mejor compresión, menos compatibilidad |
| Transparencia para web | **WebM VP9 + alpha** o **PNG seq** | Para overlays en navegador |
| Transparencia para NLE | **ProRes 4444** o **QuickTime Animation** | Alpha real |
| GIF / preview | GIF o WebP animado | Solo para revisiones |

```bash
# MP4 social 1080x1920 30fps, bien de nitidez y ligero
ffmpeg -i master.mov -vf "scale=1080:1920:flags=lanczos,fps=30" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 20 -preset slow \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:a aac -b:a 192k -movflags +faststart out.mp4

# ProRes 4444 con alpha (para overlay en Premiere/Resolve)
ffmpeg -i frames/%05d.png -c:v prores_ks -profile:v 4444 -pix_fmt yuva444p10le out.mov

# WebM con alpha (para OBS / web)
ffmpeg -i frames/%05d.png -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 28 out.webm
```

### Safe areas por plataforma

| Formato | Resolución | Margen seguro (texto) |
|---|---|---|
| Reel / TikTok / Short (9:16) | 1080×1920 | 12–15% arriba y abajo, 6% laterales |
| Feed vertical (4:5) | 1080×1350 | 5% |
| Cuadrado (1:1) | 1080×1080 | 8% |
| YouTube (16:9) | 1920×1080 | 5%, y evita los últimos 20% para end cards |
| Presentación (16:9) | 1920×1080 | 8% (se ve en proyector y en laptop) |

## 5. Checklist de QC antes de exportar

- [ ] ¿Se entiende el mensaje **sin audio**?
- [ ] ¿Cada elemento tiene entrada y salida intencional?
- [ ] ¿Hay al menos un **hold** que deje respirar?
- [ ] ¿El corte a negro/silencio está donde debe?
- [ ] ¿Los textos están dentro de safe area en el formato final?
- [ ] ¿Ningún frame con texto ilegible por movimiento (más de 200 px/s en cuerpo pequeño)?
- [ ] ¿Loudness medido, no estimado?
- [ ] ¿El MP4 abre en un reproductor limpio (VLC) sin cuadros negros al inicio?
- [ ] ¿El archivo pesa lo que debe (1080p 30 s ≈ 8–25 MB en H.264 crf 20)?
- [ ] ¿Nombres de archivo normalizados: `cliente_pieza_formato_v###.mp4`?

## 6. Nomenclatura y versionado

```
2026-10-25_acme_lanzamiento_9x16_v03.mp4
└ fecha ──┘ └cliente┘ └pieza──────┘ └fmt┘ └ver
```

Nunca `final_final_v2_OK.mp4`. Un `v###` por render entregado, y un registro de qué cambió.
