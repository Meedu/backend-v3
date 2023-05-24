import client from "./internal/httpClient";

export function list(params: any) {
  return client.get(`/backend/addons/LearningPaths/path/index`, params);
}

export function create() {
  return client.get(`/backend/addons/LearningPaths/path/create`, {});
}

export function store(params: any) {
  return client.post("/backend/addons/LearningPaths/path/create", params);
}

export function detail(id: number) {
  return client.get(`/backend/addons/LearningPaths/path/${id}`, {});
}

export function update(id: number, params: any) {
  return client.put(`/backend/addons/LearningPaths/path/${id}`, params);
}

export function destroy(id: number) {
  return client.destroy(`/backend/addons/LearningPaths/path/${id}`);
}

export function users(id: number, params: any) {
  return client.get(`/backend/addons/LearningPaths/path/${id}/users`, params);
}

export function categoryList(params: any) {
  return client.get(`/backend/addons/LearningPaths/category/index`, params);
}

export function categoryDestroy(id: number) {
  return client.destroy(`/backend/addons/LearningPaths/category/${id}`);
}

export function categoryCreate() {
  return client.get(`/backend/addons/LearningPaths/category/create`, {});
}

export function categoryStore(params: any) {
  return client.post("/backend/addons/LearningPaths/category/create", params);
}

export function categoryDetail(id: number) {
  return client.get(`/backend/addons/LearningPaths/category/${id}`, {});
}

export function categoryUpdate(id: number, params: any) {
  return client.put(`/backend/addons/LearningPaths/category/${id}`, params);
}

export function stepList(params: any) {
  return client.get(`/backend/addons/LearningPaths/v2/step/index`, params);
}

export function stepDestroy(id: number) {
  return client.destroy(`/backend/addons/LearningPaths/v2/step/${id}`);
}

export function stepCreate() {
  return client.get(`/backend/addons/LearningPaths/v2/step/create`, {});
}

export function stepStore(params: any) {
  return client.post("/backend/addons/LearningPaths/v2/step/create", params);
}

export function stepDetail(id: number) {
  return client.get(`/backend/addons/LearningPaths/v2/step/${id}`, {});
}

export function stepUpdate(id: number, params: any) {
  return client.put(`/backend/addons/LearningPaths/v2/step/${id}`, params);
}
