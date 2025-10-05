import axios from "axios";
import config from "../../config/config";

export const getAllRoleMenuAccess = async () => {
  const response = await axios.get(`${config.serverBaseUrlRoleMenuAccess}/getAll`);
    return response.data;
};

export const createRoleMenuAccess = async (data) => {
  const response = await axios.post(`${config.serverBaseUrlRoleMenuAccess}/create`, data);
  return response.data;
};

export const updateRoleMenuAccessStatus = async (accessId, status) => {
  const response = await axios.patch(`${config.serverBaseUrlRoleMenuAccess}/updateStatus/${accessId}`, null, {
    params: { status },
  });
  return response.data;
};

export const deleteRoleMenuAccess = async (accessId) => {
  const response = await axios.delete(`${config.serverBaseUrlRoleMenuAccess}/delete/${accessId}`);
  return response.data;
};

export const getRoleMenuAccessByRole = async (roleName) => {
  const response = await axios.get(`${config.serverBaseUrlRoleMenuAccess}/role/${roleName}`);
  return response.data;
};
