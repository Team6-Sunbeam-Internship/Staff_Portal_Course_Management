import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const PremiseTable = ({ data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto shadow rounded bg-white p-4 border border-gray-300">
      <table className="min-w-full table-auto text-gray-800">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-4 py-2 text-left">S.No</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Type</th>
            <th className="px-4 py-2 text-left">Address</th>
            <th className="px-4 py-2 text-left">City</th>
            <th className="px-4 py-2 text-left">State</th>
            <th className="px-4 py-2 text-left">Postal Code</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center py-4 text-gray-500">
                No Premises Found
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.premisesId} className="border-t">
                <td className="px-4 py-2">{item.premisesId}</td>
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.type}</td>
                <td className="px-4 py-2">{item.address}</td>
                <td className="px-4 py-2">{item.city}</td>
                <td className="px-4 py-2">{item.state}</td>
                <td className="px-4 py-2">{item.postalCode}</td>
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
                    onClick={() => onDelete(item.premisesId)}
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

export default PremiseTable;
