export type DocumentAnalysisConfig = {
  baseUrl: string;
  timeoutMs: number;
  extractTextPath: string;
  extractFieldsPath: string;
  detectSignaturePath: string;
};

export function loadConfig(): DocumentAnalysisConfig {
  const baseUrl = process.env.DOC_ANALYSIS_BASE_URL ?? "http://localhost:4011";
  const timeoutMs = Number(process.env.DOC_ANALYSIS_TIMEOUT_MS ?? "20000");
  const extractTextPath =
    process.env.DOC_ANALYSIS_EXTRACT_TEXT_PATH ?? "/extract-text";
  const extractFieldsPath =
    process.env.DOC_ANALYSIS_EXTRACT_FIELDS_PATH ?? "/extract-fields";
  const detectSignaturePath =
    process.env.DOC_ANALYSIS_DETECT_SIGNATURE_PATH ?? "/detect-signature";

  return {
    baseUrl,
    timeoutMs,
    extractTextPath,
    extractFieldsPath,
    detectSignaturePath,
  };
}
