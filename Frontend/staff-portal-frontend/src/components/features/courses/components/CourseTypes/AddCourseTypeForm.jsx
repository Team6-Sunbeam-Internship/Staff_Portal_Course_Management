import React, { useState } from "react";
import { useDropdowns } from "../../../../../context/DropdownContext.jsx";

const AddCourseTypeForm = ({ onClose, onSuccess }) => {
  const { batchCycles, premises, loading } = useDropdowns();
  const [formData, setFormData] = useState({
    typeName: "",
    batchCycleId: "",
    premisesId: "",
    description: "",
    status: "ACTIVE",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "batchCycleId" || name === "premisesId"
          ? parseInt(value)
          : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/coursetypes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("✅ Course Type added successfully!");
        setFormData({
          typeName: "",
          batchCycleId: "",
          premisesId: "",
          description: "",
          status: "ACTIVE",
        });
        if (onSuccess) onSuccess();
      } else {
        const errorData = await response.json();
        alert(`❌ Error: ${errorData.message || "Failed to add Course Type"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  if (loading) return <p className="text-gray-500">Loading dropdowns...</p>;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-lg relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
{/* console.log("✅ AddCourseTypeForm rendered"); */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Add Course Type
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Course Type Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Course Type Name
            </label>
            <input
              type="text"
              name="typeName"
              placeholder="Enter Course Type"
              value={formData.typeName}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Batch Cycle */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Batch Cycle
            </label>
            <select
              name="batchCycleId"
              value={formData.batchCycleId}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
            >
              <option value="">Select Batch Cycle</option>
              {batchCycles.map((bc) => (
                <option key={bc.id} value={bc.id}>
                  {bc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Premises */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Premise
            </label>
            <select
              name="premisesId"
              value={formData.premisesId}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
            >
              <option value="">Select Premise</option>
              {premises.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Enter Description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          {/* Submit + Cancel */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                !formData.typeName || !formData.batchCycleId || !formData.premisesId
              }
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 disabled:bg-gray-400"
            >
              Add Course Type
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseTypeForm;
