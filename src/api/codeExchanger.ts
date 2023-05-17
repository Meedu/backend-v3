import client from "./internal/httpClient";

export function list(params: any) {
  return client.get("/backend/addons/CodeExchanger/v2/activity/index", params);
}
export function create(params: any) {
  return client.get("backend/addons/CodeExchanger/v2/activity/create", params);
}

export function destory(id: number) {
  return client.destroy(`/backend/addons/CodeExchanger/v2/activity/${id}`);
}

export function detail(id: number) {
  return client.get(`/backend/addons/CodeExchanger/v2/activity/${id}`, {});
}

export function store(params: any) {
  return client.post(
    "/backend/addons/CodeExchanger/v2/activity/create",
    params
  );
}

export function update(id: number, params: any) {
  return client.put(`/backend/addons/CodeExchanger/v2/activity/${id}`, params);
}
