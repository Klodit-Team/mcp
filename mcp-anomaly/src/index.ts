import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { loadConfig } from "./config.js";
import { AnomalyClient } from "./anomalyClient.js";

const detectCollusionSchema = z.object({
  bids: z.array(z.record(z.any())).min(1),
});

const detectPricePatternSchema = z.object({
  bids: z.array(z.record(z.any())).min(1),
});

const detectSaucissonnageSchema = z.object({
  aoSet: z.array(z.record(z.any())).min(1),
});

const tools = [
  {
    name: "detect_collusion",
    description: "Detect collusion patterns in anonymised bids.",
    inputSchema: zodToJsonSchema(detectCollusionSchema),
  },
  {
    name: "detect_price_pattern",
    description: "Detect outlier pricing patterns in bids.",
    inputSchema: zodToJsonSchema(detectPricePatternSchema),
  },
  {
    name: "detect_saucissonnage",
    description: "Detect contract splitting across related AOs.",
    inputSchema: zodToJsonSchema(detectSaucissonnageSchema),
  },
];

const server = new Server(
  {
    name: "mcp-anomaly",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const config = loadConfig();
const client = new AnomalyClient(config);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;
  const input = request.params.arguments ?? {};

  switch (toolName) {
    case "detect_collusion": {
      const parsed = detectCollusionSchema.parse(input);
      const response = await client.detectCollusion(parsed);
      return { content: [{ type: "text", text: JSON.stringify(response) }] };
    }
    case "detect_price_pattern": {
      const parsed = detectPricePatternSchema.parse(input);
      const response = await client.detectPricePattern(parsed);
      return { content: [{ type: "text", text: JSON.stringify(response) }] };
    }
    case "detect_saucissonnage": {
      const parsed = detectSaucissonnageSchema.parse(input);
      const response = await client.detectSaucissonnage(parsed);
      return { content: [{ type: "text", text: JSON.stringify(response) }] };
    }
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
