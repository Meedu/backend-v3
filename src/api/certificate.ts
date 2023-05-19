import client from "./internal/httpClient";

export function list(params: any) {
  return client.get("/backend/addons/Cert/cert/index", params);
}

export function create(params: any) {
  return client.get("/backend/addons/Cert/cert/create", params);
}

export function store(params: any) {
  return client.post("/backend/addons/Cert/cert/create", params);
}

export function detail(id: number) {
  return client.get(`/backend/addons/Cert/cert/${id}`, {});
}

export function update(id: number, params: any) {
  return client.put(`/backend/addons/Cert/cert/${id}`, params);
}

export function destroy(id: number) {
  return client.destroy(`/backend/addons/Cert/cert/${id}`);
}
