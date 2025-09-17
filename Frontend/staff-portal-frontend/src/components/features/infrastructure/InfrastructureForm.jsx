// src/components/features/infrastructure/InfrastructureForm.jsx
import React, { useEffect, useState } from "react";

const InfrastructureForm = ({ onSubmit, onCancel, defaultValues }) => {
  const [roomName, setRoomName] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [description, setDescription] = useState("");
  const [premisesId, setPremisesId] = useState("");

  useEffect(() => {
    if (defaultValues) {
      setRoomName(defaultValues.roomName || "");
      setType(defaultValues.type || "");
      setLocation(defaultValues.location || "");
      setCapacity(defaultValues.capacity || "");
      setDescription(defaultValues.description || "");
      setPremisesId(defaultValues.premisesId || "");
    }
  }, [defaultValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomName || !premisesId) return;
    onSubmit({ roomName, type, location, capacity, description, premisesId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {defaultValues ? "Edit" : "Create"} Infrastructure
      </h3>

      <input
        type="text"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="Room Name"
        className="w-full px-3 py-2 border rounded border-gray-300 focus:ring-2 focus:ring-green-300"
        required
      />
      <input
        type="text"
        value={type}
        onChange={(e) => setType(e.target.value)}
        placeholder="Type"
        className="w-full px-3 py-2 border rounded border-gray-300 focus:ring-2 focus:ring-green-300"
      />
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location"
        className="w-full px-3 py-2 border rounded border-gray-300 focus:ring-2 focus:ring-green-300"
      />
      <input
        type="number"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
        placeholder="Capacity"
        className="w-full px-3 py-2 border rounded border-gray-300 focus:ring-2 focus:ring-green-300"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        rows={2}
        className="w-full px-3 py-2 border rounded border-gray-300 focus:ring-2 focus:ring-green-300"
      />
      <input
        type="number"
        value={premisesId}
        onChange={(e) => setPremisesId(e.target.value)}
        placeholder="Premises ID"
        className="w-full px-3 py-2 border rounded border-gray-300 focus:ring-2 focus:ring-green-300"
        required
      />

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

export default InfrastructureForm;
