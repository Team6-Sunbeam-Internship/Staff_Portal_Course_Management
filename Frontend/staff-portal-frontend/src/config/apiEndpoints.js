// Centralized API endpoints

const API_BASE = "http://localhost:6060/api"; // change this as needed

export const API_ENDPOINTS = {
  COURSES: `${API_BASE}/courses`,
  MODULES: `${API_BASE}/modules`,
  STAFFS: `${API_BASE}/staff/getAll`,
  SUBJECTS: `${API_BASE}/subjects`,
  BATCHCYCLES: `${API_BASE}/batch-cycles`,
  STUDENTGROUPS: `${API_BASE}/course-groups`,
  SECTIONS: `${API_BASE}/sections`,
  VENUES: `${API_BASE}/infrastructures`,
  SCHEDULES: `${API_BASE}/schedules`,
  TOPICS: `${API_BASE}/topics`,
  TIMESHEET: `${API_BASE}/timesheets`,
  SESSIONS: `${API_BASE}/sessions`,
  RECORDED_SESSIONS:`${API_BASE}/recorded-sessions`
};
