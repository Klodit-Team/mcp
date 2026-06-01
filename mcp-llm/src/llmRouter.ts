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

export class LlmRouter {
  private readonly config: LlmConfig;
  private readonly http: AxiosInstance;

  constructor(config: LlmConfig) {
    this.config = config;
    this.http = axios.create({ timeout: config.timeoutMs });
  }

  decideRoute(sensitivity: Sensitivity): RouteDecision {
    if (this.config.geminiWeb2ApiEndpoint) {
      return "gemini";
    }
    if (sensitivity === "non_sensitive" && this.config.externalEndpoint) {
      return "external";
    }
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
      if (!this.config.geminiWeb2ApiEndpoint) {
        throw new Error("GEMINI_WEB2API_ENDPOINT is not configured");
      }
      const response = await this.http.post(
        this.config.geminiWeb2ApiEndpoint,
        this.toGeminiRequest(request)
      );
      const data = (response.data as { choices?: Array<{ message?: { content?: string } }> }).choices?.[0]
        ?.message?.content;
      return {
        route,
        data: data ? JSON.parse(data) : response.data,
      };
    }

    if (!this.config.onPremEndpoint) {
      throw new Error("LLM_ONPREM_ENDPOINT is not configured");
    }
    const response = await this.http.post(this.config.onPremEndpoint, request);
    return { route, data: response.data };
  }

  private toGeminiRequest(request: LlmRequest) {
    const input = request.input;
    const prompt = (input.prompt as string | undefined) ?? "";
    const context = input.context as Record<string, unknown> | undefined;

    const messages: Array<{ role: string; content: string }> = [];

    if (context && Object.keys(context).length > 0) {
      messages.push({
        role: "system",
        content: JSON.stringify(context, null, 2),
      });
    }

    messages.push({
      role: "user",
      content: prompt,
    });

    return {
      model: "gemini-3.5-flash",
      messages,
      stream: false,
    };
  }
}
