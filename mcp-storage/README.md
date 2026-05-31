# MCP Storage Server

Provides access to the sovereign object store.

## Tools

- `get_presigned_url(objectKey, expiresIn)` — generate a presigned URL for an object
- `stream_text(objectKey)` — stream text content from an object
- `get_metadata(objectKey)` — get object metadata

## Environment Variables

- `STORAGE_BASE_URL` — storage service URL (default: `http://localhost:4013`)
- `STORAGE_TIMEOUT_MS` — timeout (default: `15000`)
- `STORAGE_PRESIGNED_URL_PATH` — path for presigned URLs (default: `/presigned-url`)
- `STORAGE_STREAM_TEXT_PATH` — path for streaming text (default: `/stream-text`)
- `STORAGE_METADATA_PATH` — path for metadata (default: `/metadata`)
