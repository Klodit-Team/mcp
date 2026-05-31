import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { loadConfig } from "./config.js";
import { DocumentAnalysisClient } from "./documentAnalysisClient.js";

const extractTextSchema = z.object({
  fileUrl: z.string().min(1).optional(),
  storageKey: z.string().min(1).optional(),
  contentType: z.string().optional(),
});

const extractFieldsSchema = z.object({
  fileUrl: z.string().min(1).optional(),
  storageKey: z.string().min(1).optional(),
  schema: z.record(z.any()),
  contentType: z.string().optional(),
});

const detectSignatureSchema = z.object({
  fileUrl: z.string().min(1).optional(),
  storageKey: z.string().min(1).optional(),
  contentType: z.string().optional(),
});

const tools = [
  {
    name: "extract_text",
    description: "Extract raw text from a document.",
    inputSchema: zodToJsonSchema(extractTextSchema),
  },
  {
    name: "extract_fields",
    description: "Extract named fields from a document using a schema.",
    inputSchema: zodToJsonSchema(extractFieldsSchema),
  },
  {
    name: "detect_signature",
    description: "Detect whether a document contains a signature.",
    inputSchema: zodToJsonSchema(detectSignatureSchema),
  },
];

const server = new Server(
  {
    name: "mcp-document-analysis",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const config = loadConfig();
const client = new DocumentAnalysisClient(config);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;
  const input = request.params.arguments ?? {};

  switch (toolName) {
    case "extract_text": {
      const parsed = extractTextSchema.parse(input);
      const response = await client.extractText(parsed);
      return { content: [{ type: "text", text: JSON.stringify(response) }] };
    }
    case "extract_fields": {
      const parsed = extractFieldsSchema.parse(input);
      const response = await client.extractFields(parsed);
      return { content: [{ type: "text", text: JSON.stringify(response) }] };
    }
    case "detect_signature": {
      const parsed = detectSignatureSchema.parse(input);
      const response = await client.detectSignature(parsed);
      return { content: [{ type: "text", text: JSON.stringify(response) }] };
    }
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
