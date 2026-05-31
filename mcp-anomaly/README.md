# MCP Anomaly Server

Provides anomaly detection tools for tender analysis.

## Tools

- `detect_collusion(bids)` — detect collusion patterns among bidders
- `detect_price_pattern(bids)` — detect unusual price patterns
- `detect_saucissonnage(aoSet)` — detect bid splitting across related tenders

## Environment Variables

- `ANOMALY_BASE_URL` — anomaly detection service URL (default: `http://localhost:4012`)
- `ANOMALY_TIMEOUT_MS` — timeout (default: `20000`)
- `ANOMALY_DETECT_COLLUSION_PATH` — path for collusion detection (default: `/detect-collusion`)
- `ANOMALY_DETECT_PRICE_PATTERN_PATH` — path for price pattern (default: `/detect-price-pattern`)
- `ANOMALY_DETECT_SAUCISSONNAGE_PATH` — path for saucissonnage detection (default: `/detect-saucissonnage`)
