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

export function categoryList(params: any) {
  return client.get(`/backend/addons/Paper/question_category/index`, params);
}

export function categoryCreate() {
  return client.get(`/backend/addons/Paper/question_category/create`, {});
}

export function categoryDestroy(id: number) {
  return client.destroy(`/backend/addons/Paper/question_category/${id}`);
}

export function categoryStore(params: any) {
  return client.post("/backend/addons/Paper/question_category/create", params);
}

export function categoryDetail(id: number) {
  return client.get(`/backend/addons/Paper/question_category/${id}`, {});
}

export function categoryUpdate(id: number, params: any) {
  return client.put(`/backend/addons/Paper/question_category/${id}`, params);
}
