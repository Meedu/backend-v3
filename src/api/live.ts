import client from "./internal/httpClient";

export function list(params: any) {
  return client.get(`/backend/addons/zhibo/course/index`, params);
}

export function create() {
  return client.get(`/backend/addons/zhibo/course/create`, {});
}

export function store(params: any) {
  return client.post("/backend/addons/zhibo/course/create", params);
}

export function detail(id: number) {
  return client.get(`/backend/addons/zhibo/course/${id}`, {});
}

export function destroy(id: number) {
  return client.destroy(`/backend/addons/zhibo/course/${id}`);
}

export function update(id: number, params: any) {
  return client.put(`/backend/addons/zhibo/course/${id}`, params);
}
