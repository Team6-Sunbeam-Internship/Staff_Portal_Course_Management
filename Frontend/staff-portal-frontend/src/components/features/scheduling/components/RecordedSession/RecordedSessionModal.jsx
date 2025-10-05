import React, { useState, useEffect } from "react";

const RecordedSessionModal1 = ({
  show,
  onHide,
  onSave,
  editRow,
  staffList,
  selectedBatchCycleName,
  selectedCourseName
}) => {
  const [formData, setFormData] = useState({
    sessionDate: "",
    channel: "",
    title: "",
    description: "",
    url: "",
    courseName: selectedCourseName || "",
    batchCycleName: selectedBatchCycleName || "",
    staffName: ""
  });

  // Removed unused filteredCourses state

  // Popular channels for dropdown
  const channelOptions = [
    "Zoom",
    "Microsoft Teams",
    "Google Meet",
    "Webex",
    "GoToMeeting",
    "YouTube Live",
    "Facebook Live",
    "Other"
  ];

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (dateValue) => {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (editRow) {
      setFormData({
        sessionDate: formatDateForInput(editRow.sessionDate || editRow.date),
        channel: editRow.channel || "",
        title: editRow.title || "",
        description: editRow.description || "",
        url: editRow.url || "",
        courseName: editRow.courseName || "",
        batchCycleName: editRow.batchCycleName || "",
        staffName: editRow.staffName || ""
      });
    } else {
      // Reset for Add mode
      setFormData({
        sessionDate: "",
        channel: "",
        title: "",
        description: "",
        url: "",
        courseName: selectedCourseName || "",
        batchCycleName: selectedBatchCycleName || "",
        staffName: ""
      });
    }
  }, [editRow, selectedBatchCycleName, selectedCourseName]);

  // Removed useEffect for filteredCourses as it was unused

  if (!show) return null;

  const handleInput = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return (
      formData.sessionDate &&
      formData.channel &&
      formData.title &&
      formData.url &&
      formData.courseName &&
      formData.batchCycleName &&
      formData.staffName
    );
  };

  const handleSave = () => {
    if (!isFormValid()) {
      alert("Please fill all required fields");
      return;
    }

    // Validate URL format
    try {
      new URL(formData.url);
    } catch {
      alert("Please enter a valid URL");
      return;
    }

    // Send data in the exact format you specified
    const sessionData = {
      sessionDate: formData.sessionDate,
      channel: formData.channel,
      title: formData.title,
      description: formData.description,
      url: formData.url,
      courseName: formData.courseName,
      batchCycleName: formData.batchCycleName,
      staffName: formData.staffName
    };

    onSave(sessionData);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <>
      <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {editRow ? "Edit Recorded Session" : "Add New Recorded Session"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onHide}
              ></button>
            </div>

            <div className="modal-body">
              <form className="row g-3">
                {/* Date */}
                <div className="col-md-6">
                  <label className="form-label">Session Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.sessionDate}
                    onChange={(e) => handleInput("sessionDate", e.target.value)}
                    max={getTodayDate()}
                    required
                  />
                </div>

                {/* Channel */}
                <div className="col-md-6">
                  <label className="form-label">Channel *</label>
                  <input
                    list="channelOptions"
                    className="form-control"
                    value={formData.channel}
                    onChange={(e) => handleInput("channel", e.target.value)}
                    required
                  />

                  <datalist id="channelOptions">
                    {channelOptions.map((channel) => (
                      <option key={channel} value={channel} />
                    ))}
                  </datalist>
                </div>

                {/* Title */}
                <div className="col-6">
                  <label className="form-label">Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.title}
                    onChange={(e) => handleInput("title", e.target.value)}
                    placeholder="Enter session title"
                    maxLength={200}
                    required
                  />
                </div>

                {/* Description */}
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={formData.description}
                    onChange={(e) => handleInput("description", e.target.value)}
                    placeholder="Enter session description"
                    maxLength={500}
                    required
                  ></textarea>
                  <div className="form-text">
                    {formData.description.length}/500 characters
                  </div>
                </div>

                {/* URL */}
                <div className="col-12">
                  <label className="form-label">Recording URL *</label>
                  <input
                    type="url"
                    className="form-control"
                    value={formData.url}
                    onChange={(e) => handleInput("url", e.target.value)}
                    placeholder="https://example.com/recording-link"
                    required
                  />
                  <div className="form-text">
                    Enter the full URL where the recording can be accessed
                  </div>
                </div>

                {/* Batch Cycle */}
                <div className="col-md-6">
                  <label className="form-label">Batch Cycle *</label>
                   <input
                    type="text"
                    className="form-control"
                    value={formData.batchCycleName}
                    readOnly
                  />
                </div>

                {/* Course */}
                <div className="col-md-6">
                  <label className="form-label">Course *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.courseName}
                    readOnly
                  />
                </div>

                {/* Staff Name */}
                <div className="col-md-4">
                  <label className="form-label">Staff Name *</label>
                  <select
                    className="form-select"
                    value={formData.staffName}
                    onChange={(e) => handleInput("staffName", e.target.value)}
                    required
                  >
                    <option value="">Select Staff</option>
                    {staffList.map((s) => (
                      <option key={s.StaffId} value={`${s.firstName} ${s.lastName}`}>
                        {s.firstName} {s.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </form>

              {/* Preview Section */}
              {formData.url && (
                <div className="mt-3">
                  <h6>URL Preview:</h6>
                  <div className="alert alert-info">
                    <small>
                      <strong>URL:</strong> {formData.url}
                    </small>
                  </div>
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
                {editRow ? "Update Session" : "Save Session"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecordedSessionModal1;