import React from "react";
import { Routes, Route } from "react-router-dom";
import BatchCyclePage from "../pages/batchcycle/BatchCyclePage";

const AppRoutes = () => (
  <Routes>
    <Route path="/batch-cycles" element={<BatchCyclePage />} />
  </Routes>
);

export default AppRoutes;
