export type NotificationsConfig = {
  baseUrl: string;
  timeoutMs: number;
  serviceToken?: string;
  serviceTokenHeader: string;
  serviceUserId?: string;
  serviceUserRoles?: string;
};

export function loadConfig(): NotificationsConfig {
  const baseUrl =
    process.env.NOTIFICATIONS_BASE_URL ??
    "http://localhost:3007/notification-service/v1";
  const timeoutMs = Number(process.env.NOTIFICATIONS_TIMEOUT_MS ?? "10000");
  const serviceToken = process.env.NOTIFICATIONS_SERVICE_TOKEN;
  const serviceTokenHeader =
    process.env.NOTIFICATIONS_SERVICE_TOKEN_HEADER ?? "x-service-token";
  const serviceUserId = process.env.NOTIFICATIONS_SERVICE_USER_ID;
  const serviceUserRoles = process.env.NOTIFICATIONS_SERVICE_USER_ROLES;

  return {
    baseUrl,
    timeoutMs,
    serviceToken,
    serviceTokenHeader,
    serviceUserId,
    serviceUserRoles,
  };
}
