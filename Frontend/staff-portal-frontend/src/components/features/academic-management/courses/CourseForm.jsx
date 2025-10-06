import { useEffect, useState } from "react";
import { FormField, Button, Input, CustomSelect } from "../../../layout";

export const CourseForm = ({ course, batchCycles, premises, courseTypes, onSubmit, onCancel, isLoading = false }) => {
	const [formData, setFormData] = useState({
		title: "",
		courseCode: "",
		batchCycleId: "",
		premiseId: "",
		courseTypeId: "",
		startDate: "",
		endDate: "",
		studentCount: "",
		groupCount: "",
		status: "planned",
	});
	const [errors, setErrors] = useState({});
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
				.toLocaleString("en-US", {
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
		if (course) {
			// --- UPDATION CASE ---
			const newFormData = {
				title: course.courseName || "",
				batchCycleId: course.batchCycleId || "",
				premiseId: course.premiseId || "",
				courseTypeId: course.courseTypeId || "",
				startDate: course.startDate?.split("T")[0] || "",
				endDate: course.endDate?.split("T")[0] || "",
				studentCount: String(course.studentCount) || "",
				groupCount: String(course.groupCount) || "",
				status: course.status || "planned",
				// IMPORTANT: For updation, use the existing courseCode if available.
				// If the courseCode field exists in the backend data, use it.
				// If the backend doesn't store it, generate it (as a fallback).
				courseCode: course.courseCode || generateCourseCode(course.title, course.startDate?.split("T")[0]),
			};

			setFormData(newFormData);
		} else {
			// --- CREATION CASE (Clear form data, optional if state is initialized correctly) ---
			// You might want to clear the form on course === null/undefined if component reuses state
			// For this example, we assume state is correctly initialized.
		}
	}, [course]);

	// --- EFFECT 2: Handle Real-time Generation from User Input ---
	useEffect(() => {
		const { title, startDate } = formData;

		// Generate the code whenever title or startDate changes
		const generatedCode = generateCourseCode(title, startDate);

		// Only update the state if the generated code is different
		// This prevents an infinite loop and unnecessary re-renders.
		if (formData.courseCode !== generatedCode) {
			setFormData((prevFormData) => ({
				...prevFormData,
				courseCode: generatedCode,
			}));
		}
	}, [formData.title, formData.startDate, formData.courseCode]); // courseCode is included for comparison
	const statusOptions = [
		{ value: "planned", label: "Planned" },
		{ value: "active", label: "Active" },
		{ value: "completed", label: "Completed" },
		{ value: "inactive", label: "Inactive" },
	];

	const validateForm = () => {
		const newErrors = {};

		if (!formData.title.trim()) {
			newErrors.title = "Course title is required";
		}

		if (!formData.batchCycleId) {
			newErrors.batchCycle = "Batch cycle is required";
		}
		if (!formData.premiseId) {
			newErrors.premiseId = "Location is required";
		}
		if (!formData.courseTypeId) {
			newErrors.courseTypeId = "Course type is required";
		}

		if (!formData.status) {
			newErrors.status = "Status is required";
		}

		if (!formData.startDate) {
			newErrors.startDate = "Start date is required";
		}

		if (!formData.endDate) {
			newErrors.endDate = "End date is required";
		} else if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
			newErrors.endDate = "End date cannot be before start date";
		}

		if (!formData.studentCount || isNaN(formData.studentCount) || parseInt(formData.studentCount) <= 0) {
			newErrors.studentCount = "Student count must be a valid positive number";
		}

		if (!formData.groupCount || isNaN(formData.groupCount) || parseInt(formData.groupCount) <= 0) {
			newErrors.groupCount = "Group count must be a valid positive number";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validateForm()) {
			const dataToSubmit = {
				...formData,
				// Parse number strings back to integers for API/submission
				studentCount: parseInt(formData.studentCount, 10),
				groupCount: parseInt(formData.groupCount, 10),
			};
			onSubmit(dataToSubmit);
		}
	};

	const handleChange = (e) => {
		const { name, value, type } = e.target;

		// Handle number inputs: prevent non-digit characters and enforce positive numbers if applicable
		let processedValue = value;
		if (type === "number") {
			// Only allow digits for number fields
			processedValue = value.replace(/[^0-9]/g, "");
		}

		setFormData((prev) => ({
			...prev,
			[name]: processedValue,
		}));

		// Clear error on change if it exists
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-6'>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<FormField label='Title' required error={errors.title}>
					<Input
						type='text'
						value={formData.title}
						onChange={handleChange}
						placeholder='e.g., PGDAC-AUG-25'
						error={!!errors.title}
						disabled={isLoading}
					/>
				</FormField>
				<FormField label='Batch Cycle' required error={errors.batchCycleId}>
					<CustomSelect
						name='batchCycleId'
						value={formData.batchCycleId}
						onChange={handleChange}
						options={batchCycleOptions}
						error={!!errors.status}
						disabled={isLoading}
					/>
				</FormField>
				<FormField label='Course Type' required error={errors.courseTypeId}>
					<CustomSelect
						name='courseTypeId'
						value={formData.courseTypeId}
						onChange={handleChange}
						options={courseTypesOptions}
						error={!!errors.courseTypeId}
						disabled={isLoading}
					/>
				</FormField>
				<FormField label='Location/Premise' required error={errors.premiseId}>
					<CustomSelect
						name='premiseId'
						value={formData.premiseId}
						onChange={handleChange}
						options={premiseOptions}
						error={!!errors.premiseId}
						disabled={isLoading}
					/>
				</FormField>
				<FormField label='Start Date' required error={errors.startDate}>
					<Input
						type='date'
						name='startDate'
						value={formData.startDate}
						onChange={handleChange}
						error={!!errors.startDate}
						disabled={isLoading}
					/>
				</FormField>

				{/* End Date */}
				<FormField label='End Date' required error={errors.endDate}>
					<Input
						type='date'
						name='endDate'
						value={formData.endDate}
						onChange={handleChange}
						error={!!errors.endDate}
						disabled={isLoading}
					/>
				</FormField>
				{/* Student Count */}
				<FormField label='Total Students' required error={errors.studentCount}>
					<Input
						type='number'
						name='studentCount'
						value={formData.studentCount}
						onChange={handleChange}
						placeholder='e.g., 60'
						error={!!errors.studentCount}
						disabled={isLoading}
					/>
				</FormField>

				{/* Group Count */}
				<FormField label='Number of Groups' required error={errors.groupCount}>
					<Input
						type='number'
						name='groupCount'
						value={formData.groupCount}
						onChange={handleChange}
						placeholder='e.g., 3'
						error={!!errors.groupCount}
						disabled={isLoading}
					/>
				</FormField>

				{/* Status */}
				<FormField label='Status' required error={errors.status}>
					<CustomSelect
						name='status'
						value={formData.status}
						options={statusOptions}
						onChange={handleChange}
						error={!!errors.status}
						disabled={isLoading}
					/>
				</FormField>
			</div>

			<div className='flex items-center  justify-end space-x-3 pt-4 border-t border-gray-300 dark:border-neutral-200'>
				<Button type='button' variant='danger' onClick={onCancel} disabled={isLoading}>
					Cancel
				</Button>
				<Button variant='secondary' type='submit' disabled={isLoading}>
					{isLoading ? "Saving..." : "Save"}
				</Button>
			</div>
		</form>
	);
};
