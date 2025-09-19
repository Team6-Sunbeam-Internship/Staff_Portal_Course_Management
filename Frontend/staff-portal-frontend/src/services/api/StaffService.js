// import axios from "axios";
// import config from "../../config/config";

// // Create a new staff member
// export const createStaff = async (staffData) => {
//   const response = await axios.post(`${config.serverBaseUrlStaff}/createStaff`, staffData, {
//     headers: { "Content-Type": "application/json" },
//   });
//   return response.data;
// };

// // Get all staff
// export const getAllStaff = async () => {
//   const response = await axios.get(`${config.serverBaseUrlStaff}/getAll`);
//   return response.data;
// };

// // Get single staff by ID
// export const getStaffById = async (staffId) => {
//   const response = await axios.get(`${config.serverBaseUrlStaff}/getStaffById/${staffId}`);
//   return response.data;
// };

// // Update staff
// export const updateStaff = async (staffId, staffData) => {
//   const response = await axios.patch(
//     `${config.serverBaseUrlStaff}/update/${staffId}`,
//     staffData,
//     {
//       headers: { "Content-Type": "application/json" },
//     }
//   );
//   return response.data;
// };

// // Delete staff
// export const deleteStaff = async (staffId) => {
//   const response = await axios.delete(`${config.serverBaseUrlStaff}/delete/${staffId}`);
//   return response.data;
// };







import axios from "axios";
import config from "../../config/config";

// Create a new staff member
export const createStaff = async (staffData) => {
  const response = await axios.post(`${config.serverBaseUrlStaff}/createStaff`, staffData, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

// Get all staff
export const getAllStaff = async () => {
  const response = await axios.get(`${config.serverBaseUrlStaff}/getAll`);
  return response.data;
};

// Get single staff by ID
export const getStaffById = async (staffId) => {
  const response = await axios.get(`${config.serverBaseUrlStaff}/getStaffById/${staffId}`);
  return response.data;
};

// Update staff
export const updateStaff = async (staffId, staffData) => {
  const response = await axios.patch(
    `${config.serverBaseUrlStaff}/update/${staffId}`,
    staffData,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

// Delete staff
export const deleteStaff = async (staffId) => {
  const response = await axios.delete(`${config.serverBaseUrlStaff}/delete/${staffId}`);
  return response.data;
};

export const searchStaffByName = async (name) => {
  const response = await axios.get(`${config.serverBaseUrlStaff}/search`, { 
    params: { name } 
  });
  return response.data;
};

export const getStaffByType = async (staffType) => {
  const response = await axios.get(`${config.serverBaseUrlStaff}/filterByType`, {
    params: { staffType }
  });
  return response.data;
};

export const getStaffByRole = async (staffRole) => {
  const response = await axios.get(`${config.serverBaseUrlStaff}/filterByRole`, {
    params: { staffRole }
  });
  return response.data;
};

export const searchByCourseSpecialization = async (courseSpecialization) => {
  const response = await axios.get(`${config.serverBaseUrlStaff}/searchByCourse`, {
    params: { courseSpecialization }
  });
  return response.data;
};