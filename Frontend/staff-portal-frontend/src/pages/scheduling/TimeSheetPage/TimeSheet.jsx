import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../../config/apiEndpoints";
import { callBackendService } from "../../../services/api/apiService";
import TimeSheetTable from "../../../components/features/scheduling/components/TimeSheet/TimeSheetTable";
import ToastMessage from "../../../components/common/Toast/ToastMessage/ToastMessage";
import ConfirmModal from "../../../components/common/Modal/ConfirmModal";
import AddModal from "../../../components/features/scheduling/components/TimeSheet/AddModal";

const TimeSheet = () => {
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editRow, setEditRow] = useState(null);

  // Delete confirm modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Dropdown data
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [topics, setTopics] = useState([]);
  const [batchCycles, setBatchCycles] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sections, setSections] = useState([]);

  // All original data (for filtering)
  const [allCourses, setAllCourses] = useState([]);
  const [allModules, setAllModules] = useState([]);

  // Filters
  const [selectedBatchCycleName, setSelectedBatchCycleName] = useState("");
  const [selectedCourseName, setSelectedCourseName] = useState("");
  const [selectedModuleName, setSelectedModuleName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [showPagination, setShowPagination] = useState(false);

  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
  };

  // Fetch dropdown data once
  useEffect(() => {
    const fetchData = async () => {
      try {
        const courses = await callBackendService("get", API_ENDPOINTS.COURSES);
        const coursesData = courses?.result ?? courses ?? [];
        setAllCourses(coursesData);
        setCourses(coursesData);

        const modules = await callBackendService("get", API_ENDPOINTS.MODULES);
        const modulesData = modules?.result ?? modules ?? [];
        setAllModules(modulesData);
        setModules(modulesData);

        const topics = await callBackendService("get", API_ENDPOINTS.TOPICS);
        setTopics(topics?.result ?? topics ?? []);

        const batchCycles = await callBackendService(
          "get",
          API_ENDPOINTS.BATCHCYCLES
        );
        setBatchCycles(batchCycles?.result ?? batchCycles ?? []);

        const staffs = await callBackendService("get", API_ENDPOINTS.STAFFS);
        setStaffList(staffs?.result ?? staffs ?? []);

        const subjects = await callBackendService("get", API_ENDPOINTS.SUBJECTS);
        setSubjects(subjects?.result ?? subjects ?? []);

        const sections = await callBackendService("get", API_ENDPOINTS.SECTIONS);
        setSections(sections?.result ?? sections ?? []);
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };

    fetchData();
  }, []);

  // Handle batch cycle change
  const handleBatchCycleChange = (batchCycleName) => {
    setSelectedBatchCycleName(batchCycleName);
    setSelectedCourseName("");
    setSelectedModuleName("");
    setRows([]);
    if (batchCycleName) {
      // Filter courses based on batch cycle using cycleName
      const filteredCourses = allCourses.filter(course =>
        course.cycleName === batchCycleName
      );
      setCourses(filteredCourses);
    } else {
      setCourses([]);
    }
    setModules([]);
  };

  // Handle course change
  const handleCourseChange = (courseName) => {
    setSelectedCourseName(courseName);
    setSelectedModuleName("");
    setRows([]);
    if (courseName && selectedBatchCycleName) {
      // Filter modules based on selected course and batch cycle
      const filteredModules = allModules.filter(module =>
        module.courseName === courseName &&
        module.batchCycleName === selectedBatchCycleName
      );
      setModules(filteredModules);
    } else {
      setModules([]);
    }
  };

  const handleModuleChange = (moduleName) => {
    setSelectedModuleName(moduleName);
    setRows([]); // hide table data when module is changed
  };

  // Normalize backend page
  const normalizeBackendPage = (resp) => {
    if (!resp) return null;
    if (resp.content) return resp;
    if (resp.result?.content) return resp.result;
    if (resp.page?.content) return resp.page;
    if (Array.isArray(resp)) {
      return {
        content: resp,
        totalPages: 1,
        totalElements: resp.length,
        number: 0,
        size: resp.length,
      };
    }
    return null;
  };

  // Fetch timesheets
  const fetchTimeSheets = async (pageToFetch = 0) => {
    if (!selectedBatchCycleName || !selectedCourseName || !selectedModuleName || !startDate || !endDate) {
      showMessage(
        "Please select batch cycle, course, module, start date and end date.",
        "warning"
      );
      return;
    }

    const params = {
      batchCycleName: selectedBatchCycleName,
      courseName: selectedCourseName,
      moduleName: selectedModuleName,
      startDate,
      endDate,
      page: pageToFetch,
      size,
    };

    try {
      const resp = await callBackendService(
        "get",
        `${API_ENDPOINTS.TIMESHEET}/by-date`,
        { params }
      );
      const pageData = normalizeBackendPage(resp);

      if (!pageData) {
        showMessage("Unexpected response when fetching timesheets.", "danger");
        return;
      }

      const incoming = pageData.content.map((ts) => ({
        id: ts.id,
        logDate: ts.logDate,
        batchCycleName: ts.batchCycleName,
        courseName: ts.courseModule?.courseName ?? ts.courseName,
        moduleName: ts.courseModule?.moduleName ?? ts.moduleName,
        staffName: ts.staffName,
        topicNames: ts.topics?.map((t) => t.topicName) || [],
        startTime: ts.startTime,
        endTime: ts.endTime,
        assignment: ts.assignment,
        extraTopic: ts.extraTopic,
        status: ts.status,
        durationHours: ts.durationHours,
      }));

      setRows(incoming);
      setTotalPages(
        pageData.totalPages ??
        (pageData.totalElements
          ? Math.ceil(pageData.totalElements / size)
          : 1)
      );
      setPage(pageData.number ?? pageToFetch);
      setShowPagination(true);
    } catch (err) {
      console.error("Error fetching timesheets:", err);
      showMessage("Error fetching timesheets.", "danger");
    }
  };

  // Save row (from AddRowModal)
 // Replace the handleSave function in TimeSheetPage1.js with this updated version:

const handleSave = async (rowData) => {
  try {
    let savedRow;

    if (editRow && editRow.id) {
      // Updating existing timesheet
      const timeSheetData = {
        ...rowData,
        startTime: rowData.startTime?.slice(0, 5), // "05:07:00" -> "05:07"
        endTime: rowData.endTime?.slice(0, 5),
        timeSheetTopics: rowData.topicNames?.map((t) => ({ topicName: t })) || []
      };
               //  Remove extra fields backend doesn't expect
    delete timeSheetData.topicNames;
    delete timeSheetData.topics;


      savedRow = await callBackendService(
        "put",
        `${API_ENDPOINTS.TIMESHEET}/${editRow.id}`,
        { data: timeSheetData }
      );

      showMessage("Timesheet updated successfully.", "success");

      const savedRowWithTopics = {
        ...savedRow,
        startTime: savedRow.startTime?.slice(0, 5),
        endTime: savedRow.endTime?.slice(0, 5),
        topicNames: savedRow.topics?.map((t) => t.topicName) || [],
        timeSheetTopics: savedRow.topics?.map((t) => ({ id: t.id, topicName: t.topicName })) || [],
        id: savedRow.id,
        // Ensure all required properties are present
        batchCycleName: savedRow.batchCycleName || rowData.batchCycleName,
        courseName: savedRow.courseModule?.courseName || savedRow.courseName || rowData.courseName,
        moduleName: savedRow.courseModule?.moduleName || savedRow.moduleName || rowData.moduleName,
        staffName: savedRow.staffName || rowData.staffName,
        logDate: savedRow.logDate || rowData.logDate,
        assignment: savedRow.assignment || rowData.assignment,
        extraTopic: savedRow.extraTopic || rowData.extraTopic,
        status: savedRow.status || rowData.status,
        durationHours: savedRow.durationHours || rowData.durationHours
      };

      setRows((prev) =>
        prev.map((r) =>
          r.id === editRow.id ? savedRowWithTopics : r
        )
      );
    } else {
      // Adding new timesheet
      const timeSheetData = {
        ...rowData,
        startTime: rowData.startTime?.slice(0, 5),
        endTime: rowData.endTime?.slice(0, 5),
        timeSheetTopics: rowData.topicNames?.map((t) => ({ topicName: t })) || []
      };

         //  Remove extra fields backend doesn't expect
    delete timeSheetData.topicNames;
    delete timeSheetData.topics;

      savedRow = await callBackendService("post", API_ENDPOINTS.TIMESHEET, {
        data: timeSheetData,
      });

      showMessage("Timesheet added successfully.", "success");

      const savedRowWithTopics = {
        ...savedRow,
        topicNames: savedRow.topics?.map((t) => t.topicName) || [],
        timeSheetTopics: savedRow.topics?.map((t) => ({ id: t.id, topicName: t.topicName })) || [],
        id: savedRow.id,
        // Ensure all required properties are present (same as fetched rows)
        batchCycleName: savedRow.batchCycleName || rowData.batchCycleName,
        courseName: savedRow.courseModule?.courseName || savedRow.courseName || rowData.courseName,
        moduleName: savedRow.courseModule?.moduleName || savedRow.moduleName || rowData.moduleName,
        staffName: savedRow.staffName || rowData.staffName,
        logDate: savedRow.logDate || rowData.logDate,
        assignment: savedRow.assignment || rowData.assignment,
        extraTopic: savedRow.extraTopic || rowData.extraTopic,
        status: savedRow.status || rowData.status,
        durationHours: savedRow.durationHours || rowData.durationHours,
        startTime: savedRow.startTime?.slice(0, 5) || rowData.startTime,
        endTime: savedRow.endTime?.slice(0, 5) || rowData.endTime
      };

      setRows((prev) => [...prev, savedRowWithTopics]);
    }

    setShowModal(false);
  } catch (err) {
    console.error("Error saving timesheet:", err);
    showMessage("Error saving timesheet.", "danger");
  }
};


  const handleDelete = async (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await callBackendService("delete", `${API_ENDPOINTS.TIMESHEET}/${deleteId}`);
      showMessage("Timesheet deleted successfully.", "success");
      setRows((prev) => prev.filter((r) => r.id !== deleteId));
    } catch (err) {
      console.error("Error deleting timesheet:", err);
      showMessage("Error deleting timesheet.", "danger");
    }
    setShowConfirm(false);
  };

  return (
    <div className="container-fluid p-3" style={{ maxWidth: 1320, margin: "auto" }}>
      <h4 className="mb-3 text-center">TimeSheet</h4>

      {/* ===== Filters ===== */}
      <div className="row g-2 align-items-center mb-3">
        <div className="col-md-2">
          <label className="form-label mb-1">Batch Cycle</label>
          <select
            className="form-select form-select-sm"
            value={selectedBatchCycleName}
            onChange={(e) => handleBatchCycleChange(e.target.value)}
          >
            <option value="">Select</option>
            {batchCycles.map((b) => (
              <option key={b.batchCycleId} value={b.cycleName}>
                {b.cycleName}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <label className="form-label mb-1">Course</label>
          <select
            className="form-select form-select-sm"
            value={selectedCourseName}
            onChange={(e) => handleCourseChange(e.target.value)}
            disabled={!selectedBatchCycleName}
          >
            <option value="">Select</option>
            {courses.map((c) => (
              <option key={c.courseId} value={c.courseName}>
                {c.courseName}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <label className="form-label mb-1">Module</label>
          <select
            className="form-select form-select-sm"
            value={selectedModuleName}
            onChange={(e) => handleModuleChange(e.target.value)}
            disabled={!selectedCourseName}
          >
            <option value="">Select</option>
            {modules.map((m) => (
              <option key={m.moduleId} value={m.moduleName}>
                {m.moduleName}
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
            onClick={() => fetchTimeSheets(0)}
          >
            Get TimeSheets
          </button>
        </div>
      </div>

      {/* ===== Add Entry Button ===== */}
      <div className="d-flex justify-content-end mb-2">
        <button
          className="btn btn-primary"
          disabled={!selectedBatchCycleName || !selectedCourseName || !selectedModuleName} // disable if any missing
          onClick={() => {
            setEditRow(null);
            setShowModal(true);
          }}
        >
          + Add Entry
        </button>
      </div>

      {/* ===== Table ===== */}
      <TimeSheetTable
        rows={rows}
        onEdit={(row) => {
          setEditRow(row);
          setShowModal(true);
        }}
        onDelete={handleDelete}
      />

      {/* ===== Pagination ===== */}
      {showPagination && totalPages > 0 && (
        <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => fetchTimeSheets(page - 1)}
            disabled={page === 0}
          >
            &lt; Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`btn btn-sm ${i === page ? "btn-primary" : "btn-outline-primary"
                }`}
              onClick={() => fetchTimeSheets(i)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => fetchTimeSheets(page + 1)}
            disabled={page >= totalPages - 1}
          >
            Next &gt;
          </button>
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
        message="Are you sure you want to delete this timesheet?"
      />

      {/* ===== Add/Edit Modal ===== */}
      {showModal && (
        <AddModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onSave={handleSave}
          editRow={editRow}
          courses={allCourses}
          modules={allModules}
          staff={staffList}
          subjects={subjects}
          sections={sections}
          topics={topics}
          batchCycles={batchCycles}
          selectedBatchCycleName={selectedBatchCycleName} // pass current filters
          selectedCourseName={selectedCourseName}
          selectedModuleName={selectedModuleName}
        />
      )}
    </div>
  );
};

export default TimeSheet;