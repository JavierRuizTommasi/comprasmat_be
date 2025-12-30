#!/usr/bin/env python3
"""
Convert PlantUML sequence diagrams to collaboration diagrams.
Reads all SEC_*.puml files from docs/secuencias/ and generates COL_*.puml in docs/colaboracion/
"""

import os
import re
from pathlib import Path

def extract_title_and_actors(content):
    """Extract @startuml title and find actors/boundaries/databases"""
    title_match = re.search(r'@startuml\s+(\w+)', content)
    title = title_match.group(1) if title_match else "Colaboracion"
    
    # Find all actor, boundary, database declarations
    actors = []
    for pattern in [
        r'actor\s+(\w+)',
        r'boundary\s+(".*?"|[\w\s]+?)\s+as\s+(\w+)',
        r'boundary\s+(\w+)',
        r'database\s+(".*?"|[\w\s]+?)\s+as\s+(\w+)',
        r'database\s+(\w+)'
    ]:
        for match in re.finditer(pattern, content):
            actor = match.group(1) if len(match.groups()) == 1 else match.group(3) if len(match.groups()) >= 3 else match.group(2)
            if actor and actor not in actors:
                # Clean up quoted strings
                actor = actor.strip('"').strip()
                actors.append(actor)
    
    return title, actors

def extract_messages(content):
    """Extract messages from sequence diagram (actor->system: message)"""
    messages = []
    
    # Pattern for regular messages: Actor->Target: message
    pattern = r'(\w+)\s*-+[>\-]*\s*(\w+)\s*:\s*(.+?)(?=\n|$)'
    
    for match in re.finditer(pattern, content, re.MULTILINE):
        from_actor = match.group(1).strip()
        to_actor = match.group(2).strip()
        message = match.group(3).strip()
        # Remove trailing backslash and newlines
        message = message.replace('\\n', ' ').replace('\n', ' ').strip()
        messages.append((from_actor, to_actor, message))
    
    return messages

def generate_collaboration_puml(title, actors, messages):
    """Generate collaboration diagram PUML"""
    puml_lines = [
        f'@startuml Colaboracion{title}',
        'hide footbox',
        ''
    ]
    
    # Add participant declarations with numbers
    for i, actor in enumerate(actors, 1):
        puml_lines.append(f'participant "{actor}" as {i}')
    
    puml_lines.append('')
    
    # Create actor to number mapping
    actor_to_num = {actor: str(i) for i, actor in enumerate(actors, 1)}
    
    # Add messages with numbering
    msg_num = 1
    for from_actor, to_actor, message in messages:
        from_num = actor_to_num.get(from_actor, '?')
        to_num = actor_to_num.get(to_actor, '?')
        
        if from_num != '?' and to_num != '?':
            arrow = f'{from_num} --> {to_num}' if from_num == to_num else f'{from_num} -> {to_num}'
            # Truncate long messages
            msg_display = message[:50] + '...' if len(message) > 50 else message
            puml_lines.append(f'{arrow}: {msg_num}. {msg_display}')
            msg_num += 1
    
    puml_lines.append('')
    puml_lines.append('@enduml')
    puml_lines.append('')
    
    return '\n'.join(puml_lines)

def main():
    seq_dir = Path('docs/secuencias')
    col_dir = Path('docs/colaboracion')
    
    if not seq_dir.exists():
        print(f'Sequence directory not found: {seq_dir}')
        return
    
    col_dir.mkdir(parents=True, exist_ok=True)
    
    seq_files = sorted(seq_dir.glob('SEC_*.puml'))
    print(f'Found {len(seq_files)} sequence diagram files')
    
    for seq_file in seq_files:
        try:
            with open(seq_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            title, actors = extract_title_and_actors(content)
            messages = extract_messages(content)
            
            if not actors:
                print(f'Warning: No actors found in {seq_file.name}, skipping')
                continue
            
            col_puml = generate_collaboration_puml(title, actors, messages)
            
            # Generate output filename: SEC_UC-ARCH-01_xxx.puml -> COL_UC-ARCH-01_xxx.puml
            col_filename = seq_file.name.replace('SEC_', 'COL_')
            col_file = col_dir / col_filename
            
            with open(col_file, 'w', encoding='utf-8') as f:
                f.write(col_puml)
            
            print(f'Wrote {col_file}')
        
        except Exception as e:
            print(f'Error processing {seq_file.name}: {e}')
    
    print(f'Done — generated {len(list(col_dir.glob("COL_*.puml")))} collaboration diagrams')

if __name__ == '__main__':
    main()
