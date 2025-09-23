import React, { useState, useEffect } from "react";

const SubjectForm = ({ editData, onSubmit, onClose, selectedBatch, selectedCourseType, selectedCourse, selectedModule }) => {
  const [formData, setFormData] = useState({
    subjectName: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        subjectName: editData.subjectName || "",
        status: editData.status || "ACTIVE",
      });
    }
  }, [editData]);

//   useEffect(() => {
//   if (editData) {
//     setFormData({
//       subjectName: editData.subjectName || "",
//       status: editData.status || "ACTIVE",
//     });

//     // Update selectedModule if editing
//     if (editData.moduleId) {
//       selectedModule = editData.moduleId; // ⚠️ make sure your parent updates this value too
//     }
//   }
// }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Merge selected filters with form data
    const finalPayload = {
      ...formData,
      batchCycleId: selectedBatch,
      courseTypeId: selectedCourseType,
      courseId: selectedCourse,
      moduleId: selectedModule,
    };

    onSubmit(finalPayload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2 font-medium">Subject Name</label>
        <input
          type="text"
          name="subjectName"
          value={formData.subjectName}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

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
          {editData ? "Update" : "Add"} Subject
        </button>
      </div>
    </form>
  );
};

export default SubjectForm;
