import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import {
  getAllStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  searchStaffByName,
} from "../../../../services/api/StaffService";
import Pagination from "../../../common/Pagination/Pagination";
import Table from "../../../common/Table/Table";

function ManageStaff() {
  const [staff, setStaff] = useState([]);
  const [originalStaff, setOriginalStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form fields
  const [staffId, setStaffId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [courseSpecialization, setCourseSpecialization] = useState("");
  const [staffType, setStaffType] = useState("");
  const [staffRole, setStaffRole] = useState("");

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);

  // Filter states
  const [nameFilter, setNameFilter] = useState("");
  const [courseSpecializationFilter, setCourseSpecializationFilter] =
    useState("");
  const [staffTypeFilter, setStaffTypeFilter] = useState("");
  const [staffRoleFilter, setStaffRoleFilter] = useState("");
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
 
  //Columns for the table
  const columns = [
    {
      key: "fullName",
      label: "Name",
      className: "w-48",
      render: (s) => `${s.firstName} ${s.lastName}`,
    },
    { key: "email", label: "Email", className: "w-48" },
    { key: "phone", label: "Mobile" },
    { key: "courseSpecialization", label: "Course Specialization" },
    { key: "staffType", label: "Type" },
    { key: "staffRole", label: "Role" },
  ];

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = Array.isArray(staff)
    ? staff.slice(indexOfFirst, indexOfLast)
    : [];
  const totalPages = Array.isArray(staff)
    ? Math.ceil(staff.length / recordsPerPage)
    : 0;

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    document.title = "Manage Staff";
    loadStaff();
  }, []);

  // Check if any filters are active
  useEffect(() => {
    const activeFilters =
      nameFilter ||
      courseSpecializationFilter ||
      staffTypeFilter ||
      staffRoleFilter;
    setHasActiveFilters(!!activeFilters);
  }, [
    nameFilter,
    courseSpecializationFilter,
    staffTypeFilter,
    staffRoleFilter,
  ]);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const data = await getAllStaff();
      setStaff(data);
      setOriginalStaff(data);
    } catch (error) {
      toast.error("Failed to load staff");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // All filters to the original data
  const applyFilters = () => {
    let filteredData = [...originalStaff];

    // Course specialization filter (case insensitive partial match)
    if (courseSpecializationFilter) {
      filteredData = filteredData.filter(
        (s) =>
          s.courseSpecialization &&
          s.courseSpecialization
            .toLowerCase()
            .includes(courseSpecializationFilter.toLowerCase())
      );
    }

    // Staff type filter
    if (staffTypeFilter) {
      filteredData = filteredData.filter(
        (s) => s.staffType === staffTypeFilter
      );
    }

    // Role filter
    if (staffRoleFilter) {
      filteredData = filteredData.filter(
        (s) => s.staffRole === staffRoleFilter
      );
    }

    setStaff(filteredData);
    setCurrentPage(1);
  };

  // Search by name using API
  const handleNameSearch = async () => {
    const trimmedName = nameFilter.trim();

    if (!trimmedName) {
      // If name filter is empty, apply other filters to original data
      let filteredData = [...originalStaff];

      if (courseSpecializationFilter) {
        filteredData = filteredData.filter(
          (s) =>
            s.courseSpecialization &&
            s.courseSpecialization
              .toLowerCase()
              .includes(courseSpecializationFilter.toLowerCase())
        );
      }

      if (staffTypeFilter) {
        filteredData = filteredData.filter(
          (s) => s.staffType === staffTypeFilter
        );
      }

      if (staffRoleFilter) {
        filteredData = filteredData.filter(
          (s) => s.staffRole === staffRoleFilter
        );
      }

      setStaff(filteredData);
      return;
    }

    try {
      setLoading(true);
      const searchResults = await searchStaffByName(trimmedName);

      // Other filters to search results
      let filteredResults = searchResults;

      if (courseSpecializationFilter) {
        filteredResults = filteredResults.filter(
          (s) =>
            s.courseSpecialization &&
            s.courseSpecialization
              .toLowerCase()
              .includes(courseSpecializationFilter.toLowerCase())
        );
      }

      if (staffTypeFilter) {
        filteredResults = filteredResults.filter(
          (s) => s.staffType === staffTypeFilter
        );
      }

      if (staffRoleFilter) {
        filteredResults = filteredResults.filter(
          (s) => s.staffRole === staffRoleFilter
        );
      }

      if (filteredResults.length === 0) {
        toast.info(`No staff found matching the criteria`);
      }

      setStaff(filteredResults);
      setCurrentPage(1);
    } catch (error) {
      if (error.response?.status === 404) {
        toast.info(`No staff found for name: ${trimmedName}`);
        setStaff([]);
      } else {
        toast.error("Failed to search staff by name");
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setNameFilter("");
    setCourseSpecializationFilter("");
    setStaffTypeFilter("");
    setStaffRoleFilter("");
    setStaff(originalStaff);
    setCurrentPage(1);
  };

  // Handle filter changes
  useEffect(() => {
    if (!nameFilter) {
      // If no name filter, apply other filters to original data
      applyFilters();
    }
  }, [courseSpecializationFilter, staffTypeFilter, staffRoleFilter]);

  const clearForm = () => {
    setStaffId("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setCourseSpecialization("");
    setStaffType("");
    setStaffRole("");
    setIsEditMode(false);
  };

  const onSave = async () => {
    if (!firstName || !lastName || !email || !staffType || !staffRole) {
      toast.warn("Please fill all required fields");
      return;
    }

    const staffData = {
      firstName,
      lastName,
      email,
      phone,
      courseSpecialization,
      staffType,
      staffRole,
    };

    try {
      setLoading(true);
      if (isEditMode) {
        await updateStaff(staffId, staffData);
        toast.success("Staff updated successfully");
      } else {
        await createStaff(staffData);
        toast.success("Staff added successfully");
      }
      await loadStaff();
      setShowForm(false);
      clearForm();
    } catch (err) {
      toast.error(
        isEditMode ? "Failed to update staff" : "Failed to add staff"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (staffMember) => {
    setStaffId(staffMember.staffId);
    setFirstName(staffMember.firstName);
    setLastName(staffMember.lastName);
    setEmail(staffMember.email);
    setPhone(staffMember.phone);
    setCourseSpecialization(staffMember.courseSpecialization);
    setStaffType(staffMember.staffType);
    setStaffRole(staffMember.staffRole);
    setIsEditMode(true);
    setShowForm(true);
  };

  const requestDelete = (staffMember) => {
    setStaffToDelete(staffMember);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setStaffToDelete(null);
    setShowDeleteModal(false);
  };

  const confirmDelete = async () => {
    if (!staffToDelete) return;
    try {
      setLoading(true);
      await deleteStaff(staffToDelete.staffId);
      toast.success("Staff deleted successfully");
      await loadStaff();
    } catch (err) {
      toast.error("Failed to delete staff");
      console.error(err);
    } finally {
      setLoading(false);
      cancelDelete();
    }
  };

  const staffTypeOptions = ["INHOUSE", "VISITING"];
  const roleOptions = ["ADMIN", "COURSE_COORDINATOR", "GENERAL_USER"];

  return (
    <div className="max-w-7xl mx-auto mt-6 px-4">
      <h2 className="text-2xl font-bold text-center mb-6">Manage Staff</h2>

      {/* Add button */}
      <div className="mb-4">
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow rounded"
          onClick={() => {
            clearForm();
            setShowForm(true);
          }}
        >
          Add Staff
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white shadow rounded-lg p-6">
        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Search by Name
            </label>
            <div className="flex">
              <input
                type="text"
                placeholder="Enter first name, last name, or full name..."
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleNameSearch()}
                className="flex-grow border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleNameSearch}
                disabled={loading}
                title="Search by Name"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg"
              >
                <FaSearch />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Search by Course Specialization
            </label>
            <input
              type="text"
              placeholder="Enter course specialization..."
              value={courseSpecializationFilter}
              onChange={(e) => setCourseSpecializationFilter(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-sm font-medium mb-2">
              Filter by Staff Type
            </label>
            <select
              value={staffTypeFilter}
              onChange={(e) => setStaffTypeFilter(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Staff Types</option>
              {staffTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Filter by Role
            </label>
            <select
              value={staffRoleFilter}
              onChange={(e) => setStaffRoleFilter(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={clearAllFilters}
              disabled={loading}
              title="Clear All Filters"
              className="border px-4 py-2 rounded hover:bg-gray-300 text-blue-800"
            >
              Clear Filters
            </button>
            {hasActiveFilters && (
              <span className="text-sm text-gray-500">
                Showing {staff.length} of {originalStaff.length} staff members
              </span>
            )}
          </div>
        </div>
      </div>

      <hr className="my-6" />

      {/* Staff Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-6 py-4">
              <h5 className="text-lg font-semibold">
                {isEditMode ? "Edit Staff" : "Add Staff"}
              </h5>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Mobile
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium mb-2">
                    Course Specialization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., PGDAC OR Multiple"
                    value={courseSpecialization}
                    onChange={(e) => setCourseSpecialization(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={staffType}
                    onChange={(e) => setStaffType(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Type</option>
                    <option value="INHOUSE">INHOUSE</option>
                    <option value="VISITING">VISITING</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <select
                    value={staffRole}
                    onChange={(e) => setStaffRole(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Role</option>
                    <option value="ADMIN">Admin</option>
                    <option value="COURSE_COORDINATOR">
                      CourseCoordinator
                    </option>
                    <option value="GENERAL_USER">GeneralUser</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 px-6 py-4">
              <button
                className="border px-4 py-2 rounded-lg hover:bg-gray-100"
                onClick={clearForm}
              >
                Clear
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
                onClick={onSave}
                disabled={loading}
              >
                {loading ? "Saving..." : isEditMode ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
                <FaTrash size={32} className="text-red-600" />
              </div>
            </div>
            <h4 className="text-lg font-bold mb-3">Delete Staff</h4>
            <p className="text-gray-500 mb-3">
              Are you sure you want to permanently delete this staff member?
            </p>
            {staffToDelete && (
              <div className="bg-gray-100 rounded-lg p-4 mb-4 text-left">
                <strong className="block text-blue-600">
                  {staffToDelete.firstName} {staffToDelete.lastName}
                </strong>
                <small className="block text-gray-500">
                  {staffToDelete.email}
                </small>
                <small className="block text-gray-500">
                  Role: {staffToDelete.staffRole}
                </small>
              </div>
            )}
            <p className="text-sm text-red-600 mb-4">
              <strong>Warning:</strong> This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelDelete}
                disabled={loading}
                className="border px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg min-w-[100px]"
              >
                {loading ? "Deleting..." : "Delete Staff"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Table */}
      <Table
        columns={columns}
        data={currentRecords}
        loading={loading}
        onEdit={onEdit}
        onDelete={requestDelete}
        indexOffset={indexOfFirst}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default ManageStaff;
