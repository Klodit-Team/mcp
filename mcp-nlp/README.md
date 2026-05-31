# MCP NLP Server

Provides Natural Language Processing capabilities.

## Tools

- `classify_document(text, categories)` — classify a document into categories
- `check_completeness(documentText, requiredElements)` — check if document contains required sections
- `check_expiry_dates(documentText, referenceDate)` — validate document expiry dates
- `detect_discriminatory_clauses(prompt, context)` — detect discriminatory clauses in text

## Environment Variables

- `NLP_BASE_URL` — NLP service URL (default: `http://localhost:4014`)
- `NLP_TIMEOUT_MS` — timeout (default: `15000`)
- `NLP_CLASSIFY_DOCUMENT_PATH` — path for classification (default: `/classify-document`)
- `NLP_CHECK_COMPLETENESS_PATH` — path for completeness (default: `/check-completeness`)
- `NLP_CHECK_EXPIRY_DATES_PATH` — path for expiry check (default: `/check-expiry-dates`)
- `NLP_DETECT_DISCRIMINATORY_PATH` — path for bias detection (default: `/detect-discriminatory-clauses`)
