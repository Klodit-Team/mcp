# MCP Audit Server

Wraps the **audit** service API.

## Tools

- `log_ia_decision(agentName, entite, entiteId, action, details, horodatage)` — log an AI decision for audit trail
- `create_incident(agentName, entite, entiteId, action, severity, details, horodatage)` — create an incident record

## Environment Variables

- `AUDIT_BASE_URL` — backend URL (default: `http://localhost:3009`)
- `AUDIT_TIMEOUT_MS` — timeout (default: `10000`)
- `AUDIT_SERVICE_TOKEN` — optional service auth token
- `AUDIT_SERVICE_TOKEN_HEADER` — header name (default: `x-service-token`)
