import React from "react";
import { Routes, Route } from "react-router-dom";
import PremisePage from "../pages/premise/PremisePage";

const AppRoutes = () => (
  <Routes>
    <Route path="/premises" element={<PremisePage />} />
  </Routes>
);

export default AppRoutes;
