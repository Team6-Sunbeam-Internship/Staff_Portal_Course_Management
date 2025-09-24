import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../../config/apiEndpoints";
import { callBackendService } from "../../../services/api/apiService";
import RecordedSessionTable from "../../../components/features/scheduling/components/RecordedSession/RecordedSessionTable";
import ToastMessage from "../../../components/common/Toast/ToastMessage/ToastMessage";
import ConfirmModal from "../../../components/common/Modal/ConfirmModal";
import RecordedSessionModal from "../../../components/features/scheduling/components/RecordedSession/RecordedSessionModal";

const RecordedSession = () => {
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editRow, setEditRow] = useState(null);

  // Delete confirm modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Dropdown data
  const [batchCycles, setBatchCycles] = useState([]);
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [staffList, setStaffList] = useState([]);

  // Filters
  const [selectedBatchCycleName, setSelectedBatchCycleName] = useState("");
  const [selectedCourseName, setSelectedCourseName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [showPagination, setShowPagination] = useState(false);

  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
  };

  // Fetch initial dropdown data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch batch cycles
        const batchCycles = await callBackendService("get", API_ENDPOINTS.BATCHCYCLES);
        const batchCyclesData = batchCycles?.result ?? batchCycles ?? [];
        setBatchCycles(batchCyclesData);

        // Fetch all courses
        const courses = await callBackendService("get", API_ENDPOINTS.COURSES);
        const coursesData = courses?.result ?? courses ?? [];
        setAllCourses(coursesData);
        setCourses(coursesData);

        // Fetch staff list
        const staffs = await callBackendService("get", API_ENDPOINTS.STAFFS);
        const staffData = staffs?.result ?? staffs ?? [];
        setStaffList(staffData);

      } catch (err) {
        console.error("Error fetching initial data:", err);
        showMessage("Error loading initial data.", "danger");
      }
    };

    fetchInitialData();
  }, []);

  // Handle batch cycle change
  const handleBatchCycleChange = (batchCycleName) => {
    setSelectedBatchCycleName(batchCycleName);
    setSelectedCourseName("");
    setRows([]);
    setShowPagination(false);
    
    if (batchCycleName) {
      // Filter courses based on batch cycle using cycleName (like in TimeSheet)
      const filteredCourses = allCourses.filter(course =>
        course.cycleName === batchCycleName
      );
      setCourses(filteredCourses);
    } else {
      setCourses(allCourses);
    }
  };

  // Handle course change
  const handleCourseChange = (courseName) => {
    setSelectedCourseName(courseName);
    setRows([]);
    setShowPagination(false);
  };

  // Normalize backend page response
  const normalizeBackendPage = (resp) => {
    if (!resp) return null;
    
    // Check if it's already a proper page object
    if (resp.content && Array.isArray(resp.content)) {
      return resp;
    }
    
    // Check if data is nested in result
    if (resp.result && resp.result.content) {
      return resp.result;
    }
    
    // Check if data is nested in data
    if (resp.data && resp.data.content) {
      return resp.data;
    }
    
    // If it's a direct array, wrap it in a page structure
    if (Array.isArray(resp)) {
      return {
        content: resp,
        totalPages: 1,
        totalElements: resp.length,
        number: 0,
        size: resp.length,
        first: true,
        last: true,
      };
    }
    
    return null;
  };

  // Fetch recorded sessions
  const fetchRecordedSessions = async (pageToFetch = 0) => {
    if (!selectedBatchCycleName || !selectedCourseName || !startDate || !endDate) {
      showMessage(
        "Please select batch cycle, course, start date and end date.",
        "warning"
      );
      return;
    }

    const params = {
      batchCycleName: selectedBatchCycleName,
      courseName: selectedCourseName,
      startDate: startDate,
      endDate: endDate,
      page: pageToFetch,
      size
    };

    try {
      const resp = await callBackendService(
        "get",
        `${API_ENDPOINTS.RECORDED_SESSIONS}/by-date`,
        { params }
      );
      
      const pageData = normalizeBackendPage(resp);

      if (!pageData) {
        showMessage("Unexpected response when fetching recorded sessions.", "danger");
        return;
      }

      const incoming = pageData.content.map((session) => ({
        id: session.id,
        sessionDate: session.date ? session.date.split('T')[0] : session.sessionDate,
        channel: session.channel,
        title: session.title,
        description: session.description,
        url: session.url,
        courseName: session.courseName,
        batchCycleName: session.batchCycleName,
        staffName: session.staffName
      }));

      setRows(incoming);
      setTotalPages(pageData.totalPages || 1);
      setTotalElements(pageData.totalElements || incoming.length);
      setPage(pageData.number || pageToFetch);
      setShowPagination(true);
      
    } catch (err) {
      console.error("Error fetching recorded sessions:", err);
      showMessage("Error fetching recorded sessions.", "danger");
    }
  };

  // Save session (from AddSessionModal)
  const handleSave = async (sessionData) => {
    try {
      let savedSession;

      if (editRow && editRow.id) {
        // Updating existing session - send exactly as provided
        savedSession = await callBackendService(
          "put",
          `${API_ENDPOINTS.RECORDED_SESSIONS}/${editRow.id}`,
          { data: sessionData }
        );

        showMessage("Recorded session updated successfully.", "success");

        // Update the row in the table
        const updatedRow = {
          ...sessionData,
          id: editRow.id
        };

        setRows((prev) =>
          prev.map((r) =>
            r.id === editRow.id ? updatedRow : r
          )
        );
      } else {
        // Adding new session - send exactly as provided
        savedSession = await callBackendService("post", API_ENDPOINTS.RECORDED_SESSIONS, {
          data: sessionData,
        });

        showMessage("Recorded session added successfully.", "success");

        // Add the new row to the table
        const newRow = {
          ...sessionData,
          id: savedSession.data?.id || savedSession.id || Date.now() // Handle different response structures
        };

        setRows((prev) => [newRow, ...prev]);
        setTotalElements(prev => prev + 1);
      }

      setShowModal(false);
    } catch (err) {
      console.error("Error saving recorded session:", err);
      showMessage("Error saving recorded session.", "danger");
    }
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await callBackendService("delete", `${API_ENDPOINTS.RECORDED_SESSIONS}/${deleteId}`);
      showMessage("Recorded session deleted successfully.", "success");
      setRows((prev) => prev.filter((r) => r.id !== deleteId));
      setTotalElements(prev => prev - 1);
    } catch (err) {
      console.error("Error deleting recorded session:", err);
      showMessage("Error deleting recorded session.", "danger");
    }
    setShowConfirm(false);
  };

  return (
    <div className="container-fluid p-3" style={{ maxWidth: 1400, margin: "auto" }}>
      <h4 className="mb-3 text-center">Recorded Sessions</h4>

      {/* ===== Filters ===== */}
      <div className="row g-2 align-items-center mb-3">
        <div className="col-md-3">
          <label className="form-label mb-1">Batch Cycle</label>
          <select
            className="form-select form-select-sm"
            value={selectedBatchCycleName}
            onChange={(e) => handleBatchCycleChange(e.target.value)}
          >
            <option value="">Select Batch Cycle</option>
            {batchCycles.map((b) => (
              <option key={b.batchCycleId} value={b.cycleName}>
                {b.cycleName}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label mb-1">Course</label>
          <select
            className="form-select form-select-sm"
            value={selectedCourseName}
            onChange={(e) => handleCourseChange(e.target.value)}
            disabled={!selectedBatchCycleName}
          >
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c.courseId} value={c.courseName}>
                {c.courseName}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <label className="form-label mb-1">Start Date</label>
          <input
            type="date"
            className="form-control form-control-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <label className="form-label mb-1">End Date</label>
          <input
            type="date"
            className="form-control form-control-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="col-md-2 d-grid">
          <button
            className="btn btn-primary btn-sm mt-3"
            onClick={() => fetchRecordedSessions(0)}
          >
            Get Sessions
          </button>
        </div>
      </div>

      {/* ===== Results Info ===== */}
      {showPagination && (
        <div className="mb-2 text-muted">
          <small>Showing {rows.length} of {totalElements} recorded sessions</small>
        </div>
      )}

      {/* ===== Add Entry Button ===== */}
      <div className="d-flex justify-content-end mb-2">
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditRow(null);
            setShowModal(true);
          }}
        >
          + Add Recorded Session
        </button>
      </div>

      {/* ===== Table ===== */}
      <RecordedSessionTable
        rows={rows}
        onEdit={(row) => {
          setEditRow(row);
          setShowModal(true);
        }}
        onDelete={handleDelete}
      />

      {/* ===== Pagination ===== */}
      {showPagination && totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => fetchRecordedSessions(page - 1)}
            disabled={page === 0}
          >
            &lt; Prev
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i;
            } else if (page < 3) {
              pageNum = i;
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 5 + i;
            } else {
              pageNum = page - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                className={`btn btn-sm ${pageNum === page ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => fetchRecordedSessions(pageNum)}
              >
                {pageNum + 1}
              </button>
            );
          })}
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => fetchRecordedSessions(page + 1)}
            disabled={page >= totalPages - 1}
          >
            Next &gt;
          </button>
        </div>
      )}

      {/* ===== No Data Message ===== */}
      {!showPagination && selectedBatchCycleName && selectedCourseName && startDate && endDate && (
        <div className="text-center mt-4">
          <p className="text-muted">No recorded sessions found for the selected criteria.</p>
        </div>
      )}

      {/* ===== Toast ===== */}
      <ToastMessage
        message={message?.text}
        type={message?.type}
        onClose={() => setMessage(null)}
      />

      {/* ===== Confirm Delete Modal ===== */}
      <ConfirmModal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this recorded session?"
      />

      {/* ===== Add/Edit Modal ===== */}
      {showModal && (
        <RecordedSessionModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onSave={handleSave}
          editRow={editRow}
          batchCycles={batchCycles}
          courses={allCourses}
          staffList={staffList}
          selectedBatchCycleName={selectedBatchCycleName}
          selectedCourseName={selectedCourseName}
        />
      )}
    </div>
  );
};

export default RecordedSession;