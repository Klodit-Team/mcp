import axios, { AxiosInstance } from "axios";
import { DocumentsConfig } from "./config.js";

export class DocumentsClient {
  private readonly http: AxiosInstance;
  private readonly config: DocumentsConfig;

  constructor(config: DocumentsConfig) {
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

  async listPiecesAdmin(submissionId: string) {
    const response = await this.http.get(
      `/documents/administrative/${submissionId}`,
      {
        headers: this.buildHeaders(),
      }
    );
    return response.data;
  }

  async getDocumentText(documentId: string) {
    const template = this.config.ocrEndpointTemplate ??
      "/documents/{documentId}/ocr";
    const path = template.replace("{documentId}", documentId);
    const response = await this.http.get(path, {
      headers: this.buildHeaders(),
    });
    return response.data;
  }

  async getDocumentUrl(documentId: string) {
    const response = await this.http.get(`/documents/${documentId}/download`, {
      headers: this.buildHeaders(),
    });
    return response.data;
  }

  async writePieceValidation(pieceId: string, payload: Record<string, unknown>) {
    const response = await this.http.patch(
      `/documents/administrative/piece/${pieceId}/validate`,
      payload,
      {
        headers: this.buildHeaders(),
      }
    );
    return response.data;
  }
}
