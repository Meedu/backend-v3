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
