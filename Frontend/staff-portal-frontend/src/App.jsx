import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ManageStudents from "./components/features/users/components/ManageStudents";
import ManageStaff from "./components/features/users/components/ManageStaff";
import MenuItem from "./components/features/users/components/MenuItem";
import RoleMenuAccess from "./components/features/users/components/RoleMenuAccess";
import StaffMenuAccess from "./components/features/users/components/StaffMenuAccess";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/manage-students" element={<ManageStudents />} />
        <Route path="/manage-staff" element={<ManageStaff />} />
        <Route path="/menu-item" element={<MenuItem />} />
        <Route path="/role-menu-access" element={<RoleMenuAccess />} />
        <Route path="/staff-menu-access" element={<StaffMenuAccess />} />
      </Routes>

      <ToastContainer />
    </>
  );
};

export default App;