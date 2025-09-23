import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const BatchCycleTable = ({ data, onEdit, onDelete }) => {
  const visibleData = data;

  return (
    <div className="overflow-x-auto shadow rounded bg-white p-4 border border-gray-300">
      <table className="min-w-full table-auto text-gray-800">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-4 py-2 text-left">Cycle No</th>
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Start Date</th>
            <th className="px-4 py-2 text-left">End Date</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {visibleData.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4 text-gray-500">
                No Batch Cycles
              </td>
            </tr>
          ) : (
            visibleData.map((item, idx) => (
              <tr key={item.batchCycleId} className="border-t">
                <td className="px-4 py-2">{item.batchCycleId}</td>
                <td className="px-4 py-2">{item.cycleName}</td>
                <td className="px-4 py-2">{item.description}</td>
                <td className="px-4 py-2">{item.startDate}</td>
                <td className="px-4 py-2">{item.endDate}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      item.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-2 flex items-center justify-center gap-3">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(item.batchCycleId)}
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

export default BatchCycleTable;
