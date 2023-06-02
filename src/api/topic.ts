import client from "./internal/httpClient";

export function list(params: any) {
  return client.get(`/backend/addons/meedu_topics/topic/index`, params);
}

export function create() {
  return client.get(`/backend/addons/meedu_topics/topic/create`, {});
}

export function store(params: any) {
  return client.post("/backend/addons/meedu_topics/topic/create", params);
}

export function detail(id: number) {
  return client.get(`/backend/addons/meedu_topics/topic/${id}`, {});
}

export function destroy(id: number) {
  return client.destroy(`/backend/addons/meedu_topics/topic/${id}`);
}

export function update(id: number, params: any) {
  return client.put(`/backend/addons/meedu_topics/topic/${id}`, params);
}

export function comments(params: any) {
  return client.get(`/backend/addons/meedu_topics/comment`, params);
}

export function commentDestory(id: number) {
  return client.destroy(`/backend/addons/meedu_topics/comment/${id}`);
}

export function commentMulti(params: any) {
  return client.post(`/backend/addons/meedu_topics/comment/check`, params);
}

export function userList(id: number, params: any) {
  return client.get(`/backend/addons/meedu_topics/topic/${id}/users`, params);
}

export function order(params: any) {
  return client.get(`/backend/addons/meedu_topics/orders`, params);
}

export function userDel(params: any) {
  return client.post(`/backend/addons/meedu_topics/order/user/del`, params);
}

export function userAdd(params: any) {
  return client.post(`/backend/addons/meedu_topics/order/user/add`, params);
}

export function categoryList(params: any) {
  return client.get(`/backend/addons/meedu_topics/category/index`, params);
}

export function categoryDestroy(id: number) {
  return client.destroy(`/backend/addons/meedu_topics/category/${id}`);
}

export function categoryStore(params: any) {
  return client.post("/backend/addons/meedu_topics/category/create", params);
}

export function categoryDetail(id: number) {
  return client.get(`/backend/addons/meedu_topics/category/${id}`, {});
}

export function categoryUpdate(id: number, params: any) {
  return client.put(`/backend/addons/meedu_topics/category/${id}`, params);
}
