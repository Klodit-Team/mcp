import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { loadConfig } from "./config.js";
import { SoumissionClient } from "./soumissionClient.js";
import { AoClient } from "./aoClient.js";

const listSoumissionsSchema = z.object({
  aoId: z.string().min(1),
});

const getOffreTechniqueUrlSchema = z.object({
  soumissionId: z.string().min(1),
});

const getMetadataSoumissionSchema = z.object({
  soumissionId: z.string().min(1),
});

const flagAnomalySchema = z.object({
  soumissionId: z.string().min(1),
  anomalyType: z.string().min(1),
  detail: z.string().min(1),
  confidence: z.number().min(0).max(1),
});

const tools = [
  {
    name: "list_soumissions",
    description: "List anonymized bids for a given Appel d'Offres.",
    inputSchema: zodToJsonSchema(listSoumissionsSchema),
  },
  {
    name: "get_offre_technique_url",
    description:
      "Return a time-limited, read-only reference to a technical offer file. Only allowed after OUVERTURE_PLIS.",
    inputSchema: zodToJsonSchema(getOffreTechniqueUrlSchema),
  },
  {
    name: "get_metadata_soumission",
    description:
      "Return non-identifying metadata about a bid for anomaly analysis.",
    inputSchema: zodToJsonSchema(getMetadataSoumissionSchema),
  },
  {
    name: "flag_anomaly",
    description:
      "Write an anomaly flag against a bid with type, detail, and confidence.",
    inputSchema: zodToJsonSchema(flagAnomalySchema),
  },
];

const server = new Server(
  {
    name: "mcp-soumissions",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const config = loadConfig();
const soumissionClient = new SoumissionClient(config);
const aoClient = new AoClient(config);

function unwrapData(payload: any) {
  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data;
  }
  return payload;
}

function anonymizeSoumission(raw: any) {
  return {
    id: raw.id,
    reference: raw.reference,
    lotId: raw.lotId ?? null,
    statut: raw.statut,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

function buildMetadata(raw: any) {
  return {
    id: raw.id,
    appelOffreId: raw.appelOffreId,
    lotId: raw.lotId ?? null,
    reference: raw.reference,
    statut: raw.statut,
    horodatageServeur: raw.horodatageServeur,
    isElectronique: raw.isElectronique,
    isDansDelai: raw.isDansDelai,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    offreTechnique: raw.offreTechnique
      ? {
          id: raw.offreTechnique.id,
          hashFichier: raw.offreTechnique.hashFichier,
          isConforme: raw.offreTechnique.isConforme,
          observations: raw.offreTechnique.observations,
          createdAt: raw.offreTechnique.createdAt,
        }
      : null,
  };
}

async function assertAoAllowsTechnicalAccess(aoId: string) {
  const aoPayload = await aoClient.getAo(aoId);
  const ao = unwrapData(aoPayload);
  const statut = ao?.statut;
  if (!statut || !config.allowedAoStatuses.includes(statut)) {
    throw new Error(
      `AO status "${statut ?? "unknown"}" does not allow technical offer access.`
    );
  }
}

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;
  const input = request.params.arguments ?? {};

  switch (toolName) {
    case "list_soumissions": {
      const parsed = listSoumissionsSchema.parse(input);
      const response = await soumissionClient.listSoumissionsByAo(parsed.aoId);
      const data = unwrapData(response) ?? [];
      const anonymized = Array.isArray(data)
        ? data.map(anonymizeSoumission)
        : [];
      return { content: [{ type: "text", text: JSON.stringify(anonymized) }] };
    }
    case "get_offre_technique_url": {
      const parsed = getOffreTechniqueUrlSchema.parse(input);
      const detailPayload = await soumissionClient.getSoumissionDetail(
        parsed.soumissionId
      );
      const detail = unwrapData(detailPayload);
      await assertAoAllowsTechnicalAccess(detail.appelOffreId);

      const response = await soumissionClient.getOffreTechnique(
        parsed.soumissionId
      );
      const offre = unwrapData(response);
      const result = {
        soumissionId: parsed.soumissionId,
        url: offre?.fichierUrl,
        hashFichier: offre?.hashFichier,
        createdAt: offre?.createdAt,
      };

      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
    case "get_metadata_soumission": {
      const parsed = getMetadataSoumissionSchema.parse(input);
      const detailPayload = await soumissionClient.getSoumissionDetail(
        parsed.soumissionId
      );
      const detail = unwrapData(detailPayload);
      const metadata = buildMetadata(detail);
      return { content: [{ type: "text", text: JSON.stringify(metadata) }] };
    }
    case "flag_anomaly": {
      const parsed = flagAnomalySchema.parse(input);
      const result = await soumissionClient.flagAnomaly(parsed);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
