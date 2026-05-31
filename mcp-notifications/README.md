# MCP Notifications Server

Wraps the **notification** service API.

## Tools

- `send_notification(userId, title, body, type)` — send a notification

## Environment Variables

- `NOTIFICATIONS_BASE_URL` — backend URL (default: `http://localhost:3007/notification-service/v1`)
- `NOTIFICATIONS_TIMEOUT_MS` — timeout (default: `10000`)
- `NOTIFICATIONS_SERVICE_TOKEN` — optional service auth token
- `NOTIFICATIONS_SERVICE_TOKEN_HEADER` — header name (default: `x-service-token`)
- `NOTIFICATIONS_SERVICE_USER_ID` — optional override for sender user ID
- `NOTIFICATIONS_SERVICE_USER_ROLES` — optional sender roles
