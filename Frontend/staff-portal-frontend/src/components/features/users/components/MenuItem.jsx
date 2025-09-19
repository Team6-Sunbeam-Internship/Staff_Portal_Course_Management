import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../../../../services/api/MenuItemService";

function MenuItem() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [menuItemId, setMenuItemId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [path, setPath] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [menuItemToDelete, setMenuItemToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = menuItems.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(menuItems.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    document.title = "Menu Items";
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const data = await getAllMenuItems();
      setMenuItems(data);
    } catch (error) {
      toast.error("Failed to load menu items");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setMenuItemId("");
    setTitle("");
    setDescription("");
    setPath("");
    setIsEditMode(false);
  };

  const onSave = async () => {
    if (!title || !description || !path) {
      toast.warn("Please fill all fields");
      return;
    }

    const menuItemData = { title, description, path };

    try {
      setLoading(true);
      if (isEditMode) {
        await updateMenuItem(menuItemId, menuItemData);
        toast.success("Menu item updated successfully");
      } else {
        await createMenuItem(menuItemData);
        toast.success("Menu item created successfully");
      }
      await loadMenuItems();
      setShowForm(false);
      clearForm();
    } catch (error) {
      toast.error(isEditMode ? "Failed to update" : "Failed to create");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (item) => {
    setMenuItemId(item.menuItemId);
    setTitle(item.title);
    setDescription(item.description);
    setPath(item.path);
    setIsEditMode(true);
    setShowForm(true);
  };

  const requestDelete = (item) => {
    setMenuItemToDelete(item);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setMenuItemToDelete(null);
    setShowDeleteModal(false);
  };

  const confirmDelete = async () => {
    if (!menuItemToDelete) return;
    try {
      setLoading(true);
      await deleteMenuItem(menuItemToDelete.menuItemId);
      toast.success("Menu item deleted successfully");
      await loadMenuItems();
    } catch (error) {
      toast.error("Failed to delete menu item");
      console.error(error);
    } finally {
      setLoading(false);
      cancelDelete();
    }
  };

  return (
    <div className="container mx-auto mt-6 px-4">
      <h2 className="text-2xl font-bold text-center mb-4">Menu Items</h2>

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
                {isEditMode ? "Edit Menu Item" : "Add Menu Item"}
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
                <label className="block mb-1 font-medium">Title</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                  rows="3"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div>
                <label className="block mb-1 font-medium">Path</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                onClick={clearForm}
              >
                Clear
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white rounded-lg w-full max-w-sm p-6 text-center">
            <div className="mb-4 flex items-center justify-center mx-auto w-20 h-20 rounded-full bg-red-100">
              <FaTrash size={32} className="text-red-600" />
            </div>

            <h4 className="text-lg font-bold text-gray-800 mb-2">
              Delete Menu Item
            </h4>
            <p className="text-gray-600 mb-4">
              Are you sure you want to permanently delete this menu item?
            </p>

            {menuItemToDelete && (
              <div className="bg-gray-100 rounded p-3 mb-4 text-left">
                <strong className="block text-blue-600">
                  {menuItemToDelete.title}
                </strong>
                <small className="text-gray-500">
                  {menuItemToDelete.description}
                </small>
                <br />
                <small className="text-gray-500">
                  Path: {menuItemToDelete.path}
                </small>
              </div>
            )}

            <p className="text-red-600 text-sm mb-4 font-semibold">
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
                className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded min-w-[100px] disabled:opacity-50"
                onClick={confirmDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete Menu"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3 border">#</th>
              <th className="py-2 px-3 border">Title</th>
              <th className="py-2 px-3 border">Description</th>
              <th className="py-2 px-3 border">Path</th>
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
            ) : menuItems.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-4">
                  No menu items found
                </td>
              </tr>
            ) : (
              currentRecords.map((item, idx) => (
                <tr key={item.menuItemId} className="hover:bg-gray-50">
                  <td className="py-2 px-3 border">
                    {indexOfFirstRecord + idx + 1}
                  </td>
                  <td className="py-2 px-3 border">{item.title}</td>
                  <td className="py-2 px-3 border">{item.description}</td>
                  <td className="py-2 px-3 border">{item.path}</td>
                  <td className="py-2 px-3 border flex justify-center gap-2">
                    <button
                      className="bg-yellow-400 hover:bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => onEdit(item)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-800 text-white px-2 py-1 rounded"
                      onClick={() => requestDelete(item)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <ul className="flex gap-1">
            <li>
              <button
                className={`px-3 py-1 rounded border ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i + 1}>
                <button
                  className={`px-3 py-1 rounded border ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}

            <li>
              <button
                className={`px-3 py-1 rounded border ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default MenuItem;
