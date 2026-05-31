# MCP Servers

This directory contains **12 Model Context Protocol (MCP) servers** that wrap microservice APIs and AI/ML capabilities. Each server exposes tools that AI agents can call.

## How MCP Servers Work

Each server runs as a standalone stdio process. They are spawned by AI agents as child processes. The agent configures the spawn using environment variables:

- `MCP_<name>_COMMAND` — command to run (e.g., `tsx`)
- `MCP_<name>_ARGS` — arguments (e.g., `["src/index.ts"]`)
- `MCP_<name>_CWD` — working directory (e.g., `/workspace/mcp/mcp-ao`)

The agent inherits all environment variables, so any backend URLs or tokens configured in the agent's environment are also available to the MCP server.

## Servers

| Folder | MCP Server Name | Description |
|--------|----------------|-------------|
| [mcp-ao](./mcp-ao) | MCP_AO | Wraps appel-offres (tender) service API |
| [mcp-soumissions](./mcp-soumissions) | MCP_SOUMISSIONS | Wraps submission service API |
| [mcp-documents](./mcp-documents) | MCP_DOCUMENTS | Wraps document management service |
| [mcp-evaluation](./mcp-evaluation) | MCP_EVALUATION | Wraps evaluation service API |
| [mcp-users](./mcp-users) | MCP_USERS | Wraps users/service API |
| [mcp-notifications](./mcp-notifications) | MCP_NOTIFICATIONS | Wraps notification service |
| [mcp-audit](./mcp-audit) | MCP_AUDIT | Wraps audit service API |
| [mcp-llm](./mcp-llm) | MCP_LLM | Provides LLM capabilities |
| [mcp-document-analysis](./mcp-document-analysis) | MCP_DOCUMENT_ANALYSIS | Provides document analysis tools |
| [mcp-nlp](./mcp-nlp) | MCP_NLP | Provides NLP capabilities |
| [mcp-anomaly](./mcp-anomaly) | MCP_ANOMALY | Provides anomaly detection tools |
| [mcp-storage](./mcp-storage) | MCP_STORAGE | Provides object storage access |

## Configuration

Each server reads its own configuration from environment variables. See individual server README for details.

Common pattern:
- `*_BASE_URL` — backend service URL
- `*_SERVICE_TOKEN` — optional service auth token
- `*_SERVICE_TOKEN_HEADER` — header name (default: `x-service-token`)
- `*_TIMEOUT_MS` — request timeout

## Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Run a server directly
cd mcp-ao
npx tsx src/index.ts
```

The server will list tools when an MCP client connects with `ListToolsRequest`.
