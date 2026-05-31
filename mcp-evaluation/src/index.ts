import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { loadConfig } from "./config.js";
import { EvaluationClient } from "./evaluationClient.js";

const getGrilleEvaluationSchema = z.object({
  aoId: z.string().min(1),
});

const getEvaluationContextSchema = z.object({
  aoId: z.string().min(1).optional(),
  evaluationId: z.string().min(1).optional(),
});

const writeIaNotesSchema = z.object({
  evaluationId: z.string().min(1),
  submissionId: z.string().min(1),
  criterionId: z.string().min(1),
  score: z.number().min(0).max(100),
  justification: z.string().min(1),
  confidence: z.number().min(0).max(100).optional(),
});

const writeScoreIaSchema = z.object({
  evaluationId: z.string().min(1),
  submissionId: z.string().min(1),
  scoreTechnique: z.number().min(0).max(100).optional(),
  scoreFinancier: z.number().min(0).max(100).optional(),
  scoreGlobal: z.number().min(0).max(100),
  ranking: z.number().int().positive().optional(),
  recommendation: z.string().min(1),
});

const writeComparisonSchema = z.object({
  evaluationId: z.string().min(1),
  submissionId: z.string().min(1),
  divergenceScore: z.number().min(0).max(100),
  characterization: z.string().min(1),
  details: z.record(z.any()).optional(),
});

const tools = [
  {
    name: "get_grille_evaluation",
    description:
      "Return the complete evaluation grid for an Appel d'Offres.",
    inputSchema: zodToJsonSchema(getGrilleEvaluationSchema),
  },
  {
    name: "get_evaluation_context",
    description:
      "Return the current state of an evaluation session.",
    inputSchema: zodToJsonSchema(getEvaluationContextSchema),
  },
  {
    name: "write_ia_notes",
    description:
      "Store an AI-generated note for a criterion with justification and confidence.",
    inputSchema: zodToJsonSchema(writeIaNotesSchema),
  },
  {
    name: "write_score_ia",
    description:
      "Store aggregated AI scores and recommendation.",
    inputSchema: zodToJsonSchema(writeScoreIaSchema),
  },
  {
    name: "write_comparison",
    description:
      "Store the comparison between human and AI decisions.",
    inputSchema: zodToJsonSchema(writeComparisonSchema),
  },
];

const server = new Server(
  {
    name: "mcp-evaluation",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const config = loadConfig();
const evaluationClient = new EvaluationClient(config);

function unwrapData(payload: any) {
  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data;
  }
  return payload;
}

async function resolveEvaluationId(aoId: string) {
  const response = await evaluationClient.listEvaluations({ appelOffreId: aoId });
  const data = unwrapData(response);
  if (Array.isArray(data) && data.length > 0) {
    return data[0].id;
  }
  if (data?.items && data.items.length > 0) {
    return data.items[0].id;
  }
  throw new Error(`No evaluation found for AO ${aoId}`);
}

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;
  const input = request.params.arguments ?? {};

  switch (toolName) {
    case "get_grille_evaluation": {
      const parsed = getGrilleEvaluationSchema.parse(input);
      const evaluationId = await resolveEvaluationId(parsed.aoId);
      const response = await evaluationClient.getCriteria(evaluationId);
      const data = unwrapData(response);
      return { content: [{ type: "text", text: JSON.stringify(data) }] };
    }
    case "get_evaluation_context": {
      const parsed = getEvaluationContextSchema.parse(input);
      const evaluationId = parsed.evaluationId
        ? parsed.evaluationId
        : parsed.aoId
          ? await resolveEvaluationId(parsed.aoId)
          : null;
      if (!evaluationId) {
        throw new Error("evaluationId or aoId is required");
      }
      const response = await evaluationClient.getEvaluation(evaluationId);
      const data = unwrapData(response);
      return { content: [{ type: "text", text: JSON.stringify(data) }] };
    }
    case "write_ia_notes": {
      const parsed = writeIaNotesSchema.parse(input);
      const response = await evaluationClient.upsertNote(
        parsed.evaluationId,
        parsed.submissionId,
        {
          criterionId: parsed.criterionId,
          note: parsed.score,
          justification: parsed.justification,
          source: "IA",
          scoreConfiance: parsed.confidence,
        }
      );
      const data = unwrapData(response);
      return { content: [{ type: "text", text: JSON.stringify(data) }] };
    }
    case "write_score_ia": {
      const parsed = writeScoreIaSchema.parse(input);
      const result = await evaluationClient.writeScoreIa(parsed);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
    case "write_comparison": {
      const parsed = writeComparisonSchema.parse(input);
      const result = await evaluationClient.writeComparison(parsed);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
