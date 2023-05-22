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

export function userList(id: number, params: any) {
  return client.get(`/backend/addons/Cert/cert/${id}/users`, params);
}

export function userImport(id: number, params: any) {
  return client.post(`/backend/addons/Cert/cert/${id}/user/import`, params);
}

export function userDelete(id: number, params: any) {
  return client.post(`/backend/addons/Cert/cert/${id}/user/destroy`, params);
}
