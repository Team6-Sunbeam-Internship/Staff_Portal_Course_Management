// src/services/api/premisesService.js
import httpClient from "./httpClient";

const PremisesService = {
  getAll: () => httpClient.get("/premises"),
};

export default PremisesService;
