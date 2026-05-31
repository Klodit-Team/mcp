import axios, { AxiosInstance } from "axios";
import { LlmConfig } from "./config.js";

export type Sensitivity = "highly_sensitive" | "sensitive" | "non_sensitive";
export type RouteDecision = "on_prem" | "external";

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

    if (!this.config.onPremEndpoint) {
      throw new Error("LLM_ONPREM_ENDPOINT is not configured");
    }
    const response = await this.http.post(this.config.onPremEndpoint, request);
    return { route, data: response.data };
  }
}
