import client from "./internal/httpClient";

export function list(params: any) {
  return client.get("/backend/addons/TuanGou/goods/index", params);
}

export function create(params: any) {
  return client.get("/backend/addons/TuanGou/goods/create", params);
}

export function store(params: any) {
  return client.post("/backend/addons/TuanGou/goods/create", params);
}

export function detail(id: number) {
  return client.get(`/backend/addons/TuanGou/goods/${id}`, {});
}

export function update(id: number, params: any) {
  return client.put(`/backend/addons/TuanGou/goods/${id}`, params);
}

export function destroy(id: number) {
  return client.destroy(`/backend/addons/TuanGou/goods/${id}`);
}

export function ordersList(params: any) {
  return client.get("/backend/addons/TuanGou/orders/index", params);
}

export function refundList(params: any) {
  return client.get("/backend/addons/TuanGou/refunds/index", params);
}

export function refundComplete(id: number, params: any) {
  return client.get(`/backend/addons/TuanGou/refunds/${id}/handler`, params);
}

export function tuanList(id: number, params: any) {
  return client.get(`/backend/addons/TuanGou/goods/${id}/items`, params);
}

export function tuanDetail(id: number, itemId: number) {
  return client.get(`/backend/addons/TuanGou/goods/${id}/item/${itemId}`, {});
}

export function tuanComplete(params: any) {
  return client.get(`/backend/addons/TuanGou/goods/item/complete`, params);
}
