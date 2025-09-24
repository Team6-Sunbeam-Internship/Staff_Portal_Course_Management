// TopicModal.js
import React, { useState, useEffect } from "react";

export default function TopicModal({
  show,
  onHide,
  subjects,
  sections,
  topics,
  selectedTopics = [], // Already selected topics from parent
  onAddTopics
}) {
  const [subjectId, setSubjectId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [currentlySelectedTopics, setCurrentlySelectedTopics] = useState([]);

  // Reset selections when modal opens/closes
  useEffect(() => {
    if (show) {
      setSubjectId("");
      setSectionId("");
      setCurrentlySelectedTopics([]);
    }
  }, [show]);

  if (!show) return null;

  const selectedSubject = subjects.find(sub => String(sub.subjectId) === String(subjectId));
  const filteredSections = selectedSubject
    ? sections.filter(s => s.subjectName === selectedSubject.subjectName)
    : [];

  const selectedSection = sections.find(
    (s) => String(s.sectionId) === String(sectionId)
  );
  const filteredTopics = selectedSection
    ? topics.filter((t) => t.sectionName === selectedSection.sectionName)
    : [];

  console.log("Selected subjectId:", subjectId, typeof subjectId);
  console.log("Sections:", sections.map(s => [s.sectionId, s.subjectId, typeof s.subjectId]));
  console.log("Filtered sections:", filteredSections);
  console.log("Already selected topics:", selectedTopics);

  const toggleTopic = (topicId) => {
    setCurrentlySelectedTopics((prev) =>
      prev.includes(topicId) 
        ? prev.filter((t) => t !== topicId) 
        : [...prev, topicId]
    );
  };

  const isTopicAlreadySelected = (topicName) => {
    return selectedTopics.includes(topicName);
  };

  const handleAdd = () => {
    const topicNames = topics
      .filter((t) => currentlySelectedTopics.includes(t.topicId))
      .map((t) => t.topicName);
    
    console.log("Adding topics:", topicNames);
    onAddTopics(topicNames);
    
    // Reset modal state
    setSubjectId("");
    setSectionId("");
    setCurrentlySelectedTopics([]);
    onHide();
  };

  const handleCancel = () => {
    // Reset modal state
    setSubjectId("");
    setSectionId("");
    setCurrentlySelectedTopics([]);
    onHide();
  };

  console.log(sections);
  
  return (
    <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Select Topics</h5>
            <button type="button" className="btn-close" onClick={handleCancel}></button>
          </div>
          <div className="modal-body">
            {/* Show already selected topics */}
            {selectedTopics.length > 0 && (
              <div className="mb-3">
                <label className="form-label text-muted">Already Selected Topics:</label>
                <div>
                  {selectedTopics.map((topic, index) => (
                    <span key={index} className="badge bg-success me-1 mb-1">
                      {topic} ✓
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Subject</label>
              <select
                className="form-select"
                value={subjectId}
                onChange={(e) => {
                  setSubjectId(e.target.value);
                  setSectionId("");
                  setCurrentlySelectedTopics([]); // Clear selections when changing subject
                }}
              >
                <option value="">Choose...</option>
                {subjects.map((s) => (
                  <option key={s.subjectId} value={s.subjectId}>{s.subjectName}</option>
                ))}
              </select>
            </div>
            
            {subjectId && (
              <div className="mb-3">
                <label className="form-label">Section</label>
                <select
                  className="form-select"
                  value={sectionId}
                  onChange={(e) => {
                    setSectionId(e.target.value);
                    setCurrentlySelectedTopics([]); // Clear selections when changing section
                  }}
                >
                  <option value="">Choose...</option>
                  {filteredSections.map((s) => (
                    <option key={s.sectionId} value={s.sectionId}>{s.sectionName}</option>
                  ))}
                </select>
              </div>
            )}
            
            {sectionId && (
              <div>
                <label className="form-label">Topics</label>
                <div className="border rounded p-2" style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {filteredTopics.length === 0 ? (
                    <div className="text-muted">No topics available for this section.</div>
                  ) : (
                    filteredTopics.map((t) => {
                      const isAlreadySelected = isTopicAlreadySelected(t.topicName);
                      const isCurrentlySelected = currentlySelectedTopics.includes(t.topicId);
                      
                      return (
                        <div key={t.topicId} className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={isCurrentlySelected}
                            disabled={isAlreadySelected}
                            onChange={() => toggleTopic(t.topicId)}
                          />
                          <label className={`form-check-label ${isAlreadySelected ? 'text-muted' : ''}`}>
                            {t.topicName}
                            {isAlreadySelected && (
                              <span className="badge bg-success ms-2">Already Selected</span>
                            )}
                          </label>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
            <button
              className="btn btn-primary"
              disabled={currentlySelectedTopics.length === 0}
              onClick={handleAdd}
            >
              Add Topics ({currentlySelectedTopics.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}