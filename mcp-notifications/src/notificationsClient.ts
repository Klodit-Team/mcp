import axios, { AxiosInstance } from "axios";
import { NotificationsConfig } from "./config.js";

export class NotificationsClient {
  private readonly http: AxiosInstance;
  private readonly config: NotificationsConfig;

  constructor(config: NotificationsConfig) {
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
      ...(this.config.serviceUserId
        ? { "x-user-id": this.config.serviceUserId }
        : {}),
      ...(this.config.serviceUserRoles
        ? { "x-user-roles": this.config.serviceUserRoles }
        : {}),
      ...(extra ?? {}),
    };
  }

  async sendIaAlert(payload: Record<string, unknown>) {
    const response = await this.http.post("/alertes-ia", payload, {
      headers: this.buildHeaders(),
    });
    return response.data;
  }
}
