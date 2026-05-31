import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { loadConfig } from "./config.js";
import { NotificationsClient } from "./notificationsClient.js";

const sendAiAlertSchema = z.object({
  incidentId: z.string().optional(),
  titre: z.string().min(1),
  message: z.string().min(10),
  typeAlerte: z.string().min(1),
  niveauUrgence: z.string().min(1),
  utilisateursCibles: z.array(z.string().min(1)).min(1),
  donneesContexte: z.record(z.any()).optional(),
  entiteType: z.string().optional(),
  entiteId: z.string().optional(),
});

const tools = [
  {
    name: "send_ai_alert",
    description:
      "Send an AI alert to target users with incident reference and urgency level.",
    inputSchema: zodToJsonSchema(sendAiAlertSchema),
  },
];

const server = new Server(
  {
    name: "mcp-notifications",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const config = loadConfig();
const notificationsClient = new NotificationsClient(config);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;
  const input = request.params.arguments ?? {};

  switch (toolName) {
    case "send_ai_alert": {
      const parsed = sendAiAlertSchema.parse(input);
      const response = await notificationsClient.sendIaAlert(parsed);
      return { content: [{ type: "text", text: JSON.stringify(response) }] };
    }
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
