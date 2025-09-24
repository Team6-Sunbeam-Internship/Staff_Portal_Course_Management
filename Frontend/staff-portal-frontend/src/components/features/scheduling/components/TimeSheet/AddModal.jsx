import React, { useState, useEffect } from "react";
import TopicModal from "./TopicModal";

export default function AddModal({
  show,
  onHide,
  onSave,
  editRow,
  courses,
  modules,
  staff,
  subjects,
  sections,
  topics,
  batchCycles,
  selectedBatchCycleName, 
    selectedCourseName,
    selectedModuleName
}) {
  const [formData, setFormData] = useState({
    batchCycleName: selectedBatchCycleName || "",
    courseName: selectedCourseName || "",
    moduleName: selectedModuleName ||  "",
    staffName: "",
    startTime: "",
    endTime: "",
    extraTopic: "",
    assignment: "",
    status: "",
    logDate: "",
    durationHours: "",
    topicNames: [],
  });

  const [showTopicModal, setShowTopicModal] = useState(false);

  // Helper function to format date for input[type="date"]
  const formatDateForInput = (dateValue) => {
    if (!dateValue) return "";
    
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "";
    
    // Format as YYYY-MM-DD for HTML date input
    return date.toISOString().split('T')[0];
  };

useEffect(() => {
  if (editRow) {
    setFormData({
      ...editRow,
      logDate: formatDateForInput(editRow.logDate),
      topicNames: editRow.topicNames
        ? editRow.topicNames
        : editRow.timeSheetTopics
        ? editRow.timeSheetTopics.map((t) => t.topicName)
        : [],
      timeSheetTopics: editRow.timeSheetTopics
        ? editRow.timeSheetTopics
        : editRow.topicNames
        ? editRow.topicNames.map((t) => ({ topicName: t }))
        : []
    });
  } else {
    // reset for Add mode
    setFormData({
      batchCycleName: selectedBatchCycleName || "",
      courseName: selectedCourseName || "",
      moduleName: selectedModuleName || "",
      staffName: "",
      startTime: "",
      endTime: "",
      extraTopic: "",
      assignment: "",
      status: "",
      logDate: "",
      durationHours: "",
      topicNames: [],
      timeSheetTopics: []
    });
  }
}, [editRow, selectedBatchCycleName, selectedCourseName, selectedModuleName]);



  if (!show) return null;

  const availableCourses = courses.filter(
    (c) => c.cycleName === formData.batchCycleName
  );

  const availableModules = modules.filter(
    (m) => m.courseName === formData.courseName && m.batchCycleName === formData.batchCycleName
  );

  const handleInput = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value }));
  };

  // Enhanced date handler
  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    
    handleInput("logDate", dateValue);
  };

  // Handle manual duration input for topic allocation hours
  const handleDurationChange = (e) => {
    const value = e.target.value;
    
    
    // Allow empty string or valid positive integers
    if (value === "") {
      handleInput("durationHours", "");
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue >= 1) {
        handleInput("durationHours", numValue.toString());
      }
    }
  };

  // Remove a topic from the selected list
  const removeTopic = (topicToRemove) => {
    setFormData((prev) => ({
      ...prev,
      topicNames: prev.topicNames.filter(topic => topic !== topicToRemove)
    }));
  };

  // Add topics without duplicates
  const addTopics = (newTopics) => {
    setFormData((prev) => {
      const existingTopics = new Set(prev.topicNames);
      const uniqueNewTopics = newTopics.filter(topic => !existingTopics.has(topic));
      return {
        ...prev,
        topicNames: [...prev.topicNames, ...uniqueNewTopics]
      };
    });
  };

  const isFormValid = () => {
    const isValid = 
      formData.batchCycleName &&
      formData.courseName &&
      formData.moduleName &&
      formData.staffName &&
      formData.startTime &&
      formData.endTime &&
      formData.extraTopic &&
      formData.assignment &&
      formData.status &&
      formData.logDate &&
      formData.durationHours &&
      parseInt(formData.durationHours) >= 1 && // Ensure duration is at least 1 (integer)
      formData.topicNames.length > 0;

    console.log("Form validation check:", {
      batchCycleName: !!formData.batchCycleName,
      courseName: !!formData.courseName,
      moduleName: !!formData.moduleName,
      staffName: !!formData.staffName,
      startTime: !!formData.startTime,
      endTime: !!formData.endTime,
      extraTopic: !!formData.extraTopic,
      assignment: !!formData.assignment,
      status: !!formData.status,
      logDate: !!formData.logDate,
      durationHours: formData.durationHours,
      durationValid: parseInt(formData.durationHours) >= 1,
      topicCount: formData.topicNames.length,
      overallValid: isValid
    });

    return isValid;
  };

  const handleSave = () => {
    console.log("Raw form data before processing:", formData);
    
    if (!isFormValid()) {
      console.log("Form validation failed:", formData);
      alert("Please fill all required fields correctly");
      return;
    }

    // Ensure durationHours is a valid integer >= 1
    const durationValue = parseInt(formData.durationHours);
    console.log("Duration value parsed:", durationValue, "from:", formData.durationHours);
    
    if (isNaN(durationValue) || durationValue < 1) {
      console.log("Invalid duration:", formData.durationHours);
      alert("Duration must be at least 1 hour (whole number)");
      return;
    }

    // Validate critical fields
    if (!formData.courseName || !formData.moduleName) {
      console.error("Missing course or module:", {
        courseName: formData.courseName,
        moduleName: formData.moduleName
      });
      alert("Please select both Course and Module");
      return;
    }

    if (!formData.topicNames || formData.topicNames.length === 0) {
      console.error("No topics selected");
      alert("Please select at least one topic");
      return;
    }

    // Create the data structure expected by backend
    const timeSheetData = {
      startTime: formData.startTime,
      endTime: formData.endTime,
      extraTopic: formData.extraTopic || "",
      assignment: formData.assignment || "",
      logDate: formData.logDate,
      staffName: formData.staffName,
      durationHours: durationValue,
      status: formData.status,
      batchCycleName: formData.batchCycleName,
      courseModule: {
        courseName: formData.courseName,
        moduleName: formData.moduleName
      },
      timeSheetTopics: formData.topicNames.map(topicName => ({
        topicName: topicName
      })),
      // Also include flat structure for backward compatibility
      courseName: formData.courseName,
      moduleName: formData.moduleName,
      topicNames: formData.topicNames
    };

    console.log("Structured data for backend:", JSON.stringify(timeSheetData, null, 2));
    console.log("CourseModule object:", timeSheetData.courseModule);
    console.log("TimeSheet topics:", timeSheetData.timeSheetTopics);

    // For the parent component, we might need to keep the original structure
    // Let's pass both the original form data and the structured data
    const dataToSave = editRow 
      ? { ...timeSheetData, id: editRow.id }
      : { ...timeSheetData, id: Date.now() };

    console.log("Final data being passed to onSave:", dataToSave);

    onSave(dataToSave, !!editRow);
    onHide();
  };

  console.log("BatchCycles received in modal:", batchCycles);
  console.log("staff received in modal:", staff);
  console.log("Current logDate value:", formData.logDate); // Debug log
  console.log("Current durationHours value:", formData.durationHours, "type:", typeof formData.durationHours); // Debug duration

  return (
    <>
      <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {editRow ? "Edit Timesheet Entry" : "Add Timesheet Entry"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onHide}
              ></button>
            </div>

            <div className="modal-body">
              <form className="row g-3">
                {/* Batch Cycle */}
                <div className="col-md-6">
                  <label className="form-label">Batch Cycle</label>
                   <input
                    type="text"
                    className="form-control"
                    value={formData.batchCycleName}
                    readOnly
                  />
                </div>

                {/* Course */}
                <div className="col-md-6">
                  <label className="form-label">Course</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.courseName}
                    readOnly
                  />
                </div>

                {/* Module */}
                <div className="col-md-6">
                  <label className="form-label">Module</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.moduleName}
                    readOnly
                  />
                </div>

                {/* Staff */}
                <div className="col-md-6">
                  <label className="form-label">Staff</label>
                  <select
                    className="form-select"
                    value={formData.staffName}
                    onChange={(e) => handleInput("staffName", e.target.value)}
                    disabled={!formData.courseName}
                  >
                    <option value="">Choose...</option>
                    {staff.map((s) => (
                      <option
                        key={s.StaffId}
                        value={`${s.firstName} ${s.lastName}`}
                      >
                        {s.firstName} {s.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date - ENHANCED */}
                <div className="col-md-6">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.logDate}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split("T")[0]} // prevent past dates
                    max="9999-12-31" // Prevent invalid dates
                    style={{ cursor: 'pointer' }} // Visual feedback
                  />
                </div>

                {/* Start/End Time */}
                <div className="col-md-6">
                  <label className="form-label">Start Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={formData.startTime}
                    onChange={(e) => handleInput("startTime", e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">End Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={formData.endTime}
                    onChange={(e) => handleInput("endTime", e.target.value)}
                  />
                </div>

                {/* Duration - Hours allocated for topics */}
                <div className="col-md-6">
                  <label className="form-label">Duration (hrs allocated for topics) *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.durationHours}
                    onChange={handleDurationChange}
                    min="1"
                    step="1"
                    placeholder="Enter hours (minimum 1)"
                    required
                  />
                  {formData.durationHours && parseInt(formData.durationHours) < 1 && (
                    <div className="text-danger small mt-1">
                      Duration must be at least 1 hour
                    </div>
                  )}
                  {!formData.durationHours && (
                    <div className="text-muted small mt-1">
                      This field is required
                    </div>
                  )}
                </div>

                {/* Assignment */}
                <div className="col-md-6">
                  <label className="form-label">Assignment</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.assignment}
                    onChange={(e) => handleInput("assignment", e.target.value)}
                  />
                </div>

                {/* Status */}
                <div className="col-md-6">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => handleInput("status", e.target.value)}
                  >
                    <option value="">Choose...</option>
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="APPROVED">Approved</option>
                  </select>
                </div>

                {/* Extra Topic */}
                <div className="col-md-6">
                  <label className="form-label">Extra Topic</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.extraTopic}
                    onChange={(e) => handleInput("extraTopic", e.target.value)}
                  />
                </div>
              </form>

              {/* Topics */}
              {formData.moduleName && (
                <div className="mt-3">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => setShowTopicModal(true)}
                  >
                    Select Topics
                  </button>
                  <div className="mt-2">
                    {formData.topicNames.map((t, i) => (
                      <span key={i} className="badge bg-info text-dark me-1 d-inline-flex align-items-center">
                        {t}
                        <button
                          type="button"
                          className="btn-close btn-close-white ms-1"
                          style={{ fontSize: '0.6em' }}
                          onClick={() => removeTopic(t)}
                          aria-label="Remove topic"
                        ></button>
                      </span>
                    ))}
                  </div>
                  {formData.topicNames.length === 0 && (
                    <div className="text-muted small mt-1">
                      No topics selected. Click "Select Topics" to add some.
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onHide}>
                Cancel
              </button>
              <button
                className="btn btn-success"
                disabled={!isFormValid()}
                onClick={handleSave}
              >
                Save Entry
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Topic Modal */}
      <TopicModal
        show={showTopicModal}
        onHide={() => setShowTopicModal(false)}
        subjects={subjects.filter((s) => s.moduleName === formData.moduleName)}
        sections={sections}
        topics={topics}
        selectedTopics={formData.topicNames} // Pass already selected topics
        onAddTopics={addTopics} // Use the new addTopics function
      />
    </>
  );
}