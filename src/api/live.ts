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
