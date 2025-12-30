#!/usr/bin/env python3
import os
import re

repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
docs_dir = os.path.join(repo_root, 'docs')

puml_files = [f for f in os.listdir(docs_dir) if f.startswith('ER_') and f.endswith('.puml')]
if not puml_files:
    print('No ER_*.puml files found in docs/')
    exit(0)

arrow_re = re.compile(r"^\s*([A-Za-z0-9_]+)\s+([\}\|o0<>\-\{]+)\s+([A-Za-z0-9_]+)\s*:\s*(.*)$")

for fn in puml_files:
    src = os.path.join(docs_dir, fn)
    base = os.path.splitext(fn)[0]
    dest = os.path.join(docs_dir, 'CLASSES_' + base[3:] + '.puml')
    print('Converting', src, '->', dest)
    with open(src, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    out_lines = []
    for line in lines:
        # convert entity declarations
        m = re.match(r"(\s*)entity\s+\"?([A-Za-z0-9_ ]+)\"?\s+as\s+([A-Za-z0-9_]+)\s*\{", line)
        if m:
            indent, display, name = m.groups()
            out_lines.append(f"{indent}class {name} {{\n")
            continue
        m2 = re.match(r"(\s*)entity\s+([A-Za-z0-9_]+)\s*\{", line)
        if m2:
            indent, name = m2.groups()
            out_lines.append(f"{indent}class {name} {{\n")
            continue
        # convert relationship lines to class associations
        m3 = arrow_re.match(line)
        if m3:
            a, arrow, b, label = m3.groups()
            # normalize to simple association
            out_lines.append(f"{a} --> {b} : {label}\n")
            continue
        # keep other lines (attributes, startuml/enduml, comments)
        out_lines.append(line)
    # minor fix: replace '@startuml' and '@enduml' preserved
    # write dest
    with open(dest, 'w', encoding='utf-8') as out:
        out.writelines(out_lines)
    print('Wrote', dest)
print('Conversion complete.')
