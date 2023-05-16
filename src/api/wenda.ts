import client from "./internal/httpClient";

export function list(params: any) {
  return client.get("/backend/addons/Wenda/question/index", params);
}

export function category() {
  return client.get("/backend/addons/Wenda/category/index", {});
}

export function destroyMulti(params: any) {
  return client.post(`/backend/addons/Wenda/question/delete`, params);
}

export function answer(id: number) {
  return client.get(`/backend/addons/Wenda/question/${id}/answers`, {});
}

export function destroyCate(id: number) {
  return client.destroy(`/backend/addons/Wenda/category/${id}`);
}
