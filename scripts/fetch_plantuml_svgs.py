#!/usr/bin/env python3
import os
import zlib
import requests

# PlantUML encoding (raw deflate + custom base64 alphabet)
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
    # convert to bytes
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


def fetch_svg_from_puml(puml_path, out_svg_path):
    with open(puml_path, 'r', encoding='utf-8') as f:
        text = f.read()
    encoded = plantuml_encode(text)
    url = f'https://www.plantuml.com/plantuml/svg/{encoded}'
    print('GET', url)
    # try up to 3 times (transient network issues / rate limits)
    tries = 3
    for attempt in range(1, tries + 1):
        try:
            r = requests.get(url, timeout=30)
        except Exception as e:
            print(f'Exception (attempt {attempt}) fetching {puml_path}:', e)
            r = None
        if r is None:
            if attempt < tries:
                continue
            else:
                print(f'ERROR: failed to fetch {puml_path} after {tries} attempts')
                return False
        if r.status_code != 200:
            print(f'ERROR: status {r.status_code} for {puml_path}')
            if attempt < tries:
                continue
            return False
        ctype = r.headers.get('Content-Type', '')
        content = r.content
        if b'<svg' not in content[:1000]:
            print(f'WARN: fetched content for {puml_path} does not start with <svg (Content-Type={ctype})')
            if attempt < tries:
                continue
            else:
                print('Giving up after retries.')
        os.makedirs(os.path.dirname(out_svg_path), exist_ok=True)
        with open(out_svg_path, 'wb') as out:
            out.write(content)
        print('Wrote', out_svg_path)
        return True
    return False


def main():
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    docs_dir = os.path.join(repo_root, 'docs')
    images_dir = os.path.join(docs_dir, 'images')
    # gather puml files in docs matching ER_*.puml, CLASSES_*.puml and ER_Diagrama.puml
    puml_files = []
    for name in os.listdir(docs_dir):
        if name.endswith('.puml') and (name.startswith('ER_') or name.startswith('CLASSES_') or name == 'ER_Diagrama.puml'):
            puml_files.append(os.path.join(docs_dir, name))
    if not puml_files:
        print('No PUML files found in docs/')
        return
    for p in puml_files:
        base = os.path.splitext(os.path.basename(p))[0]
        out_svg = os.path.join(images_dir, f'{base}.svg')
        # skip if existing file looks good
        need_fetch = True
        if os.path.exists(out_svg):
            try:
                with open(out_svg, 'rb') as f:
                    start = f.read(200)
                if start.lstrip().startswith(b'<svg'):
                    print('Skipping (already valid):', out_svg)
                    need_fetch = False
                else:
                    print('Will regenerate (corrupt or HTML wrapper):', out_svg)
            except Exception:
                need_fetch = True
        if not need_fetch:
            continue
        try:
            fetch_svg_from_puml(p, out_svg)
        except Exception as e:
            print('Exception fetching', p, e)

if __name__ == '__main__':
    main()
