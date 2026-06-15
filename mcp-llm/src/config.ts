export type LlmConfig = {
  onPremEndpoint?: string;
  externalEndpoint?: string;
  geminiApiKey?: string;
  timeoutMs: number;
  auditBaseUrl?: string;
  auditServiceToken?: string;
  auditServiceTokenHeader: string;
};

export function loadConfig(): LlmConfig {
  return {
    onPremEndpoint: process.env.LLM_ONPREM_ENDPOINT,
    externalEndpoint: process.env.LLM_EXTERNAL_ENDPOINT,
    geminiApiKey: process.env.GEMINI_API_KEY,
    timeoutMs: Number(process.env.LLM_TIMEOUT_MS ?? "20000"),
    auditBaseUrl: process.env.AUDIT_BASE_URL,
    auditServiceToken: process.env.AUDIT_SERVICE_TOKEN,
    auditServiceTokenHeader: process.env.AUDIT_SERVICE_TOKEN_HEADER ?? "x-service-token",
  };
}
