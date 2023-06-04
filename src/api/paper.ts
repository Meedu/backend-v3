import client from "./internal/httpClient";

export function list(params: any) {
  return client.get(`/backend/addons/Paper/paper/index`, params);
}

export function create() {
  return client.get(`/backend/addons/Paper/paper/create`, {});
}

export function store(params: any) {
  return client.post("/backend/addons/Paper/paper/create", params);
}

export function detail(id: number) {
  return client.get(`/backend/addons/Paper/paper/${id}`, {});
}

export function destroy(id: number) {
  return client.destroy(`/backend/addons/Paper/paper/${id}`);
}

export function update(id: number, params: any) {
  return client.put(`/backend/addons/Paper/paper/${id}`, params);
}

export function categoryList(params: any) {
  return client.get(`/backend/addons/Paper/paper_category/index`, params);
}

export function categoryCreate() {
  return client.get(`/backend/addons/Paper/paper_category/create`, {});
}

export function categoryDestroy(id: number) {
  return client.destroy(`/backend/addons/Paper/paper_category/${id}`);
}

export function categoryStore(params: any) {
  return client.post("/backend/addons/Paper/paper_category/create", params);
}

export function categoryDetail(id: number) {
  return client.get(`/backend/addons/Paper/paper_category/${id}`, {});
}

export function categoryUpdate(id: number, params: any) {
  return client.put(`/backend/addons/Paper/paper_category/${id}`, params);
}
