# MCP Document Analysis Server

Provides document analysis and OCR tools.

## Tools

- `extract_text(fileUrl)` — extract raw text from a document URL
- `extract_fields(fileUrl, schema)` — extract structured fields from a document
- `detect_signature(fileUrl)` — detect presence of signatures

## Environment Variables

- `DOC_ANALYSIS_BASE_URL` — analysis service URL (default: `http://localhost:4011`)
- `DOC_ANALYSIS_TIMEOUT_MS` — timeout (default: `20000`)
- `DOC_ANALYSIS_EXTRACT_TEXT_PATH` — path for text extraction (default: `/extract-text`)
- `DOC_ANALYSIS_EXTRACT_FIELDS_PATH` — path for field extraction (default: `/extract-fields`)
- `DOC_ANALYSIS_DETECT_SIGNATURE_PATH` — path for signature detection (default: `/detect-signature`)
