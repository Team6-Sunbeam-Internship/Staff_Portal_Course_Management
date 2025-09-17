import React from "react";
import { Routes, Route } from "react-router-dom";
import InfrastructurePage from "../pages/infrastructure/InfrastructurePage";

const AppRoutes = () => (
  <Routes>
    <Route path="/infrastructures" element={<InfrastructurePage />} />
  </Routes>
);

export default AppRoutes;
