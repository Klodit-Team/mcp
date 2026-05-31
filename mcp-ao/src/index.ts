import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { AoClient } from "./aoClient.js";
import { loadConfig } from "./config.js";

const getAppelOffresSchema = z.object({
  aoId: z.string().min(1),
});

const listAoByStatusSchema = z.object({
  statut: z.string().min(1),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  wilaya: z.string().optional(),
  secteurActivite: z.string().optional(),
  typeProcedure: z.string().optional(),
});

const getCriteresEvaluationSchema = z.object({
  aoId: z.string().min(1),
});

const getCahierDesChargesSchema = z.object({
  aoId: z.string().min(1),
});

const updateGreAGreScoreSchema = z.object({
  gagId: z.string().min(1),
  modeleIa: z.string().min(1),
  scoreConformite: z.number().min(0).max(100),
  recommandation: z.string().min(1),
  justificationIa: z.string().min(1),
  confianceScore: z.number().min(0).max(100),
});

const tools = [
  {
    name: "get_appel_offres",
    description:
      "Retrieve the full Appel d'Offres record for a given identifier.",
    inputSchema: zodToJsonSchema(getAppelOffresSchema),
  },
  {
    name: "list_ao_by_status",
    description:
      "List Appels d'Offres filtered by status, with optional pagination and filters.",
    inputSchema: zodToJsonSchema(listAoByStatusSchema),
  },
  {
    name: "get_criteres_evaluation",
    description:
      "Retrieve the evaluation criteria grid for a given Appel d'Offres.",
    inputSchema: zodToJsonSchema(getCriteresEvaluationSchema),
  },
  {
    name: "get_cahier_des_charges",
    description:
      "Return the CDC document reference (presigned URL) for a given Appel d'Offres.",
    inputSchema: zodToJsonSchema(getCahierDesChargesSchema),
  },
  {
    name: "update_gre_a_gre_score",
    description:
      "Store AI conformity score and recommendation for a gre-a-gre request.",
    inputSchema: zodToJsonSchema(updateGreAGreScoreSchema),
  },
];

const server = new Server(
  {
    name: "mcp-ao",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const config = loadConfig();
const aoClient = new AoClient(config);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;
  const input = request.params.arguments ?? {};

  switch (toolName) {
    case "get_appel_offres": {
      const parsed = getAppelOffresSchema.parse(input);
      const result = await aoClient.getAppelOffres(parsed.aoId);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
    case "list_ao_by_status": {
      const parsed = listAoByStatusSchema.parse(input);
      const result = await aoClient.listAppelsOffres(parsed);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
    case "get_criteres_evaluation": {
      const parsed = getCriteresEvaluationSchema.parse(input);
      const result = await aoClient.getCriteresEvaluation(parsed.aoId);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
    case "get_cahier_des_charges": {
      const parsed = getCahierDesChargesSchema.parse(input);
      const result = await aoClient.getCahierDesCharges(parsed.aoId);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
    case "update_gre_a_gre_score": {
      const parsed = updateGreAGreScoreSchema.parse(input);
      const result = await aoClient.updateGreAGreScore(parsed);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
