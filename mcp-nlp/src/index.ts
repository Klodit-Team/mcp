import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { loadConfig } from "./config.js";
import { NlpClient } from "./nlpClient.js";

const classifyDocumentSchema = z.object({
  text: z.string().min(1),
  categories: z.array(z.string().min(1)).optional(),
});

const checkCompletenessSchema = z.object({
  text: z.string().min(1),
  requiredFields: z.array(z.string().min(1)).min(1),
});

const checkExpiryDatesSchema = z.object({
  text: z.string().min(1),
  alertThresholdDays: z.number().int().positive().optional(),
});

const detectDiscriminatorySchema = z.object({
  text: z.string().min(1),
});

const tools = [
  {
    name: "classify_document",
    description: "Classify a document text into categories.",
    inputSchema: zodToJsonSchema(classifyDocumentSchema),
  },
  {
    name: "check_completeness",
    description: "Check if required fields are present in text.",
    inputSchema: zodToJsonSchema(checkCompletenessSchema),
  },
  {
    name: "check_expiry_dates",
    description: "Detect expired or near-expiry dates in text.",
    inputSchema: zodToJsonSchema(checkExpiryDatesSchema),
  },
  {
    name: "detect_discriminatory_clauses",
    description: "Detect discriminatory or exclusionary clauses in text.",
    inputSchema: zodToJsonSchema(detectDiscriminatorySchema),
  },
];

const server = new Server(
  {
    name: "mcp-nlp",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const config = loadConfig();
const client = new NlpClient(config);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;
  const input = request.params.arguments ?? {};

  switch (toolName) {
    case "classify_document": {
      const parsed = classifyDocumentSchema.parse(input);
      const response = await client.classifyDocument(parsed);
      return { content: [{ type: "text", text: JSON.stringify(response) }] };
    }
    case "check_completeness": {
      const parsed = checkCompletenessSchema.parse(input);
      const response = await client.checkCompleteness(parsed);
      return { content: [{ type: "text", text: JSON.stringify(response) }] };
    }
    case "check_expiry_dates": {
      const parsed = checkExpiryDatesSchema.parse(input);
      const response = await client.checkExpiryDates(parsed);
      return { content: [{ type: "text", text: JSON.stringify(response) }] };
    }
    case "detect_discriminatory_clauses": {
      const parsed = detectDiscriminatorySchema.parse(input);
      const response = await client.detectDiscriminatoryClauses(parsed);
      return { content: [{ type: "text", text: JSON.stringify(response) }] };
    }
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
