#!/usr/bin/env python3
"""
Read and extract text from Microsoft Word (.docx) documents.
Usage: python read_docx.py <path/to/document.docx>
"""

import sys
import zipfile
import xml.etree.ElementTree as ET


def extract_text_from_docx(docx_path):
    """Extract text content from a .docx file."""
    try:
        with zipfile.ZipFile(docx_path, 'r') as z:
            xml_content = z.read('word/document.xml')
        
        # Register namespace
        namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        root = ET.fromstring(xml_content)
        
        # Extract all paragraph text
        paragraphs = []
        for paragraph in root.findall('.//w:p', namespaces):
            paragraph_text = []
            for text_elem in paragraph.findall('.//w:t', namespaces):
                if text_elem.text:
                    paragraph_text.append(text_elem.text)
            if paragraph_text:
                paragraphs.append(''.join(paragraph_text))
        
        return '\n'.join(paragraphs)
    
    except FileNotFoundError:
        return f"Error: File not found - {docx_path}"
    except zipfile.BadZipFile:
        return f"Error: Invalid .docx file - {docx_path}"
    except Exception as e:
        return f"Error reading document: {str(e)}"


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python read_docx.py <path/to/document.docx>")
        sys.exit(1)
    
    docx_path = sys.argv[1]
    text = extract_text_from_docx(docx_path)
    print(text)
