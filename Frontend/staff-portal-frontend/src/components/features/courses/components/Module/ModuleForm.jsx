import React, { useEffect, useState } from "react";
import dropdownService from "../../../../../services/api/dropdownService";

const ModuleForm = ({ editData, onSubmit, onClose }) => {
  const [batchCycles, setBatchCycles] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({
    moduleName: "",
    batchCycleId: "",
    courseTypeId: "",
    courseId: "",
    theoryHours: "",
    practicalHours: "",
    status: "ACTIVE",
  });

  // Fetch batch cycles and course types on mount
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [batchRes, typeRes] = await Promise.all([
          dropdownService.getBatchCycles(),
          dropdownService.getCourseTypes(),
        ]);
        setBatchCycles(batchRes?.data || []);
        setCourseTypes(typeRes?.data || []);
      } catch (err) {
        console.error("Error fetching dropdowns:", err);
      }
    };
    fetchDropdowns();
  }, []);

  // When editing, prefill all fields
  useEffect(() => {
    if (!editData) return;

    // Step 1: Set batchCycleId and courseTypeId first
    setFormData({
      moduleName: editData.moduleName || "",
      batchCycleId: editData.batchCycleId || "",
      courseTypeId: editData.courseTypeId || "",
      courseId: "", // will set after loading courses
      theoryHours: editData.theoryHours || "",
      practicalHours: editData.practicalHours || "",
      status: editData.status || "ACTIVE",
    });

    // Step 2: Fetch courses for this batch + type
    if (editData.batchCycleId && editData.courseTypeId) {
      dropdownService
        .getCourses(editData.batchCycleId, editData.courseTypeId)
        .then((res) => {
          const courseList = res.data || [];
          setCourses(courseList);

          // Step 3: Prefill courseId after courses are loaded
          setFormData((prev) => ({
            ...prev,
            courseId: editData.courseId || "",
          }));
        })
        .catch((err) => {
          console.error("Error fetching courses:", err);
          setCourses([]);
        });
    }
  }, [editData]);

  // When batchCycleId or courseTypeId changes, fetch courses
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "batchCycleId" || name === "courseTypeId") {
      setFormData((prev) => ({ ...prev, courseId: "" })); // reset course
      const batchId = name === "batchCycleId" ? Number(value) : formData.batchCycleId;
      const typeId = name === "courseTypeId" ? Number(value) : formData.courseTypeId;

      if (batchId && typeId) {
        dropdownService
          .getCourses(batchId, typeId)
          .then((res) => setCourses(res.data || []))
          .catch((err) => {
            console.error("Error fetching courses:", err);
            setCourses([]);
          });
      } else {
        setCourses([]);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Unique courses by name
  const uniqueCourses = Array.from(
    courses.reduce((map, c) => {
      if (!map.has(c.name)) map.set(c.name, c);
      return map;
    }, new Map()).values()
  );

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
          {batchCycles.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
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
            <option key={ct.id} value={ct.id}>{ct.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Course</label>
        <select
          name="courseId"
          value={formData.courseId}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        >
          <option value="">Select Course</option>
          {uniqueCourses.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Module Name</label>
        <input
          type="text"
          name="moduleName"
          value={formData.moduleName}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Theory Hours</label>
          <input
            type="number"
            name="theoryHours"
            value={formData.theoryHours}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div>
          <label>Practical Hours</label>
          <input
            type="number"
            name="practicalHours"
            value={formData.practicalHours}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
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
          {editData ? "Update" : "Add"} Module
        </button>
      </div>
    </form>
  );
};

export default ModuleForm;
