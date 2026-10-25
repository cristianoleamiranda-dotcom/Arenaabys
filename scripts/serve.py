#!/usr/bin/env python3
"""
serve.py — servidor de desarrollo del hub, sin dependencias.

Resuelve los dos problemas de `python3 -m http.server` en este repo:

  1. Los .md se sirven como text/markdown con charset utf-8 (con http.server el
     navegador los descarga en vez de abrirlos).
  2. Los .mjs/.jsonl/.webm/.woff2 llevan el tipo correcto y todo va con
     Cache-Control: no-store, para que ningún cambio quede pegado en caché.

Uso:
    python3 scripts/serve.py              # 0.0.0.0:8080
    python3 scripts/serve.py 3000         # otro puerto
    python3 scripts/serve.py 8080 --quiet # sin log por request

Rutas de interés:  /  ·  /demo/  ·  /viewer.html?doc=docs/01-…
"""
from __future__ import annotations

import argparse
import http.server
import os
import socketserver
import sys
from functools import partial

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Tipos que http.server no conoce o resuelve mal.
EXTRA_TYPES = {
    ".md": "text/markdown; charset=utf-8",
    ".markdown": "text/markdown; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".jsonl": "application/x-ndjson; charset=utf-8",
    ".yaml": "text/yaml; charset=utf-8",
    ".yml": "text/yaml; charset=utf-8",
    ".webm": "video/webm",
    ".mp4": "video/mp4",
    ".mov": "video/quicktime",
    ".wav": "audio/wav",
    ".ttf": "font/ttf",
    ".otf": "font/otf",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".svg": "image/svg+xml",
    ".avif": "image/avif",
    ".webp": "image/webp",
    ".sh": "text/x-shellscript; charset=utf-8",
    ".py": "text/x-python; charset=utf-8",
}


class HubHandler(http.server.SimpleHTTPRequestHandler):
    """Handler con tipos correctos, UTF-8 y sin caché."""

    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        **EXTRA_TYPES,
    }

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store, must-revalidate")
        # El preview de Arena se sirve dentro de un iframe: no bloquear el embed
        # y evitar que el navegador reinterprete los tipos (clave para .md/.mjs).
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()

    def guess_type(self, path: str) -> str:  # noqa: D102
        ext = os.path.splitext(path)[1].lower()
        if ext in EXTRA_TYPES:
            return EXTRA_TYPES[ext]
        if ext in (".html", ".htm"):
            return "text/html; charset=utf-8"
        if ext in (".css", ".txt"):
            return f"text/{ext[1:]}; charset=utf-8"
        return super().guess_type(path)

    def log_message(self, fmt: str, *args) -> None:  # noqa: A003
        if self.server.quiet:  # type: ignore[attr-defined]
            return
        sys.stderr.write(f"  {self.address_string()} · {fmt % args}\n")


class HubServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


def main() -> int:
    parser = argparse.ArgumentParser(description="Servidor de desarrollo del Motion Skills Hub")
    parser.add_argument("port", nargs="?", type=int, default=8080, help="puerto (default 8080)")
    parser.add_argument("--bind", default="0.0.0.0", help="interfaz (default 0.0.0.0)")
    parser.add_argument("--root", default=ROOT, help="directorio a servir (default: raíz del repo)")
    parser.add_argument("--quiet", action="store_true", help="no registrar cada request")
    args = parser.parse_args()

    if not os.path.isdir(args.root):
        print(f"✗ no existe el directorio: {args.root}", file=sys.stderr)
        return 1

    handler = partial(HubHandler, directory=args.root)
    try:
        httpd = HubServer((args.bind, args.port), handler)
    except OSError as exc:
        print(f"✗ no se pudo abrir {args.bind}:{args.port} → {exc}", file=sys.stderr)
        print("  ¿otro proceso en ese puerto?  ss -ltnp | grep :%d" % args.port, file=sys.stderr)
        return 1

    httpd.quiet = args.quiet  # type: ignore[attr-defined]
    print(f"▸ Motion Skills Hub · http://{args.bind}:{args.port}")
    print(f"  raíz    : {args.root}")
    print(f"  hub     : /index.html")
    print(f"  reel    : /demo/")
    print(f"  docs    : /viewer.html?doc=docs/01-que-es-motion-graphics.md")
    print("  ctrl+c para detener", flush=True)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n▸ detenido")
    finally:
        httpd.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
