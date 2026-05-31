import axios, { AxiosInstance } from "axios";
import { DocumentAnalysisConfig } from "./config.js";

export class DocumentAnalysisClient {
  private readonly http: AxiosInstance;
  private readonly config: DocumentAnalysisConfig;

  constructor(config: DocumentAnalysisConfig) {
    this.config = config;
    this.http = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeoutMs,
    });
  }

  async extractText(payload: Record<string, unknown>) {
    const response = await this.http.post(this.config.extractTextPath, payload);
    return response.data;
  }

  async extractFields(payload: Record<string, unknown>) {
    const response = await this.http.post(this.config.extractFieldsPath, payload);
    return response.data;
  }

  async detectSignature(payload: Record<string, unknown>) {
    const response = await this.http.post(
      this.config.detectSignaturePath,
      payload
    );
    return response.data;
  }
}
