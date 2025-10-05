import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import BatchCycleService from "../../services/api/batchCycleService";
import BatchCycleForm from "../../components/features/batchcycle/BatchCycleForm";
import BatchCycleTable from "../../components/features/batchcycle/BatchCycleTable";

const BatchCyclePage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [batchCycles, setBatchCycles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBatchCycles = async () => {
    setLoading(true);
    try {
      const res = await BatchCycleService.getAll();
      setBatchCycles(res.data);
    } catch (err) {
      toast.error("Failed to load batch cycles");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatchCycles();
  }, []);

  const handleAdd = () => {
    setEditData(null);
    setShowForm(true);
  };

  const handleEdit = (cycle) => {
    setEditData(cycle);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this batch?")) {
      try {
        await BatchCycleService.remove(id);
        toast.success("Batch cycle deleted");
        fetchBatchCycles();
      } catch (err) {
        toast.error("Failed to delete batch cycle");
        console.error(err);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editData) {
        await BatchCycleService.update(editData.batchCycleId, formData);
        toast.success("Batch cycle updated");
      } else {
        await BatchCycleService.create(formData);
        toast.success("Batch cycle created");
      }
      setShowForm(false);
      setEditData(null);
      fetchBatchCycles();
    } catch (err) {
      toast.error("Failed to save batch cycle");
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
          Manage Batch Cycle
        </h2>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <BatchCycleTable
            data={batchCycles}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md animate-fade-in">
              <BatchCycleForm
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
            + Add Batch Cycle
          </button>
        </div>
      </main>
    </div>
  );
};

export default BatchCyclePage;
