import { useEffect, useState } from "react";
import { FaEdit, FaSyncAlt, FaTrash, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  getAllStaffMenuAccess,
  createStaffMenuAccess,
  updateStaffMenuAccessStatus,
  deleteStaffMenuAccess,
  searchStaffMenuAccessByName,
} from "../../../../services/api/StaffMenuAccess";
import SearchableStaffSelect from "./SearchableStaffSelect";
import SearchableMenuItemSelect from "./SearchableMenuItemSelect";
import Pagination from "../../../common/Pagination/Pagination";
import Table from "../../../common/Table/Table";

function StaffMenuAccess() {
  const [accessList, setAccessList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [accessId, setAccessId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [menuItemId, setMenuItemId] = useState("");
  const [status, setStatus] = useState("ALLOWED");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  // Columns for the table
  const columns = [
    {
      key: "staffName",
      label: "Staff Name",
      render: (item) => `${item.staffFirstName} ${item.staffLastName}`,
    },
    { key: "menuItemTitle", label: "Menu Item" },
    {
      key: "status",
      label: "Status",
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

  const handleSearch = async () => {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      loadData();
      return;
    }

    try {
      setLoading(true);
      const data = await searchStaffMenuAccessByName(trimmed);
      if (!data || data.length === 0) {
        toast.info(`No staff menu access records found for name: ${trimmed}`);
        setAccessList([]);
      } else {
        setAccessList(data);
      }
    } catch (err) {
      if (err?.response?.status === 404) {
        const msg =
          err.response?.data ||
          `No staff menu access records found for name: ${trimmed}`;
        toast.info(msg);
        setAccessList([]);
      } else if (err?.response?.status === 400) {
        toast.warning(err.response?.data || "Invalid search input");
      } else {
        toast.error("Failed to search staff menu access");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setSearchTerm("");
    loadData();
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const accessData = await getAllStaffMenuAccess();
      setAccessList(accessData);
    } catch {
      toast.error("Failed to load data from server");
      setAccessList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Staff Menu Access";
    loadData();
  }, []);

  const clearForm = () => {
    setAccessId("");
    setStaffId("");
    setMenuItemId("");
    setStatus("ALLOWED");
    setIsEditMode(false);
  };

  const onSave = async () => {
    if (!staffId || !menuItemId || !status) {
      toast.warn("Please fill all fields");
      return;
    }

    const payload = {
      staffId,
      menuItemId: parseInt(menuItemId, 10),
      status,
    };

    try {
      setLoading(true);
      if (isEditMode) {
        await updateStaffMenuAccessStatus(accessId, status);
        toast.success("Status updated successfully");
      } else {
        await createStaffMenuAccess(payload);
        toast.success("Staff menu access created successfully");
      }
      await loadData();
      setShowForm(false);
      clearForm();
    } catch {
      toast.error(isEditMode ? "Failed to update" : "Failed to create");
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (item) => {
    setAccessId(item.staffAccessId);
    setStaffId(item.staffId);
    setMenuItemId(item.menuItemId);
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
      await deleteStaffMenuAccess(itemToDelete.staffAccessId);
      toast.success("Deleted successfully");
      await loadData();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setLoading(false);
      cancelDelete();
    }
  };

  return (
    <div className="container mx-auto mt-6 px-4">
      <h2 className="text-2xl font-bold text-center mb-4">Staff Menu Access</h2>

      <div className="mb-4">
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          onClick={() => {
            clearForm();
            setShowForm(true);
          }}
        >
          Add Staff Access
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
                {isEditMode ? "Edit Staff Access" : "Add Staff Access"}
              </h5>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {!isEditMode && (
                <div>
                  <label className="block mb-1 font-medium">Staff</label>
                  <SearchableStaffSelect
                    value={staffId}
                    onChange={setStaffId}
                    placeholder="Search and select staff..."
                  />
                </div>
              )}
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
            <h5 className="text-lg font-bold mb-2">Delete Staff Access</h5>
            {itemToDelete && (
              <p className="mb-2">
                Delete access for{" "}
                <strong>
                  {itemToDelete.staffFirstName} {itemToDelete.staffLastName}
                </strong>{" "}
                on menu item:{" "}
                <strong>
                  {itemToDelete.menuItemTitle || itemToDelete.menuItemId}
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

      {/* Search Box */}
      <div className="mb-4 flex gap-2 max-w-md">
        <input
          type="text"
          className="border border-gray-300 rounded-l px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Search by staff name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-r"
          onClick={handleSearch}
          title="Search"
        >
          <FaSearch />
        </button>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded"
          onClick={resetSearch}
          title="Reset"
        >
          <FaSyncAlt />
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

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default StaffMenuAccess;
