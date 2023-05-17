import client from "./internal/httpClient";

export function list(params: any) {
  return client.get("/backend/addons/MiaoSha/goods/index", params);
}

export function create(params: any) {
  return client.get("/backend/addons/MiaoSha/goods/create", params);
}

export function store(params: any) {
  return client.post("/backend/addons/MiaoSha/goods/create", params);
}

export function detail(id: number) {
  return client.get(`/backend/addons/MiaoSha/goods/${id}`, {});
}

export function update(id: number, params: any) {
  return client.put(`/backend/addons/MiaoSha/goods/${id}`, params);
}

export function destroy(id: number) {
  return client.destroy(`/backend/addons/MiaoSha/goods/${id}`);
}

export function ordersList(params: any) {
  return client.get("/backend/addons/MiaoSha/orders/index", params);
}
