import client from "./internal/httpClient";

// 线上课详情

export function list(params: any) {
  return client.get(`/backend/api/v1/course`, params);
}

export function create() {
  return client.get(`/backend/api/v1/course/create`, {});
}

export function store(params: any) {
  return client.post("/backend/api/v1/course", params);
}

export function detail(id: number) {
  return client.get(`/backend/api/v1/course/${id}`, {});
}

export function destroy(id: number) {
  return client.destroy(`/backend/api/v1/course/${id}`);
}

export function update(id: number, params: any) {
  return client.put(`/backend/api/v1/course/${id}`, params);
}

// 获取播放地址
export function playUrl(courseId: number, hourId: number) {
  return client.get(`/api/v1/course/${courseId}/hour/${hourId}`, {});
}

// 记录学员观看时长
export function record(courseId: number, hourId: number, duration: number) {
  return client.get(`/api/v1/course/${courseId}/hour/${hourId}/record`, {
    duration,
  });
}

export function videoList(params: any) {
  return client.get(`/backend/api/v1/video`, params);
}

export function userImport(id: number, params: any) {
  return client.post(`/backend/api/v1/course/${id}/subscribe/import`, params);
}

export function categoryList(params: any) {
  return client.get(`/backend/api/v1/courseCategory`, params);
}

export function categoryDestroy(id: number) {
  return client.destroy(`/backend/api/v1/courseCategory/${id}`);
}

export function categoryCreate() {
  return client.get(`/backend/api/v1/courseCategory/create`, {});
}

export function categoryStore(params: any) {
  return client.post("/backend/api/v1/courseCategory", params);
}

export function categoryDetail(id: number) {
  return client.get(`/backend/api/v1/courseCategory/${id}`, {});
}

export function categoryUpdate(id: number, params: any) {
  return client.put(`/backend/api/v1/courseCategory/${id}`, params);
}

export function commentList(params: any) {
  return client.get(`/backend/api/v1/course_comment`, params);
}

export function commentDestroy(params: any) {
  return client.post(`/backend/api/v1/course_comment/delete`, params);
}
