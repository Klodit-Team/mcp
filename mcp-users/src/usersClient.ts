import axios, { AxiosInstance } from "axios";
import { UsersConfig } from "./config.js";

export class UsersClient {
  private readonly http: AxiosInstance;
  private readonly config: UsersConfig;

  constructor(config: UsersConfig) {
    this.config = config;
    this.http = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeoutMs,
    });
  }

  private buildHeaders(extra?: Record<string, string>): Record<string, string> {
    return {
      ...(this.config.serviceToken
        ? { [this.config.serviceTokenHeader]: this.config.serviceToken }
        : {}),
      ...(extra ?? {}),
    };
  }

  async getOrganisationProfile(userId: string) {
    const response = await this.http.get("/operateurs-economiques/profile", {
      headers: this.buildHeaders({ "x-user-id": userId }),
    });
    return response.data;
  }
}
