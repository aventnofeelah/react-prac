export const initialDataSample = [
  {
    id: 1,
    type: "post",
    headers: {"content-type": "text/html"},
    payload: {"user": "qwe"},
    size: 3,
    status: "new" // failed accepted new 
  },
  {
    id: 2,
    type: "get",
    headers: {"content-type": "text/html"},
    payload: null,
    size: 0,
    status: "new"
  },
  {
    id: 3,
    type: "delete",
    headers: {"accept-language": "en; kk;"},
    payload: {"item": 1},
    size: 1,
    status: "new"
  },
  {
    id: 4,
    type: "patch",
    headers: {"accept-language": "en; kk;"},
    payload: {"user": "user_123", "password": "secret"},
    size: 14,
    status: "new"
  },
  {
    id: 5,
    type: "post",
    headers: {"X-Forwarded-For": "203.0.113.195"},
    payload: {"comment": "bad comment"},
    size: 11,
    status: "new"
  },
  {
    id: 6,
    type: "post",
    headers: { "content-type": "application/json", "authorization": "Bearer token123" },
    payload: { "title": "Hello World" },
    size: 11,
    status: "failed"
  },
  {
    id: 7,
    type: "get",
    headers: { "accept": "text/plain", "user-agent": "Mozilla/5.0" },
    payload: null,
    size: 0,
    status: "new"
  },
  {
    id: 8,
    type: "put",
    headers: { "content-type": "application/json" },
    payload: { "status": "active", "role": "admin" },
    size: 11,
    status: "new"
  },
  {
    id: 9,
    type: "delete",
    headers: { "authorization": "Basic YWRtaW46c2VjcmV0" },
    payload: { "reason": "outdated" },
    size: 8,
    status: "accepted"
  },
  {
    id: 10,
    type: "patch",
    headers: { "content-type": "application/json", "x-api-key": "key_998877" },
    payload: { "email": "dev@example.com" },
    size: 15,
    status: "new"
  },
  {
    id: 11,
    type: "post",
    headers: { "x-forwarded-for": "198.51.100.42", "content-type": "text/html" },
    payload: { "feedback": "Great service!" },
    size: 14,
    status: "new"
  },
  {
    id: 12,
    type: "get",
    headers: { "cache-control": "no-cache", "accept-language": "ru-RU, ru;q=0.9" },
    payload: null,
    size: 0,
    status: "accepted"
  },
  {
    id: 13,
    type: "post",
    headers: { "content-type": "application/json" },
    payload: { "query": "react hooks" },
    size: 11,
    status: "new"
  },
  {
    id: 14,
    type: "patch",
    headers: { "authorization": "Bearer admin_secret_token" },
    payload: { "is_verified": true },
    size: 4,
    status: "new"
  },
  {
    id: 15,
    type: "delete",
    headers: { "content-type": "application/json", "x-request-id": "req-9901" },
    payload: { "force": "true" },
    size: 4,
    status: "new"
  },
  {
    id: 16,
    type: "options",
    headers: null,
    payload: null,
    size: 0,
    status: "new"
  },
  {
    id: 17,
    type: "post",
    headers: { "content-type": "application/json", "x-client-version": "2.4.0" },
    payload: { "username": "alex_dev" },
    size: 8,
    status: "new"
  },
  {
    id: 18,
    type: "get",
    headers: { "accept": "application/json", "if-none-match": "W/\"68b329da\"" },
    payload: null,
    size: 0,
    status: "new"
  },
  {
    id: 19,
    type: "patch",
    headers: { "content-type": "application/json", "authorization": "Bearer token_abc_99" },
    payload: { "theme": "dark_mode" },
    size: 9,
    status: "new"
  },
  {
    id: 20,
    type: "delete",
    headers: { "x-action-by": "system_cron", "accept": "*/*" },
    payload: { "session_id": "sess_88321" },
    size: 10,
    status: "new"
  },
  {
    id: 21,
    type: "post",
    headers: { "content-type": "text/plain", "x-forwarded-for": "10.0.0.12" },
    payload: { "log": "error_connection_timeout" },
    size: 24,
    status: "new"
  },
  {
    id: 22,
    type: "put",
    headers: { "content-type": "application/json" },
    payload: { "avatar_url": "https://img.com/a.png" },
    size: 23,
    status: "new"
  },
  {
    id: 23,
    type: "get",
    headers: { "user-agent": "PostmanRuntime/7.29.2" },
    payload: null,
    size: 0,
    status: "new"
  },
  {
    id: 24,
    type: "post",
    headers: { "content-type": "application/json", "x-csrf-token": "csrf_xyz_777" },
    payload: { "promo_code": "DISCOUNT2026" },
    size: 12,
    status: "new"
  },
  {
    id: 25,
    type: "patch",
    headers: { "authorization": "Bearer admin_access", "content-type": "application/json" },
    payload: { "notifications": "disabled" },
    size: 8,
    status: "new"
  },
  {
    id: 26,
    type: "delete",
    headers: { "content-type": "application/json" },
    payload: { "archive_id": "arc_505" },
    size: 7,
    status: "new"
  }

  
];