import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const TopicTable = ({ topics, onEdit, onDelete }) => {
  if (!topics || topics.length === 0) {
    return <p className="text-gray-500 text-center mt-4">No topics found.</p>;
  }

  return (
    <div className="flex justify-center mt-6">
      <div className="w-full max-w-4xl overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Sr.No.</th>
              <th className="px-4 py-2 text-left">Topic</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {topics.map((t, idx) => (
              <tr key={t.topicId} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{t.topicName}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      t.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="px-4 py-2 flex justify-center gap-4">
                  <button onClick={() => onEdit(t)} className="text-blue-600 hover:text-blue-800">
                    <FaEdit />
                  </button>
                  <button onClick={() => onDelete(t.topicId)} className="text-red-600 hover:text-red-800">
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

export default TopicTable;
