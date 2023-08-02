import client from "./internal/httpClient";

export function list(params: any) {
  return client.get(`/backend/addons/zhibo/course/index`, params);
}

export function create() {
  return client.get(`/backend/addons/zhibo/course/create`, {});
}

export function store(params: any) {
  return client.post("/backend/addons/zhibo/course/create", params);
}

export function detail(id: number) {
  return client.get(`/backend/addons/zhibo/course/${id}`, {});
}

export function destroy(id: number) {
  return client.destroy(`/backend/addons/zhibo/course/${id}`);
}

export function update(id: number, params: any) {
  return client.put(`/backend/addons/zhibo/course/${id}`, params);
}

export function comment(params: any) {
  return client.get(`/backend/addons/zhibo/course_comment`, params);
}
export function stats(id: number, params: any) {
  return client.get(`/backend/addons/zhibo/course/${id}/stats`, params);
}

export function commentDestoryMulti(params: any) {
  return client.post(`/backend/addons/zhibo/course_comment/delete`, params);
}

export function commentCheck(params: any) {
  return client.post(`/backend/addons/zhibo/course_comment/check`, params);
}

export function userImport(id: number, params: any) {
  return client.post(`/backend/addons/zhibo/course/${id}/user/import`, params);
}

export function userList(id: number, params: any) {
  return client.get(`/backend/addons/zhibo/course/${id}/users`, params);
}

export function watchUsers(id: number, params: any) {
  return client.get(`/backend/addons/zhibo/course/${id}/watch-users`, params);
}

export function userDel(id: number, params: any) {
  return client.post(`/backend/addons/zhibo/course/${id}/user/del`, params);
}

export function userAdd(id: number, params: any) {
  return client.post(`/backend/addons/zhibo/course/${id}/user/add`, params);
}

export function categoryList(params: any) {
  return client.get(`/backend/addons/zhibo/course_category/index`, params);
}

export function categoryDestroy(id: number) {
  return client.destroy(`/backend/addons/zhibo/course_category/${id}`);
}

export function categoryCreate() {
  return client.get(`/backend/addons/zhibo/course_category/create`, {});
}

export function categoryStore(params: any) {
  return client.post("/backend/addons/zhibo/course_category/create", params);
}

export function categoryDetail(id: number) {
  return client.get(`/backend/addons/zhibo/course_category/${id}`, {});
}

export function categoryUpdate(id: number, params: any) {
  return client.put(`/backend/addons/zhibo/course_category/${id}`, params);
}

export function teacherList(params: any) {
  return client.get(`/backend/addons/zhibo/teacher/index`, params);
}

export function teacherDestroy(id: number) {
  return client.destroy(`/backend/addons/zhibo/teacher/${id}`);
}

export function teacherCreate() {
  return client.get(`/backend/addons/zhibo/teacher/create`, {});
}

export function teacherStore(params: any) {
  return client.post("/backend/addons/zhibo/teacher/create", params);
}

export function teacherDetail(id: number) {
  return client.get(`/backend/addons/zhibo/teacher/${id}`, {});
}

export function teacherUpdate(id: number, params: any) {
  return client.put(`/backend/addons/zhibo/teacher/${id}`, params);
}

export function videoList(params: any) {
  return client.get(`/backend/addons/zhibo/course_video/index`, params);
}

export function videoDestory(id: number) {
  return client.destroy(`/backend/addons/zhibo/course_video/${id}`);
}

export function videoCreate() {
  return client.get(`/backend/addons/zhibo/course_video/create`, {});
}

export function videoStore(params: any) {
  return client.post("/backend/addons/zhibo/course_video/create", params);
}

export function videoDetail(id: number) {
  return client.get(`/backend/addons/zhibo/course_video/${id}`, {});
}

export function videoUpdate(id: number, params: any) {
  return client.put(`/backend/addons/zhibo/course_video/${id}`, params);
}

export function videoStats(id: number) {
  return client.get(`/backend/addons/zhibo/course_video/${id}/stats`, {});
}

export function videoChats(id: number, ids: number, params: any) {
  return client.get(`/backend/addons/zhibo/chat/${id}/${ids}`, params);
}

export function videoChatDestoryMulti(params: any) {
  return client.post(`/backend/addons/zhibo/chat/delete`, params);
}

export function videoWatchUsers(id: number, params: any) {
  return client.get(
    `/backend/addons/zhibo/course_video/${id}/watch-users`,
    params
  );
}

export function chaptersList(params: any) {
  return client.get(`/backend/addons/zhibo/course_chapter/index`, params);
}

export function chaptersDestroy(id: number) {
  return client.destroy(`/backend/addons/zhibo/course_chapter/${id}`);
}

export function chaptersStore(params: any) {
  return client.post(`/backend/addons/zhibo/course_chapter/create`, params);
}

export function chaptersDetail(id: number) {
  return client.get(`/backend/addons/zhibo/course_chapter/${id}`, {});
}

export function chaptersUpdate(id: number, params: any) {
  return client.put(`/backend/addons/zhibo/course_chapter/${id}`, params);
}
