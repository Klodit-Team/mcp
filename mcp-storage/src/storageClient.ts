import axios, { AxiosInstance } from "axios";
import { StorageConfig } from "./config.js";

export class StorageClient {
  private readonly http: AxiosInstance;
  private readonly config: StorageConfig;

  constructor(config: StorageConfig) {
    this.config = config;
    this.http = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeoutMs,
    });
  }

  async getPresignedUrl(payload: Record<string, unknown>) {
    const response = await this.http.post(this.config.presignedUrlPath, payload);
    return response.data;
  }

  async streamTextChunks(payload: Record<string, unknown>) {
    const response = await this.http.post(this.config.streamTextPath, payload);
    return response.data;
  }

  async getObjectMetadata(payload: Record<string, unknown>) {
    const response = await this.http.post(this.config.metadataPath, payload);
    return response.data;
  }
}
