import httpClient from "./httpClient";

const BatchCycleService = {
  getAll: () => httpClient.get("/batch-cycles"),
  create: (data) => httpClient.post("/batch-cycles", data),
  update: (id, data) => httpClient.put(`/batch-cycles/${id}`, data),
  remove: (id) => httpClient.delete(`/batch-cycles/${id}`),
};

export default BatchCycleService;
