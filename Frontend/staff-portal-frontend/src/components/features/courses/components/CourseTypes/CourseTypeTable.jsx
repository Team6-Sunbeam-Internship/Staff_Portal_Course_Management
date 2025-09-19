import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const CourseTypeTable = ({ courseTypes = [], onEdit, onDelete }) => {
  if (!courseTypes || courseTypes.length === 0) {
    return (
      <p className="text-gray-500 text-center mt-4">No course types found.</p>
    );
  }

  return (
    <div className="flex justify-center mt-6">
      <div className="w-full max-w-5xl overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Sr. No.</th>
              <th className="px-4 py-2 text-left">Course Type</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Premises</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courseTypes.map((ct, index) => (
              <tr key={ct.courseTypeId || index} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-center">{index + 1}</td>
                <td className="px-4 py-2">{ct.typeName ?? "-"}</td>
                <td className="px-4 py-2">{ct.description ?? "-"}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      ct.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {ct.status ?? "-"}
                  </span>
                </td>
                <td className="px-4 py-2">{ct.premisesName ?? "-"}</td>
                <td className="px-4 py-2 flex justify-center gap-4">
                  <button
                    onClick={() => onEdit(ct)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(ct.courseTypeId)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseTypeTable;
