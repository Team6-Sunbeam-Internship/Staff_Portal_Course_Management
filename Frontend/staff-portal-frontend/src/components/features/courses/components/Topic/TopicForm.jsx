import React, { useEffect, useState } from "react";

const TopicForm = ({ editData, onSubmit, onClose, sectionId }) => {
  const [formData, setFormData] = useState({
    sectionId: sectionId,
    topicName: "",
    status: "ACTIVE",
  });

  // Prefill form if editing
  useEffect(() => {
    if (editData) {
      setFormData({
        sectionId: editData.sectionId || sectionId,
        topicName: editData.topicName || "",
        status: editData.status || "ACTIVE",
      });
    }
  }, [editData, sectionId]);

  // Handle input changes
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
      {/* Topic Name */}
      <div>
        <label className="block mb-1 font-medium">Topic Name</label>
        <input
          type="text"
          name="topicName"
          value={formData.topicName}
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
          className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
        >
          {editData ? "Update" : "Add"} Topic
        </button>
      </div>
    </form>
  );
};

export default TopicForm;
