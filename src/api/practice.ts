import client from "./internal/httpClient";

export function list(params: any) {
  return client.get(`/backend/addons/Paper/practice/index`, params);
}

export function create() {
  return client.get(`/backend/addons/Paper/practice/create`, {});
}

export function store(params: any) {
  return client.post("/backend/addons/Paper/practice/create", params);
}

export function detail(id: number) {
  return client.get(`/backend/addons/Paper/practice/${id}}`, {});
}

export function destroy(params: any) {
  return client.post(`/backend/addons/Paper/practice/delete/multi`, params);
}

export function update(id: number, params: any) {
  return client.put(`/backend/addons/Paper/practice/${id}`, params);
}

export function userList(id: number, params: any) {
  return client.get(`/backend/addons/Paper/practice/${id}/users`, params);
}

export function userDel(id: number, params: any) {
  return client.post(
    `/backend/addons/Paper/practice/${id}/user/delete`,
    params
  );
}

export function userAdd(id: number, params: any) {
  return client.post(
    `/backend/addons/Paper/practice/${id}/user/insert`,
    params
  );
}

export function userProgress(id: number, ids: any) {
  return client.get(
    `/backend/addons/Paper/practice/${id}/user/${ids}/progress`,
    {}
  );
}
