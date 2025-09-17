// src/services/api/infrastructureService.js
import httpClient from "./httpClient";

const InfrastructureService = {
  getAll: () => httpClient.get("/infrastructures"),
  getById: (id) => httpClient.get(`/infrastructures/${id}`),
  create: (data) => httpClient.post("/infrastructures", data),
  update: (id, data) => httpClient.put(`/infrastructures/${id}`, data),
  remove: (id) => httpClient.delete(`/infrastructures/${id}`),
};

export default InfrastructureService;
