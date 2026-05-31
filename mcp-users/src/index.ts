import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { loadConfig } from "./config.js";
import { UsersClient } from "./usersClient.js";

const getOrganisationProfileSchema = z.object({
  userId: z.string().min(1),
});

const tools = [
  {
    name: "get_organisation_profile",
    description:
      "Return organisation profile including blacklist status and qualification categories.",
    inputSchema: zodToJsonSchema(getOrganisationProfileSchema),
  },
];

const server = new Server(
  {
    name: "mcp-users",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const config = loadConfig();
const usersClient = new UsersClient(config);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;
  const input = request.params.arguments ?? {};

  switch (toolName) {
    case "get_organisation_profile": {
      const parsed = getOrganisationProfileSchema.parse(input);
      const response = await usersClient.getOrganisationProfile(parsed.userId);
      return { content: [{ type: "text", text: JSON.stringify(response) }] };
    }
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
