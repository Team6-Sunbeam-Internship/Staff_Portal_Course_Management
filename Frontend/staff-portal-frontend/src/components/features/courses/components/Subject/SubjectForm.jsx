import React, { useEffect, useState } from "react";
import dropdownService from "../../../../../services/api/dropdownService";

const SubjectForm = ({ editData, onSubmit, onClose, selectedBatch, selectedCourseType, selectedCourse, selectedModule }) => {
  const [batchCycles, setBatchCycles] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);

  const [formData, setFormData] = useState({
    batchCycleId: "",
    courseTypeId: "",
    courseId: "",
    moduleId: "",
    subjectName: "",
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
        setBatchCycles(batchRes.data || []);
        setCourseTypes(typeRes.data || []);
      } catch (err) {
        console.error("Error fetching dropdowns:", err);
      }
    };
    fetchDropdowns();
  }, []);

  // Load courses whenever batchCycleId or courseTypeId changes
  useEffect(() => {
    const loadCourses = async (batchId, typeId) => {
      if (!batchId || !typeId) return setCourses([]);
      try {
        const res = await dropdownService.getCourses(batchId, typeId);
        setCourses(res.data || []);
      } catch (err) {
        console.error(err);
        setCourses([]);
      }
    };

    loadCourses(formData.batchCycleId, formData.courseTypeId);
  }, [formData.batchCycleId, formData.courseTypeId]);

  // Load modules whenever courseId changes
  useEffect(() => {
    const loadModules = async (courseId) => {
      if (!courseId) return setModules([]);
      try {
        const res = await dropdownService.getModules(courseId);
        setModules(res.data || []);
      } catch (err) {
        console.error(err);
        setModules([]);
      }
    };

    loadModules(formData.courseId);
  }, [formData.courseId]);

  // Prefill form if editing
  useEffect(() => {
    if (editData) {
      setFormData({
        batchCycleId: editData.batchCycleId || "",
        courseTypeId: editData.courseTypeId || "",
        courseId: editData.courseId || "",
        moduleId: editData.moduleId || "",
        subjectName: editData.subjectName || "",
        status: editData.status || "ACTIVE",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Reset dependent dropdowns
    if (name === "batchCycleId" || name === "courseTypeId") setFormData((prev) => ({ ...prev, courseId: "", moduleId: "" }));
    if (name === "courseId") setFormData((prev) => ({ ...prev, moduleId: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Batch Cycle</label>
        <select name="batchCycleId" value={formData.batchCycleId} onChange={handleChange} required className="border p-2 rounded w-full">
          <option value="">Select Batch Cycle</option>
          {batchCycles.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Course Type</label>
        <select name="courseTypeId" value={formData.courseTypeId} onChange={handleChange} required className="border p-2 rounded w-full">
          <option value="">Select Course Type</option>
          {courseTypes.map((ct) => (
            <option key={ct.id} value={ct.id}>{ct.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Course</label>
        <select name="courseId" value={formData.courseId} onChange={handleChange} required className="border p-2 rounded w-full">
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Module</label>
        <select name="moduleId" value={formData.moduleId} onChange={handleChange} required className="border p-2 rounded w-full">
          <option value="">Select Module</option>
          {modules.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Subject Name</label>
        <input type="text" name="subjectName" value={formData.subjectName} onChange={handleChange} className="border p-2 rounded w-full" required />
      </div>

      <div>
        <label>Status</label>
        <select name="status" value={formData.status} onChange={handleChange} className="border p-2 rounded w-full" required>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-red-300 hover:bg-gray-400">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-teal-700">{editData ? "Update" : "Add"} Subject</button>
      </div>
    </form>
  );
};

export default SubjectForm;
