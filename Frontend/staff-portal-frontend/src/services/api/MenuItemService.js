import axios from "axios";
import config from "../../config/config";

// Create menu item
export const createMenuItem = async (menuItemData) => {
  const response = await axios.post(
    `${config.serverBaseUrlMenuItem}/createMenuItem`,
    menuItemData,
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};

// Update menu item
export const updateMenuItem = async (id, menuItemData) => {
  const response = await axios.put(
    `${config.serverBaseUrlMenuItem}/updateMenuItem/${id}`,
    menuItemData,
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};

// Delete menu item
export const deleteMenuItem = async (id) => {
  const response = await axios.delete(
    `${config.serverBaseUrlMenuItem}/deleteMenuItem/${id}`
  );
  return response.data;
};

// Get all menu items
export const getAllMenuItems = async () => {
  const response = await axios.get(`${config.serverBaseUrlMenuItem}`);
  return response.data;
};

export const searchMenuItems = async (title) => {
  const response = await axios.get(`${config.serverBaseUrlMenuItem}/search`, {
    params: { title },
  });
  return response.data;
};