import React, { useEffect, useState } from "react";
import { FormField } from "../../../layout";

export const TopicForm = ({ topic, batchCycleId, courseCode, moduleCode, subjectCode, sectionCode, onSubmit, isLoading = false, onCancel }) => {
	const [formData, setFormData] = useState({
		topicCode: "",
		topicName: "",
	});
	useEffect(() => {
		if (topic) {
			setFormData({
				topicCode: sectionCode + "-" + topic.topicCode,
				topicName: topic.subjectName,
			});
		}
	}, [sectionCode, topic]);
	const [error, setErrors] = useState({});
	const validateForm = () => {
		const newErrors = {};
		if (!formData.topicCode.trim()) {
			newErrors.topicCode = "Subject code is required";
		}
		if (!formData.topicName.trim()) {
			newErrors.topicName = "Subject name is required";
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
			{/**Read only value for batchCycleId, courseCode, moduleCode, subjectCode, sectionCode */}
			<div className='grid grid-cols-3 gap-6'>
				<Input readOnly label='Batch Cycle' value={batchCycleId} />
				<Input readOnly label='Course' value={courseCode} />
				<Input readOnly label='Module' value={moduleCode} />
				<Input readOnly label='Subject' value={subjectCode} />
				<Input readOnly label='Section' value={sectionCode} />
			</div>

			<FormField label={"Topic Code"} error={error.topicCode} required>
				<Input
					type='text'
					value={formData.topicCode}
					onChange={(e) => handleInputChange("topicCode", e.target.value)}
					placeHolder='SCJ-001 or SSDM-005'
					disabled={isLoading}
				/>
			</FormField>

			<FormField label={"Topic Name"} error={error.topicName} required>
				<Input
					type='text'
					value={formData.topicName}
					onChange={(e) => handleInputChange("subjectName", e.target.value)}
					placeHolder='Topic Name'
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
