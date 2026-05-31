export type AnomalyConfig = {
  baseUrl: string;
  timeoutMs: number;
  detectCollusionPath: string;
  detectPricePatternPath: string;
  detectSaucissonnagePath: string;
};

export function loadConfig(): AnomalyConfig {
  const baseUrl = process.env.ANOMALY_BASE_URL ?? "http://localhost:4012";
  const timeoutMs = Number(process.env.ANOMALY_TIMEOUT_MS ?? "20000");
  const detectCollusionPath =
    process.env.ANOMALY_DETECT_COLLUSION_PATH ?? "/detect-collusion";
  const detectPricePatternPath =
    process.env.ANOMALY_DETECT_PRICE_PATTERN_PATH ?? "/detect-price-pattern";
  const detectSaucissonnagePath =
    process.env.ANOMALY_DETECT_SAUCISSONNAGE_PATH ??
    "/detect-saucissonnage";

  return {
    baseUrl,
    timeoutMs,
    detectCollusionPath,
    detectPricePatternPath,
    detectSaucissonnagePath,
  };
}
