import axios from "axios";
export const callBackendService = async (method, url, { data = null, params = null } = {}) => {
  try {
    const response = await axios({
      method,
      url,
      data,   // for POST, PUT
      params, // for query params ?key=value
    });
    return response.data;
  } catch (error) {
    console.error("Backend service error:", error);
    throw error;
  }
};