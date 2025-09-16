import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const CourseTable = ({ courses, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="px-4 py-2 text-left">Course Code</th>
            <th className="px-4 py-2 text-left">Course</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Batch Cycle</th>
            <th className="px-4 py-2 text-left">Course Type</th>
            <th className="px-4 py-2 text-left">Premise</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.courseId} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{c.courseCode}</td>
              <td className="px-4 py-2">{c.courseName}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    c.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {c.status}
                </span>
              </td>
              <td className="px-4 py-2">{c.cycleName}</td>
              <td className="px-4 py-2">{c.courseTypeName}</td>
              <td className="px-4 py-2">{c.premisesName}</td>
              <td className="px-4 py-2 flex justify-center gap-4">
                <button
                  onClick={() => onEdit(c)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => onDelete(c.courseId)}
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
  );
};

export default CourseTable;
