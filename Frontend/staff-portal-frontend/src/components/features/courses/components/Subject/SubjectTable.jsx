import React from "react";
import { FaEdit, FaTrash, FaListAlt } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";

const SubjectTable = ({ subjects, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // get current filters

  if (!subjects || subjects.length === 0) {
    return <p className="text-gray-500 text-center mt-4">No subjects found.</p>;
  }

  const handleSectionClick = (subjectId) => {
    // Preserve current filters in query string
    navigate(`/sections/${subjectId}?${searchParams.toString()}`);
  };

  return (
    <div className="flex justify-center mt-6">
      <div className="w-full max-w-4xl overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Sr. No.</th>
              <th className="px-4 py-2 text-left">Subject</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
              <th className="px-4 py-2 text-center">Sections</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((s, idx) => (
              <tr key={s.subjectId} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-center">{idx + 1}</td>
                <td className="px-4 py-2">{s.subjectName}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      s.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-2 flex justify-center gap-4">
                  <button
                    onClick={() => onEdit(s)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(s.subjectId)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleSectionClick(s.subjectId)}
                    className="text-green-600 hover:text-green-800"
                    title="View Sections"
                  >
                    <FaListAlt size={18} />
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

export default SubjectTable;
