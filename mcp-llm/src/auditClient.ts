import axios, { AxiosInstance } from "axios";
import { LlmConfig } from "./config.js";

export class AuditClient {
  private readonly http?: AxiosInstance;
  private readonly config: LlmConfig;

  constructor(config: LlmConfig) {
    this.config = config;
    if (config.auditBaseUrl) {
      this.http = axios.create({ baseURL: config.auditBaseUrl });
    }
  }

  private buildHeaders(): Record<string, string> {
    if (!this.config.auditServiceToken) {
      return {};
    }

    return {
      [this.config.auditServiceTokenHeader]: this.config.auditServiceToken,
    };
  }

  async logDecision(details: Record<string, unknown>) {
    if (!this.http) {
      return;
    }

    await this.http.post(
      "/audit/logs",
      {
        action: "llm_request",
        entite: "llm",
        details: JSON.stringify(details),
        horodatage: new Date().toISOString(),
      },
      { headers: this.buildHeaders() }
    );
  }
}
