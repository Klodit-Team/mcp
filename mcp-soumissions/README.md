# MCP Soumissions Server

Wraps the **soumission** (submission) service API.

## Tools

- `list_soumissions(aoId)` — list submissions for a tender
- `get_offre_technique_url(soumissionId)` — get technical offer URL
- `get_metadata_soumission(soumissionId)` — get submission metadata
- `flag_anomaly(soumissionId, anomalyType, detail, confidence)` — flag a submission as anomalous (requires SOUMMISSION_ANOMALY_ENDPOINT)

## Environment Variables

- `SOUMMISSION_BASE_URL` — backend URL (default: `http://localhost:8004`)
- `AO_BASE_URL` — AO service URL for cross-checks (default: `http://localhost:8003`)
- `SOUMMISSION_TIMEOUT_MS` — timeout (default: `10000`)
- `SOUMMISSION_SERVICE_TOKEN` — optional service auth token
- `SOUMMISSION_SERVICE_TOKEN_HEADER` — header name (default: `x-service-token`)
- `SOUMMISSION_ALLOWED_AO_STATUSES` — allowed tender statuses (default: `OUVERTURE_PLIS,EVALUATION,ATTRIBUE,CLOTURE`)
- `SOUMMISSION_ANOMALY_ENDPOINT` — required for flag_anomaly
