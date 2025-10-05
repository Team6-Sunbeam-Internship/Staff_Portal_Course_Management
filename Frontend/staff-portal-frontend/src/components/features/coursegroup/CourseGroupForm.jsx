import React, { useEffect, useState } from "react";
import CourseGroupFilterService from "../../../services/api/courseGroupFilterService";

const CourseGroupForm = ({ onSubmit, onCancel, defaultValues }) => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [courseId, setCourseId] = useState("");
  const [batchCycleId, setBatchCycleId] = useState("");
  const [status, setStatus] = useState("");

  const [courses, setCourses] = useState([]);
  const [batchCycles, setBatchCycles] = useState([]);
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    // Load dropdowns
    const fetchFilters = async () => {
      try {
        const coursesRes = await CourseGroupFilterService.getCourses();
        setCourses(coursesRes.data);

        const batchesRes = await CourseGroupFilterService.getBatchCycles();
        setBatchCycles(batchesRes.data);

        const statusRes = await CourseGroupFilterService.getStatuses();
        setStatuses(statusRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    if (defaultValues) {
      setGroupName(defaultValues.groupName || "");
      setDescription(defaultValues.description || "");
      setCapacity(defaultValues.capacity || "");
      setCourseId(defaultValues.courseId || "");
      setBatchCycleId(defaultValues.batchCycleId || "");
      setStatus(defaultValues.status || "");
    }
  }, [defaultValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      groupName,
      description,
      capacity,
      courseId,
      batchCycleId,
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {defaultValues ? "Edit" : "Create"} Course Group
      </h3>

      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Group Name"
        className="w-full px-3 py-2 border rounded"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        rows={2}
        className="w-full px-3 py-2 border rounded"
      />
      <input
        type="number"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
        placeholder="Capacity"
        className="w-full px-3 py-2 border rounded"
      />

      <select
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
        className="w-full px-3 py-2 border rounded"
        required
      >
        <option value="">Select Course</option>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        value={batchCycleId}
        onChange={(e) => setBatchCycleId(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      >
        <option value="">Select Batch Cycle</option>
        {batchCycles.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      >
        <option value="">Select Status</option>
        {statuses.map((s) => (
          <option key={s.id} value={s.name}>
            {s.name}
          </option>
        ))}
      </select>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-pink-600 text-white rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          {defaultValues ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default CourseGroupForm;
