import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { loadConfig } from "./config.js";
import { DocumentsClient } from "./documentsClient.js";
import { publishOcrResult } from "./ocrPublisher.js";

const listPiecesAdminSchema = z.object({
  submissionId: z.string().min(1),
});

const getDocumentTextSchema = z.object({
  documentId: z.string().min(1),
});

const getDocumentUrlSchema = z.object({
  documentId: z.string().min(1),
});

const writeOcrResultSchema = z.object({
  documentId: z.string().min(1),
  pieceId: z.string().min(1).optional(),
  typeAnalyse: z.string().min(1),
  texteExtrait: z.string().optional(),
  scoreConfiance: z.number().min(0).max(1).optional(),
  isConforme: z.boolean().optional(),
  anomalies: z.any().optional(),
});

const writePieceValidationSchema = z.object({
  pieceId: z.string().min(1),
  isValide: z.boolean(),
  reason: z.string().optional(),
});

const tools = [
  {
    name: "list_pieces_admin",
    description:
      "List administrative pieces attached to a submission with type and identifier.",
    inputSchema: zodToJsonSchema(listPiecesAdminSchema),
  },
  {
    name: "get_document_text",
    description:
      "Return extracted text for a document from cache if available.",
    inputSchema: zodToJsonSchema(getDocumentTextSchema),
  },
  {
    name: "get_document_url",
    description:
      "Return a time-limited, read-only reference to a document file.",
    inputSchema: zodToJsonSchema(getDocumentUrlSchema),
  },
  {
    name: "write_ocr_result",
    description:
      "Store OCR/NLP analysis results for a document piece.",
    inputSchema: zodToJsonSchema(writeOcrResultSchema),
  },
  {
    name: "write_piece_validation",
    description:
      "Write a validation status and reasoning for an administrative piece.",
    inputSchema: zodToJsonSchema(writePieceValidationSchema),
  },
];

const server = new Server(
  {
    name: "mcp-documents",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const config = loadConfig();
const documentsClient = new DocumentsClient(config);

function unwrapData(payload: any) {
  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data;
  }
  return payload;
}

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;
  const input = request.params.arguments ?? {};

  switch (toolName) {
    case "list_pieces_admin": {
      const parsed = listPiecesAdminSchema.parse(input);
      const response = await documentsClient.listPiecesAdmin(
        parsed.submissionId
      );
      const data = unwrapData(response);
      return { content: [{ type: "text", text: JSON.stringify(data) }] };
    }
    case "get_document_text": {
      const parsed = getDocumentTextSchema.parse(input);
      const response = await documentsClient.getDocumentText(parsed.documentId);
      const data = unwrapData(response);
      return { content: [{ type: "text", text: JSON.stringify(data) }] };
    }
    case "get_document_url": {
      const parsed = getDocumentUrlSchema.parse(input);
      const response = await documentsClient.getDocumentUrl(parsed.documentId);
      const data = unwrapData(response);
      return { content: [{ type: "text", text: JSON.stringify(data) }] };
    }
    case "write_ocr_result": {
      const parsed = writeOcrResultSchema.parse(input);
      await publishOcrResult(config, parsed);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ status: "queued", documentId: parsed.documentId }),
          },
        ],
      };
    }
    case "write_piece_validation": {
      const parsed = writePieceValidationSchema.parse(input);
      const response = await documentsClient.writePieceValidation(parsed.pieceId, {
        isValide: parsed.isValide,
        reason: parsed.reason,
      });
      const data = unwrapData(response);
      return { content: [{ type: "text", text: JSON.stringify(data) }] };
    }
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
