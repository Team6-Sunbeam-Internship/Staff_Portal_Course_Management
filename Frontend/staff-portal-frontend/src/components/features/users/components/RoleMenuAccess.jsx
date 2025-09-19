import { useEffect, useState } from "react";
import { FaEdit, FaSyncAlt, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  getAllRoleMenuAccess,
  createRoleMenuAccess,
  updateRoleMenuAccessStatus,
  deleteRoleMenuAccess,
  getRoleMenuAccessByRole,
} from "../../../../services/api/RoleMenuAccess";
import Pagination from "../../../common/Pagination/Pagination";
import Table from "../../../common/Table/Table";

import SearchableMenuItemSelect from "./SearchableMenuItemSelect";

function RoleMenuAccess() {
  const [accessList, setAccessList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [accessId, setAccessId] = useState("");
  const [roleName, setRoleName] = useState("");
  const [menuItemId, setMenuItemId] = useState("");
  const [status, setStatus] = useState("ALLOWED");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [roleFilter, setRoleFilter] = useState("");

  // Columns for the table
  const columns = [
    { key: "roleName", label: "Role Name", className: "w-32" },
    {
      key: "menuItemTitle",
      label: "Menu Item",
      className: "w-48",
      render: (item) => item.menuItem?.title || item.menuItemTitle,
    },
    {
      key: "status",
      label: "Status",
      className: "w-28",
      render: (item) => (
        <span
          className={`px-2 py-1 rounded text-white ${
            item.status === "ALLOWED" ? "bg-green-800" : "bg-red-800"
          }`}
        >
          {item.status}
        </span>
      ),
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = Array.isArray(accessList)
    ? accessList.slice(indexOfFirst, indexOfLast)
    : [];
  const totalPages = Array.isArray(accessList)
    ? Math.ceil(accessList.length / recordsPerPage)
    : 0;

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAllRoleMenuAccess();
      setAccessList(data);
    } catch (error) {
      console.error("Error loading data:", error);
      if (error.response) {
        if (error.response.status === 404) {
          toast.error(
            "API endpoint not found. Please check your backend configuration."
          );
        } else {
          toast.error(
            `Failed to load role-menu access: ${error.response.status}`
          );
        }
      } else if (error.request) {
        toast.error(
          "Cannot connect to server. Please ensure your backend is running."
        );
      } else {
        toast.error("Failed to load role-menu access");
      }
      setAccessList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (selectedRole) => {
    setRoleFilter(selectedRole);
    try {
      setLoading(true);
      if (selectedRole) {
        const filteredData = await getRoleMenuAccessByRole(selectedRole);
        setAccessList(filteredData);
      } else {
        await loadData();
      }
    } catch (error) {
      console.error("Error filtering by role:", error);
      toast.error("Failed to filter by role");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = async () => {
    setRoleFilter("");
    await loadData();
  };

  useEffect(() => {
    document.title = "Role Menu Access";
    loadData();
  }, []);

  const clearForm = () => {
    setAccessId("");
    setRoleName("");
    setMenuItemId("");
    setStatus("ALLOWED");
    setIsEditMode(false);
  };

  const onSave = async () => {
    if (!roleName || !menuItemId || !status) {
      toast.warn("Please fill all fields");
      return;
    }

    const payload = {
      roleName,
      menuItemId: parseInt(menuItemId, 10),
      status,
    };

    try {
      setLoading(true);
      if (isEditMode) {
        await updateRoleMenuAccessStatus(accessId, status);
        toast.success("Status updated successfully");
      } else {
        await createRoleMenuAccess(payload);
        toast.success("Role menu access created successfully");
      }
      await loadData();
      setShowForm(false);
      clearForm();
    } catch (err) {
      console.error("Save error:", err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error(isEditMode ? "Failed to update" : "Failed to create");
      }
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (item) => {
    setAccessId(item.accessId);
    setRoleName(item.roleName);
    setMenuItemId(item.menuItem?.menuItemId || item.menuItemId);
    setStatus(item.status);
    setIsEditMode(true);
    setShowForm(true);
  };

  const requestDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setItemToDelete(null);
    setShowDeleteModal(false);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setLoading(true);
      await deleteRoleMenuAccess(itemToDelete.accessId);
      toast.success("Deleted successfully");
      await loadData();
    } catch (err) {
      console.error("Delete error:", err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to delete");
      }
    } finally {
      setLoading(false);
      cancelDelete();
    }
  };

  const roleOptions = ["ADMIN", "COURSE_COORDINATOR", "GENERAL_USER"];

  return (
    <div className="container mx-auto mt-6 px-4">
      <h2 className="text-2xl font-bold text-center mb-4">Role Menu Access</h2>

      <div className="mb-4">
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          onClick={() => {
            clearForm();
            setShowForm(true);
          }}
        >
          Add New
        </button>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-md p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-lg font-semibold">
                {isEditMode ? "Edit Role Access" : "Add Role Access"}
              </h5>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Role Name</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  disabled={isEditMode}
                >
                  <option value="">Select Role</option>
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              {!isEditMode && (
                <div>
                  <label className="block mb-1 font-medium">Menu Item</label>
                  <SearchableMenuItemSelect
                    value={menuItemId}
                    onChange={setMenuItemId}
                    placeholder="Search and select menu item..."
                  />
                </div>
              )}

              <div>
                <label className="block mb-1 font-medium">Status</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="ALLOWED">ALLOWED</option>
                  <option value="BLOCKED">BLOCKED</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
                onClick={onSave}
                disabled={loading}
              >
                {loading ? "Saving..." : isEditMode ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center">
            <h5 className="text-lg font-bold mb-2">Delete Role Access</h5>
            {itemToDelete && (
              <p className="mb-2">
                Delete <strong>{itemToDelete.roleName}</strong> access for{" "}
                <strong>
                  {itemToDelete.menuItem?.title ||
                    itemToDelete.menuItemTitle ||
                    `Menu ID: ${
                      itemToDelete.menuItem?.menuItemId ||
                      itemToDelete.menuItemId
                    }`}
                </strong>
                ?
              </p>
            )}
            <p className="text-red-600 text-sm mb-4">
              Warning: This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded disabled:opacity-50"
                onClick={cancelDelete}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded disabled:opacity-50"
                onClick={confirmDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="mb-4 flex items-center gap-2">
        <label className="font-medium">Filter by Role:</label>
        <select
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={roleFilter}
          onChange={(e) => handleRoleChange(e.target.value)}
        >
          <option value="">All</option>
          {roleOptions.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 p-2 rounded flex items-center justify-center"
          title="Clear Filter"
          onClick={clearFilters}
          disabled={loading}
        >
          <FaSyncAlt size={18} />
        </button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={currentRecords}
        loading={loading}
        onEdit={onEdit}
        onDelete={requestDelete}
        indexOffset={indexOfFirst}
      />
      {/* <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3 border">#</th>
              <th className="py-2 px-3 border">Role Name</th>
              <th className="py-2 px-3 border">Menu Item</th>
              <th className="py-2 px-3 border">Status</th>
              <th className="py-2 px-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="py-4">
                  Loading...
                </td>
              </tr>
            ) : !Array.isArray(accessList) || accessList.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-4">
                  No data found
                </td>
              </tr>
            ) : (
              currentRecords.map((item, idx) => (
                <tr key={item.accessId} className="hover:bg-gray-50">
                  <td className="py-2 px-3 border">{indexOfFirst + idx + 1}</td>
                  <td className="py-2 px-3 border">{item.roleName}</td>
                  <td className="py-2 px-3 border">{item.menuItemTitle}</td>
                  <td className="py-2 px-3 border">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        item.status === "ALLOWED"
                          ? "bg-green-800"
                          : "bg-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 border flex justify-center gap-2">
                    <button
                      className="bg-yellow-400 hover:bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => onEdit(item)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-800 text-white px-2 py-1 rounded"
                      onClick={() => requestDelete(item)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
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

export default RoleMenuAccess;
