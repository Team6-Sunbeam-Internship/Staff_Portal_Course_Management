import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create context
const DropdownContext = createContext();

// Custom hook
export const useDropdowns = () => useContext(DropdownContext);

export const DropdownProvider = ({ children }) => {
  const [batchCycles, setBatchCycles] = useState([]);
  const [premises, setPremises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Example API URLs (adjust as per your BE APIs)
  const API_BASE = "/api/dropdowns";

  // Fetch BatchCycles
  const fetchBatchCycles = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/batchcycles`);
      setBatchCycles(res.data);
    } catch (err) {
      setError("Failed to fetch batch cycles");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Premises
  const fetchPremises = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/premises`); // assuming you have a premises endpoint
      setPremises(res.data);
    } catch (err) {
      setError("Failed to fetch premises");
    } finally {
      setLoading(false);
    }
  };

  // Load both on mount
  useEffect(() => {
    fetchBatchCycles();
    fetchPremises();
  }, []);

  return (
    <DropdownContext.Provider
      value={{
        batchCycles,
        premises,
        loading,
        error,
        refreshBatchCycles: fetchBatchCycles,
        refreshPremises: fetchPremises,
      }}
    >
      {children}
    </DropdownContext.Provider>
  );
};
