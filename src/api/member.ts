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

export function userImport(params: any) {
  return client.post("/backend/api/v1/member/import", params);
}

export function detail(id: number) {
  return client.get(`/backend/api/v1/member/${id}/detail`, {});
}

export function userOrders(id: number, params: any) {
  return client.get(`/backend/api/v1/member/${id}/detail/userOrders`, params);
}

export function userVodWatchRecords(params: any) {
  return client.get(`/backend/api/v2/member/courses`, params);
}

export function userVideoWatchRecords(params: any) {
  return client.get(`/backend/api/v2/member/course/progress`, params);
}

export function userVideos(params: any) {
  return client.get(`/backend/api/v2/member/videos`, params);
}

export function userInviteRecords(id: number, params: any) {
  return client.get(`/backend/api/v1/member/${id}/detail/userInvite`, params);
}

export function userCredit1(id: number, params: any) {
  return client.get(
    `/backend/api/v1/member/${id}/detail/credit1Records`,
    params
  );
}

export function userBalanceRecords(params: any) {
  return client.get(
    `/backend/addons/multi_level_share/member/balanceRecords`,
    params
  );
}

export function userIOSRecords(params: any) {
  return client.get(
    `/backend/addons/TemplateOne/member/credit2Records`,
    params
  );
}

export function userLive(params: any) {
  return client.get(`/backend/addons/zhibo/user/index`, params);
}

export function userBook(params: any) {
  return client.get(`/backend/addons/meedu_books/user/index`, params);
}

export function userTopic(params: any) {
  return client.get(`/backend/addons/meedu_topics/orders`, params);
}

export function userPapers(id: number, params: any) {
  return client.get(`/backend/addons/Paper/user/${id}/paper-orders`, params);
}

export function userMockPapers(id: number, params: any) {
  return client.get(
    `/backend/addons/Paper/user/${id}/mock-paper-orders`,
    params
  );
}

export function userPractices(id: number, params: any) {
  return client.get(`/backend/addons/Paper/user/${id}/practice-orders`, params);
}

export function userPapersRecords(id: number, params: any) {
  return client.get(`/backend/addons/Paper/user/${id}/paper-records`, params);
}

export function userMockPapersRecords(id: number, params: any) {
  return client.get(
    `/backend/addons/Paper/user/${id}/mock-paper-records`,
    params
  );
}

export function userPracticesRecords(id: number, params: any) {
  return client.get(
    `/backend/addons/Paper/user/${id}/practice-records`,
    params
  );
}

export function credit1Change(params: any) {
  return client.post(`/backend/api/v1/member/credit1/change`, params);
}

export function IOSRecharge(params: any) {
  return client.post(`/backend/addons/TemplateOne/member/recharge`, params);
}

export function tagRecharge(id: number, params: any) {
  return client.put(`/backend/api/v1/member/${id}/tags`, params);
}

export function tagList(params: any) {
  return client.get(`/backend/api/v1/member/tag/index`, params);
}

export function tagCreate() {
  return client.get(`/backend/api/v1/member/tag/create`, {});
}

export function tagStore(params: any) {
  return client.post(`/backend/api/v1/member/tag/create`, params);
}

export function tagDetail(id: number) {
  return client.get(`/backend/api/v1/member/tag/${id}`, {});
}

export function tagUpdate(id: number, params: any) {
  return client.put(`/backend/api/v1/member/tag/${id}`, params);
}

export function tagDestroy(id: number) {
  return client.destroy(`/backend/api/v1/member/tag/${id}`);
}

export function remarkUpdate(id: number, params: any) {
  return client.put(`/backend/api/v1/member/${id}/remark`, params);
}
