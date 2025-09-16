import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const CourseTypeTable = ({ courseTypes = [], onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg bg-white p-4">
      <table className="min-w-full table-auto">
        <thead className="bg-teal-100 text-teal-800">
          <tr>
            <th className="px-4 py-2 text-left">Sr.No</th>
            <th className="px-4 py-2 text-left">Course Type</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Premises</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courseTypes.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4 text-slate-500">
                No Course Types
              </td>
            </tr>
          ) : (
            courseTypes.map((ct, index) => (
              <tr
                key={ct.courseTypeId || index}
                className="border-t hover:bg-teal-50 transition"
              >
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{ct.typeName ?? "N/A"}</td>
                <td className="px-4 py-2">{ct.description ?? "N/A"}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      ct.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : ct.status === "INACTIVE"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {ct.status
                      ? ct.status.charAt(0) + ct.status.slice(1).toLowerCase()
                      : "N/A"}
                  </span>
                </td>
                <td className="px-4 py-2">{ct.premisesName ?? "N/A"}</td>
                <td className="px-4 py-2 flex items-center justify-center gap-4">
                  <button
                    onClick={() => onEdit(ct)}
                    className="text-teal-600 hover:text-teal-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(ct.courseTypeId)}
                    className="text-red-500 hover:text-red-700"
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

export default CourseTypeTable;
