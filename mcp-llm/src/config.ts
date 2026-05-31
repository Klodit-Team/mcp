export type LlmConfig = {
  onPremEndpoint?: string;
  externalEndpoint?: string;
  timeoutMs: number;
  auditBaseUrl?: string;
  auditServiceToken?: string;
  auditServiceTokenHeader: string;
};

export function loadConfig(): LlmConfig {
  const onPremEndpoint = process.env.LLM_ONPREM_ENDPOINT;
  const externalEndpoint = process.env.LLM_EXTERNAL_ENDPOINT;
  const timeoutMs = Number(process.env.LLM_TIMEOUT_MS ?? "20000");
  const auditBaseUrl = process.env.AUDIT_BASE_URL;
  const auditServiceToken = process.env.AUDIT_SERVICE_TOKEN;
  const auditServiceTokenHeader =
    process.env.AUDIT_SERVICE_TOKEN_HEADER ?? "x-service-token";

  return {
    onPremEndpoint,
    externalEndpoint,
    timeoutMs,
    auditBaseUrl,
    auditServiceToken,
    auditServiceTokenHeader,
  };
}
