import client from "./internal/httpClient";

export function list(params: any) {
  return client.get(`/backend/addons/meedu_books/book/index`, params);
}
