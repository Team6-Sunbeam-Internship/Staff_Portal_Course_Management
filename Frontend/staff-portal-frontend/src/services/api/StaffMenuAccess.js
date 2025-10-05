import axios from "axios";
import config from "../../config/config";

export const getAllStaffMenuAccess = async () => {
  const response = await axios.get(`${config.serverBaseUrlStaffMenuAccess}/getAll`);
  return response.data;
};

export const createStaffMenuAccess = async (data) => {
  const response = await axios.post(`${config.serverBaseUrlStaffMenuAccess}/create`, data);
  return response.data;
};

export const updateStaffMenuAccessStatus = async (accessId, status) => {
  const response = await axios.patch(`${config.serverBaseUrlStaffMenuAccess}/updateStatus/${accessId}`, null, {
    params: { status },
  });
  return response.data;
};

export const deleteStaffMenuAccess = async (accessId) => {
  const response = await axios.delete(`${config.serverBaseUrlStaffMenuAccess}/delete/${accessId}`);
  return response.data;
};

export const getStaffMenuAccessByStaff = async (staffId) => {
  const response = await axios.get(`${config.serverBaseUrlStaffMenuAccess}/getStaff/${staffId}`);
  return response.data;
};

export const searchStaffMenuAccessByName = async (name) => {
  const response = await axios.get(
    `${config.serverBaseUrlStaffMenuAccess}/search`,
    { params: { name } }
  );
  return response.data;
};

export const getAllStaff = async () => {
  const res = await axios.get(`${config.serverBaseUrlStaff}/getAll`); 
  return res.data;
};

export const searchStaffByName = async (name) => {
  const res = await axios.get(`${config.serverBaseUrlStaff}/search`, { params: { name } });
  return res.data;
};
