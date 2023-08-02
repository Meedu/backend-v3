import client from "./internal/httpClient";

export function list(params: any) {
  return client.get("/backend/addons/Credit1Mall/goods/index", params);
}

export function create() {
  return client.get("/backend/addons/Credit1Mall/goods/create", {});
}

export function store(params: any) {
  return client.post("/backend/addons/Credit1Mall/goods/create", params);
}

export function detail(id: number) {
  return client.get(`/backend/addons/Credit1Mall/goods/${id}`, {});
}

export function update(id: number, params: any) {
  return client.put(`/backend/addons/Credit1Mall/goods/${id}`, params);
}

export function destroy(id: number) {
  return client.destroy(`/backend/addons/Credit1Mall/goods/${id}`);
}

export function ordersList(params: any) {
  return client.get("/backend/addons/Credit1Mall/orders/index", params);
}

export function ordersDetail(id: number) {
  return client.get(`/backend/addons/Credit1Mall/orders/${id}`, {});
}

export function ordersUpdate(id: number, params: any) {
  return client.put(`/backend/addons/Credit1Mall/orders/${id}`, params);
}

export function ordersSend(id: number, params: any) {
  return client.post(`/backend/addons/Credit1Mall/orders/${id}/send`, params);
}
