import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import PremiseService from "../../services/api/premiseService";
import PremiseForm from "../../components/features/premise/PremiseForm";
import PremiseTable from "../../components/features/premise/PremiseTable";

const PremisePage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [premises, setPremises] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPremises = async () => {
    setLoading(true);
    try {
      const res = await PremiseService.getAll();
      setPremises(res.data);
    } catch (err) {
      toast.error("Failed to load premises");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPremises();
  }, []);

  const handleAdd = () => {
    setEditData(null);
    setShowForm(true);
  };

  const handleEdit = (premise) => {
    setEditData(premise);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this premise?")) {
      try {
        await PremiseService.remove(id);
        toast.success("Premise deleted");
        fetchPremises();
      } catch (err) {
        toast.error("Failed to delete premise");
        console.error(err);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editData) {
        await PremiseService.update(editData.premisesId, formData);
        toast.success("Premise updated");
      } else {
        await PremiseService.create(formData);
        toast.success("Premise created");
      }
      setShowForm(false);
      setEditData(null);
      fetchPremises();
    } catch (err) {
      toast.error("Failed to save premise");
      console.error(err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditData(null);
  };

  return (
    <div className="flex">
      {/* Sidebar space (like BatchCyclePage) */}
      <div className="w-64 bg-gray-100 border-r min-h-screen"></div>

      <main className="flex-1 p-6 relative">
        <Toaster position="top-right" />
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Manage Premises
        </h2>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <PremiseTable
            data={premises}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md animate-fade-in">
              <PremiseForm
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
            + Add Premise
          </button>
        </div>
      </main>
    </div>
  );
};

export default PremisePage;
