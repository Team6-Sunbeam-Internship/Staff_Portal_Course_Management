import React, { useEffect, useState } from "react";
import dropdownService from "../../../../../services/api/dropdownService";

const CourseForm = ({ editData, onSubmit, onClose }) => {
  const [batchCycles, setBatchCycles] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    batchCycleId: "",
    courseTypeId: "",
    courseName: "",
    courseCode: "",
    startDate: "",
    endDate: "",
    status: "ACTIVE",
  });

  // Fetch dropdowns on mount
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [batchRes, typeRes] = await Promise.all([
          dropdownService.getBatchCycles(),
          dropdownService.getCourseTypes(),
        ]);

        setBatchCycles(batchRes.data || []);
        setCourseTypes(typeRes.data || []);
      } catch (err) {
        console.error("Error fetching dropdowns:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDropdowns();
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        batchCycleId: editData.batchCycleId || "",
        courseTypeId: editData.courseTypeId || "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error("Error saving course:", err);
      alert("Failed to save course. Please check the console.");
    }
  };

  if (loading) return <p>Loading dropdowns...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Batch Cycle</label>
        <select
          name="batchCycleId"
          value={formData.batchCycleId}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        >
          <option value="">Select Batch Cycle</option>
          {batchCycles.map((bc) => (
            <option key={bc.id} value={bc.id}>
              {bc.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Course Type</label>
        <select
          name="courseTypeId"
          value={formData.courseTypeId}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        >
          <option value="">Select Course Type</option>
          {courseTypes.map((ct) => (
            <option key={ct.id} value={ct.id}>
              {ct.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Course Name</label>
        <input
          type="text"
          name="courseName"
          value={formData.courseName}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
      </div>

      <div>
        <label>Course Code</label>
        <input
          type="text"
          name="courseCode"
          value={formData.courseCode}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label>End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
      </div>

      <div>
        <label>Status</label>
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
          {editData ? "Update" : "Add"} Course
        </button>
      </div>
    </form>
  );
};

export default CourseForm;
