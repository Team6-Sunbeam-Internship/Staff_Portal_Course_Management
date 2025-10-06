import { useEffect, useState } from "react";
import { FormField, Button, Input, TextArea, CustomSelect } from "../../../layout";
import { useGetPremisesQuery } from "../../../../store";

export const InfrastructureForm = ({ infrastructure, onSubmit, onCancel, isLoading = false }) => {
	const [formData, setFormData] = useState({
		title: "",
		type: "",
		description: "",
		premiseId: "",
		capacity: "",
	});
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (infrastructure) {
			setFormData({
				title: infrastructure.title || "",
				type: infrastructure.type || "",
				description: infrastructure.description || "",
				premiseId: infrastructure.premiseId || "",
				capacity: infrastructure.capacity || "",
			});
		}
	}, [infrastructure]);

	const infrastructureTypeOptions = [
		{ value: "Laboratory", label: "Laboratory" },
		{ value: "Residential Building", label: "Residential Building" },
		{ value: "Classroom Block", label: "Classroom Block" },
		{ value: "Office Complex", label: "Office Complex" },
		{ value: "Medical Unit", label: "Medical Unit" },
		{ value: "Exhibition Hall", label: "Exhibition Hall" },
		{ value: "Recreational Facility", label: "Recreational Facility" },
		{ value: "Study Hall", label: "Study Hall" },
		{ value: "Storage Facility", label: "Storage Facility" },
		{ value: "Kitchen Facility", label: "Kitchen Facility" },
	];

	// Fetch premise data for the location field
	const { data: premises = [] } = useGetPremisesQuery();
	const premiseLocationOptions = [
		{ value: "", label: "Select Premise" },
		...premises.map((premise) => ({
			value: premise.id,
			label: premise.title,
		})),
	];
	const validateForm = () => {
		const newErrors = {};

		if (!formData.title.trim()) {
			newErrors.title = "Infrastructure title is required";
		}
		if (!formData.type) {
			newErrors.type = "Type is required";
		}
		if (!formData.premiseId) {
			newErrors.premiseId = "Location is required";
		}
		if (!formData.capacity || isNaN(formData.capacity) || parseInt(formData.capacity) <= 0) {
			newErrors.capacity = "Capacity must be a valid positive number";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validateForm()) {
			onSubmit({
				...formData,
				id: infrastructure?.id,
			});
		}
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-6'>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<FormField label='Title' required error={errors.title}>
					<Input
						type='text'
						value={formData.title}
						onChange={(e) => handleInputChange("title", e.target.value)}
						placeholder='e.g., Server Room Alpha'
						error={!!errors.title}
						disabled={isLoading}
					/>
				</FormField>
				<FormField label='Type' required error={errors.type}>
					<CustomSelect
						value={formData.type}
						onChange={(e) => handleInputChange("type", e.target.value)}
						options={infrastructureTypeOptions}
						error={!!errors.type}
						disabled={isLoading}
					/>
				</FormField>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<FormField label='Location' required error={errors.premiseId}>
					<CustomSelect
						value={formData.premiseId}
						onChange={(e) => handleInputChange("location", e.target.value)}
						options={premiseLocationOptions}
						error={!!errors.location}
						disabled={isLoading}
					/>
				</FormField>
				<FormField label='Capacity' required error={errors.capacity}>
					<Input
						type='number'
						value={formData.capacity}
						onChange={(e) => handleInputChange("capacity", e.target.value)}
						placeholder='e.g., 50'
						error={!!errors.capacity}
						disabled={isLoading}
					/>
				</FormField>
			</div>

			<FormField label='Description' error={errors.description}>
				<TextArea
					value={formData.description}
					onChange={(e) => handleInputChange("description", e.target.value)}
					placeholder='Enter a brief description of the infrastructure'
					rows={4}
					error={!!errors.description}
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
