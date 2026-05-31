export type EvaluationConfig = {
  baseUrl: string;
  timeoutMs: number;
  serviceToken?: string;
  serviceTokenHeader: string;
  scoreIaEndpoint?: string;
  comparisonEndpoint?: string;
};

export function loadConfig(): EvaluationConfig {
  const baseUrl = process.env.EVALUATION_BASE_URL ?? "http://localhost:8008";
  const timeoutMs = Number(process.env.EVALUATION_TIMEOUT_MS ?? "10000");
  const serviceToken = process.env.EVALUATION_SERVICE_TOKEN;
  const serviceTokenHeader =
    process.env.EVALUATION_SERVICE_TOKEN_HEADER ?? "x-service-token";
  const scoreIaEndpoint = process.env.EVALUATION_SCORE_IA_ENDPOINT;
  const comparisonEndpoint = process.env.EVALUATION_COMPARISON_ENDPOINT;

  return {
    baseUrl,
    timeoutMs,
    serviceToken,
    serviceTokenHeader,
    scoreIaEndpoint,
    comparisonEndpoint,
  };
}
