export type AoConfig = {
  baseUrl: string;
  timeoutMs: number;
  serviceToken?: string;
  serviceTokenHeader: string;
  greAGreScoreEndpoint?: string;
};

export function loadConfig(): AoConfig {
  const baseUrl = process.env.AO_BASE_URL ?? "http://localhost:8003";
  const timeoutMs = Number(process.env.AO_TIMEOUT_MS ?? "10000");
  const serviceToken = process.env.AO_SERVICE_TOKEN;
  const serviceTokenHeader =
    process.env.AO_SERVICE_TOKEN_HEADER ?? "x-service-token";
  const greAGreScoreEndpoint = process.env.AO_GRE_A_GRE_SCORE_ENDPOINT;

  return {
    baseUrl,
    timeoutMs,
    serviceToken,
    serviceTokenHeader,
    greAGreScoreEndpoint,
  };
}
