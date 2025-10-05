import React, { useState, useEffect } from "react";
import courseTypeService from "../../../../../services/api/courseTypeService";

const AddCourseTypeForm = ({ onClose, onAdd, onUpdate, editData, premises }) => {
  const [formData, setFormData] = useState({
    typeName: "",
    description: "",
    status: "ACTIVE",
    premisesId: "",
  });

  // Prefill when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        typeName: editData.typeName || "",
        description: editData.description || "",
        status: editData.status || "ACTIVE",
        premisesId: editData.premisesId || "",
      });
    } else {
      setFormData({
        typeName: "",
        description: "",
        status: "ACTIVE",
        premisesId: "",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editData) {
        response = await courseTypeService.update(editData.courseTypeId, formData);
        onUpdate(response.data);
      } else {
        response = await courseTypeService.add(formData);
        onAdd(response.data);
      }
      onClose();
    } catch (err) {
      console.error("Error saving course type:", err);
      alert(
        err.response?.data?.message ||
          "Failed to save course type. Check premises selection."
      );
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center 
                    bg-white/20 backdrop-blur-sm z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-bold text-green-700 mb-4">
          {editData ? "Edit Course Type" : "Add Course Type"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type Name
            </label>
            <input
              type="text"
              name="typeName"
              value={formData.typeName}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Premises Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Premises
            </label>
            <select
              name="premisesId"
              value={formData.premisesId}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            >
              <option value="">Select Premises</option>
              {premises.map((p) => (
                <option key={p.premisesId} value={p.premisesId}>
                  {p.name || p.address}
                </option>
              ))}
            </select>
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
              className="border p-2 rounded w-full"
              required
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-red-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-teal-700"
            >
              {editData ? "Update" : "Add"} Course Type
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseTypeForm;
