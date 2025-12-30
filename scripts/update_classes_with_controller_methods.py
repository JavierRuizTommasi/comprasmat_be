#!/usr/bin/env python3
import os
import re

repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
project_root = repo_root

docs_dir = os.path.join(repo_root, 'docs')
controllers = []
# find controller files
for root, dirs, files in os.walk(repo_root):
    for f in files:
        if f.endswith('.controller.js'):
            controllers.append(os.path.join(root, f))

print('Found controllers:', len(controllers))

# build map from module name to controller path
controller_map = {}
for path in controllers:
    # module folder name
    rel = os.path.relpath(path, repo_root).replace('\\','/')
    parts = rel.split('/')
    # expected structure: <module>/<file>.controller.js
    if len(parts) >= 2:
        module = parts[0]
        controller_map[module] = path
    else:
        name = os.path.basename(path).split('.')[0]
        controller_map[name] = path

# find class puml files
class_pu = [f for f in os.listdir(docs_dir) if f.startswith('CLASSES_') and f.endswith('.puml')]
print('Found class PUMLs:', len(class_pu))

# regex to find exports
exp_re = re.compile(r"^\s*exports\.([A-Za-z0-9_]+)\s*=", re.MULTILINE)

changes = []
for pu in class_pu:
    pu_path = os.path.join(docs_dir, pu)
    module = pu[len('CLASSES_'):-len('.puml')]
    # map module name to controller key: sometimes module names differ in case
    ctrl_path = controller_map.get(module)
    if not ctrl_path:
        # try alternative keys (lower/upper)
        alt = None
        for k in controller_map.keys():
            if k.lower() == module.lower():
                alt = controller_map[k]
                break
        ctrl_path = alt
    if not ctrl_path:
        print('No controller found for', module, '- skipping')
        continue
    # read controller
    with open(ctrl_path, 'r', encoding='utf-8') as f:
        ctrl_text = f.read()
    exports = exp_re.findall(ctrl_text)
    exports = [e for e in exports if not e.startswith('//')]
    exports = sorted(set(exports))
    print(module, '->', len(exports), 'exports')
    if not exports:
        continue
    # read puml
    with open(pu_path, 'r', encoding='utf-8') as f:
        ptxt = f.read()
    # find class block
    m = re.search(r"class\s+([A-Za-z0-9_]+)\s*\{", ptxt)
    if not m:
        print('No class block found in', pu_path)
        continue
    class_name = m.group(1)
    # find class block bounds
    start = m.end()
    # find closing '}' for the class (first '}' after start)
    end = ptxt.find('\n}', start)
    if end == -1:
        # fallback: find next standalone '}'
        end = ptxt.find('}', start)
    if end == -1:
        print('Cannot find end of class block in', pu_path)
        continue
    block = ptxt[start:end]
    # find existing method names (+ or - )
    exist_re = re.compile(r"^[ \t]*[+\-]\s*([A-Za-z0-9_]+)\s*\(", re.MULTILINE)
    existing = set(exist_re.findall(block))
    to_add = [e for e in exports if e not in existing]
    if not to_add:
        print('No new methods for', pu)
        continue
    # prepare insertion: before end (just before the closing brace), insert methods lines
    method_lines = ''
    for name in to_add:
        method_lines += f'  + {name}(req,res): void\n'
    new_ptxt = ptxt[:end] + method_lines + ptxt[end:]
    with open(pu_path, 'w', encoding='utf-8') as f:
        f.write(new_ptxt)
    changes.append((pu_path, to_add))

print('Updated', len(changes), 'PUML files')
for p, added in changes:
    print('  ', os.path.basename(p), 'added', len(added), 'methods')
