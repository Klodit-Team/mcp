# MCP AO Server

Wraps the **appel-offres** (tender) service API.

## Tools

- `get_appel_offres(aoId)` — fetch tender details
- `list_ao_by_status(statuses, activeOnly)` — list tenders by status
- `get_criteres_evaluation(aoId)` — fetch evaluation criteria
- `get_cahier_des_charges(aoId)` — fetch terms of reference
- `update_gre_a_gre_score(gagId, modeleIa, scoreConformite, recommandation, justificationIa, confianceScore)` — update direct-award score

## Environment Variables

- `AO_BASE_URL` — backend URL (default: `http://localhost:8003`)
- `AO_TIMEOUT_MS` — timeout (default: `10000`)
- `AO_SERVICE_TOKEN` — optional service auth token
- `AO_SERVICE_TOKEN_HEADER` — header name (default: `x-service-token`)
- `AO_GRE_A_GRE_SCORE_ENDPOINT` — optional override for gre_a_gre scoring endpoint

## Dependencies

Requires `@modelcontextprotocol/sdk`, `axios`, `zod`.
