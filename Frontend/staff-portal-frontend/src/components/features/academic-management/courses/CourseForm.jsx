import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { FormField, Button, Input, CustomSelect, CustomDatePicker } from "../../../layout";
import { useFormState } from "../../../../hooks/uiHook/useFormState";
import { Building, CalendarDays, LucideChevronDown, Tag } from "lucide-react";
import { useOutsideClick } from "../../../../hooks";
import { motion, AnimatePresence } from "motion/react";
export const CourseForm = forwardRef(({ course, batchCycles, premises, courseTypes, onSubmit, isLoading = false }, ref) => {
	const { values, errors, setField, setAll, submit, reset, isDirty } = useFormState({
		initialValues: {
			title: "",
			courseCode: "",
			batchCycleId: "",
			premiseId: "",
			courseTypeId: "",
			startDate: "",
			endDate: "",
			studentCount: "",
			groupCount: "",
			status: "",
		},
		validate: (vals) => {
			const errs = {};
			if (!vals.title.trim()) errs.title = "Title is required";
			if (!vals.courseCode.trim()) errs.courseCode = "Course code is required";
			if (!vals.batchCycleId) errs.batchCycleId = "Batch cycle is required";
			if (!vals.premiseId) errs.premiseId = "Location is required";
			if (!vals.courseTypeId) errs.courseTypeId = "Course type is required";
			if (!vals.startDate) errs.startDate = "Start date is required";
			if (!vals.endDate) errs.endDate = "End date is required";
			if (!vals.studentCount) errs.studentCount = "Student count is required";
			if (!vals.groupCount) errs.groupCount = "Group count is required";
			if (!vals.status) errs.status = "Status is required";
			return errs;
		},
		onSubmit: (vals) => {
			onSubmit({
				payload: vals,
				id: course?.id,
			});
		},
	});

	// Options for Custom Dropdowns
	const batchCycleOptions = [{ value: "", label: "Select batch cycle" }, ...batchCycles.map((c) => ({ value: c.id, label: c.title }))];
	// Options for Custom Dropdowns
	const courseTypesOptions = [{ value: "", label: "Select course type" }, ...courseTypes.map((c) => ({ value: c.id, label: c.title }))];
	// Options for Custom Dropdowns
	const premiseOptions = [{ value: "", label: "Select location" }, ...premises.map((c) => ({ value: c.id, label: c.title }))];

	// Generate course code
	const generateCourseCode = (title, startDate) => {
		// startDate will be in "yyyy-mm-dd" format from the <input type="date">
		if (title && startDate) {
			// 1. Parse the Date
			// Create a Date object from the "yyyy-mm-dd" string.
			// Appending 'T00:00:00' ensures the date is treated as midnight UTC
			// to prevent local timezone offsets from shifting the date back one day.
			const dateObject = new Date(`${startDate}T00:00:00`);

			// 2. Validation
			// Check for an invalid date (e.g., if startDate was an empty string)
			if (isNaN(dateObject.getTime())) {
				return "";
			}

			// 3. Extraction and Formatting
			// Get the full month name and year
			// 'en-US' locale is standard for full month names
			const monthName = dateObject
				.toLocaleString("en-IN", {
					month: "short",
				})
				.toUpperCase();

			const year = dateObject.getFullYear().toString().slice(-2);

			// Format: CourseName(title) + MonthName + Year
			return `${title}-${monthName}-${year}`;
		}
		return "";
	};

	// --- EFFECT 1: Handle Initial Load (Creation & Updation) ---
	useEffect(() => {
		if (!course) {
			// Reset to empty form when creating new course
			setAll({
				title: "",
				courseCode: "",
				batchCycleId: "",
				premiseId: "",
				courseTypeId: "",
				startDate: "",
				endDate: "",
				studentCount: "",
				groupCount: "",
				status: "PLANNED",
			});
			return;
		}

		// Populate form with course data for editing
		setAll({
			title: course.title || "",
			batchCycleId: course.batchCycleId || "",
			premiseId: course.premiseId || "",
			courseTypeId: course.courseTypeId || "",
			startDate: course.startDate?.split("T")[0] || "",
			endDate: course.endDate?.split("T")[0] || "",
			studentCount: String(course.studentCount ?? ""),
			groupCount: String(course.courseGroupCount ?? ""),
			status: course.courseStatus ? course.courseStatus.toUpperCase() : "PLANNED",
			courseCode: course.courseCode || generateCourseCode(course.title, course.startDate?.split("T")[0]),
		});
	}, [course?.id]);

	// --- EFFECT 2: Handle Real-time Generation from User Input ---
	useEffect(() => {
		if (course?.id) return;
		const generatedCode = generateCourseCode(values.title, values.startDate);
		if (values.courseCode !== generatedCode) {
			setField("courseCode", generatedCode);
		}
	}, [values.title, values.startDate]);
	const statusOptions = [
		{ value: "PLANNED", label: "Planned" },
		{ value: "ACTIVE", label: "Active" },
		{ value: "COMPLETED", label: "Completed" },
		{ value: "INACTIVE", label: "Inactive" },
	];

	useImperativeHandle(ref, () => ({
		submit,
		reset,
		isDirty,
	}));
	const [isPickerOpen, setIsPickerOpen] = useState(false);
	const datePickerWrapperRef = useRef(null);
	useOutsideClick(datePickerWrapperRef, () => setIsPickerOpen(false));

	const formatDateLocal = (date) => {
		if (!date) return "";
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	const formatDisplayDate = (dateStr) => {
		if (!dateStr) return "--/--/--";
		return new Date(dateStr).toLocaleDateString("en-IN", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};
	const handleDateRangeChange = (range) => {
		const startStr = range.start ? formatDateLocal(range.start) : "";
		const endStr = range.end ? formatDateLocal(range.end) : "";

		setField("startDate", startStr);
		setField("endDate", endStr);
	};

	return (
		<div className='space-y-6'>
			<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
				<Input
					type='text'
					label={"Course Title"}
					icon={Tag}
					required
					value={values.title}
					onChange={(e) => setField("title", e.target.value)}
					error={!!errors.title}
					disabled={isLoading}
				/>
				<CustomSelect
					name='batchCycleId'
					label={"Batch Cycle"}
					icon={CalendarDays}
					required
					value={values.batchCycleId}
					onChange={(e) => setField("batchCycleId", e.target.value)}
					options={batchCycleOptions}
					error={!!errors.status}
					disabled={isLoading}
				/>
				<CustomSelect
					name='courseTypeId'
					label={"Course Type"}
					icon={Tag}
					required
					value={values.courseTypeId}
					onChange={(e) => setField("courseTypeId", e.target.value)}
					options={courseTypesOptions}
					error={!!errors.courseTypeId}
					disabled={isLoading}
				/>
				<CustomSelect
					name='premiseId'
					label={"Premise"}
					icon={Building}
					required
					value={values.premiseId}
					onChange={(e) => setField("premiseId", e.target.value)}
					options={premiseOptions}
					error={!!errors.premiseId}
					disabled={isLoading}
				/>
				<div className='relative w-full' ref={datePickerWrapperRef}>
					<button
						type='button'
						onClick={() => setIsPickerOpen(!isPickerOpen)}
						disabled={isLoading}
						className={`flex w-full items-center justify-between gap-2 rounded-2xl px-4 py-3.5 text-left text-[10px] font-black tracking-widest uppercase transition-all ${isPickerOpen ? "bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20" : "border border-zinc-200 bg-white text-amber-400 hover:border-amber-500/50 dark:border-zinc-800 dark:bg-zinc-950"}`}>
						{values.startDate ? `${formatDisplayDate(values.startDate)} - ${formatDisplayDate(values.endDate)}` : "Select Start-End Date"}
						<LucideChevronDown size={14} className={`transition-transform duration-300 ${isPickerOpen ? "rotate-180" : "opacity-30"}`} />
					</button>
					<div className='absolute top-full left-0 z-[100] mt-2 w-full'>
						<AnimatePresence mode='wait'>
							{isPickerOpen && (
								<motion.div
									layout
									initial={{ opacity: 0, height: 0, scale: 0.98, y: -10 }}
									animate={{ opacity: 1, height: "auto", scale: 1, y: 0 }}
									exit={{ opacity: 0, height: 0, scale: 0.98, y: -10 }}
									transition={{ type: "spring", stiffness: 400, damping: 35, opacity: { duration: 0.3 } }}
									className='w-full origin-top overflow-hidden'>
									<CustomDatePicker
										variant='range'
										value={{
											start: values.startDate ? new Date(values.startDate) : null,
											end: values.endDate ? new Date(values.endDate) : null,
										}}
										onChange={handleDateRangeChange}
										disabled={isLoading}
									/>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
				{/* Student Count */}
				<Input
					type='number'
					label={"Student Count"}
					value={values.studentCount}
					onChange={(e) => setField("studentCount", e.target.value)}
					placeholder='e.g., 60'
					error={!!errors.studentCount}
					disabled={isLoading}
				/>

				{/* Group Count */}
				<Input
					type='number'
					label={"Group Count"}
					value={values.groupCount}
					onChange={(e) => setField("groupCount", e.target.value)}
					placeholder='e.g., 3'
					error={!!errors.groupCount}
					disabled={isLoading}
				/>

				{/* Status */}
				<CustomSelect
					name='status'
					value={values.status}
					options={statusOptions}
					onChange={(e) => setField("status", e.target.value)}
					error={!!errors.status}
					disabled={isLoading}
				/>
			</div>
		</div>
	);
});
