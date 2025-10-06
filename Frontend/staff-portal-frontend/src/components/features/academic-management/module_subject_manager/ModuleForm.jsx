import React, { useEffect, useState } from "react";
import { FormField } from "../../../layout";

export const ModuleForm = ({ module, batchCycleId, courseCode, onSubmit, isLoading = false, onCancel }) => {
	const [formData, setFormData] = useState({
		moduleCode: "",
		moduleName: "",
		theoryHours: "",
		practicalHours: "",
	});
	useEffect(() => {
		if (module) {
			setFormData({
				moduleCode: module.moduleCode,
				moduleName: module.moduleName,
				theoryHours: module.theoryHours,
				practicalHours: module.practicalHours,
			});
		}
	}, [module, courseCode]);
	const [error, setErrors] = useState({});

	const generateModuleCode = (courseCode, moduleName) => {
		if (!courseCode || !moduleName) return "";

		// Clean module name: remove special chars, trim, uppercase, replace spaces with nothing
		const shortName = moduleName
			.trim()
			.replace(/[^a-zA-Z0-9 ]/g, "")
			.split(" ")
			.map((word) => word.slice(0, 3).toUpperCase())
			.join("");

		return `${courseCode}-${shortName}`;
	};
	useEffect(() => {
		const { moduleName } = formData;
		const moduleCode = generateModuleCode(courseCode, moduleName);
		setFormData({
			...formData,
			moduleCode: moduleCode,
		});
	},[courseCode, formData]);
	const validateForm = () => {
		const newErrors = {};

		if (!formData.moduleCode.trim()) {
			newErrors.moduleCode = "Module code is required";
		}
		if (!formData.moduleName.trim()) {
			newErrors.moduleName = "Module name is required";
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
				...(module?.id && { id: module.id }),
			});
		}
	};
	return (
		<form onSubmit={handleSubmit} className='space-y-6'>
			{/**Read only value for batchCycleId and courseCode */}
			<div className='grid grid-cols-2 gap-6'>
				<Input readOnly label='Batch Cycle' value={batchCycleId} />
				<Input readOnly label='Course' value={courseCode} />
			</div>

			<FormField label={"Module Code"} error={error.moduleCode} required>
				<Input
					type='text'
					value={formData.moduleCode}
					onChange={(e) => handleInputChange("moduleCode", e.target.value)}
					placeHolder='MCJ-001 or MSDM-005'
					disabled={isLoading}
				/>
			</FormField>

			<FormField label={"Module Name"} error={error.moduleName} required>
				<Input
					type='text'
					value={formData.moduleName}
					onChange={(e) => handleInputChange("moduleName", e.target.value)}
					placeHolder='Module Name'
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

export default ModuleForm;
