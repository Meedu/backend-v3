import client from "./internal/httpClient";

export function list(params: any) {
  return client.get(`/backend/addons/Paper/mock_paper/index`, params);
}

export function create(params: any) {
  return client.get(`/backend/addons/Paper/mock_paper/create`, params);
}

export function store(params: any) {
  return client.post("/backend/addons/Paper/mock_paper/create", params);
}

export function detail(id: number) {
  return client.get(`/backend/addons/Paper/mock_paper/${id}`, {});
}

export function destroy(id: number) {
  return client.destroy(`/backend/addons/Paper/mock_paper/${id}`);
}

export function update(id: number, params: any) {
  return client.put(`/backend/addons/Paper/mock_paper/${id}`, params);
}

export function userPaper(id: number, params: any) {
  return client.get(`/backend/addons/Paper/mock_paper/${id}/records`, params);
}

export function stats(id: number, params: any) {
  return client.get(
    `/backend/addons/Paper/mock_paper/${id}/statistics`,
    params
  );
}

export function userList(id: number, params: any) {
  return client.get(`/backend/addons/Paper/mock_paper/${id}/users`, params);
}

export function userDel(id: number, params: any) {
  return client.post(
    `/backend/addons/Paper/mock_paper/${id}/user/delete`,
    params
  );
}

export function userAdd(id: number, params: any) {
  return client.post(
    `/backend/addons/Paper/mock_paper/${id}/user/insert`,
    params
  );
}

export function mockPaperJoinRecord(paperId: number, recordId: number) {
  return client.get(
    `/backend/addons/Paper/mock_paper/${paperId}/userPaper/${recordId}`,
    {}
  );
}
