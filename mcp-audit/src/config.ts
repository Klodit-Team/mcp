export type AuditConfig = {
  baseUrl: string;
  timeoutMs: number;
  serviceToken?: string;
  serviceTokenHeader: string;
};

export function loadConfig(): AuditConfig {
  const baseUrl = process.env.AUDIT_BASE_URL ?? "http://localhost:3009";
  const timeoutMs = Number(process.env.AUDIT_TIMEOUT_MS ?? "10000");
  const serviceToken = process.env.AUDIT_SERVICE_TOKEN;
  const serviceTokenHeader =
    process.env.AUDIT_SERVICE_TOKEN_HEADER ?? "x-service-token";

  return {
    baseUrl,
    timeoutMs,
    serviceToken,
    serviceTokenHeader,
  };
}
