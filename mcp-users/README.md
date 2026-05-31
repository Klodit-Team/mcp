# MCP Users Server

Wraps the **users** service API.

## Tools

- `get_organisation_profile(userId)` — fetch user or organisation profile

## Environment Variables

- `USERS_BASE_URL` — backend URL (default: `http://localhost:3002`)
- `USERS_TIMEOUT_MS` — timeout (default: `10000`)
- `USERS_SERVICE_TOKEN` — optional service auth token
- `USERS_SERVICE_TOKEN_HEADER` — header name (default: `x-service-token`)
