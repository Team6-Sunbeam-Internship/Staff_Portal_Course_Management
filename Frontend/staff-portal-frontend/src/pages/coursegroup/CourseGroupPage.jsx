import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import CourseGroupService from "../../services/api/courseGroupService";
import CourseGroupForm from "../../components/features/coursegroup/CourseGroupForm";
import CourseGroupTable from "../../components/features/coursegroup/CourseGroupTable";

const CourseGroupPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [courseGroups, setCourseGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await CourseGroupService.getAll();
      setCourseGroups(res.data);
    } catch (err) {
      toast.error("Failed to load course groups");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleAdd = () => {
    setEditData(null);
    setShowForm(true);
  };

  const handleEdit = (cg) => {
    setEditData(cg);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      try {
        await CourseGroupService.remove(id);
        toast.success("Deleted successfully");
        fetchGroups();
      } catch (err) {
        toast.error("Failed to delete");
      }
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editData) {
        await CourseGroupService.update(editData.groupId, data);
        toast.success("Updated successfully");
      } else {
        await CourseGroupService.create(data);
        toast.success("Created successfully");
      }
      setShowForm(false);
      setEditData(null);
      fetchGroups();
    } catch (err) {
      toast.error("Failed to save");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditData(null);
  };

  return (
    <div className="flex">
      <div className="w-64 bg-gray-100 border-r min-h-screen"></div>
      <main className="flex-1 p-6 relative">
        <Toaster position="top-right" />
        <h2 className="text-2xl font-bold text-center mb-6">
          Manage Course Groups
        </h2>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <CourseGroupTable
            data={courseGroups}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
              <CourseGroupForm
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
                defaultValues={editData}
              />
            </div>
          </div>
        )}

        <div className="fixed bottom-5 right-5 z-10">
          <button
            onClick={handleAdd}
            className="bg-green-600 text-white px-6 py-3 rounded shadow hover:bg-green-700"
          >
            + Add Course Group
          </button>
        </div>
      </main>
    </div>
  );
};

export default CourseGroupPage;
