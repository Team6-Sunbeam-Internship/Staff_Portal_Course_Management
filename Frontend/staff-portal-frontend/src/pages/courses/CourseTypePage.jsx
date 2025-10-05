import React, { useEffect, useState } from "react";
import CourseTypeTable from "../../components/features/courses/components/CourseTypes/CourseTypeTable";
import AddCourseTypeForm from "../../components/features/courses/components/CourseTypes/AddCourseTypeForm";
import courseTypeService from "../../services/api/courseTypeService";
import premisesService from "../../services/api/premisesService";

const CourseTypePage = () => {
  const [courseTypes, setCourseTypes] = useState([]);
  const [premises, setPremises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  // Fetch all course types from BE
  const fetchCourseTypes = async () => {
    setLoading(true);
    try {
      const res = await courseTypeService.getAll();
      setCourseTypes(res.data.result || []);
    } catch (err) {
      console.error("Error fetching course types:", err);
      setError("Failed to load course types");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all premises from BE
  const fetchPremises = async () => {
    try {
      const res = await premisesService.getAll();
      setPremises(res.data || []);
    } catch (err) {
      console.error("Error fetching premises:", err);
      setPremises([]);
    }
  };

  // Load course types on mount
  useEffect(() => {
    fetchCourseTypes();
  }, []);

  // Open form for adding new course type
  const handleAdd = async () => {
    await fetchPremises();
    setEditData(null);
    setShowForm(true);
  };

  // Open form for editing
  const handleEdit = async (courseType) => {
    await fetchPremises();
    setEditData(courseType);
    setShowForm(true);
  };

  // Add new course type
  const handleAddCourseType = async (newCourseType) => {
    await fetchCourseTypes(); // refresh table
    setShowForm(false);
  };

  // Update existing course type
  const handleUpdateCourseType = async (updatedCourseType) => {
    await fetchCourseTypes(); // refresh table
    setShowForm(false);
    setEditData(null);
  };

  // Delete course type
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course type?")) return;
    try {
      await courseTypeService.remove(id);
      await fetchCourseTypes(); // refresh table after deletion
    } catch (err) {
      console.error("Error deleting course type:", err);
      alert("Failed to delete course type. It may already be removed.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700 mb-4 ">Course Types </h1>
        <div className="w-full flex justify-end max-w-5xl">
            <button
            onClick={handleAdd}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            >
            + Add Course Type
            </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <CourseTypeTable
          courseTypes={courseTypes}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {showForm && (
        <AddCourseTypeForm
          onClose={() => {
            setShowForm(false);
            setEditData(null);
          }}
          onAdd={handleAddCourseType}
          onUpdate={handleUpdateCourseType}
          editData={editData}
          premises={premises} // pass premises list
        />
      )}
    </div>
  );
};

export default CourseTypePage;
