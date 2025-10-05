import axios from "axios";
import config from "../../config/config";

const httpClient = axios.create({
  baseURL: config.baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: config.timeout || 10000,
});

export default httpClient;

