export type SoumissionConfig = {
  baseUrl: string;
  aoBaseUrl: string;
  timeoutMs: number;
  serviceToken?: string;
  serviceTokenHeader: string;
  allowedAoStatuses: string[];
  anomalyEndpoint?: string;
};

export function loadConfig(): SoumissionConfig {
  const baseUrl = process.env.SOUMMISSION_BASE_URL ?? "http://localhost:8004";
  const aoBaseUrl = process.env.AO_BASE_URL ?? "http://localhost:8003";
  const timeoutMs = Number(process.env.SOUMMISSION_TIMEOUT_MS ?? "10000");
  const serviceToken = process.env.SOUMMISSION_SERVICE_TOKEN;
  const serviceTokenHeader =
    process.env.SOUMMISSION_SERVICE_TOKEN_HEADER ?? "x-service-token";
  const allowedAoStatuses = (process.env.SOUMMISSION_ALLOWED_AO_STATUSES ??
    "OUVERTURE_PLIS,EVALUATION,ATTRIBUE,CLOTURE")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const anomalyEndpoint = process.env.SOUMMISSION_ANOMALY_ENDPOINT;

  return {
    baseUrl,
    aoBaseUrl,
    timeoutMs,
    serviceToken,
    serviceTokenHeader,
    allowedAoStatuses,
    anomalyEndpoint,
  };
}
