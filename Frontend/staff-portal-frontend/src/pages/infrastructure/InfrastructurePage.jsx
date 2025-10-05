// src/pages/infrastructure/InfrastructurePage.jsx
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import InfrastructureService from "../../services/api/infrastructureService";
import InfrastructureForm from "../../components/features/infrastructure/InfrastructureForm";
import InfrastructureTable from "../../components/features/infrastructure/InfrastructureTable";

const InfrastructurePage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [infrastructures, setInfrastructures] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInfrastructures = async () => {
    setLoading(true);
    try {
      const res = await InfrastructureService.getAll();
      setInfrastructures(res.data);
    } catch (err) {
      toast.error("Failed to load infrastructures");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfrastructures();
  }, []);

  const handleAdd = () => {
    setEditData(null);
    setShowForm(true);
  };

  const handleEdit = (infra) => {
    setEditData(infra);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this infrastructure?")) {
      try {
        await InfrastructureService.remove(id);
        toast.success("Infrastructure deleted");
        fetchInfrastructures();
      } catch (err) {
        toast.error("Failed to delete infrastructure");
        console.error(err);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editData) {
        await InfrastructureService.update(editData.infrastructureId, formData);
        toast.success("Infrastructure updated");
      } else {
        await InfrastructureService.create(formData);
        toast.success("Infrastructure created");
      }
      setShowForm(false);
      setEditData(null);
      fetchInfrastructures();
    } catch (err) {
      toast.error("Failed to save infrastructure");
      console.error(err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditData(null);
  };

  return (
    <div className="flex">
      <div className="w-64 bg-gray-100 border-r min-h-screen"></div>
      <main className="flex-1 p-6 relative">
        <Toaster position="top-right" />
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Manage Infrastructure
        </h2>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <InfrastructureTable
            data={infrastructures}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md animate-fade-in">
              <InfrastructureForm
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
                defaultValues={editData}
              />
            </div>
          </div>
        )}

        <div className="fixed bottom-5 right-5 z-10">
          <button
            onClick={handleAdd}
            className="bg-green-600 text-white px-6 py-3 rounded-md shadow hover:bg-green-700 transition"
          >
            + Add Infrastructure
          </button>
        </div>
      </main>
    </div>
  );
};

export default InfrastructurePage;
