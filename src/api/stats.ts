import client from "./internal/httpClient";

export function transactionList(params: any) {
  return client.get("/backend/api/v2/stats/transaction", params);
}

export function transactionGraph(params: any) {
  return client.get("/backend/api/v2/stats/transaction-graph", params);
}

export function contentList(params: any) {
  return client.get("/backend/api/v2/stats/transaction-top", params);
}
