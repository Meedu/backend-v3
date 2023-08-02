import client from "./internal/httpClient";

export function list(params: any) {
  return client.get("/backend/addons/multi_level_share/goods/index", params);
}

export function destory(id: number) {
  return client.destroy(`/backend/addons/multi_level_share/goods/${id}`);
}

export function detail(id: number) {
  return client.get(`/backend/addons/multi_level_share/goods/${id}`, {});
}

export function store(params: any) {
  return client.post("/backend/addons/multi_level_share/goods/create", params);
}

export function rewards(params: any) {
  return client.get("/backend/addons/multi_level_share/reward/index", params);
}

export function update(id: number, params: any) {
  return client.put(`/backend/addons/multi_level_share/goods/${id}`, params);
}
