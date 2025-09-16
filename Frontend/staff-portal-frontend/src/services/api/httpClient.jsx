import axios from "axios";
import config from "../../config/config";

const httpClient = axios.create({
  baseURL: config.baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: config.timeout || 10000,
});

// Optional: Add request interceptor to include token
httpClient.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem("token");
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for logging errors
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default httpClient;
