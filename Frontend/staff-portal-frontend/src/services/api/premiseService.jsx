import httpClient from "./httpClient";

const PremiseService = {
  getAll: () => httpClient.get("/premises"),
  create: (data) => httpClient.post("/premises", data),
  update: (id, data) => httpClient.put(`/premises/${id}`, data),
  remove: (id) => httpClient.delete(`/premises/${id}`),
};

export default PremiseService;
