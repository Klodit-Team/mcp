import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { loadConfig } from "./config.js";
import { StorageClient } from "./storageClient.js";

const getPresignedUrlSchema = z.object({
  objectKey: z.string().min(1),
  expiresInSeconds: z.number().int().positive().optional(),
});

const streamTextChunksSchema = z.object({
  objectKey: z.string().min(1),
  chunkSize: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional(),
});

const getObjectMetadataSchema = z.object({
  objectKey: z.string().min(1),
});

const tools = [
  {
    name: "get_presigned_url",
    description: "Return a time-limited read-only URL for a stored file.",
    inputSchema: zodToJsonSchema(getPresignedUrlSchema),
  },
  {
    name: "stream_text_chunks",
    description: "Stream text content from a stored file in chunks.",
    inputSchema: zodToJsonSchema(streamTextChunksSchema),
  },
  {
    name: "get_object_metadata",
    description: "Return metadata for a stored file.",
    inputSchema: zodToJsonSchema(getObjectMetadataSchema),
  },
];

const server = new Server(
  {
    name: "mcp-storage",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const config = loadConfig();
const client = new StorageClient(config);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;
  const input = request.params.arguments ?? {};

  switch (toolName) {
    case "get_presigned_url": {
      const parsed = getPresignedUrlSchema.parse(input);
      const response = await client.getPresignedUrl(parsed);
      return { content: [{ type: "text", text: JSON.stringify(response) }] };
    }
    case "stream_text_chunks": {
      const parsed = streamTextChunksSchema.parse(input);
      const response = await client.streamTextChunks(parsed);
      return { content: [{ type: "text", text: JSON.stringify(response) }] };
    }
    case "get_object_metadata": {
      const parsed = getObjectMetadataSchema.parse(input);
      const response = await client.getObjectMetadata(parsed);
      return { content: [{ type: "text", text: JSON.stringify(response) }] };
    }
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
