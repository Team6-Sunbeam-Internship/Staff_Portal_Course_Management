// src/components/features/infrastructure/InfrastructureTable.jsx
import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const InfrastructureTable = ({ data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto shadow rounded bg-white p-4 border border-gray-300">
      <table className="min-w-full table-fixed text-gray-800">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="w-16 px-4 py-2 text-left">Infrastructure ID</th>
            <th className="w-32 px-4 py-2 text-left">Room Name</th>
            <th className="w-24 px-4 py-2 text-left">Type</th>
            <th className="w-32 px-4 py-2 text-left">Location</th>
            <th className="w-20 px-4 py-2 text-left">Capacity</th>
            <th className="w-48 px-4 py-2 text-left">Description</th>
            <th className="w-32 px-4 py-2 text-left">Premises</th>
            <th className="w-32 px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-4 text-gray-500">
                No Infrastructures
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.infrastructureId} className="border-t">
                <td className="px-4 py-2 text-left">{item.infrastructureId}</td>
                <td className="px-4 py-2 text-left">{item.roomName}</td>
                <td className="px-4 py-2 text-left">{item.type}</td>
                <td className="px-4 py-2 text-left">{item.location}</td>
                <td className="px-4 py-2 text-left">{item.capacity}</td>
                <td className="px-4 py-2 text-left truncate max-w-xs">
                  {item.description}
                </td>
                <td className="px-4 py-2 text-left">{item.premisesName}</td>
                <td className="px-4 py-2 flex justify-center gap-3">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(item.infrastructureId)}
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

export default InfrastructureTable;
