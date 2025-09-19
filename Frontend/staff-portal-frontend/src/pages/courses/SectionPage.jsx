import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import sectionService from "../../services/api/sectionService";
import subjectService from "../../services/api/subjectService";
import SectionForm from "../../components/features/courses/components/Section/SectionForm";
import SectionTable from "../../components/features/courses/components/Section/SectionTable";

const SectionPage = () => {
  const { subjectId: paramId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const search = location.search; // preserve query params (filters)
  const filters = Object.fromEntries(new URLSearchParams(search));

  // Get subjectId from params or state (when coming back from TopicPage)
  const subjectId = paramId || location.state?.subjectId;

  const [sections, setSections] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  // Fetch sections with filters
  const fetchSections = async () => {
    if (!subjectId) return;
    setLoading(true);
    try {
      // Pass filters to backend if needed
      const res = await sectionService.getBySubject(subjectId, filters);
      setSections(res.data.result || []);
    } catch (err) {
      console.error("Error fetching sections:", err);
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subject name
  const fetchSubjectName = async () => {
    if (!subjectId) return;
    try {
      const res = await subjectService.getById(subjectId);
      setSubjectName(res.data?.result?.subjectName || "Subject");
    } catch (err) {
      console.error("Error fetching subject name:", err);
      setSubjectName("Subject");
    }
  };

  useEffect(() => {
    fetchSections();
    fetchSubjectName();
  }, [subjectId, search]); // re-fetch if subjectId or filters change

  // Handlers
  const handleAdd = () => { setEditData(null); setShowForm(true); };
  const handleEdit = (section) => { setEditData(section); setShowForm(true); };
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this section?")) return;
    try { await sectionService.remove(id); fetchSections(); } 
    catch (err) { console.error(err); alert("Failed to delete section."); }
  };
  const handleFormSubmit = async (formData) => {
    try {
      if (editData) await sectionService.update(editData.sectionId, formData);
      else await sectionService.add({ ...formData, subjectId });
      fetchSections();
      setShowForm(false);
      setEditData(null);
    } catch (err) { console.error(err); alert("Failed to save section."); }
  };

  // Back to subjects
  const handleBack = () => navigate(`/subjects${search}`);

  // Navigate to TopicPage
  const handleViewTopics = (sectionId) => {
    navigate(`/topics/${sectionId}${search}`, { state: { subjectId } });
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <span className="cursor-pointer hover:underline" onClick={handleBack}>
          ← Back to Subjects
        </span>{" "}
        &gt; <span className="font-semibold">{subjectName}</span> &gt; Sections
      </div>

      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700 mb-4 ">Sections</h1>
        <div className="w-full flex justify-end max-w-5xl">
            <button
            onClick={handleAdd}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            >
            + Add Section
            </button>
        </div>
      </div>

      {/* Section Table */}
      <div className="flex justify-center">
        <div className="w-full max-w-5xl">
          {loading ? (
            <p className="text-gray-500 text-center py-6">Loading sections...</p>
          ) : sections.length > 0 ? (
            <SectionTable
              sections={sections}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewTopics={handleViewTopics}
            />
          ) : (
            <p className="text-gray-500 text-center py-6">
              No sections found. Please add a new section.
            </p>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm z-50">
          <div className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
            <button onClick={() => { setShowForm(false); setEditData(null); }}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl">✕</button>
            <SectionForm editData={editData} onSubmit={handleFormSubmit} onClose={() => { setShowForm(false); setEditData(null); }} subjectId={subjectId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionPage;
