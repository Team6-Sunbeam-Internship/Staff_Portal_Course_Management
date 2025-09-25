import React, { useState, useEffect } from "react";
import axios from "axios";
import ScheduleTable from "../../../components/common/Table/Schedule/ScheduleTable";
import ToastMessage from "../../../components/common/Toast/ToastMessage/ToastMessage";
import ConfirmModal from "../../../components/common/Modal/ScheduleModals/ConfirmModal";
import { API_ENDPOINTS } from "../../../config/apiEndpoints";
import { callBackendService } from "../../../services/api/apiService";
import "../../../components/common/Table/Schedule/ScheduleTable.css";
// Added for PDF export
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // this extends jsPDF with autoTable



const Scheduling = () => {
    const [selectedBatchCycleId, setSelectedBatchCycleId] = useState("");
    const [selectedBatchCycleName, setSelectedBatchCycleName] = useState("");
    const [selectedCourseName, setSelectedCourseName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [skipDates, setSkipDates] = useState([]);
    const [scheduleData, setScheduleData] = useState([]);
    const [message, setMessage] = useState(null);
    const [mode, setMode] = useState("get");     //"get" | "generate"
    // Confirm Modal
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);

    // Options fetched from API
    const [allCourses, setAllCourses] = useState([]);
    const [batchCycles, setBatchCycles] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [modules, setModules] = useState([]);
    const [venues, setVenues] = useState([]);
    const [studentGroups, setStudentGroups] = useState([]);

    const groupOptions = studentGroups.map((g) => g.groupName);
    const moduleOptions = modules.map((m) => m.moduleName);
    const staffOptions = staffList.map((s) => `${s.firstName} ${s.lastName}`);
    const venueOptions = venues.map((v) => v.roomName);
    const timeSlotOptions = ["Morning", "Afternoon", "Evening"];
    const activityOptions = ["Lecture", "Lab", "Others"];

    // Pagination / fetch state
    const [showPagination, setShowPagination] = useState(false); // only show after fetching from backend
    const [page, setPage] = useState(0); // zero-based page index
    const [size, setSize] = useState(8); // default page size (user can change)
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // Fetch all data once
    useEffect(() => {
        const fetchData = async () => {
            try {
                const courses = await callBackendService("get", API_ENDPOINTS.COURSES);
                // handle possible shapes
                setAllCourses(courses?.result ?? courses ?? []);

                const batchCycles = await callBackendService(
                    "get",
                    API_ENDPOINTS.BATCHCYCLES
                );
                setBatchCycles(batchCycles ?? []);

                const staffs = await callBackendService("get", API_ENDPOINTS.STAFFS);
                setStaffList(staffs ?? []);

                const modules = await callBackendService("get", API_ENDPOINTS.MODULES);
                setModules(modules?.result ?? modules ?? []);

                const venues = await callBackendService("get", API_ENDPOINTS.VENUES);
                setVenues(venues ?? []);
            } catch (err) {
                console.error("Error fetching initial data:", err);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchStudentGroups = async () => {
            if (!selectedBatchCycleId) {
                setStudentGroups([]); // reset if nothing selected
                return;
            }

            // clear old groups immediately
            setStudentGroups([]);

            try {
                const studentGroups = await callBackendService(
                    "get",
                    `${API_ENDPOINTS.STUDENTGROUPS}/${selectedBatchCycleId}`
                );

                setStudentGroups(studentGroups ?? []);
            } catch (err) {
                console.error("Error fetching student groups:", err);
            }
        };

        fetchStudentGroups();
    }, [selectedBatchCycleId]);

    //  Filter courses by selected batch cycle name
    useEffect(() => {
        if (selectedBatchCycleName) {
            const cycleObj = batchCycles.find(
                (b) => b.cycleName === selectedBatchCycleName
            );
            if (cycleObj) {
                const filtered = allCourses.filter(
                    (c) => c.cycleName === cycleObj.cycleName
                );
                setFilteredCourses(filtered);
            } else {
                setFilteredCourses([]);
            }
        } else {
            setFilteredCourses([]);
        }
        setSelectedCourseName(""); // reset course when batch cycle changes
    }, [selectedBatchCycleName, allCourses, batchCycles]);

    const showMessage = (text, type = "info") => {
        setMessage({ text, type });
    };

    const handleSkipDateChange = (date) => {
        setSkipDates((prev) =>
            prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
        );

        // Remove any schedule rows that match the skipped date
        setScheduleData((prev) => prev.filter((r) => r.scheduleDate !== date));
    };

    //  Add schedules for date range
    const
        addScheduleForDateRange = () => {
            if (!selectedBatchCycleName || !selectedCourseName || !startDate || !endDate) {
                showMessage("Please fill all required fields.", "warning");
                return;
            }

            const batchCycleObj = batchCycles.find(
                (b) => b.cycleName === selectedBatchCycleName
            );
            const courseObj = allCourses.find(
                (c) => c.courseName === selectedCourseName
            );

            if (!batchCycleObj || !courseObj) {
                showMessage("Invalid batch cycle or course selection.", "danger");
                return;
            }

            const sDate = new Date(startDate);
            const eDate = new Date(endDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            let newRows = [];

            // keep only rows inside the new date range
            const updatedExistingRows = scheduleData.filter((row) => {
                const rowDate = new Date(row.scheduleDate);
                return rowDate >= sDate && rowDate <= eDate;
            });

            // now generate rows for missing dates
            let tempDate = new Date(sDate);
            while (tempDate <= eDate) {
                const isoDate = tempDate.toISOString().split("T")[0];

                if (
                    !skipDates.includes(isoDate) &&
                    new Date(isoDate) >= today &&
                    !updatedExistingRows.some((r) => r.scheduleDate === isoDate)
                ) {
                    newRows.push({
                        scheduleDate: isoDate,
                        startTime: "",
                        endTime: "",
                        staffNames: [],
                        studentGroups: "",
                        moduleName: "",
                        activity: "",
                        infrastructureName: "",
                        slotName: "",
                        cycleName: batchCycleObj.cycleName,
                        courseName: courseObj.courseName,
                        isEditing: true,
                        isAdded: false,
                    });
                }
                tempDate.setDate(tempDate.getDate() + 1);
            }

            if (newRows.length === 0 && updatedExistingRows.length === 0) {
                showMessage("No rows available in this date range.", "warning");
                return;
            }

            // hide pagination when generating schedules
            setShowPagination(false);

            // keep rows in range + add new rows
            setScheduleData([...updatedExistingRows, ...newRows]);

            showMessage(
                `${newRows.length} new row(s) added. ${updatedExistingRows.length} existing row(s) kept.`,
                "success"
            );
        };


    const handleCellChange = (index, field, value) => {
        const updated = [...scheduleData];
        updated[index][field] = value;
        setScheduleData(updated);
    };

    const handleAddRow = (index) => {
        const row = scheduleData[index];
        const newRow = {
            scheduleDate: row.scheduleDate,
            moduleName: row.moduleName,
            startTime: "",
            endTime: "",
            staffNames: [],
            studentGroups: [],
            activity: "",
            infrastructureName: "",
            slotName: "",
            cycleName: row.cycleName,
            courseName: row.courseName,
            isEditing: true,
            isAdded: false,
        };
        const updated = [...scheduleData];
        updated.splice(index + 1, 0, newRow);
        setScheduleData(updated);
    };

    //  Confirm delete
    const handleDeleteRow = (index) => {
        const row = scheduleData[index];
        if (!row.scheduleId) {
            // No scheduleId → remove instantly
            setScheduleData((prev) => prev.filter((_, i) => i !== index));
            showMessage("Row removed.", "info");
            return;
        }
        // With scheduleId → confirm
        setDeleteIndex(index);
        setShowConfirm(true);
    };

    const confirmDelete = () => {
        const index = deleteIndex;
        const row = scheduleData[index];
        setShowConfirm(false);



        if (row.scheduleId) {
            callBackendService("delete", `${API_ENDPOINTS.SCHEDULES}/${row.scheduleId}`)
                .then(() => {
                    showMessage("Schedule deleted successfully.", "success");
                    setScheduleData((prev) => prev.filter((_, i) => i !== index));
                })
                .catch((err) => {
                    console.error("Delete error:", err);

                    // Extract backend error message
                    const backend = err.response?.data;
                    const msg =
                        (backend?.code && backend?.message
                            ? `${backend.code}: ${backend.message}`
                            : backend?.message || backend?.error) ||
                        err.message ||
                        "Error deleting schedule.";

                    showMessage(msg, "danger");
                });
        }

    };

    const handleSaveRow = (index) => {
        const row = scheduleData[index];
        if (
            !row.startTime ||
            !row.endTime ||
            !row.staffNames?.length ||
            !row.studentGroups?.length ||
            !row.moduleName ||
            !row.activity ||
            !row.infrastructureName ||
            !row.slotName
        ) {
            showMessage("Please fill all fields.", "warning");
            return;
        }

        const requestPayload = {
            scheduleDate: row.scheduleDate,
            activity: row.activity,
            staffNames: row.staffNames,
            studentGroups: row.studentGroups,
            moduleName: row.moduleName,
            infrastructureName: row.infrastructureName,
            courseName: row.courseName,
            batchCycleName: row.cycleName,
            timeSlot: {
                slotName: row.slotName,
                startTime: row.startTime,
                endTime: row.endTime,
            },
        };

        if (row.scheduleId) {
            // === UPDATE schedule ===
            callBackendService("put", `${API_ENDPOINTS.SCHEDULES}/${row.scheduleId}`, {
                data: requestPayload,
            })
                .then(() => {
                    showMessage("Schedule updated successfully.", "success");
                    const updated = [...scheduleData];
                    updated[index] = { ...row, isEditing: false, isAdded: true };
                    setScheduleData(updated);
                })
                .catch((err) => {
                    console.error(err);

                    // extract backend error message safely
                    const msg =
                        err.response?.data?.message ||
                        err.response?.data?.error ||
                        err.message ||
                        "Error updating schedule.";
                    console.log(msg);
                    showMessage(msg, "danger");
                });
        } else {
            // === CREATE schedule ===
            console.log("Payload:", requestPayload);
            callBackendService("post", API_ENDPOINTS.SCHEDULES, {
                data: requestPayload,
            })
                .then(() => {
                    showMessage("Schedule created successfully.", "success");
                    const updated = [...scheduleData];
                    updated[index] = { ...row, isEditing: false, isAdded: true };
                    setScheduleData(updated);
                })
                .catch((err) => {
                    console.error(err);

                    const msg =
                        err.response?.data?.message ||
                        err.response?.data?.error ||
                        err.message ||
                        "Error creating schedule.";
                    console.log(msg);
                    showMessage(msg, "danger");
                });
        }
    };

    const handleUpdateRow = (index) => {
        const updated = [...scheduleData];
        // only allow editing for future schedules (incoming)
        const row = updated[index];
        // if row has scheduleId (i.e. incoming from backend) and date is in past, disallow
        if (row.scheduleId) {
            const rowDate = new Date(row.scheduleDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (rowDate < today) {
                showMessage("Cannot edit past schedules.", "warning");
                return;
            }
        }
        updated[index].isEditing = true;
        setScheduleData(updated);
    };

    const handleRemoveRow = (index) => {
        setScheduleData((prev) => prev.filter((_, i) => i !== index));
    };

    // ------------ NEW: Fetch schedules (paged) from backend ------------
    const normalizeBackendPage = (resp) => {
        // Try to be resilient to different shapes from callBackendService
        // Accept resp.content OR resp.result?.content OR resp.page/content
        if (!resp) return null;
        if (resp.content) return resp;
        if (resp.result?.content) return resp.result;
        if (resp.page?.content) return resp.page;
        // if resp itself is page-like
        if (Array.isArray(resp)) {
            // not a page, treat as single page
            return { content: resp, totalPages: 1, totalElements: resp.length, number: 0, size: resp.length };
        }
        return null;
    };

    const fetchSchedules = async (pageToFetch = 0) => {
        if (!selectedBatchCycleName || !selectedCourseName || !startDate || !endDate) {
            showMessage("Please provide batch cycle, course, start date and end date for fetching schedules.", "warning");
            return;
        }

        // Build params
        const params = {
            batchCycleName: selectedBatchCycleName,
            courseName: selectedCourseName,
            startDate,
            endDate,
            page: pageToFetch,
            size,
        };

        try {
            // Prefer callBackendService if available in project
            const resp = await callBackendService("get", `${API_ENDPOINTS.SCHEDULES}/by-date`, { params });
            const page = normalizeBackendPage(resp);

            // If callBackendService returned response envelope, try axios style
            // fallback: if resp.data exists
            let finalPage = page;
            if (!finalPage && resp?.data) finalPage = normalizeBackendPage(resp.data);

            // If still null, try a direct axios call (last resort)
            let axiosResp = null;
            if (!finalPage) {
                axiosResp = await axios.get(`${API_ENDPOINTS.SCHEDULES}/by-date`, { params });
                finalPage = normalizeBackendPage(axiosResp.data);
            }

            if (!finalPage) {
                showMessage("Unexpected response from server when fetching schedules.", "danger");
                return;
            }

            // Map backend schedule items into your table row shape
            const incoming = finalPage.content.map((s) => {
                // try different field names for id
                const scheduleId = s.scheduleId ?? s.id ?? s.schedule_id ?? s.id;
                const ts = s.timeSlot ?? s.time_slot ?? s.timeslot ?? s.timeSlot;
                const start = ts?.startTime ?? ts?.start_time ?? "";
                const end = ts?.endTime ?? ts?.end_time ?? "";
                const slotName = ts?.slotName ?? ts?.slot_name ?? "";

                // determine editable: only allow edit for future schedules
                const rowDate = new Date(s.scheduleDate);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const editable = rowDate >= today;

                return {
                    scheduleId,
                    scheduleDate: s.scheduleDate,
                    activity: s.activity,
                    courseName: s.courseName,
                    staffNames: s.staffNames ?? s.staff_names ?? [],
                    moduleName: s.moduleName ?? s.module_name ?? "",
                    infrastructureName: s.infrastructureName ?? s.infrastructure_name ?? "",
                    batchCycleName: s.batchCycleName ?? s.batch_cycle_name ?? s.batchCycleName,
                    studentGroups: s.studentGroups ?? s.student_groups ?? [],
                    timeSlot: ts,
                    startTime: start,
                    endTime: end,
                    slotName,
                    cycleName: s.batchCycleName ?? s.batch_cycle_name ?? "",
                    isEditing: false,
                    isAdded: true,
                    editable, // custom flag - you may use to show/hide edit button in table
                };
            });

            // Replace table data with fetched page
            setScheduleData(incoming);

            // Pagination meta
            setTotalPages(finalPage.totalPages ?? (finalPage.totalElements ? Math.ceil(finalPage.totalElements / size) : 1));
            setTotalElements(finalPage.totalElements ?? incoming.length);
            setPage(finalPage.number ?? pageToFetch);
            setShowPagination(true);
        } catch (err) {
            console.error("Error fetching schedules:", err);
            showMessage("Error fetching schedules.", "danger");
        }
    };

    // Pagination controls handlers
    const goToPage = (p) => {
        if (p < 0 || p >= totalPages) return;
        fetchSchedules(p);
    };

    const prevPage = () => {
        if (page > 0) goToPage(page - 1);
    };

    const nextPage = () => {
        if (page < totalPages - 1) goToPage(page + 1);
    };

    // When user changes size, reset to first page and fetch
    const handleSizeChange = (newSize) => {
        const n = Number(newSize) || 1;
        setSize(n);

    };
    const today = new Date().toISOString().split("T")[0];
    const handleAction = () => {
        if (mode === "get") {
            fetchSchedules(0);
        } else {
            addScheduleForDateRange();
        }
    };

    const generatePDF = () => {
        if (!scheduleData || scheduleData.length === 0) {
            showMessage("No schedule data to export.", "warning");
            return;
        }

        const doc = new jsPDF("p", "mm", "a4");

        // === Heading Info ===
        const batchCycleHeading = `Batch Cycle: ${selectedBatchCycleName || "-"}`;
        const courseHeading = `Course: ${selectedCourseName || "-"}`;

        doc.setFontSize(12);
        doc.text(batchCycleHeading, 14, 15);
        doc.text(courseHeading, 14, 22);

        // === Table Columns ===
        const columns = [
            { header: "Date", dataKey: "scheduleDate" },
            { header: "Start Time", dataKey: "startTime" },
            { header: "End Time", dataKey: "endTime" },
            { header: "Slot", dataKey: "slotName" },
            { header: "Staff", dataKey: "staffNames" },
            { header: "Group", dataKey: "studentGroups" },
            { header: "Module", dataKey: "moduleName" },
            { header: "Activity", dataKey: "activity" },
            { header: "Venue", dataKey: "infrastructureName" },

        ];

        // === Map rows from scheduleData ===
        const rows = scheduleData.map((row) => ({
            scheduleDate: row.scheduleDate,
            startTime: row.startTime,
            endTime: row.endTime,
            staffNames: Array.isArray(row.staffNames) ? row.staffNames.join(", ") : row.staffNames,
            studentGroups: Array.isArray(row.studentGroups) ? row.studentGroups.join(", ") : row.studentGroups,
            moduleName: row.moduleName,
            activity: row.activity,
            infrastructureName: row.infrastructureName,
            slotName: row.slotName,
        }));

        // === Add Table ===
        autoTable(doc, {
            head: [columns.map(c => c.header)],
            body: rows.map(r => columns.map(c => r[c.dataKey] || "")),
            startY: 36, // start below headings
            styles: { fontSize: 9, cellPadding: 3, overflow: 'linebreak' },
            headStyles: { fillColor: [52, 58, 64], textColor: 255, halign: "center" },
            columnStyles: {
                0: { cellWidth: 22 }, // Date
                1: { cellWidth: 18 }, // Start Time
                2: { cellWidth: 18 }, // End Time
                3: { cellWidth: 20 }, // Staff
                4: { cellWidth: 28 }, // Group
                5: { cellWidth: 18 }, // Module
                6: { cellWidth: 18 }, // Activity
                7: { cellWidth: 22 }, // Venue
                8: { cellWidth: 28 }, // Slot
            },
            theme: "grid",
            margin: { top: 36, left: 5, right: 10, bottom: 20 },
            didDrawPage: (data) => {
                const pageCount = doc.internal.getNumberOfPages();
                doc.setFontSize(9);
                doc.text(
                    `Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`,
                    200,
                    290,
                    { align: "right" }
                );
            },
        });

        // === Save PDF ===
        doc.save("schedule.pdf");
    };

    return (
        <div
            className="container-fluid p-3"
            style={{ maxWidth: 1320, margin: "auto" }}
        >
            <h4 className="mb-3 text-center">Scheduling</h4>

            {/* ===== Form Fields ===== */}
            <div className="row g-2 align-items-center mb-3">
                <div className="col-md-2">
                    <label className="form-label mb-1">
                        Batch <span className="text-danger">*</span>
                    </label>
                    <select
                        className="form-select form-select-sm"
                        value={selectedBatchCycleId}
                        onChange={(e) => {
                            const id = e.target.value;
                            setSelectedBatchCycleId(id);

                            // find the name from batchCycles list
                            const cycle = batchCycles.find(
                                (b) => String(b.batchCycleId) === id
                            );
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

                {/* Start Date */}
                <div className="w-auto">
                    <label className="form-label mb-1" style={{ fontSize: "12px" }}>
                        Start Date
                    </label>
                    <input
                        type="date"
                        className="form-control form-control-sm"
                        value={startDate}
                        min={mode === "generate" ? today : undefined}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>

                {/* End Date */}
                <div className="w-auto">
                    <label className="form-label mb-1" style={{ fontSize: "12px" }}>
                        End Date
                    </label>
                    <input
                        type="date"
                        className="form-control form-control-sm"
                        value={endDate}
                        min={mode === "generate" ? today : undefined}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <div className="w-auto">
                    <label className="form-label mb-1">Skip Date</label>
                    <input
                        type="date"
                        className="form-control form-control-sm"
                        onChange={(e) => {
                            if (e.target.value) {
                                handleSkipDateChange(e.target.value);
                                e.target.value = "";
                            }
                        }}
                    />
                </div>
                {/* Action Button */}
                <div className="w-auto d-grid   ">
                    <button
                        className="btn btn-primary btn-sm "
                        onClick={handleAction}
                        disabled={!selectedBatchCycleName || !selectedCourseName || !startDate || !endDate}
                    >
                        {mode === "get" ? "Get Schedules" : "Generate Schedule"}
                    </button>
                </div>
            </div>


            {/* ===== GET SCHEDULES BUTTON & PAGE SIZE INPUT ===== */}
            <div className="row align-items-end g-2 mb-3">
                {/* Mode Toggle */}
                <div className="w-auto">
                    <label className="form-label mb-1" style={{ fontSize: "12px" }}>
                        Action
                    </label>
                    <select
                        className="form-select form-select-sm no-arrow"
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                    >
                        <option value="get">Get Schedule</option>
                        <option value="generate">Generate Schedule</option>
                    </select>
                </div>

                <div className="d-grid mt-2" style={{ width: "60px" }}>
                    <label className="form-label mb-1" style={{ fontSize: "12px" }} >Page Size</label>
                    <input
                        type="number"
                        min="1"
                        className="form-control form-control-sm"
                        title="Page size"
                        value={size}
                        onChange={(e) => handleSizeChange(e.target.value)}
                    />
                </div>
                {/* Export PDF Button */}
                <div className="w-auto d-grid">
                    <button className="btn btn-secondary btn-sm" onClick={generatePDF}>
                        Export PDF
                    </button>
                </div>

            </div>

            {/* ===== Skip Dates ===== */}
            {skipDates.length > 0 && (
                <div className="mb-3">
                    <div className="d-flex flex-wrap gap-2">
                        {skipDates.map((dt) => (
                            <span
                                key={dt}
                                className="badge bg-danger d-flex align-items-center"
                            >
                                {dt}
                                <button
                                    type="button"
                                    className="btn-close btn-close-white btn-sm ms-1"
                                    onClick={() => handleSkipDateChange(dt)}
                                    title="Remove"
                                    style={{ fontSize: "0.6rem" }}
                                />
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* ===== Schedule Table ===== */}
            <div style={{ marginLeft: "25px", marginRight: "10px" }}>
                <ScheduleTable
                    scheduleData={scheduleData}
                    onAddRow={handleAddRow}
                    onCellChange={handleCellChange}
                    onDeleteRow={handleDeleteRow}
                    onRemoveRow={handleRemoveRow}
                    onSaveRow={handleSaveRow}
                    onUpdateRow={handleUpdateRow}
                    staffList={staffOptions}
                    moduleOptions={moduleOptions}
                    groupOptions={groupOptions}
                    activityOptions={activityOptions}
                    venueOptions={venueOptions}
                    timeSlotOptions={timeSlotOptions}
                />
            </div>

            {/* ===== Pagination Controls (outside table) ===== */}
            {showPagination && totalPages > 0 && (
                <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
                    <button className="btn btn-sm btn-outline-primary" onClick={prevPage} disabled={page === 0}>
                        &lt; Prev
                    </button>

                    {/* page numbers 1..totalPages */}
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            className={`btn btn-sm ${i === page ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={() => goToPage(i)}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button className="btn btn-sm btn-outline-primary" onClick={nextPage} disabled={page >= totalPages - 1}>
                        Next &gt;
                    </button>
                </div>
            )}

            {/* Toast */}
            <ToastMessage
                message={message?.text}
                type={message?.type}
                onClose={() => setMessage(null)}
            />

            {/* Confirm Delete Modal */}
            <ConfirmModal
                show={showConfirm}
                onHide={() => setShowConfirm(false)}
                onConfirm={confirmDelete}
                message="Are you sure you want to delete this schedule?"
            />
        </div>
    );
};

export default Scheduling;
