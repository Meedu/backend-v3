import client from "./internal/httpClient";

export function list(params: any) {
  return client.get(`/backend/addons/meedu_books/book/index`, params);
}

export function create() {
  return client.get(`/backend/addons/meedu_books/book/create`, {});
}

export function store(params: any) {
  return client.post("/backend/addons/meedu_books/book/create", params);
}

export function detail(id: number) {
  return client.get(`/backend/addons/meedu_books/book/${id}`, {});
}

export function destroy(id: number) {
  return client.destroy(`/backend/addons/meedu_books/book/${id}`);
}

export function update(id: number, params: any) {
  return client.put(`/backend/addons/meedu_books/book/${id}`, params);
}

export function comments(params: any) {
  return client.get(`/backend/addons/meedu_books/book_comment/index`, params);
}

export function commentDestoryMulti(params: any) {
  return client.post(`/backend/addons/meedu_books/book_comment/destroy/multi`, params);
}

export function commentMulti(params: any) {
  return client.post(`/backend/addons/meedu_books/book_comment/checked`, params);
}