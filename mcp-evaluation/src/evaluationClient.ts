import axios, { AxiosInstance } from "axios";
import { EvaluationConfig } from "./config.js";

export class EvaluationClient {
  private readonly http: AxiosInstance;
  private readonly config: EvaluationConfig;

  constructor(config: EvaluationConfig) {
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

  async listEvaluations(params: Record<string, unknown>) {
    const response = await this.http.get("/api/v1/evaluations", {
      headers: this.buildHeaders(),
      params,
    });
    return response.data;
  }

  async getEvaluation(evaluationId: string) {
    const response = await this.http.get(`/api/v1/evaluations/${evaluationId}`, {
      headers: this.buildHeaders(),
    });
    return response.data;
  }

  async getCriteria(evaluationId: string) {
    const response = await this.http.get(
      `/api/v1/evaluations/${evaluationId}/criteres`,
      {
        headers: this.buildHeaders(),
      }
    );
    return response.data;
  }

  async upsertNote(
    evaluationId: string,
    submissionId: string,
    payload: Record<string, unknown>
  ) {
    const response = await this.http.post(
      `/api/v1/evaluations/${evaluationId}/soumissions/${submissionId}/notes`,
      payload,
      {
        headers: this.buildHeaders(),
      }
    );
    return response.data;
  }

  async writeScoreIa(payload: Record<string, unknown>) {
    if (!this.config.scoreIaEndpoint) {
      throw new Error(
        "EVALUATION_SCORE_IA_ENDPOINT is not set. No HTTP endpoint is configured for write_score_ia."
      );
    }

    const response = await this.http.post(this.config.scoreIaEndpoint, payload, {
      headers: this.buildHeaders(),
    });
    return response.data;
  }

  async writeComparison(payload: Record<string, unknown>) {
    if (!this.config.comparisonEndpoint) {
      throw new Error(
        "EVALUATION_COMPARISON_ENDPOINT is not set. No HTTP endpoint is configured for write_comparison."
      );
    }

    const response = await this.http.post(this.config.comparisonEndpoint, payload, {
      headers: this.buildHeaders(),
    });
    return response.data;
  }
}
