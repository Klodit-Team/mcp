export type UsersConfig = {
  baseUrl: string;
  timeoutMs: number;
  serviceToken?: string;
  serviceTokenHeader: string;
};

export function loadConfig(): UsersConfig {
  const baseUrl = process.env.USERS_BASE_URL ?? "http://localhost:3001";
  const timeoutMs = Number(process.env.USERS_TIMEOUT_MS ?? "10000");
  const serviceToken = process.env.USERS_SERVICE_TOKEN;
  const serviceTokenHeader =
    process.env.USERS_SERVICE_TOKEN_HEADER ?? "x-service-token";

  return {
    baseUrl,
    timeoutMs,
    serviceToken,
    serviceTokenHeader,
  };
}
