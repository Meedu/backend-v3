import client from "./internal/httpClient";

export function list(params: any) {
  return client.get(`/backend/addons/single_page/page/index`, params);
}

export function create() {
  return client.get(`/backend/addons/single_page/page/create`, {});
}

export function store(params: any) {
  return client.post("/backend/addons/single_page/page/create", params);
}

export function detail(id: number) {
  return client.get(`/backend/addons/single_page/page/${id}`, {});
}

export function destroy(id: number) {
  return client.destroy(`/backend/addons/single_page/page/${id}`);
}

export function update(id: number, params: any) {
  return client.put(`/backend/addons/single_page/page/${id}`, params);
}
