export type DocumentsConfig = {
  baseUrl: string;
  timeoutMs: number;
  serviceToken?: string;
  serviceTokenHeader: string;
  ocrEndpointTemplate?: string;
  rabbitMqUrl: string;
  ocrResultsQueue: string;
};

export function loadConfig(): DocumentsConfig {
  const baseUrl = process.env.DOCUMENTS_BASE_URL ?? "http://localhost:8005";
  const timeoutMs = Number(process.env.DOCUMENTS_TIMEOUT_MS ?? "10000");
  const serviceToken = process.env.DOCUMENTS_SERVICE_TOKEN;
  const serviceTokenHeader =
    process.env.DOCUMENTS_SERVICE_TOKEN_HEADER ?? "x-service-token";
  const ocrEndpointTemplate = process.env.DOCUMENTS_OCR_ENDPOINT_TEMPLATE;
  const rabbitMqUrl =
    process.env.DOCUMENTS_RABBITMQ_URL ?? "amqp://localhost:5672";
  const ocrResultsQueue =
    process.env.DOCUMENTS_OCR_RESULTS_QUEUE ?? "documents.ocr.results";

  return {
    baseUrl,
    timeoutMs,
    serviceToken,
    serviceTokenHeader,
    ocrEndpointTemplate,
    rabbitMqUrl,
    ocrResultsQueue,
  };
}
