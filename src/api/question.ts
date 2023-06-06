import client from "./internal/httpClient";

export function list(params: any) {
  return client.get(`/backend/addons/Paper/question/index`, params);
}

export function create() {
  return client.get(`/backend/addons/Paper/question/create`, {});
}

export function store(params: any) {
  return client.post("/backend/addons/Paper/question/create", params);
}

export function detail(id: number) {
  return client.get(`/backend/addons/Paper/question/${id}`, {});
}

export function destroyMulti(params: any) {
  return client.post(`/backend/addons/Paper/question/destroy/multi`, params);
}

export function update(id: number, params: any) {
  return client.put(`/backend/addons/Paper/question/${id}`, params);
}

export function importing(param: any) {
  return client.post("/backend/addons/Paper/question/import/csv", param);
}
