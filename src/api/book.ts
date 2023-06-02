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
  return client.post(
    `/backend/addons/meedu_books/book_comment/destroy/multi`,
    params
  );
}

export function commentMulti(params: any) {
  return client.post(
    `/backend/addons/meedu_books/book_comment/checked`,
    params
  );
}

export function categoryList(params: any) {
  return client.get(`/backend/addons/meedu_books/book_category/index`, params);
}

export function categoryDestroy(id: number) {
  return client.destroy(`/backend/addons/meedu_books/book_category/${id}`);
}

export function categoryStore(params: any) {
  return client.post(
    "/backend/addons/meedu_books/book_category/create",
    params
  );
}

export function categoryDetail(id: number) {
  return client.get(`/backend/addons/meedu_books/book_category/${id}`, {});
}

export function categoryUpdate(id: number, params: any) {
  return client.put(`/backend/addons/meedu_books/book_category/${id}`, params);
}

export function articleList(params: any) {
  return client.get(`/backend/addons/meedu_books/book_article/index`, params);
}

export function articleCreate(params: any) {
  return client.get(`/backend/addons/meedu_books/book_article/create`, params);
}

export function articleDestroy(id: number) {
  return client.destroy(`/backend/addons/meedu_books/book_article/${id}`);
}

export function articleStore(params: any) {
  return client.post("/backend/addons/meedu_books/book_article/create", params);
}

export function articleDetail(id: number) {
  return client.get(`/backend/addons/meedu_books/book_article/${id}`, {});
}

export function articleUpdate(id: number, params: any) {
  return client.put(`/backend/addons/meedu_books/book_article/${id}`, params);
}

export function articleComments(params: any) {
  return client.get(
    `/backend/addons/meedu_books/article_comment/index`,
    params
  );
}

export function articleCommentDestoryMulti(params: any) {
  return client.post(
    `/backend/addons/meedu_books/article_comment/destroy/multi`,
    params
  );
}

export function articleCommentMulti(params: any) {
  return client.post(
    `/backend/addons/meedu_books/article_comment/checked`,
    params
  );
}

export function userList(id: number, params: any) {
  return client.get(`/backend/addons/meedu_books/book/${id}/users`, params);
}

export function userDel(id: number, params: any) {
  return client.post(`/backend/addons/meedu_books/book/${id}/user/del`, params);
}

export function userAdd(id: number, params: any) {
  return client.post(`/backend/addons/meedu_books/book/${id}/user/add`, params);
}

export function chaptersList(params: any) {
  return client.get(`/backend/addons/meedu_books/book_chapter/index`, params);
}

export function chaptersDestroy(id: number) {
  return client.destroy(`/backend/addons/meedu_books/book_chapter/${id}`);
}

export function chaptersStore(params: any) {
  return client.post(`/backend/addons/meedu_books/book_chapter/create`, params);
}

export function chaptersDetail(id: number) {
  return client.get(`/backend/addons/meedu_books/book_chapter/${id}`, {});
}

export function chaptersUpdate(id: number, params: any) {
  return client.put(`/backend/addons/meedu_books/book_chapter/${id}`, params);
}
