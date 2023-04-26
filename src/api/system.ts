import client from "./internal/httpClient";

export function getSystemConfig() {
  return client.get("/backend/api/v2/system/config", {});
}

export function setting() {
  return client.get("/backend/api/v1/setting", {});
}

export function saveSetting(params: any) {
  return client.post("/backend/api/v1/setting", params);
}

export function imageCaptcha() {
  return client.get("/backend/api/v1/captcha/image", {});
}
