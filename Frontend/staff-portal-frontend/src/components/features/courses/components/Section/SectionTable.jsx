import React from "react";
import { FaEdit, FaTrash, FaBookOpen } from "react-icons/fa";

const SectionTable = ({ sections, onEdit, onDelete, onViewTopics }) => {
  if (!sections || sections.length === 0) {
    return <p className="text-gray-500 text-center mt-4">No sections found.</p>;
  }

  return (
    <div className="flex justify-center mt-6">
      <div className="w-full max-w-4xl overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Sr. No.</th>
              <th className="px-4 py-2 text-left">Section</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
              <th className="px-4 py-2 text-center">Topics</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((sec, idx) => (
              <tr key={sec.sectionId} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-left">{idx + 1}</td>
                <td className="px-4 py-2">{sec.sectionName}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      sec.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {sec.status}
                  </span>
                </td>
                <td className="px-4 py-2 flex justify-center gap-4">
                  <button
                    onClick={() => onEdit(sec)}
                    className="text-green-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(sec.sectionId)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => onViewTopics(sec.sectionId)}
                    className="text-greeen-600 hover:text-purple-800"
                    title="View Topics"
                  >
                    <FaBookOpen size={18} />
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

export default SectionTable;
