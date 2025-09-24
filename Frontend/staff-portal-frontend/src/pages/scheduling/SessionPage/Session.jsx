import React, { useEffect, useState } from "react";
import axios from "axios";
import SessionTable from "../../../components/features/scheduling/components/Session/SessionTable";
import SessionModal from "../../../components/features/scheduling/components/Session/SessionModal";
import ConfirmModal from "../../../components/common/Modal/ScheduleModals/ConfirmModal";
import { API_ENDPOINTS } from "../../../config/apiEndpoints";
import ToastMessage from "../../../components/common/Toast/ToastMessage/ToastMessage";

export default function Session() {
  const [selectedBatchCycleId, setSelectedBatchCycleId] = useState("");
  const [sessions, setSessions] = useState([]);
  const [availableStaff, setAvailableStaff] = useState([]);
  const [batchCycles, setBatchCycles] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedBatchCycleName, setSelectedBatchCycleName] = useState("");
  const [selectedCourseName, setSelectedCourseName] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [message, setMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // pagination
  const [page, setPage] = useState(0);
  const [size] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [showPagination, setShowPagination] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const staffRes = await axios.get(API_ENDPOINTS.STAFFS);
        setAvailableStaff(staffRes.data ?? []);

        const batchCycleRes = await axios.get(API_ENDPOINTS.BATCHCYCLES);
        setBatchCycles(batchCycleRes.data ?? []);

        const courseRes = await axios.get(API_ENDPOINTS.COURSES);
        setCourses(courseRes.data?.result ?? courseRes.data ?? []);
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };
    fetchData();
  }, []);

  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
  };

  const existingMeetingIds = [
    ...new Set(sessions.map((session) => session.meetingId).filter(Boolean)),
  ];

  // === Fetch sessions by filters ===
  const fetchSessions = async (pageToFetch = 0) => {
    if (!selectedBatchCycleName || !selectedCourseName || !startDate || !endDate) {
      showMessage("Please select batch, course, start date and end date.", "warning");
      return;
    }

    try {
      const params = {
        batchCycleName: selectedBatchCycleName,
        courseName: selectedCourseName,
        startDate: startDate,
        endDate: endDate,
        page: pageToFetch,
        size,
      };

      const resp = await axios.get(`${API_ENDPOINTS.SESSIONS}/by-date`, { params });
      const pageData =
        resp.data?.result?.content ||
        resp.data?.content ||
        resp.data?.page?.content ||
        Array.isArray(resp.data)
          ? resp.data
          : [];

      const normalized = Array.isArray(pageData)
        ? {
            content: pageData,
            totalPages: 1,
            number: 0,
          }
        : resp.data?.result || resp.data;

      setSessions(normalized.content || []);
      setTotalPages(normalized.totalPages || 1);
      setPage(normalized.number || 0);
      setShowPagination(true);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      showMessage("Error fetching sessions.", "danger");
    }
  };

  const handleSave = (sessionData) => {
    const payload = {
      ...sessionData,
      batchCycleName: selectedBatchCycleName,
      courseName: selectedCourseName,
    };

    if (editData) {
      axios
        .put(`${API_ENDPOINTS.SESSIONS}/${editData.id}`, payload)
        .then(() => {
          showMessage("Session updated successfully.", "success");
          setSessions((prev) =>
            prev.map((s) => (s.id === editData.id ? { ...s, ...payload } : s))
          );
          setShowModal(false);
          setEditData(null);
        })
        .catch((err) => {
          const msg =
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            "Error updating session.";
          showMessage(msg, "danger");
        });
    } else {
      axios
        .post(API_ENDPOINTS.SESSIONS, payload)
        .then((res) => {
          showMessage("Session created successfully.", "success");
          setSessions((prev) => [...prev, res.data ?? payload]);
          setShowModal(false);
        })
        .catch((err) => {
          const msg =
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            "Error creating session.";
          showMessage(msg, "danger");
        });
    }
  };

  const handleDelete = (index) => {
    const row = sessions[index];
    if (!row.id) {
      setSessions((prev) => prev.filter((_, i) => i !== index));
      showMessage("Row removed.", "info");
      return;
    }
    setConfirmDeleteId(index);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    const index = confirmDeleteId;
    const row = sessions[index];
    setShowConfirm(false);

    if (row?.id) {
      axios
        .delete(`${API_ENDPOINTS.SESSIONS}/${row.id}`)
        .then(() => {
          showMessage("Session deleted successfully.", "success");
          setSessions((prev) => prev.filter((_, i) => i !== index));
        })
        .catch((err) => {
          const backend = err.response?.data;
          const msg =
            (backend?.code && backend?.message
              ? `${backend.code}: ${backend.message}`
              : backend?.message || backend?.error) ||
            err.message ||
            "Error deleting session.";
          showMessage(msg, "danger");
        });
    }
  };

  useEffect(() => {
    if (selectedBatchCycleName) {
      const cycleObj = batchCycles.find(
        (b) => b.cycleName === selectedBatchCycleName
      );
      if (cycleObj) {
        const filtered = courses.filter((c) => c.cycleName === cycleObj.cycleName);
        setFilteredCourses(filtered);
      } else {
        setFilteredCourses([]);
      }
    } else {
      setFilteredCourses([]);
    }
    setSelectedCourseName("");
    // Clear table rows because batch/course changed
  setSessions([]);
  }, [selectedBatchCycleName, courses, batchCycles]);
 
   useEffect(() => {
    setSessions([]);
  }, [selectedCourseName]);
 

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Session Management</h3>

      {/* Filters above table */}
      <div className="row g-2 align-items-center mb-3">
        <div className="col-md-2">
          <label className="form-label mb-1">
            Batch Cycle <span className="text-danger">*</span>
          </label>
          <select
            className="form-select form-select-sm"
            value={selectedBatchCycleId}
            onChange={(e) => {
              const id = e.target.value;
              setSelectedBatchCycleId(id);
              const cycle = batchCycles.find((b) => String(b.batchCycleId) === id);
              setSelectedBatchCycleName(cycle ? cycle.cycleName : "");
            }}
          >
            <option value="">Select Batch Cycle</option>
            {batchCycles.map((b) => (
              <option key={b.batchCycleId} value={b.batchCycleId}>
                {b.cycleName}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <label className="form-label mb-1">
            Course <span className="text-danger">*</span>
          </label>
          <select
            className="form-select form-select-sm"
            value={selectedCourseName}
            onChange={(e) => setSelectedCourseName(e.target.value)}
            disabled={!selectedBatchCycleName}
          >
            <option value="">Select Course</option>
            {filteredCourses.map((c) => (
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
            onClick={() => fetchSessions(0)}
          >
            Get Sessions
          </button>
        </div>
      </div>

      <button
        className="btn btn-success mb-3"
        disabled={!selectedBatchCycleName || !selectedCourseName}
        onClick={() => {
          setEditData(null);
          setShowModal(true);
        }}
      >
        + Add Session
      </button>

      <SessionTable
        sessions={sessions}
        onEdit={(session) => {
          setEditData(session);
          setShowModal(true);
        }}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      {showPagination && totalPages > 0 && (
        <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => fetchSessions(page - 1)}
            disabled={page === 0}
          >
            &lt; Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`btn btn-sm ${
                i === page ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => fetchSessions(i)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => fetchSessions(page + 1)}
            disabled={page >= totalPages - 1}
          >
            Next &gt;
          </button>
        </div>
      )}

      <SessionModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSave}
        availableStaff={availableStaff}
        existingMeetingIds={existingMeetingIds}
        batchCycles={batchCycles}
        courses={courses}
        initialData={editData}
        selectedBatchCycleName={selectedBatchCycleName}
        selectedCourseName={selectedCourseName}
      />

      <ConfirmModal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this session?"
      />

      <ToastMessage
        message={message?.text}
        type={message?.type}
        onClose={() => setMessage(null)}
        position="top-end"
        className="p-3"
      />
    </div>
  );
}
