import client from "./internal/httpClient";

export function list(params: any) {
  return client.get("/backend/addons/Snapshot/images", params);
}

export function destorymulti(params: any) {
  return client.post("/backend/addons/Snapshot/images/delete/multi", params);
}
