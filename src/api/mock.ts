import client from "./internal/httpClient";

export function list(params: any) {
  return client.get(`/backend/addons/Paper/mock_paper/index`, params);
}
