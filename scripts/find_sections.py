import sys
from pypdf import PdfReader

pdf_path = r'C:\Users\TeseoHeracles\Documents\CP RED TEST ANTIGRAVITY\Core-Rules\Cyberpunk-RED-Core-Rulebook-v1.24_2020-12-25.pdf'
reader = PdfReader(pdf_path)

def walk(outline, depth=0):
    for item in outline:
        if isinstance(item, list):
            walk(item, depth + 1)
        elif hasattr(item, 'title'):
            try:
                page = reader.get_destination_page_number(item)
                title = item.title
                keywords = ['gear', 'weapon', 'cyberware', 'armor', 'night market', 'role', 'skill', 'combat', 'netrun', 'injury']
                if any(k in title.lower() for k in keywords):
                    print(f"{'  ' * depth}- {title}: page {page + 1}")
            except Exception:
                pass

if reader.outline:
    walk(reader.outline)
