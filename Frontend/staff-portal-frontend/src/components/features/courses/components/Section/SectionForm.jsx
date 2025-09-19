import React, { useEffect, useState } from "react";

const SectionForm = ({ editData, onSubmit, onClose, subjectId }) => {
  const [formData, setFormData] = useState({
    subjectId: subjectId,
    sectionName: "",
    status: "ACTIVE",
  });

  // Prefill form if editing
  useEffect(() => {
    if (editData) {
      setFormData({
        subjectId: editData.subjectId || subjectId,
        sectionName: editData.sectionName || "",
        status: editData.status || "ACTIVE",
      });
    }
  }, [editData, subjectId]);

  // Handle changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Section Name */}
      <div>
        <label className="block mb-1 font-medium">Section Name</label>
        <input
          type="text"
          name="sectionName"
          value={formData.sectionName}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
      </div>

      {/* Status */}
      <div>
        <label className="block mb-1 font-medium">Status</label>
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
          className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
        >
          {editData ? "Update" : "Add"} Section
        </button>
      </div>
    </form>
  );
};

export default SectionForm;
