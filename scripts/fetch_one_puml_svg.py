#!/usr/bin/env python3
import sys
import os
import zlib
import requests

ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_"

def encode6bit(b):
    return ALPHABET[b & 0x3F]

def append3bytes(b1, b2, b3):
    c1 = (b1 >> 2) & 0x3F
    c2 = ((b1 & 0x3) << 4) | ((b2 >> 4) & 0xF)
    c3 = ((b2 & 0xF) << 2) | ((b3 >> 6) & 0x3)
    c4 = b3 & 0x3F
    return encode6bit(c1) + encode6bit(c2) + encode6bit(c3) + encode6bit(c4)

def plantuml_encode(text: str) -> str:
    data = text.encode('utf-8')
    compressor = zlib.compressobj(level=9, wbits=-15)
    compressed = compressor.compress(data) + compressor.flush()
    res = []
    i = 0
    length = len(compressed)
    while i < length:
        b1 = compressed[i]
        b2 = compressed[i+1] if i+1 < length else 0
        b3 = compressed[i+2] if i+2 < length else 0
        res.append(append3bytes(b1, b2, b3))
        i += 3
    return ''.join(res)


def fetch_one(puml_path, out_svg_path):
    with open(puml_path, 'r', encoding='utf-8') as f:
        text = f.read()
    encoded = plantuml_encode(text)
    url = f'https://www.plantuml.com/plantuml/svg/{encoded}'
    print('GET', url)
    r = requests.get(url, timeout=30)
    if r.status_code != 200:
        raise SystemExit(f'Error fetching: {r.status_code}')
    content = r.content
    os.makedirs(os.path.dirname(out_svg_path), exist_ok=True)
    with open(out_svg_path, 'wb') as out:
        out.write(content)
    print('Wrote', out_svg_path)


if __name__ == '__main__':
    if len(sys.argv) != 3:
        print('Usage: fetch_one_puml_svg.py <puml_path> <out_svg_path>')
        sys.exit(2)
    fetch_one(sys.argv[1], sys.argv[2])
