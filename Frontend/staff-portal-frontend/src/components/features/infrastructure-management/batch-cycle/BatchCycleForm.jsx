import { useEffect, useState } from "react";
import { FormField, Button, Input, Select, TextArea } from "../../../layout";

export const BatchCycleForm = ({ batchCycle, onSubmit, onCancel, isLoading = false }) => {
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		startDate: "",
		endDate: "",
		status: "planned",
	});
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (batchCycle) {
			setFormData({
				title: batchCycle.title || "",
				description: batchCycle.description || "",
				startDate: batchCycle.startDate?.split("T")[0] || "",
				endDate: batchCycle.endDate?.split("T")[0] || "",
				status: batchCycle.status || "planned",
			});
		}
	}, [batchCycle]);

	const statusOptions = [
		{ value: "PLANNED", label: "Planned" },
		{ value: "ACTIVE", label: "Active" },
		{ value: "COMPLETED", label: "Completed" },
		{ value: "INACTIVE", label: "Inactive" },
	];

	const validateForm = () => {
		const newErrors = {};

		if (!formData.title.trim()) {
			newErrors.title = "Batch cycle title is required";
		}

		if (!formData.startDate) {
			newErrors.startDate = "Start date is required";
		}

		if (!formData.endDate) {
			newErrors.endDate = "End date is required";
		} else if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
			newErrors.endDate = "End date cannot be before start date";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validateForm()) {
			onSubmit({
				...formData,
				id: batchCycle?.id,
			});
		}
	};

	const handleInputChange = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-6'>
			<div className='grid grid-cols-1 gap-4'>
				<FormField label='Title' required error={errors.title}>
					<Input
						type='text'
						value={formData.title}
						onChange={(e) => handleInputChange("title", e.target.value)}
						placeholder='e.g., Batch Cycle 2024-01'
						error={!!errors.title}
						disabled={isLoading}
					/>
				</FormField>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<FormField label='Start Date' required error={errors.startDate}>
					<Input
						type='date'
						value={formData.startDate}
						onChange={(e) => handleInputChange("startDate", e.target.value)}
						error={!!errors.startDate}
						disabled={isLoading}
					/>
				</FormField>
				<FormField label='End Date' required error={errors.endDate}>
					<Input
						type='date'
						value={formData.endDate}
						onChange={(e) => handleInputChange("endDate", e.target.value)}
						error={!!errors.endDate}
						disabled={isLoading}
					/>
				</FormField>
			</div>
			<FormField label='Status' required error={errors.status}>
				<Select
					value={formData.status}
					onChange={(e) => handleInputChange("status", e.target.value)}
					options={statusOptions}
					error={!!errors.status}
					disabled={isLoading}
				/>
			</FormField>

			<FormField label='Description' error={errors.description}>
				<TextArea
					value={formData.description}
					onChange={(e) => handleInputChange("description", e.target.value)}
					placeholder='Enter batch cycle description (optional)'
					rows={4}
					error={!!errors.description}
					disabled={isLoading}
				/>
			</FormField>
			<div className='flex items-center  justify-end space-x-3 pt-4'>
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
