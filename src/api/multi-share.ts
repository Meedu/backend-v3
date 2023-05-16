import client from "./internal/httpClient";

export function list(params: any) {
  return client.get("/backend/addons/multi_level_share/goods/index", params);
}

export function destory(id: number) {
  return client.destroy(`/backend/addons/multi_level_share/goods/${id}`);
}

export function rewards(params: any) {
  return client.get("/backend/addons/multi_level_share/reward/index", params);
}
