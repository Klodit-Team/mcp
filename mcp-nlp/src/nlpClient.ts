import axios, { AxiosInstance } from "axios";
import { NlpConfig } from "./config.js";

export class NlpClient {
  private readonly http: AxiosInstance;
  private readonly config: NlpConfig;

  constructor(config: NlpConfig) {
    this.config = config;
    this.http = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeoutMs,
    });
  }

  async classifyDocument(payload: Record<string, unknown>) {
    const response = await this.http.post(
      this.config.classifyDocumentPath,
      payload
    );
    return response.data;
  }

  async checkCompleteness(payload: Record<string, unknown>) {
    const response = await this.http.post(
      this.config.checkCompletenessPath,
      payload
    );
    return response.data;
  }

  async checkExpiryDates(payload: Record<string, unknown>) {
    const response = await this.http.post(
      this.config.checkExpiryDatesPath,
      payload
    );
    return response.data;
  }

  async detectDiscriminatoryClauses(payload: Record<string, unknown>) {
    const response = await this.http.post(
      this.config.detectDiscriminatoryPath,
      payload
    );
    return response.data;
  }
}
