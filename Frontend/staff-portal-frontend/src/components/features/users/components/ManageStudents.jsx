import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaSyncAlt } from "react-icons/fa";
import {
  importStudentsFile,
  getAllStudents,
  deleteStudent,
  saveStudent,
  updateStudent,
  // getAllCourses // This method used while i am using real courses from backend
  getInactiveStudents,
  getActiveStudents,
} from "../../../../services/api/StudentService";
import Pagination from "../../../common/Pagination/Pagination";
import Table from "../../../common/Table/Table";

function ManageStudents() {
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [studentName, setStudentName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [batchCycleName, setBatchCycleName] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const [statusFilter, setStatusFilter] = useState(""); // ACTIVE, INACTIVE

  // Columns for the table
  const columns = [
  { key: "registrationNumber", label: "Reg. No", className: "w-28" },
  { key: "studentName", label: "Name", className: "w-56" },
  { key: "email", label: "Email", className: "w-48" },
  { key: "mobileNumber", label: "Mobile", className: "w-28" },
  { key: "batchCycleName", label: "BatchCycle", className: "w-28" },
  { key: "courseName", label: "Course", className: "w-28" },
  {
    key: "status",
    label: "Status",
    className: "w-24",
    render: (item) => (item.status === "ACTIVE" ? "Active" : "Inactive"),
  },
  { key: "address", label: "Address", className: "w-68" },
];

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  useEffect(() => {
    document.title = "Manage Students";
    const fetchInitial = async () => {
      await loadStudents();
      await loadCourses();
    };
    fetchInitial();
  }, []);

  // Remove this method while using real courses from backend
  function getAllCourses() {
    return [
      { courseName: "PGDAC" },
      { courseName: "PGDBDA" },
      { courseName: "PGDMC" },
    ];
  }

  const loadCourses = async () => {
    try {
      const data = await getAllCourses();
      setCourses(data);
    } catch (err) {
      toast.error("Failed to load courses");
      console.error(err);
    }
  };

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await getAllStudents();
      setStudents(data);
    } catch (error) {
      toast.error("Failed to load students");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination calculations
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = students.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(students.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedExtensions = ["csv", "xlsx", "xls"];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      toast.warn("Invalid file type. Please upload a .csv or .xlsx file.");
      e.target.value = null;
      return;
    }

    try {
      setLoading(true);
      const result = await importStudentsFile(file);
      toast.success(
        `Import completed: ${result.successfulImports} successful, ${result.failedImports} failed.`
      );
      await loadStudents();
    } catch (err) {
      toast.error("Error importing students");
      console.error(err);
    } finally {
      setLoading(false);
      e.target.value = null;
    }
  };

  const handleStatusChange = async (status) => {
    setStatusFilter(status);

    try {
      setLoading(true);
      let data = [];

      if (status === "ACTIVE") {
        data = await getActiveStudents();
      } else if (status === "INACTIVE") {
        data = await getInactiveStudents();
      } else {
        data = await getAllStudents();
      }

      setStudents(data);
    } catch (error) {
      console.error("Error fetching students by status:", error);
      toast.error("Failed to fetch filtered students");
    } finally {
      setLoading(false);
    }
  };

  const onClear = () => {
    setRegistrationNumber("");
    setStudentName("");
    setEmail("");
    setMobileNumber("");
    setAddress("");
    setBatchCycleName("");
    setStatus("ACTIVE");
    setCourseName("");
    setIsEditMode(false);
  };

  const onSave = async () => {
    if (
      !registrationNumber ||
      !studentName ||
      !email ||
      !mobileNumber ||
      !batchCycleName ||
      !courseName ||
      !address
    ) {
      toast.warn("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const studentData = {
        registrationNumber,
        studentName,
        email,
        mobileNumber,
        address,
        batchCycleName,
        courseName,
        status,
      };

      if (isEditMode) {
        await updateStudent(registrationNumber, studentData);
        toast.success("Student updated successfully");
      } else {
        await saveStudent(studentData);
        toast.success("Student saved successfully");
      }

      await loadStudents();
      onClear();
      setShowForm(false);
    } catch (err) {
      toast.error(
        isEditMode ? "Failed to update student" : "Failed to save student"
      );
      console.error("Save/Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = (s) => {
    setRegistrationNumber(s.registrationNumber || "");
    setStudentName(s.studentName || "");
    setEmail(s.email || "");
    setMobileNumber(s.mobileNumber || "");
    setAddress(s.address || "");
    setBatchCycleName(s.batchCycleName || "");
    setStatus(s.status || "ACTIVE");
    setCourseName(s.courseName || "");
    setIsEditMode(true);
    setShowForm(true);
  };

  const onDelete = (s) => {
    setStudentToDelete(s);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    try {
      setLoading(true);
      await deleteStudent(studentToDelete.registrationNumber);
      toast.success("Student deleted successfully");
      await loadStudents();
      setShowDeleteModal(false);
      setStudentToDelete(null);
    } catch (err) {
      toast.error("Failed to delete student");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setStudentToDelete(null);
  };

  return (
    <div className="container mx-auto mt-6 px-4">
      <h2 className="text-2xl font-bold text-center mb-4">Manage Students</h2>

      <div className="mb-4 flex items-center gap-3">
        <label
          htmlFor="importFile"
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition"
        >
          {loading ? "Processing..." : "Import Students"}
        </label>
        <input
          id="importFile"
          type="file"
          accept=".csv,.xlsx"
          className="hidden"
          onChange={handleFileChange}
          disabled={loading}
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          onClick={() => {
            onClear();
            setShowForm(true);
          }}
          disabled={loading}
        >
          Add Student
        </button>
        {loading && (
          <div className="w-5 h-5 border-2 border-t-2 border-gray-300 rounded-full animate-spin"></div>
        )}
      </div>

      {showForm && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-3xl overflow-y-auto max-h-[90vh] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-lg font-semibold">
                {isEditMode ? "Update Student" : "Add Student"}
              </h5>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">
                  Registration Number
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  disabled={isEditMode}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Student Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Mobile</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Batch Cycle</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., MAR-2024 or AUG-2024"
                  value={batchCycleName}
                  onChange={(e) => setBatchCycleName(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Course Name</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                >
                  <option value="">Select Course</option>
                  {courses.map((c, index) => (
                    <option key={index} value={c.courseName || c.name}>
                      {c.courseName || c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Status</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Address</label>
                <textarea
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                onClick={onClear}
              >
                Clear
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                onClick={onSave}
                disabled={loading}
              >
                {loading
                  ? isEditMode
                    ? "Updating..."
                    : "Saving..."
                  : isEditMode
                  ? "Update"
                  : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                <FaTrash size={32} className="text-red-600" />
              </div>
              <h4 className="font-bold text-lg mb-2">Delete Student Record</h4>
              <p className="text-gray-500 mb-2">
                Are you certain you want to permanently delete this student
                record?
              </p>

              {studentToDelete && (
                <div className="bg-gray-100 rounded p-3 mb-4 text-left">
                  <strong className="block text-blue-600">
                    {studentToDelete.studentName}
                  </strong>
                  <small className="text-gray-500">
                    Reg. No: {studentToDelete.registrationNumber}
                  </small>
                  <br />
                  <small className="text-gray-500">
                    Course: {studentToDelete.courseName}
                  </small>
                </div>
              )}

              <p className="text-red-600 text-sm mb-4">
                <strong>Warning:</strong> This action cannot be undone.
              </p>

              <div className="flex justify-center gap-3">
                <button
                  className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                  onClick={cancelDelete}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                  onClick={confirmDelete}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete Student"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="mb-4 flex items-center gap-2">
        <label className="font-medium">Filter by Status:</label>
        <select
          className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <option value="">All</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        <button
          className="bg-gray-200 p-2 rounded hover:bg-gray-300 flex items-center justify-center"
          title="Reset Filter"
          onClick={() => handleStatusChange("")}
        >
          <FaSyncAlt size={16} />
        </button>
      </div>

      <hr className="mb-4" />

      {/* Table */}
      <Table
  columns={columns}
  data={currentRecords}
  loading={loading}
  onEdit={onUpdate}
  onDelete={onDelete}
  indexOffset={indexOfFirstRecord}
/>
      {/* <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1 text-center w-12">#</th>
              <th className="border px-2 py-1 w-28">Reg. No</th>
              <th className="border px-2 py-1 w-36">Name</th>
              <th className="border px-2 py-1 w-48">Email</th>
              <th className="border px-2 py-1 w-28">Mobile</th>
              <th className="border px-2 py-1 w-28">BatchCycle</th>
              <th className="border px-2 py-1 w-28">Course</th>
              <th className="border px-2 py-1 w-24">Status</th>
              <th className="border px-2 py-1 w-48">Address</th>
              <th className="border px-2 py-1 text-center w-24">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="text-center p-3">
                  Loading...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center p-3">
                  No students found
                </td>
              </tr>
            ) : (
              currentRecords.map((s, idx) => (
                <tr key={s.registrationNumber} className="hover:bg-gray-50">
                  <td className="border px-2 py-1 text-center">
                    {indexOfFirstRecord + idx + 1}
                  </td>
                  <td className="border px-2 py-1 truncate">
                    {s.registrationNumber}
                  </td>
                  <td className="border px-2 py-1 truncate">{s.studentName}</td>
                  <td className="border px-2 py-1 truncate">{s.email}</td>
                  <td className="border px-2 py-1 truncate">
                    {s.mobileNumber}
                  </td>
                  <td className="border px-2 py-1 truncate">
                    {s.batchCycleName}
                  </td>
                  <td className="border px-2 py-1 truncate">{s.courseName}</td>
                  <td className="border px-2 py-1 truncate">
                    {formatStatus(s.status)}
                  </td>
                  <td className="border px-2 py-1 truncate">{s.address}</td>
                  <td className="border px-2 py-1 text-center">
                    <div className="flex justify-center gap-1">
                      <button
                        className="bg-yellow-400 hover:bg-green-500 text-white px-2 py-1 rounded"
                        title="Edit"
                        onClick={() => onUpdate(s)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-800 text-white px-2 py-1 rounded"
                        title="Delete"
                        onClick={() => onDelete(s)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div> */}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default ManageStudents;
