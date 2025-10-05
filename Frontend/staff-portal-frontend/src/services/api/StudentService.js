import axios from "axios";
import config from "../../config/config";

export async function importStudentsFile(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      `${config.serverBaseUrlStudent}/students/import`,
      formData,
      { responseType: "json" }
    );
    return response.data;
  } catch (ex) {
    console.error("Error in importStudentsFile:", ex);
    throw ex;
  }
}

// Get ALL students except deleted
export async function getAllStudents() {
  try {
    // Fetch only ACTIVE and INACTIVE (exclude DELETED)
    const [activeRes, inactiveRes] = await Promise.all([
      axios.get(`${config.serverBaseUrlStudent}/students/active`),
      axios.get(`${config.serverBaseUrlStudent}/students/inactive`)
    ]);

    // Merge both lists
    const allStudents = [
      ...(activeRes.data || []),
      ...(inactiveRes.data || [])
    ];
    return allStudents;
  } catch (ex) {
    console.error("Error in getAllStudents:", ex);
    throw ex;
  }
}

// Delete student by registration number
export async function deleteStudent(registrationNumber) {
  try {
    const response = await axios.delete(
      `${config.serverBaseUrlStudent}/students/delete/${registrationNumber}`
    );
    return response.data;
  } catch (ex) {
    console.error("Error in deleteStudent:", ex);
    throw ex;
  }
}

// Get single student by ID
export async function getStudentById(studentId) {
  try {
    const response = await axios.get(`${config.serverBaseUrlStudent}/students/${studentId}`);
    return response.data;
  } catch (ex) {
    console.error("Error in getStudentById:", ex);
    throw ex;
  }
}

// Save new student
export async function saveStudent(studentData) {
  try {
    const response = await axios.post(
      `${config.serverBaseUrlStudent}/students/add`,
      studentData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (ex) {
    console.error("Error in saveStudent:", ex);
    console.error("Error response:", ex.response?.data);
    console.error("Error status:", ex.response?.status);
    throw ex;
  }
}

// Update student
export async function updateStudent(originalRegistrationNumber, studentData) {
  try {
    
    const response = await axios.put(
      `${config.serverBaseUrlStudent}/students/update/${originalRegistrationNumber}`,
      studentData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (ex) {
    console.error("Error in updateStudent:", ex);
    console.error("Error response:", ex.response?.data);
    console.error("Error status:", ex.response?.status);
    throw ex;
  }
}

// Get all courses from the backend acadamic service
export const getAllCourses = async () => {
  const res = await axios.get(`${config.serverBaseUrlCourse}/courses`);
  return res.data; 
};

// Get Active Students
export async function getActiveStudents() {
  try {
    const res = await axios.get(`${config.serverBaseUrlStudent}/students/active`);
    return res.data;
  } catch (error) {
    console.error("Error fetching active students:", error);
    throw error;
  }
}

// Get Inactive Students
export async function getInactiveStudents() {
  try {
    const res = await axios.get(`${config.serverBaseUrlStudent}/students/inactive`);
    return res.data;
  } catch (error) {
    console.error("Error fetching inactive students:", error);
    throw error;
  }
}
