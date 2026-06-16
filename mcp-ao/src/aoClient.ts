import axios, { AxiosInstance } from "axios";
import { AoConfig } from "./config.js";

export class AoClient {
  private readonly http: AxiosInstance;
  private readonly config: AoConfig;

  constructor(config: AoConfig) {
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

  async getAppelOffres(aoId: string) {
    const response = await this.http.get(`/appels-offres/${aoId}`, {
      headers: this.buildHeaders(),
    });
    return response.data;
  }

  async listAppelsOffres(params: {
    statut: string;
    page?: number;
    limit?: number;
    wilaya?: string;
    secteurActivite?: string;
    typeProcedure?: string;
  }) {
    const response = await this.http.get("/appels-offres", {
      headers: this.buildHeaders(),
      params,
    });
    return response.data;
  }

  async getCriteresEvaluation(aoId: string) {
    const response = await this.http.get(
      `/appels-offres/${aoId}/criteres-evaluation`,
      {
        headers: this.buildHeaders(),
      }
    );
    return response.data;
  }

  async getCahierDesCharges(aoId: string) {
    const response = await this.http.get(`/appels-offres/${aoId}/cdc`, {
      headers: this.buildHeaders(),
    });
    return response.data;
  }

  async updateGreAGreScore(payload: Record<string, unknown>) {
    if (!this.config.greAGreScoreEndpoint) {
      throw new Error(
        "AO_GRE_A_GRE_SCORE_ENDPOINT is not set. No HTTP endpoint is configured for update_gre_a_gre_score."
      );
    }

    const gagId = payload.gagId as string;
    const endpoint = this.config.greAGreScoreEndpoint.replace("{demandeId}", gagId);
    try {
      const response = await this.http.patch(endpoint, payload, {
        headers: this.buildHeaders(),
      });
      return response.data;
    } catch (err: any) {
      if (err.response && err.response.data) {
        throw new Error(
          `API Error ${err.response.status}: ${JSON.stringify(
            err.response.data
          )}`
        );
      }
      throw err;
    }
  }
}
