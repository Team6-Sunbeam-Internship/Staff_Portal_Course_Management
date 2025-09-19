import React, { useState, useEffect } from "react";
import dropdownService from "../../services/api/dropdownService";
import moduleService from "../../services/api/moduleService";
import ModuleForm from "../../components/features/courses/components/Module/ModuleForm";
import ModuleTable from "../../components/features/courses/components/Module/ModuleTable";

const ModulePage = () => {
  const [modules, setModules] = useState([]);
  const [batchCycles, setBatchCycles] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [courses, setCourses] = useState([]);

  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedCourseType, setSelectedCourseType] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

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

  // Fetch courses whenever batch + type changes
  useEffect(() => {
    const loadCourses = async () => {
      if (!selectedBatch || !selectedCourseType) {
        setCourses([]);
        setSelectedCourse("");
        return;
      }
      try {
        const res = await dropdownService.getCourses(
          selectedBatch,
          selectedCourseType
        );
        setCourses(res?.data || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setCourses([]);
      }
    };
    loadCourses();
  }, [selectedBatch, selectedCourseType]);

  // Fetch modules filtered by batch, type, course
  const fetchModules = async () => {
    if (!selectedBatch || !selectedCourseType || !selectedCourse) {
      setModules([]);
      return;
    }
    setLoading(true);
    try {
      const res = await moduleService.filter(
        selectedBatch,
        selectedCourseType,
        selectedCourse
      );
      let data = res.data.result || [];
      if (!Array.isArray(data)) data = [data];
      setModules(data);
    } catch (err) {
      console.error("Error fetching modules:", err);
      setModules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [selectedBatch, selectedCourseType, selectedCourse]);

  const handleAdd = () => {
    setEditData(null);
    setShowForm(true);
  };

  const handleEdit = (module) => {
    setEditData({
      moduleId: module.moduleId,
      moduleName: module.moduleName,
      batchCycleId: module.batchCycleId || module.batchCycle?.id,
      courseTypeId: module.courseTypeId || module.courseType?.id,
      courseId: module.courseId || module.course?.id,
      theoryHours: module.theoryHours,
      practicalHours: module.practicalHours,
      status: module.status,
    });

    setSelectedBatch(module.batchCycleId || module.batchCycle?.id || "");
    setSelectedCourseType(module.courseTypeId || module.courseType?.id || "");
    setSelectedCourse(module.courseId || module.course?.id || "");

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this module?")) return;
    try {
      await moduleService.remove(id);
      fetchModules();
    } catch (err) {
      console.error("Error deleting module:", err);
      alert("Failed to delete module.");
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editData) {
        await moduleService.update(editData.moduleId, formData);
      } else {
        await moduleService.add(formData);
      }
      fetchModules();
      setShowForm(false);
      setEditData(null);
    } catch (err) {
      console.error("Error saving module:", err);
      alert("Failed to save module.");
    }
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Headers */}
       <div className="flex flex-col items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700 mb-4 ">Modules</h1>
        <div className="w-full flex justify-end max-w-5xl">
            <button
            onClick={handleAdd}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            >
            + Add Module
            </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex justify-center mb-6">
        <div className="flex gap-4 bg-gray-50 p-4 rounded-lg shadow-md">
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(Number(e.target.value) || "")}
            className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
          >
            <option value="">Select Batch Cycle</option>
            {batchCycles.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            value={selectedCourseType}
            onChange={(e) => setSelectedCourseType(Number(e.target.value) || "")}
            className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
          >
            <option value="">Select Course Type</option>
            {courseTypes.map((ct) => (
              <option key={ct.id} value={ct.id}>
                {ct.name}
              </option>
            ))}
          </select>

          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(Number(e.target.value) || "")}
            className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
          >
            <option value="">Select Course</option>
            {Array.from(
              courses.reduce((map, c) => {
                if (!map.has(c.name)) map.set(c.name, c);
                return map;
              }, new Map()).values()
            ).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Modules Table */}
      {loading ? (
        <p className="text-gray-500 text-center">Loading modules...</p>
      ) : modules.length > 0 ? (
        <ModuleTable
          modules={modules}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        selectedBatch &&
        selectedCourseType &&
        selectedCourse && (
          <p className="text-gray-500 text-center">
            No modules found for selected filters.
          </p>
        )
      )}

      {/* Add / Edit Module Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center 
                  bg-white/20 backdrop-blur-sm z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
            <ModuleForm
              editData={editData}
              onSubmit={handleFormSubmit}
              onClose={() => {
                setShowForm(false);
                setEditData(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ModulePage;
