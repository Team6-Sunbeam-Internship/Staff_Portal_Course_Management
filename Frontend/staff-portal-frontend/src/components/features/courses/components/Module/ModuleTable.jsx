import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const ModuleTable = ({ modules, onEdit, onDelete }) => {
  if (!modules || modules.length === 0) {
    return <p className="text-gray-500 text-center mt-4">No modules found.</p>;
  }

  return (
    <div className="flex justify-center mt-6">
      <div className="w-full max-w-6xl overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Module</th>
              <th className="px-4 py-2 text-left">Course</th>
              <th className="px-4 py-2 text-left">Course Type</th>
              <th className="px-4 py-2 text-left">Batch</th>
              <th className="px-4 py-2 text-left">Theory Hours</th>
              <th className="px-4 py-2 text-left">Practical Hours</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((m, idx) => (
              <tr key={m.moduleId} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{m.moduleName}</td>
                <td className="px-4 py-2">{m.courseName}</td>
                <td className="px-4 py-2">{m.courseTypeName}</td>
                <td className="px-4 py-2">{m.batchCycleName}</td>
                <td className="px-4 py-2 text-center">{m.theoryHours}</td>
                <td className="px-4 py-2 text-center">{m.practicalHours}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      m.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {m.status}
                  </span>
                </td>
                <td className="px-4 py-2 flex justify-center gap-4">
                  <button
                    onClick={() => onEdit(m)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(m.moduleId)}
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

export default ModuleTable;
