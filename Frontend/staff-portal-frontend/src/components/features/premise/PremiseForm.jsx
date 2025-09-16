import React, { useState, useEffect } from "react";

const PremiseForm = ({ onSubmit, onCancel, defaultValues }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (defaultValues) {
      setFormData(defaultValues);
    }
  }, [defaultValues]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: "",
      type: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      status: "ACTIVE",
    });
  };

  return (
    <div className="border rounded-xl shadow-md bg-white p-6 w-96">
      <h2 className="text-lg font-semibold text-center mb-4">
        {defaultValues ? "Update Premise" : "Create Premise"}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Premise Name"
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
          placeholder="Type (e.g. Building, Hall)"
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="City"
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder="State"
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          placeholder="Postal Code"
          className="border px-3 py-2 rounded"
          required
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>

        <div className="flex justify-center gap-4 mt-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            {defaultValues ? "Update" : "Create"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PremiseForm;
