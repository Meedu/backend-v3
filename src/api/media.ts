import client from "./internal/httpClient";

export function imageList(params: any) {
  return client.get("/backend/api/v1/media/images", params);
}

export function videoList(params: any) {
  return client.get("/backend/api/v1/media/videos/index", params);
}

export function storeVideo(params: any) {
  return client.post("/backend/api/v1/media/videos/create", params);
}

export function destroyVideo(params: any) {
  return client.post("/backend/api/v1/media/videos/delete/multi", params);
}
