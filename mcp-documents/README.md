# MCP Documents Server

Wraps the **documents** service API.

## Tools

- `get_document_url(documentId)` — get document URL or reference
- `upload_document(filePath, documentType, metadata)` — upload a document

## Environment Variables

- `DOCUMENTS_BASE_URL` — backend URL (default: `http://localhost:8005`)
- `DOCUMENTS_TIMEOUT_MS` — timeout (default: `10000`)
- `DOCUMENTS_SERVICE_TOKEN` — optional service auth token
- `DOCUMENTS_SERVICE_TOKEN_HEADER` — header name (default: `x-service-token`)
- `DOCUMENTS_OCR_ENDPOINT_TEMPLATE` — optional OCR endpoint template
- `DOCUMENTS_RABBITMQ_URL` — RabbitMQ URL (default: `amqp://localhost:5672`)
- `DOCUMENTS_OCR_RESULTS_QUEUE` — RabbitMQ queue name (default: `documents.ocr.results`)
