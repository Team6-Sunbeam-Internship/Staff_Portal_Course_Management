import { useEffect, useState } from "react";
import { FormField, Button, Input, Select, TextArea, CustomSelect } from "../../../layout";
export const PremiseForm = ({
	premise,
	onSubmit,
	onCancel,
	isLoading = false,
}) => {
	const [formData, setFormData] = useState({
		title: "",
		address: {
			line1: "",
			line2: "",
			city: "",
			state: "",
			country: "",
			postalCode: "",
		},
		description: "",
		type: "Residential",
	});
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (premise) {
			setFormData({
				title: premise.title || "",
				address: {
					line1: premise.address?.line1 || "",
					line2: premise.address?.line2 || "",
					city: premise.address?.city || "",
					state: premise.address?.state || "",
					country: premise.address?.country || "",
					postalCode: premise.address?.postalCode || "",
				},
				description: premise.description || "",
				type: premise.type || "Residential",
			});
		}
	}, [premise]);

	const premiseTypeOptions = [
		{ value: "Residential", label: "Residential" },
		{ value: "Commercial", label: "Commercial" },
		{ value: "Educational", label: "Educational" },
		{ value: "Industrial", label: "Industrial" },
		{ value: "Medical Facility", label: "Medical Facility" },
		{ value: "Teaching Institute", label: "Teaching Institute" },
	];

	const validateForm = () => {
		const newErrors = {};

		if (!formData.title.trim()) {
			newErrors.title = "Premise title is required";
		}
		if (!formData.address.line1.trim()) {
			newErrors.addressLine1 = "Address Line 1 is required";
		}
		if (!formData.address.city.trim()) {
			newErrors.addressCity = "City is required";
		}
		if (!formData.address.state.trim()) {
			newErrors.addressState = "State is required";
		}
		if (!formData.address.country.trim()) {
			newErrors.addressCountry = "Country is required";
		}
		if (!formData.address.postalCode.trim()) {
			newErrors.addressPostalCode = "Postal code is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange = (field, value) => {
		if (field.startsWith("address.")) {
			const addressField = field.split(".")[1];
			setFormData((prev) => ({
				...prev,
				address: { ...prev.address, [addressField]: value },
			}));
			if (errors[`address${addressField}`]) {
				setErrors((prev) => ({
					...prev,
					[`address${addressField}`]: "",
				}));
			}
		} else {
			setFormData((prev) => ({ ...prev, [field]: value }));
			if (errors[field]) {
				setErrors((prev) => ({ ...prev, [field]: "" }));
			}
		}
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (validateForm()) {
			onSubmit({
				...formData,
				id: premise?.id,
			});
		}
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-6'>
			<FormField label='Title' required error={errors.title}>
				<Input
					type='text'
					value={formData.title}
					onChange={(e) => handleInputChange("title", e.target.value)}
					placeholder='e.g., Nexus Corporation HQ'
					error={!!errors.title}
					disabled={isLoading}
				/>
			</FormField>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<FormField
					label='Address Line 1'
					required
					error={errors.addressLine1}
				>
					<Input
						type='text'
						value={formData.address.line1}
						onChange={(e) =>
							handleInputChange("address.line1", e.target.value)
						}
						placeholder='e.g., 123 Capital Way'
						error={!!errors.addressLine1}
						disabled={isLoading}
					/>
				</FormField>
				<FormField label='Address Line 2'>
					<Input
						type='text'
						value={formData.address.line2}
						onChange={(e) =>
							handleInputChange("address.line2", e.target.value)
						}
						placeholder='e.g., Suite 200'
						disabled={isLoading}
					/>
				</FormField>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<FormField label='City' required error={errors.addressCity}>
					<Input
						type='text'
						value={formData.address.city}
						onChange={(e) =>
							handleInputChange("address.city", e.target.value)
						}
						placeholder='e.g., Downtown'
						error={!!errors.addressCity}
						disabled={isLoading}
					/>
				</FormField>
				<FormField label='State' required error={errors.addressState}>
					<Input
						type='text'
						value={formData.address.state}
						onChange={(e) =>
							handleInputChange("address.state", e.target.value)
						}
						placeholder='e.g., CA'
						error={!!errors.addressState}
						disabled={isLoading}
					/>
				</FormField>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<FormField
					label='Country'
					required
					error={errors.addressCountry}
				>
					<Input
						type='text'
						value={formData.address.country}
						onChange={(e) =>
							handleInputChange("address.country", e.target.value)
						}
						placeholder='e.g., USA'
						error={!!errors.addressCountry}
						disabled={isLoading}
					/>
				</FormField>
				<FormField
					label='Postal Code'
					required
					error={errors.addressPostalCode}
				>
					<Input
						type='text'
						value={formData.address.postalCode}
						onChange={(e) =>
							handleInputChange(
								"address.postalCode",
								e.target.value
							)
						}
						placeholder='e.g., 01234'
						error={!!errors.addressPostalCode}
						disabled={isLoading}
					/>
				</FormField>
			</div>

			<FormField label='Type' required error={errors.type}>
				<CustomSelect
					value={formData.type}
					onChange={(e) => handleInputChange("type", e.target.value)}
					options={premiseTypeOptions}
					error={!!errors.type}
					disabled={isLoading}
				/>
			</FormField>

			<FormField label='Description' error={errors.description}>
				<TextArea
					value={formData.description}
					onChange={(e) =>
						handleInputChange("description", e.target.value)
					}
					placeholder='Enter a brief description of the premise'
					rows={4}
					error={!!errors.description}
					disabled={isLoading}
				/>
			</FormField>
			<div className='flex items-center justify-end space-x-3 pt-4'>
				<Button
					type='button'
					variant='danger'
					onClick={onCancel}
					disabled={isLoading}
				>
					Cancel
				</Button>
				<Button variant='secondary' type='submit' disabled={isLoading}>
					{isLoading ? "Saving..." : "Save"}
				</Button>
			</div>
		</form>
	);
};
