import axios from "axios";

const premisesService = {
  getAll: () => axios.get("http://localhost:8082/premises"),
};

export default premisesService;
