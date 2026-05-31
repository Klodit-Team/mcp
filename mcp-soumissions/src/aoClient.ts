import axios, { AxiosInstance } from "axios";
import { SoumissionConfig } from "./config.js";

export class AoClient {
  private readonly http: AxiosInstance;
  private readonly config: SoumissionConfig;

  constructor(config: SoumissionConfig) {
    this.config = config;
    this.http = axios.create({
      baseURL: config.aoBaseUrl,
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

  async getAo(aoId: string) {
    const response = await this.http.get(`/appels-offres/${aoId}`, {
      headers: this.buildHeaders(),
    });
    return response.data;
  }
}
