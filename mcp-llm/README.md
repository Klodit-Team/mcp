# MCP LLM Server

Provides access to Large Language Model capabilities.

## Tools

- `complete(sensitivity, prompt, context, rules)` — generate completion with given context
- `score_justification(sensitivity, prompt, context, rules)` — score a textual justification
- `classify_risk(sensitivity, prompt, context)` — classify risk level
- `detect_bias(sensitivity, prompt, context)` — detect discriminatory clauses in text
- `draft_cdc_section(sensitivity, prompt, context, sectionType)` — draft a CDC section
- `extract_fields(fileUrl, schema)` — extract structured fields from a document

## Environment Variables

- `LLM_ONPREM_ENDPOINT` — on-premise LLM API endpoint
- `LLM_EXTERNAL_ENDPOINT` — external LLM API endpoint
- `AUDIT_BASE_URL` — audit service URL for logging decisions (default: `http://localhost:3009`)
- `AUDIT_SERVICE_TOKEN` — optional service auth token
- `AUDIT_SERVICE_TOKEN_HEADER` — header name (default: `x-service-token`)
