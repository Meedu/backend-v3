import client from "./internal/httpClient";

export function list(params: any) {
  return client.get("/backend/api/v1/order", params);
}

export function refund(id: number, params: any) {
  return client.post(`/backend/api/v1/order/${id}/refund`, params);
}

export function refundList(params: any) {
  return client.get("/backend/api/v1/order/refund/list", params);
}

export function refundDestroy(id: number) {
  return client.destroy(`/backend/api/v1/order/refund/${id}`);
}

export function detail(id: number) {
  return client.get(`/backend/api/v1/order/${id}`, {});
}

export function setPaid(id: number) {
  return client.get(`/backend/api/v1/order/${id}/finish`, {});
}

export function rechargeOrders(params: any) {
  return client.get("/backend/addons/TemplateOne/recharge/orders", params);
}

export function withdrawOrders(params: any) {
  return client.get("/backend/addons/multi_level_share/withdraw/index", params);
}

export function withdrawOrdersSubmit(params: any) {
  return client.post(
    "/backend/addons/multi_level_share/withdraw/handle",
    params
  );
}
