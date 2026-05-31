export type NlpConfig = {
  baseUrl: string;
  timeoutMs: number;
  classifyDocumentPath: string;
  checkCompletenessPath: string;
  checkExpiryDatesPath: string;
  detectDiscriminatoryPath: string;
};

export function loadConfig(): NlpConfig {
  const baseUrl = process.env.NLP_BASE_URL ?? "http://localhost:4014";
  const timeoutMs = Number(process.env.NLP_TIMEOUT_MS ?? "15000");
  const classifyDocumentPath =
    process.env.NLP_CLASSIFY_DOCUMENT_PATH ?? "/classify-document";
  const checkCompletenessPath =
    process.env.NLP_CHECK_COMPLETENESS_PATH ?? "/check-completeness";
  const checkExpiryDatesPath =
    process.env.NLP_CHECK_EXPIRY_DATES_PATH ?? "/check-expiry-dates";
  const detectDiscriminatoryPath =
    process.env.NLP_DETECT_DISCRIMINATORY_PATH ??
    "/detect-discriminatory-clauses";

  return {
    baseUrl,
    timeoutMs,
    classifyDocumentPath,
    checkCompletenessPath,
    checkExpiryDatesPath,
    detectDiscriminatoryPath,
  };
}
