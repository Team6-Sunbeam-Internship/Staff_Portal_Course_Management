import React, { useState, useEffect } from "react";

const ModuleForm = ({ editData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    moduleName: "",
    theoryHours: "",
    practicalHours: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        moduleName: editData.moduleName || "",
        theoryHours: editData.theoryHours || "",
        practicalHours: editData.practicalHours || "",
        status: editData.status || "ACTIVE",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Module Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Module Name
        </label>
        <input
          type="text"
          name="moduleName"
          value={formData.moduleName}
          onChange={handleChange}
          required
          className="mt-1 block w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      {/* Theory Hours */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Theory Hours
        </label>
        <input
          type="number"
          name="theoryHours"
          value={formData.theoryHours}
          onChange={handleChange}
          required
          min="0"
          className="mt-1 block w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      {/* Practical Hours */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Practical Hours
        </label>
        <input
          type="number"
          name="practicalHours"
          value={formData.practicalHours}
          onChange={handleChange}
          required
          min="0"
          className="mt-1 block w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-purple-500 focus:border-purple-500"
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
          className="mt-1 block w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-purple-700"
        >
          {editData ? "Update Module" : "Add Module"}
        </button>
      </div>
    </form>
  );
};

export default ModuleForm;
