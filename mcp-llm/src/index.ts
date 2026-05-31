import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { loadConfig } from "./config.js";
import { LlmRouter, Sensitivity } from "./llmRouter.js";
import { stripPayload } from "./piiStripper.js";
import { AuditClient } from "./auditClient.js";

const baseRequestSchema = z.object({
  sensitivity: z.enum(["highly_sensitive", "sensitive", "non_sensitive"]),
  prompt: z.string().min(1),
  context: z.record(z.any()).optional(),
});

const completeSchema = baseRequestSchema.extend({
  maxTokens: z.number().int().positive().optional(),
});

const detectBiasSchema = baseRequestSchema;

const scoreJustificationSchema = baseRequestSchema.extend({
  rules: z.array(z.string().min(1)).optional(),
});

const draftCdcSectionSchema = baseRequestSchema.extend({
  sectionType: z.string().min(1),
});

const classifyRiskSchema = baseRequestSchema.extend({
  categories: z.array(z.string().min(1)).optional(),
});

const tools = [
  {
    name: "complete",
    description: "Generate a text completion using the routed LLM.",
    inputSchema: zodToJsonSchema(completeSchema),
  },
  {
    name: "detect_bias",
    description: "Detect discriminatory or biased clauses in text.",
    inputSchema: zodToJsonSchema(detectBiasSchema),
  },
  {
    name: "score_justification",
    description: "Score a justification text against regulatory rules.",
    inputSchema: zodToJsonSchema(scoreJustificationSchema),
  },
  {
    name: "draft_cdc_section",
    description: "Draft a CDC section for a given type and context.",
    inputSchema: zodToJsonSchema(draftCdcSectionSchema),
  },
  {
    name: "classify_risk",
    description: "Classify a text into risk categories with confidence.",
    inputSchema: zodToJsonSchema(classifyRiskSchema),
  },
];

const server = new Server(
  {
    name: "mcp-llm",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const config = loadConfig();
const router = new LlmRouter(config);
const audit = new AuditClient(config);

async function executeTask(
  task: string,
  payload: Record<string, unknown>,
  sensitivity: Sensitivity
) {
  const strippedInput = stripPayload(payload);
  const route = router.decideRoute(sensitivity);
  const request = {
    task,
    input: payload,
    strippedInput,
    sensitivity,
    route,
  };

  const result = await router.call(request);
  await audit.logDecision({
    task,
    sensitivity,
    route: result.route,
    strippedInput,
  });

  return result.data;
}

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;
  const input = request.params.arguments ?? {};

  switch (toolName) {
    case "complete": {
      const parsed = completeSchema.parse(input);
      const data = await executeTask(
        "complete",
        {
          prompt: parsed.prompt,
          context: parsed.context,
          maxTokens: parsed.maxTokens,
        },
        parsed.sensitivity
      );
      return { content: [{ type: "text", text: JSON.stringify(data) }] };
    }
    case "detect_bias": {
      const parsed = detectBiasSchema.parse(input);
      const data = await executeTask(
        "detect_bias",
        { prompt: parsed.prompt, context: parsed.context },
        parsed.sensitivity
      );
      return { content: [{ type: "text", text: JSON.stringify(data) }] };
    }
    case "score_justification": {
      const parsed = scoreJustificationSchema.parse(input);
      const data = await executeTask(
        "score_justification",
        {
          prompt: parsed.prompt,
          context: parsed.context,
          rules: parsed.rules,
        },
        parsed.sensitivity
      );
      return { content: [{ type: "text", text: JSON.stringify(data) }] };
    }
    case "draft_cdc_section": {
      const parsed = draftCdcSectionSchema.parse(input);
      const data = await executeTask(
        "draft_cdc_section",
        {
          prompt: parsed.prompt,
          context: parsed.context,
          sectionType: parsed.sectionType,
        },
        parsed.sensitivity
      );
      return { content: [{ type: "text", text: JSON.stringify(data) }] };
    }
    case "classify_risk": {
      const parsed = classifyRiskSchema.parse(input);
      const data = await executeTask(
        "classify_risk",
        {
          prompt: parsed.prompt,
          context: parsed.context,
          categories: parsed.categories,
        },
        parsed.sensitivity
      );
      return { content: [{ type: "text", text: JSON.stringify(data) }] };
    }
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
