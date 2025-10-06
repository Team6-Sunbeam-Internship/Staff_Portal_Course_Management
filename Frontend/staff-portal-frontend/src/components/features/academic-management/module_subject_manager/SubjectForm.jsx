import React, { useEffect, useState } from "react";
import { FormField } from "../../../layout";

export const SubjectForm = ({ subject, batchCycleId, courseCode, moduleId, onSubmit, isLoading = false, onCancel }) => {
	const [formData, setFormData] = useState({
		subjectCode: "",
		subjectName: "",
		theoryHours: "",
		practicalHours: "",
	});
	useEffect(() => {
		if (subject) {
			setFormData({
				subjectCode: courseCode + "-" + subject.subjectCode,
				subjectName: subject.subjectName,
				theoryHours: subject.theoryHours,
				practicalHours: subject.practicalHours,
			});
		}
	}, [subject, courseCode]);

	const generateSubjectCode = (courseCode, subjectName) => {
		if (!courseCode || !subjectName) return "";

		// Clean module name: remove special chars, trim, uppercase, replace spaces with nothing
		const shortName = subjectName
			.trim()
			.replace(/[^a-zA-Z0-9 ]/g, "")
			.split(" ")
			.map((word) => word.slice(0, 3).toUpperCase())
			.join("");

		return `${courseCode}-${shortName}`;
	};

	useEffect(() => {
		const { subjectName } = formData;
		if (subjectName) {
			setFormData({
				...formData,
				subjectCode: generateSubjectCode(courseCode, subjectName),
			});
		}
	}, [formData, courseCode]);

	const [error, setErrors] = useState({});
	const validateForm = () => {
		const newErrors = {};

		if (!formData.subjectCode.trim()) {
			newErrors.subjectCode = "Subject code is required";
		}
		if (!formData.subjectName.trim()) {
			newErrors.subjectName = "Subject name is required";
		}
		if (!formData.theoryHours || isNaN(formData.theoryHours) || parseInt(formData.theoryHours) <= 0) {
			newErrors.theoryHours = "Theory hours must be a valid positive number";
		}
		if (!formData.practicalHours || isNaN(formData.practicalHours) || parseInt(formData.practicalHours) <= 0) {
			newErrors.practicalHours = "Practical hours must be a valid positive number";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange = (field, value) => {
		setFormData({
			...formData,
			[field]: value,
		});
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (validateForm()) {
			onSubmit({
				...formData,
				courseCode: courseCode,
			});
		}
	};
	return (
		<form onSubmit={handleSubmit} className='space-y-6'>
			{/**Read only value for batchCycleId and courseCode */}
			<div className='grid grid-cols-3 gap-6'>
				<Input readOnly label='Batch Cycle' value={batchCycleId} />
				<Input readOnly label='Course' value={courseCode} />
				<Input readOnly label='Module' value={moduleId} />
			</div>

			<FormField label={"Subject Code"} error={error.subjectCode} required>
				<Input
					type='text'
					value={formData.subjectCode}
					onChange={(e) => handleInputChange("subjectCode", e.target.value)}
					placeHolder='SCJ-001 or SSDM-005'
					disabled={isLoading}
				/>
			</FormField>

			<FormField label={"Subject Name"} error={error.subjectName} required>
				<Input
					type='text'
					value={formData.subjectName}
					onChange={(e) => handleInputChange("subjectName", e.target.value)}
					placeHolder='Subject Name'
					disabled={isLoading}
				/>
			</FormField>

			<FormField label={"Theory Hours"} error={error.theoryHours} required>
				<Input
					type='number'
					value={formData.theoryHours}
					onChange={(e) => handleInputChange("theoryHours", e.target.value)}
					placeHolder='Theory Hours'
					disabled={isLoading}
				/>
			</FormField>

			<FormField label={"Practical Hours"} error={error.practicalHours} required>
				<Input
					type='number'
					value={formData.practicalHours}
					onChange={(e) => handleInputChange("practicalHours", e.target.value)}
					placeHolder='Practical Hours'
					disabled={isLoading}
				/>
			</FormField>

			<div className='flex items-center justify-end space-x-3 pt-4'>
				<Button type='button' variant='danger' onClick={onCancel} disabled={isLoading}>
					Cancel
				</Button>
				<Button variant='secondary' type='submit' disabled={isLoading}>
					{isLoading ? "Save" : "Save"}
				</Button>
			</div>
		</form>
	);
};

export default SubjectForm;
