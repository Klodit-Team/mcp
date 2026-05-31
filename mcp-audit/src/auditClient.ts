import axios, { AxiosInstance } from "axios";
import { AuditConfig } from "./config.js";

export class AuditClient {
  private readonly http: AxiosInstance;
  private readonly config: AuditConfig;

  constructor(config: AuditConfig) {
    this.config = config;
    this.http = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeoutMs,
    });
  }

  private buildHeaders(): Record<string, string> {
    if (!this.config.serviceToken) {
      return {};
    }

    return {
      [this.config.serviceTokenHeader]: this.config.serviceToken,
    };
  }

  async logDecision(payload: Record<string, unknown>) {
    const response = await this.http.post("/audit/logs", payload, {
      headers: this.buildHeaders(),
    });
    return response.data;
  }

  async createIncident(payload: Record<string, unknown>) {
    const response = await this.http.post("/incidents", payload, {
      headers: this.buildHeaders(),
    });
    return response.data;
  }
}
