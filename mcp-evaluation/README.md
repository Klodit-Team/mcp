# MCP Evaluation Server

Wraps the **evaluation** service API.

## Tools

- `get_grille_evaluation(aoId)` — fetch evaluation grid/criteria
- `get_evaluation_context(aoId)` — fetch evaluation context
- `write_ia_notes(evaluationId, submissionId, criterionId, score, justification, confidence)` — write AI scoring notes
- `write_score_ia(evaluationId, submissionId, scoreTechnique, scoreFinancier, scoreGlobal, ranking, recommendation)` — write aggregate AI score

## Environment Variables

- `EVALUATION_BASE_URL` — backend URL (default: `http://localhost:8008`)
- `EVALUATION_TIMEOUT_MS` — timeout (default: `10000`)
- `EVALUATION_SERVICE_TOKEN` — optional service auth token
- `EVALUATION_SERVICE_TOKEN_HEADER` — header name (default: `x-service-token`)
- `EVALUATION_SCORE_IA_ENDPOINT` — optional endpoint for AI score
- `EVALUATION_COMPARISON_ENDPOINT` — optional endpoint for comparison
