export type StorageConfig = {
  baseUrl: string;
  timeoutMs: number;
  presignedUrlPath: string;
  streamTextPath: string;
  metadataPath: string;
};

export function loadConfig(): StorageConfig {
  const baseUrl = process.env.STORAGE_BASE_URL ?? "http://localhost:4013";
  const timeoutMs = Number(process.env.STORAGE_TIMEOUT_MS ?? "15000");
  const presignedUrlPath =
    process.env.STORAGE_PRESIGNED_URL_PATH ?? "/presigned-url";
  const streamTextPath =
    process.env.STORAGE_STREAM_TEXT_PATH ?? "/stream-text";
  const metadataPath = process.env.STORAGE_METADATA_PATH ?? "/metadata";

  return {
    baseUrl,
    timeoutMs,
    presignedUrlPath,
    streamTextPath,
    metadataPath,
  };
}
