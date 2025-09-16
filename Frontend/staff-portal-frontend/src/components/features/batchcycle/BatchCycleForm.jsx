import React, { useEffect, useState } from "react";

const BatchCycleForm = ({ onSubmit, onCancel, defaultValues }) => {
  const [cycleName, setCycleName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (defaultValues) {
      setCycleName(defaultValues.cycleName || "");
      setDescription(defaultValues.description || "");
      setStatus(defaultValues.status || "ACTIVE");
      setStartDate(defaultValues.startDate || "");
      setEndDate(defaultValues.endDate || "");
    }
  }, [defaultValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cycleName || !startDate || !endDate) return;
    onSubmit({ cycleName, description, status, startDate, endDate });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {defaultValues ? "Edit" : "Create"} Batch Cycle
      </h3>

      <div>
        <label className="text-sm text-gray-600">Title</label>
        <input
          type="text"
          value={cycleName}
          onChange={(e) => setCycleName(e.target.value)}
          className="w-full mt-1 px-3 py-2 border rounded border-gray-300 focus:ring-2 focus:ring-green-300"
          placeholder="Enter title"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full mt-1 px-3 py-2 border rounded border-gray-300 focus:ring-2 focus:ring-green-300"
          placeholder="Description"
        />
      </div>

      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="text-sm text-gray-600">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded border-gray-300 focus:ring-2 focus:ring-green-300"
          />
        </div>
        <div className="w-1/2">
          <label className="text-sm text-gray-600">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded border-gray-300 focus:ring-2 focus:ring-green-300"
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-600">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full mt-1 px-3 py-2 border rounded border-gray-300 focus:ring-2 focus:ring-green-300"
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm bg-pink-600 text-white rounded hover:bg-pink-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
        >
          {defaultValues ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default BatchCycleForm;
