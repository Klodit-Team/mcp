import axios, { AxiosInstance } from "axios";
import { AnomalyConfig } from "./config.js";

export class AnomalyClient {
  private readonly http: AxiosInstance;
  private readonly config: AnomalyConfig;

  constructor(config: AnomalyConfig) {
    this.config = config;
    this.http = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeoutMs,
    });
  }

  async detectCollusion(payload: Record<string, unknown>) {
    const response = await this.http.post(this.config.detectCollusionPath, payload);
    return response.data;
  }

  async detectPricePattern(payload: Record<string, unknown>) {
    const response = await this.http.post(
      this.config.detectPricePatternPath,
      payload
    );
    return response.data;
  }

  async detectSaucissonnage(payload: Record<string, unknown>) {
    const response = await this.http.post(
      this.config.detectSaucissonnagePath,
      payload
    );
    return response.data;
  }
}
