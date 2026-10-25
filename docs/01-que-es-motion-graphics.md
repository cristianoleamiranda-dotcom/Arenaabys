# 01 · Qué es el motion graphics (y qué no)

> Documento base del repositorio. Síntesis de las fuentes de la investigación original
> (Domestika, Trazos, The Core School, Maxon, Antídoto 56, HeyGen, Adobe) más criterio de
> producción. Todas las fuentes están listadas en [`04-recursos-github.md`](./04-recursos-github.md#fuentes-de-la-investigación).

## Definición operativa

Los **motion graphics** (gráficos en movimiento) son piezas de animación digital que dan vida a
elementos gráficos estáticos —tipografía, formas, íconos, ilustraciones, fotografías, datos— para
comunicar una idea, un dato o una historia de forma rápida y atractiva.

La definición corta que sirve para producir:

> **Motion graphics = diseño gráfico con la variable tiempo añadida.**
> El mensaje manda; el movimiento es el argumento, no el adorno.

## Diferencias con disciplinas vecinas

| Disciplina | Centro de gravedad | Pregunta que responde |
|---|---|---|
| Motion graphics | El **mensaje** y la síntesis visual | ¿Cómo hago que este concepto se entienda en 6 segundos? |
| Animación tradicional / character | El **personaje** y la narrativa | ¿Cómo siente y actúa este personaje? |
| VFX / compositing | La **integración** con imagen real | ¿Cómo hago creíble este plano? |
| Edición (NLE) | El **ritmo** del material existente | ¿En qué orden y con qué duración cuento esto? |
| 3D / CGI | El **volumen y la luz** | ¿Cómo se ve este objeto en el espacio? |

En la práctica un proyecto real mezcla todas: un explainer con motion graphics suele tener
diseño gráfico animado (MG), tipografía cinética, algo de 3D y una edición que manda el ritmo.

## Características principales

1. **Enfoque en el mensaje.** Prioriza claridad y síntesis visual sobre narrativa compleja.
   Regla práctica: si quitas el audio y no se entiende la idea, el diseño falló.
2. **Elementos clave.** Diseño gráfico + ritmo + tipografía cinética + color + textura + sonido.
   El sonido no es post-producción: es un elemento de diseño (ver [`02-guia-edicion-audiovisual.md`](./02-guia-edicion-audiovisual.md)).
3. **Versatilidad de formatos.** Reels, comerciales, tutoriales, cabeceras de serie, infografías,
   demos de producto, presentaciones animadas, lower thirds, stingers.
4. **Iteración y plantillas.** Buena parte del oficio es construir sistemas reutilizables
   (composiciones, presets, plantillas MOGRT, librerías de easing) más que piezas únicas.
5. **Escalabilidad del sistema.** Un mismo sistema visual debe funcionar en 16:9, 9:16, 1:1 y 4:5
   con reencuadre, no con rediseño.

## Familias de piezas (taxonomía de producción)

| Familia | Duración típica | Objetivo | Ejemplo |
|---|---|---|---|
| **Stinger / logo reveal** | 1–4 s | Identidad de marca | Intro de canal, transición de stream |
| **Kinetic typography** | 3–15 s | Mensaje puro con texto | Cita animada, letra de canción |
| **Lower third / chyron** | 2–6 s | Identificar a alguien | Nombre + cargo en entrevista |
| **Explainer** | 45 s–5 min | Explicar un concepto | “Cómo funciona X” con diagramas |
| **Data motion / infografía animada** | 10–60 s | Hacer legible un dato | Bar chart race, contador de métricas |
| **Product / UI motion** | 5–30 s | Mostrar un producto | Demo de app con mockups animados |
| **Social ad / hook** | 6–20 s | Detener el scroll | Reel de 3 escenas + CTA |
| **Broadcast package** | variable | Sistema completo | Bumpers, cortinas, tickers |
| **Motion identity** | variable | Sistema de marca en movimiento | Logo + tipografía + color + audio logo |

Antídoto 56 Estudio Visual publica una clasificación de estilos muy útil para *moodboards*
(3D, flat, hand-drawn, collage, isométrico, glitch, etc.): <https://www.antidoto56.com/blog/15-tipos-de-videos-animados-motion-graphics-que-haran-despegar-los-contenidos-de-tu-marca>

## Pirámide de decisión (antes de abrir el software)

```
        ┌─────────────┐
        │  1. MENSAJE │  una frase: qué debe quedar
        ├─────────────┤
        │ 2. ESTRUCTURA│  hook → desarrollo → remate (3 actos)
        ├─────────────┤
        │ 3. RITMO    │  BPM / duración por escena / dónde caen los golpes
        ├─────────────┤
        │ 4. SISTEMA  │  tipografía, paleta, grid, movimiento base
        ├─────────────┤
        │ 5. TÉCNICA  │  herramienta, entregables, códecs
        └─────────────┘
```

Si el paso 1 no está cerrado y escrito, cualquier decisión posterior es decoración.

## Herramientas por tipo de trabajo

| Necesidad | Herramienta | Coste | Notas |
|---|---|---|---|
| Estándar de industria 2D/3D | **Adobe After Effects** | Suscripción | Expressions, MOGRT, integración con Premiere/Illustrator/Photoshop |
| 3D y MoGraph procedural | **Cinema 4D**, **Blender** (gratis) | Suscripción / libre | Blender + Geometry Nodes cubre mucho de C4D |
| 2D vectorial con animación | **Adobe Animate**, **Rive**, **Lottie** | Varía | Rive/Lottie para producto e interfaz |
| Edición con capas de texto y formas | **Premiere Pro**, **DaVinci Resolve** (gratis) | Suscripción / libre | Resolve incluye Fusion para compositing |
| Código / automatización | **Remotion** (React), **Manim**, **p5.js**, **GSAP**, **three.js** | Libre | Repetible, versionable en Git, ideal para datos |
| Rápido / IA | HeyGen, InVideo y similares | Suscripción | Útiles para prototipos; revisar tipografía y timing |
| Open source de escritorio | **Graphite**, **TiXL**, **Astrofox**, **Motionity** | Libre | Ver catálogo en `04-recursos-github.md` |

## Glosario de bolsillo

- **Easing** — curva de aceleración de un movimiento. `ease-in` arranca lento, `ease-out` frena
  lento, `ease-in-out` ambas. Sin easing, todo se siente robótico.
- **Overshoot / anticipación** — el objeto se pasa y vuelve (overshoot) o retrocede antes de ir
  (anticipación). Son los dos principios que más “vida” dan con menos esfuerzo.
- **Stagger** — desfase temporal entre elementos de un grupo (0,03–0,08 s por elemento).
- **Hold** — fotograma quieto. El silencio visual es ritmo; no todo debe moverse.
- **Safe area** — margen donde el texto no se corta por UI de la plataforma.
- **Beat / downbeat** — pulso musical y su acento. Base del corte sincronizado.
- **BPM** — pulsos por minuto. 120 BPM = 1 pulso cada 0,5 s = 15 frames a 30 fps.
- **MOGRT** — plantilla de After Effects editable desde Premiere (Essential Graphics).
- **Alpha channel** — transparencia en el archivo (ProRes 4444, WebM VP9 alpha, PNG seq).
- **LUT / grade** — tabla de conversión de color para uniformar el look.
- **Rendering frame-accurate** — la salida es determinista: mismo frame, mismo píxel.

## Las tres reglas que evitan el 90% de los rehacer

1. **Nada entra sin intención.** Todo elemento tiene motivo, punto de entrada y punto de salida.
2. **Un solo foco por momento.** Si dos cosas compiten, el ojo no lee ninguna.
3. **El timing se prueba mudo y a velocidad real.** Si funciona sin audio y sin slow-motion, funciona.

## Fuentes de la investigación

- Domestika — *Motion graphics: qué es y para qué sirve*: <https://www.domestika.org/es/blog/4241-motion-graphics-que-es-y-para-que-sirve>
- Trazos — *Motion graphics desde cero*: <https://trazos.net/motion-graphics-desde-cero/>
- The Core School — *Motion graphics*: <https://www.thecoreschool.com/blog/motion-graphics/>
- Maxon — *Motion graphics*: <https://www.maxon.net/es/solutions/motion-graphics>
- Antídoto 56 — *15 tipos de vídeos animados*: <https://www.antidoto56.com/blog/15-tipos-de-videos-animados-motion-graphics-que-haran-despegar-los-contenidos-de-tu-marca>
- HeyGen — *AI motion graphics*: <https://www.heygen.com/es-ar/tool/ai-motion-graphics>
- Video de referencia (YouTube): <https://www.youtube.com/watch?v=XbGzd7ks7LA>
