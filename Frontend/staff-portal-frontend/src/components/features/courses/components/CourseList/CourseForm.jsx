import React, { useEffect, useState } from "react";

const CourseForm = ({ editData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    courseName: "",
    courseCode: "",
    startDate: "",
    endDate: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        courseName: editData.courseName || "",
        courseCode: editData.courseCode || "",
        startDate: editData.startDate || "",
        endDate: editData.endDate || "",
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
      {/* Course Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Course Name
        </label>
        <input
          type="text"
          name="courseName"
          value={formData.courseName}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
      </div>

      {/* Course Code */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Course Code
        </label>
        <input
          type="text"
          name="courseCode"
          value={formData.courseCode}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
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
          {editData ? "Update Course" : "Add Course"}
        </button>
      </div>
    </form>
  );
};

export default CourseForm;
