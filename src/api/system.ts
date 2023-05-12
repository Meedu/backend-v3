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

export function getImageCaptcha() {
  return client.get("/backend/api/v1/captcha/image", {});
}

export function addonsList() {
  return client.get(`/backend/api/v1/addons`, {});
}

export function repository(params: any) {
  return client.get(`/backend/api/v1/addons/repository`, params);
}

export function switchAction(params: any) {
  return client.post(`/backend/api/v1/addons/switch`, params);
}

export function upgrade(params: any) {
  return client.get(`/backend/api/v1/addons/repository/upgrade`, params);
}

export function install(params: any) {
  return client.get(`/backend/api/v1/addons/repository/install`, params);
}

export function adminLog(params: any) {
  return client.get(`/backend/api/v1/log/admin`, params);
}
export function userLoginLog(params: any) {
  return client.get(`/backend/api/v1/log/userLogin`, params);
}
export function uploadImagesLog(params: any) {
  return client.get(`/backend/api/v1/log/uploadImages`, params);
}
export function administratorList(params: any) {
  return client.get(`/backend/api/v1/administrator`, params);
}

export function administratorDestory(id: number) {
  return client.destroy(`/backend/api/v1/administrator/${id}`);
}

export function administratorCreate() {
  return client.get(`/backend/api/v1/administrator/create`, {});
}

export function administratorStore(params: any) {
  return client.post(`/backend/api/v1/administrator`, params);
}

export function administratorDetail(id: number) {
  return client.get(`/backend/api/v1/administrator/${id}`, {});
}
