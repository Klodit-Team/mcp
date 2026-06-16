import axios, { AxiosInstance } from "axios";
import { LlmConfig } from "./config.js";

export type Sensitivity = "highly_sensitive" | "sensitive" | "non_sensitive";
export type RouteDecision = "on_prem" | "external" | "gemini";

export type LlmRequest = {
  task: string;
  input: Record<string, unknown>;
  sensitivity: Sensitivity;
  route?: RouteDecision;
  strippedInput?: Record<string, unknown>;
};

const GEMINI_URL = (key: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;

export class LlmRouter {
  private readonly config: LlmConfig;
  private readonly http: AxiosInstance;

  constructor(config: LlmConfig) {
    this.config = config;
    this.http = axios.create({ timeout: config.timeoutMs });
  }

  decideRoute(sensitivity: Sensitivity): RouteDecision {
    if (this.config.geminiApiKey) return "gemini";
    if (sensitivity === "non_sensitive" && this.config.externalEndpoint) return "external";
    return "on_prem";
  }

  async call(request: LlmRequest) {
    const route = request.route ?? this.decideRoute(request.sensitivity);

    if (route === "external") {
      if (!this.config.externalEndpoint) {
        throw new Error("LLM_EXTERNAL_ENDPOINT is not configured");
      }
      const response = await this.http.post(this.config.externalEndpoint, request);
      return { route, data: response.data };
    }

    if (route === "gemini") {
      if (!this.config.geminiApiKey) {
        throw new Error("GEMINI_API_KEY is not configured");
      }
      const input = request.input;
      const prompt = (input.prompt as string | undefined) ?? "";
      const context = input.context as Record<string, unknown> | undefined;

      const userText = context && Object.keys(context).length > 0
        ? `Context:\n${JSON.stringify(context, null, 2)}\n\n${prompt}`
        : prompt;

      const response = await this.callWithRetry(() =>
        this.http.post(GEMINI_URL(this.config.geminiApiKey!), {
          contents: [{ role: "user", parts: [{ text: userText }] }],
          systemInstruction: {
            parts: [{ text: `You are an AI assistant for a public procurement platform. Task: ${request.task}. Always return valid JSON as specified in the prompt.` }],
          },
          generationConfig: { responseMimeType: "application/json" },
        }),
      );

      const rawText: string =
        (response.data as any)?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
      return { route, data: this.parseJson(rawText) };
    }

    if (!this.config.onPremEndpoint) {
      throw new Error("LLM_ONPREM_ENDPOINT is not configured");
    }
    const response = await this.http.post(this.config.onPremEndpoint, request);
    return { route, data: response.data };
  }

  private async callWithRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
    let lastErr: unknown;
    for (let i = 0; i < retries; i++) {
      try { return await fn(); } catch (e: any) {
        const code = e?.response?.status;
        if (code === 503 || code === 429) {
          lastErr = e;
          await new Promise(r => setTimeout(r, 1_000 * (i + 1)));
          continue;
        }
        throw e;
      }
    }
    throw lastErr;
  }

  private parseJson(text: string): unknown {
    const cleaned = text
      .replace(/^```(?:json)?\s*/m, "")
      .replace(/\s*```\s*$/m, "")
      .trim();
    try {
      return JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/s);
      if (match) { try { return JSON.parse(match[1]); } catch {} }
      return { raw: text };
    }
  }
}
