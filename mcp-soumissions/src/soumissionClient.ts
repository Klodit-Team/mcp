import axios, { AxiosInstance } from "axios";
import { SoumissionConfig } from "./config.js";

export class SoumissionClient {
  private readonly http: AxiosInstance;
  private readonly config: SoumissionConfig;

  constructor(config: SoumissionConfig) {
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

  async listSoumissionsByAo(aoId: string) {
    const response = await this.http.get(`/api/v1/soumissions/appel-offre/${aoId}`, {
      headers: this.buildHeaders(),
    });
    return response.data;
  }

  async getSoumissionDetail(soumissionId: string) {
    const response = await this.http.get(`/api/v1/soumissions/${soumissionId}`, {
      headers: this.buildHeaders(),
    });
    return response.data;
  }

  async getOffreTechnique(soumissionId: string) {
    const response = await this.http.get(
      `/api/v1/soumissions/${soumissionId}/offre-technique`,
      {
        headers: this.buildHeaders(),
      }
    );
    return response.data;
  }

  async flagAnomaly(payload: Record<string, unknown>) {
    if (!this.config.anomalyEndpoint) {
      throw new Error(
        "SOUMMISSION_ANOMALY_ENDPOINT is not set. No HTTP endpoint is configured for flag_anomaly."
      );
    }

    const response = await this.http.post(this.config.anomalyEndpoint, payload, {
      headers: this.buildHeaders(),
    });
    return response.data;
  }
}
