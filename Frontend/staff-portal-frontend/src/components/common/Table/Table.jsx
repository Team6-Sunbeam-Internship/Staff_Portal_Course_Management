import { FaEdit, FaTrash } from "react-icons/fa";

const Table = ({ columns, data, loading, onEdit, onDelete, indexOffset = 0 }) => {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="w-full table-auto border-collapse border border-gray-200 text-sm">
        <thead className="bg-gray-100 text-gray-700 text-center">
          <tr>
            <th className="border p-2 w-12 text-center">#</th>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`border p-2 ${col.className || ""}`}
              >
                {col.label}
              </th>
            ))}
            <th className="border p-2 w-36">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length + 2} className="text-center p-4">
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 2} className="text-center p-4">
                No records found
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr key={item.staffId || idx} className="hover:bg-gray-50 text-center">
                <td className="border p-2">{indexOffset + idx + 1}</td>
                {columns.map((col) => (
                  <td key={col.key} className="border p-2">
                    {typeof col.render === "function"
                      ? col.render(item)
                      : item[col.key]}
                  </td>
                ))}
                <td className="border p-2">
                  <div className="flex justify-center gap-1">
                    {onEdit && (
                      <button
                        className="bg-yellow-400 hover:bg-green-500 text-white px-2 py-1 rounded"
                        onClick={() => onEdit(item)}
                      >
                        <FaEdit />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="bg-red-600 hover:bg-red-800 text-white px-2 py-1 rounded"
                        onClick={() => onDelete(item)}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
