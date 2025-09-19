import React, { useEffect, useState } from "react";
import CourseForm from "../../components/features/courses/components/CourseList/CourseForm";
import CourseTable from "../../components/features/courses/components/CourseList/CourseTable";
import courseService from "../../services/api/courseService";
import dropdownService from "../../services/api/dropdownService";

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [batchCycles, setBatchCycles] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedCourseType, setSelectedCourseType] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  // Fetch dropdowns
  const fetchDropdowns = async () => {
    try {
      const batchRes = await dropdownService.getBatchCycles();
      setBatchCycles(batchRes.data || []);
      const courseTypeRes = await dropdownService.getCourseTypes();
      setCourseTypes(courseTypeRes.data || []);
    } catch (err) {
      console.error("Error fetching dropdowns:", err);
    }
  };

  // Fetch courses (only when both filters selected)
  const fetchCourses = async (batchId, courseTypeId) => {
    if (!batchId || !courseTypeId) {
      setCourses([]); // reset table
      return;
    }

    setLoading(true);
    try {
      const res = await courseService.filterByIds(batchId, courseTypeId);
      setCourses(res.data.result || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdowns();
  }, []);

  // When dropdown changes
  const handleFilterChange = (batchId, courseTypeId) => {
    setSelectedBatch(batchId);
    setSelectedCourseType(courseTypeId);
    fetchCourses(batchId, courseTypeId);
  };

  const handleAdd = () => {
    setEditData(null);
    setShowForm(true);
  };

  const handleEdit = (course) => {
    setEditData(course);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await courseService.remove(id);
      fetchCourses(selectedBatch, selectedCourseType);
    } catch (err) {
      console.error("Error deleting course:", err);
      alert("Failed to delete course. It may already be removed.");
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editData) {
        await courseService.update(editData.courseId, formData);
      } else {
        await courseService.add(formData);
      }
      fetchCourses(selectedBatch, selectedCourseType);
      setShowForm(false);
      setEditData(null);
    } catch (err) {
      console.error("Error saving course:", err);
      alert("Failed to save course");
    }
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700 mb-4 ">Courses</h1>
        <div className="w-full flex justify-end max-w-5xl">
            <button
            onClick={handleAdd}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            >
            + Add Course
            </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex justify-center flex gap-4 mb-6">
        <select
          value={selectedBatch}
          onChange={(e) =>
            handleFilterChange(Number(e.target.value) || "", selectedCourseType)
          }
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
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
          onChange={(e) =>
            handleFilterChange(selectedBatch, Number(e.target.value) || "")
          }
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
        >
          <option value="">Select Course Type</option>
          {courseTypes.map((ct) => (
            <option key={ct.id} value={ct.id}>
              {ct.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-gray-500 text-center">Loading courses...</p>
      ) : courses.length > 0 ? (
        <div className="flex justify-center">
          <div className="w-full max-w-5xl">
            <CourseTable
              courses={courses}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      ) : (
        selectedBatch &&
        selectedCourseType && (
          <p className="text-gray-500 text-center">
            No courses found for selected filters.
          </p>
        )
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-50 transition-opacity animate-fadeIn">
          <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg">
            <CourseForm
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

export default CoursePage;
