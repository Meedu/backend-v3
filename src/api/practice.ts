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
  return client.get(`/backend/addons/Paper/practice/${id}`, {});
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

export function chapterList(params: any) {
  return client.get(`/backend/addons/Paper/practice_chapter/index`, params);
}

export function chapterCreate() {
  return client.get(`/backend/addons/Paper/practice_chapter/create`, {});
}

export function chaptersDestoryMulti(params: any) {
  return client.post(
    `/backend/addons/Paper/practice_chapter/delete/multi`,
    params
  );
}

export function chaptersStore(params: any) {
  return client.post(`/backend/addons/Paper/practice_chapter/create`, params);
}

export function chaptersDetail(id: number) {
  return client.get(`/backend/addons/Paper/practice_chapter/${id}`, {});
}

export function chaptersUpdate(id: number, params: any) {
  return client.put(`/backend/addons/Paper/practice_chapter/${id}`, params);
}

export function questionList(id: number, params: any) {
  return client.get(
    `/backend/addons/Paper/practice_chapter/${id}/questions`,
    params
  );
}

export function questionCreate(id: number, params: any) {
  return client.get(
    `/backend/addons/Paper/practice_chapter/${id}/questions/params`,
    params
  );
}

export function questionDestoryMulti(id: number, params: any) {
  return client.post(
    `/backend/addons/Paper/practice_chapter/${id}/questions/delete`,
    params
  );
}

export function questionStoreMulti(id: number, params: any) {
  return client.post(
    `/backend/addons/Paper/practice_chapter/${id}/questions`,
    params
  );
}
