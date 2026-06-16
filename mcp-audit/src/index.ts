import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { loadConfig } from "./config.js";
import { AuditClient } from "./auditClient.js";

const logIaDecisionSchema = z.object({
  agentName: z.string().min(1),
  entite: z.string().min(1),
  entiteId: z.string().optional(),
  action: z.string().min(1),
  details: z.string().optional(),
  horodatage: z.string().min(1),
  userId: z.string().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

const createIncidentIaSchema = z.object({
  typeIncident: z.string().min(1),
  entiteSource: z.string().min(1),
  entiteId: z.string().min(1),
  modeleIa: z.string().min(1),
  decisionIa: z.string().optional(),
  decisionHumaine: z.string().optional(),
  ecartScore: z.number().optional(),
  confianceIa: z.number().min(0).max(1).optional(),
  gravite: z.string().min(1),
  dateDetection: z.string().min(1),
});

const tools = [
  {
    name: "log_ia_decision",
    description:
      "Append a timestamped audit entry for an AI decision.",
    inputSchema: zodToJsonSchema(logIaDecisionSchema),
  },
  {
    name: "create_incident_ia",
    description:
      "Create a formal AI incident record with severity.",
    inputSchema: zodToJsonSchema(createIncidentIaSchema),
  },
];

const server = new Server(
  {
    name: "mcp-audit",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const config = loadConfig();
const auditClient = new AuditClient(config);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;
  const input = request.params.arguments ?? {};

  switch (toolName) {
    case "log_ia_decision": {
      const parsed = logIaDecisionSchema.parse(input);
      const response = await auditClient.logDecision({
        user_id: parsed.userId,
        action: parsed.action,
        entite: parsed.entite,
        entite_id: parsed.entiteId,
        details: parsed.agentName ? `[Agent: ${parsed.agentName}] ${parsed.details || ''}` : parsed.details,
        ip_address: parsed.ipAddress,
        user_agent: parsed.userAgent,
        horodatage: parsed.horodatage,
      });
      return { content: [{ type: "text", text: JSON.stringify(response) }] };
    }
    case "create_incident_ia": {
      const parsed = createIncidentIaSchema.parse(input);
      const response = await auditClient.createIncident({
        type_incident: parsed.typeIncident,
        entite_source: parsed.entiteSource,
        entite_id: parsed.entiteId,
        modele_ia: parsed.modeleIa,
        decision_ia: parsed.decisionIa,
        decision_humaine: parsed.decisionHumaine,
        ecart_score: parsed.ecartScore,
        confiance_ia: parsed.confianceIa,
        gravite: parsed.gravite,
        date_detection: parsed.dateDetection,
      });
      return { content: [{ type: "text", text: JSON.stringify(response) }] };
    }
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
