---
name: docx-reader
description: Read and extract text content from Microsoft Word documents (.docx files). Use when you need to extract text, tables, or structured content from Word documents for analysis, summarization, or data extraction. Supports extracting plain text, preserving document structure, and handling Chinese/English mixed content.
---

# DOCX Reader

Extract text content from Microsoft Word (.docx) documents.

## Usage

Use the provided Python script to extract text from .docx files:

```bash
python scripts/read_docx.py <path/to/document.docx>
```

## Features

- Extracts all text content from the document
- Preserves paragraph structure
- Handles Chinese and English text
- Works with tables and formatted content

## Example

```bash
python scripts/read_docx.py "C:\Users\gupo\.openclaw\media\inbound\小古健康商业计划20260227.docx"
```

## Output

The script outputs plain text to stdout, which can be:
- Displayed directly
- Redirected to a file
- Piped to other commands

## Limitations

- Does not preserve complex formatting (fonts, colors, styles)
- Tables are converted to text
- Images are not extracted
