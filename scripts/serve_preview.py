#!/usr/bin/env python3
"""
Abyss Tattoo Studio v3 — Live Preview HTTP Server (0.0.0.0:8000)
Supports HTTP 206 Partial Content (Byte-Range) for MP4 video streaming and WebP plates.
"""

import os
import re
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = int(os.environ.get("PORT", "8000"))
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class RangeHTTPRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()
        if not os.path.exists(path):
            self.send_error(404, "File not found")
            return None

        range_header = self.headers.get("Range")
        if not range_header:
            return super().send_head()

        m = re.match(r"bytes=(\d*)-(\d*)", range_header)
        if not m:
            return super().send_head()

        file_size = os.path.getsize(path)
        start_str, end_str = m.groups()
        start = int(start_str) if start_str else 0
        end = int(end_str) if end_str else file_size - 1
        end = min(end, file_size - 1)

        if start >= file_size or start > end:
            self.send_response(416)
            self.send_header("Content-Range", f"bytes */{file_size}")
            self.end_headers()
            return None

        length = end - start + 1
        ctype = self.guess_type(path)
        f = open(path, "rb")
        f.seek(start)

        self.send_response(206)
        self.send_header("Content-type", ctype)
        self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
        self.send_header("Content-Length", str(length))
        self.send_header("Last-Modified", self.date_time_string(os.path.getmtime(path)))
        self.end_headers()
        self._range_bytes_remaining = length
        return f

    def copyfile(self, source, outputfile):
        remaining = getattr(self, "_range_bytes_remaining", None)
        if remaining is None:
            return super().copyfile(source, outputfile)
        bufsize = 64 * 1024
        while remaining > 0:
            chunk = source.read(min(bufsize, remaining))
            if not chunk:
                break
            outputfile.write(chunk)
            remaining -= len(chunk)
        self._range_bytes_remaining = None


if __name__ == "__main__":
    server = ThreadingHTTPServer(("0.0.0.0", PORT), RangeHTTPRequestHandler)
    print(f"Abyss Tattoo Studio v3 Live Preview listening on http://0.0.0.0:{PORT}")
    sys.stdout.flush()
    server.serve_forever()
