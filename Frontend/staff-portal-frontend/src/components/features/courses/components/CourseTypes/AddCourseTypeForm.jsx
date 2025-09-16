import React, { useState, useEffect } from "react";
import courseTypeService from "../../../../../services/api/courseTypeService";

const AddCourseTypeForm = ({ onClose, onAdd, onUpdate, editData, premises }) => {
  const [formData, setFormData] = useState({
    typeName: "",
    description: "",
    status: "ACTIVE",
    premisesId: "",
  });

  // Fill form when editing
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
        err.response?.data?.message || "Failed to save course type. Check premises selection."
      );
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {editData ? "Edit Course Type" : "Add Course Type"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Name */}
          <div>
            <label>Type Name</label>
            <input
              type="text"
              name="typeName"
              value={formData.typeName}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
            />
          </div>

          {/* Description */}
          <div>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded p-2"
              rows={2}
            />
          </div>

          {/* Premises Dropdown */}
          <div>
            <label>Premises</label>
            <select
              name="premisesId"
              value={formData.premisesId}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
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
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded">
              {editData ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseTypeForm;
