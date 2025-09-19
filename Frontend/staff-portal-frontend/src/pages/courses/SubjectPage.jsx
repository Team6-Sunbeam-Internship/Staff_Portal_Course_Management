import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import dropdownService from "../../services/api/dropdownService";
import subjectService from "../../services/api/subjectService";
import SubjectForm from "../../components/features/courses/components/Subject/SubjectForm";
import SubjectTable from "../../components/features/courses/components/Subject/SubjectTable";

const SubjectPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [subjects, setSubjects] = useState([]);
  const [batchCycles, setBatchCycles] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);

  const [selectedBatch, setSelectedBatch] = useState(searchParams.get("batch") || "");
  const [selectedCourseType, setSelectedCourseType] = useState(searchParams.get("courseType") || "");
  const [selectedCourse, setSelectedCourse] = useState(searchParams.get("course") || "");
  const [selectedModule, setSelectedModule] = useState(searchParams.get("module") || "");

  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  // Update query params when filters change
  useEffect(() => {
    const params = {};
    if (selectedBatch) params.batch = selectedBatch;
    if (selectedCourseType) params.courseType = selectedCourseType;
    if (selectedCourse) params.course = selectedCourse;
    if (selectedModule) params.module = selectedModule;
    setSearchParams(params);
  }, [selectedBatch, selectedCourseType, selectedCourse, selectedModule, setSearchParams]);

  // Fetch batch cycles + course types
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

  // Fetch courses
  useEffect(() => {
    if (selectedBatch && selectedCourseType) {
      dropdownService
        .getCourses(selectedBatch, selectedCourseType)
        .then((res) => setCourses(res.data || []))
        .catch((err) => console.error("Error fetching courses:", err));
    } else {
      setCourses([]);
      setSelectedCourse("");
    }
    setModules([]);
    setSelectedModule("");
  }, [selectedBatch, selectedCourseType]);

  // Fetch modules
  useEffect(() => {
    if (selectedCourse) {
      dropdownService
        .getModules(selectedCourse)
        .then((res) => setModules(res.data || []))
        .catch((err) => console.error("Error fetching modules:", err));
    } else {
      setModules([]);
      setSelectedModule("");
    }
  }, [selectedCourse]);

  // Fetch subjects
  const fetchSubjects = async () => {
    if (!selectedBatch || !selectedCourseType || !selectedCourse || !selectedModule) {
      setSubjects([]);
      return;
    }
    setLoading(true);
    try {
      const res = await subjectService.filter(
        selectedBatch,
        selectedCourseType,
        selectedCourse,
        selectedModule
      );
      setSubjects(res.data.result || []);
    } catch (err) {
      console.error("Error fetching subjects:", err);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [selectedBatch, selectedCourseType, selectedCourse, selectedModule]);

  // Handlers
  const handleAdd = () => {
    setEditData(null);
    setShowForm(true);
  };

  const handleEdit = (subject) => {
    setEditData(subject);
    setSelectedBatch(subject.batchCycleId || "");
    setSelectedCourseType(subject.courseTypeId || "");
    setSelectedCourse(subject.courseId || "");
    setSelectedModule(subject.moduleId || "");
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    try {
      await subjectService.remove(id);
      fetchSubjects();
    } catch (err) {
      console.error("Error deleting subject:", err);
      alert("Failed to delete subject. It may already be removed.");
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editData) {
        await subjectService.update(editData.subjectId, formData);
      } else {
        await subjectService.add(formData);
      }
      fetchSubjects();
      setShowForm(false);
      setEditData(null);
    } catch (err) {
      console.error("Error saving subject:", err);
      alert("Failed to save subject");
    }
  };

  // Navigate to SectionPage with filters
  const handleViewSections = (subject) => {
    const query = searchParams.toString();
    navigate(`/sections/${subject.subjectId}?${query}`);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
       <div className="flex flex-col items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700 mb-4 ">Subjects</h1>
        <div className="w-full flex justify-end max-w-5xl">
            <button
            onClick={handleAdd}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            >
            + Add Subject
            </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex justify-center mb-6 gap-4 flex-wrap">
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(Number(e.target.value) || "")}
          className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
        >
          <option value="">Select Batch Cycle</option>
          {batchCycles.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        <select
          value={selectedCourseType}
          onChange={(e) => setSelectedCourseType(Number(e.target.value) || "")}
          className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
        >
          <option value="">Select Course Type</option>
          {courseTypes.map((ct) => (
            <option key={ct.id} value={ct.id}>{ct.name}</option>
          ))}
        </select>

        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(Number(e.target.value) || "")}
          className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={selectedModule}
          onChange={(e) => setSelectedModule(Number(e.target.value) || "")}
          className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
        >
          <option value="">Select Module</option>
          {modules.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="flex justify-center">
        <div className="w-full max-w-5xl">
          {loading ? (
            <p className="text-gray-500 text-center py-6">Loading subjects...</p>
          ) : subjects.length > 0 ? (
            <SubjectTable
              subjects={subjects}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewSections={handleViewSections} // new prop
            />
          ) : (
            <p className="text-gray-500 text-center py-6">
              No subjects found. Please add a new subject.
            </p>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm z-50">
          <div className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100">
            <button
              onClick={() => { setShowForm(false); setEditData(null); }}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
            >
              ✕
            </button>

            <SubjectForm
              editData={editData}
              onSubmit={handleFormSubmit}
              onClose={() => { setShowForm(false); setEditData(null); }}
              selectedBatch={selectedBatch}
              selectedCourseType={selectedCourseType}
              selectedCourse={selectedCourse}
              selectedModule={selectedModule}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectPage;
