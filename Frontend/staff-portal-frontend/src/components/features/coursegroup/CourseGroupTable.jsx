import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const CourseGroupTable = ({ data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto shadow rounded bg-white p-4 border border-gray-300">
      <table className="min-w-full table-auto text-gray-800">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-4 py-2 text-left">Group ID</th>
            <th className="px-4 py-2 text-left">Group Name</th>
            <th className="px-4 py-2 text-left">Capacity</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                No Course Groups
              </td>
            </tr>
          ) : (
            data.map((cg) => (
              <tr key={cg.groupId} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{cg.groupId}</td>
                <td className="px-4 py-2">{cg.groupName}</td>
                <td className="px-4 py-2">{cg.capacity}</td>
                <td className="px-4 py-2 truncate max-w-xs">
                  {cg.description}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      cg.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {cg.status}
                  </span>
                </td>
                <td className="px-4 py-2 flex items-center justify-center gap-3">
                  <button
                    onClick={() => onEdit(cg)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(cg.groupId)}
                    className="text-red-600 hover:text-red-800"
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
  );
};

export default CourseGroupTable;
