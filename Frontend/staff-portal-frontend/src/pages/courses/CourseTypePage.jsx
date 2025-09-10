import { useState } from "react";
import AddCourseTypeForm from "../../components/features/courses/components/CourseTypes/AddCourseTypeForm";

export default function CourseTypePage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Course Types</h1>
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          + Add Course Type
        </button>
      </div>

      {/* List of course types */}
      {/* Example: <CourseTypeList /> */}

      {open && (
        <AddCourseTypeForm
          onClose={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            // 🔄 Refresh list after adding
          }}
        />
      )}
    </div>
  );
}
