import React, { useEffect, useState } from "react";
import { FormField } from "../../../layout";

export const SectionForm = ({ section, batchCycleId, courseCode, moduleCode, subjectCode, onSubmit, isLoading = false, onCancel }) => {
	const [formData, setFormData] = useState({
		sectionCode: "",
		sectionName: "",
	});
	useEffect(() => {
		if (section) {
			setFormData({
				sectionCode: subjectCode + "-" + section.sectionCode,
				sectionName: section.sectionName,
			});
		}
	}, [section, subjectCode]);
	const [error, setErrors] = useState({});
	const validateForm = () => {
		const newErrors = {};

		if (!formData.sectionCode.trim()) {
			newErrors.sectionCode = "Section code is required";
		}
		if (!formData.sectionName.trim()) {
			newErrors.sectionName = "Section name is required";
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
			{/**Read only value for batchCycleId, courseCode, moduleCode, and subjectCode */}
			<div className='grid grid-cols-2 gap-6'>
				<Input readOnly label='Batch Cycle' value={batchCycleId} />
				<Input readOnly label='Course' value={courseCode} />
				<Input readOnly label='Module' value={moduleCode} />
				<Input readOnly label='Subject' value={subjectCode} />
			</div>

			<FormField label={"Section Code"} error={error.sectionCode} required>
				<Input
					type='text'
					value={formData.sectionCode}
					onChange={(e) => handleInputChange("sectionCode", e.target.value)}
					placeHolder='MCJ-001 or MSDM-005'
					disabled={isLoading}
				/>
			</FormField>

			<FormField label={"Section Name"} error={error.sectionName} required>
				<Input
					type='text'
					value={formData.sectionName}
					onChange={(e) => handleInputChange("sectionName", e.target.value)}
					placeHolder='Module Name'
					disabled={isLoading}
				/>
			</FormField>


			<div className='flex items-center justify-end space-x-3 pt-4'>
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

