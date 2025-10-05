import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import topicService from "../../services/api/topicService";
import TopicForm from "../../components/features/courses/components/Topic/TopicForm";
import TopicTable from "../../components/features/courses/components/Topic/TopicTable";

const TopicPage = () => {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const search = location.search; // preserve filters
  const subjectId = location.state?.subjectId; // passed from SectionPage

  const [topics, setTopics] = useState([]);
  const [sectionName, setSectionName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchTopics = async () => {
    if (!sectionId) return;
    setLoading(true);
    try {
      const res = await topicService.getBySection(sectionId);
      setTopics(res.data.result || []);
      if (res.data.result?.length) {
        setSectionName(res.data.result[0].sectionName); // get section name from API
      }
    } catch (err) {
      console.error(err);
      setTopics([]);
      setSectionName("Section");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchTopics(); }, [sectionId]);

  const handleAdd = () => setShowForm(true);
  const handleEdit = (topic) => { setEditData(topic); setShowForm(true); };
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this topic?")) return;
    try { await topicService.remove(id); fetchTopics(); } 
    catch (err) { console.error(err); alert("Failed to delete topic."); }
  };
  const handleFormSubmit = async (formData) => {
    try {
      if (editData) await topicService.update(editData.topicId, formData);
      else await topicService.add({ ...formData, sectionId });
      fetchTopics();
      setShowForm(false);
      setEditData(null);
    } catch (err) { console.error(err); alert("Failed to save topic."); }
  };

  // Back to SectionPage with filters preserved
  const handleBack = () => {
    if (!subjectId) return navigate(-1); // fallback
    navigate(`/sections/${subjectId}${search}`, { state: { subjectId } });
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <span className="cursor-pointer hover:underline" onClick={handleBack}>
          ← Back to Sections
        </span>{" "}
        &gt; <span className="font-semibold">{sectionName}</span> &gt; Topics
      </div>

      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700 mb-4 ">Topics</h1>
        <div className="w-full flex justify-end max-w-5xl">
            <button
            onClick={handleAdd}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            >
            + Add Topic
            </button>
        </div>
      </div>

      {/* Topics Table */}
      <div className="flex justify-center">
        <div className="w-full max-w-5xl">
          {loading ? (
            <p className="text-gray-500 text-center py-6">Loading topics...</p>
          ) : topics.length > 0 ? (
            <TopicTable topics={topics} onEdit={handleEdit} onDelete={handleDelete} />
          ) : (
            <p className="text-gray-500 text-center py-6">No topics found. Please add a new topic.</p>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm z-50">
          <div className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
            <button onClick={() => { setShowForm(false); setEditData(null); }} className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl">✕</button>
            <TopicForm editData={editData} onSubmit={handleFormSubmit} onClose={() => { setShowForm(false); setEditData(null); }} sectionId={sectionId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicPage;
