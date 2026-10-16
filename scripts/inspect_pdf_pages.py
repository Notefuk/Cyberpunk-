import sys
import os
from pypdf import PdfReader

# Force UTF-8 standard output for Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

def inspect_pdf(pdf_path: str, start_page: int, end_page: int):
    if not os.path.isabs(pdf_path):
        pdf_path = os.path.abspath(pdf_path)

    if not os.path.exists(pdf_path):
        # Fallback check if full date filename or similar exists in directory
        dirname = os.path.dirname(pdf_path)
        basename = os.path.basename(pdf_path)
        if os.path.exists(dirname):
            candidates = [f for f in os.listdir(dirname) if basename.replace(".pdf", "") in f and f.endswith(".pdf")]
            if candidates:
                pdf_path = os.path.join(dirname, candidates[0])
            else:
                print(f"Error: PDF not found at {pdf_path}", file=sys.stderr)
                sys.exit(1)
        else:
            print(f"Error: Path does not exist: {pdf_path}", file=sys.stderr)
            sys.exit(1)

    print(f"=== Inspecting '{pdf_path}' (Pages {start_page} to {end_page}) ===")
    reader = PdfReader(pdf_path)
    total_pages = len(reader.pages)

    if start_page < 1 or end_page < start_page:
        print(f"Error: Invalid page range. Must be 1 <= start <= end. Total pages: {total_pages}", file=sys.stderr)
        sys.exit(1)

    actual_end = min(end_page, total_pages)

    for p in range(start_page - 1, actual_end):
        page_num = p + 1
        page = reader.pages[p]
        text = page.extract_text() or ""
        print(f"\n--- PAGE {page_num} of {total_pages} ---")
        print(text.strip())

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python inspect_pdf_pages.py <pdf_path> <start_page> <end_page>")
        sys.exit(1)

    path_arg = sys.argv[1]
    start_arg = int(sys.argv[2])
    end_arg = int(sys.argv[3])
    inspect_pdf(path_arg, start_arg, end_arg)
