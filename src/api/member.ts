import client from "./internal/httpClient";

export function list(params: any) {
  return client.get("/backend/api/v1/member", params);
}

export function create(params: any) {
  return client.get("/backend/api/v1/member/create", params);
}

export function store(params: any) {
  return client.post("/backend/api/v1/member", params);
}

export function edit(id: number) {
  return client.get(`/backend/api/v1/member/${id}`, {});
}

export function update(id: number, params: any) {
  return client.put(`/backend/api/v1/member/${id}`, params);
}

export function destroy(id: number) {
  return client.destroy(`/backend/api/v2/member/${id}`);
}

export function editMulti(params: any) {
  return client.put(`/backend/api/v1/member/field/multi`, params);
}

export function sendMessageMulti(params: any) {
  return client.post("/backend/api/v1/member/message/multi", params);
}

export function sendMessage(id: number, params: any) {
  return client.post(`/backend/api/v1/member/${id}/message`, params);
}
