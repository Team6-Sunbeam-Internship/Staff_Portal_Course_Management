import { useState, useEffect } from "react";
import {
	Input,
	TextArea,
	Select,
	FormField,
	Button,
	VStack,
	HStack,
} from "../../../layout"

export const CourseTypeForm = ({
	courseType,
	onSubmit,
	onCancel,
	isLoading = false,
}) => {
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		status: "active",
	});
	const [errors, setErrors] = useState({});

	// Update form data when a courseType prop is passed (for editing)
	useEffect(() => {
		if (courseType) {
			setFormData({
				title: courseType.title || "",
				description: courseType.description || "",
				status: courseType.status || "ACTIVE",
			});
		}
	}, [courseType]);

	// Options for the status select field
	const statusOptions = [
		{ value: "ACTIVE", label: "Active" },
		{ value: "INACTIVE", label: "Inactive" },
	];

	// Validate the form data and return any errors
	const validateForm = () => {
		const newErrors = {};

		if (!formData.title.trim()) {
			newErrors.title = "Title is required";
		} else if (formData.title.length < 3) {
			newErrors.title = "Title must be at least 3 characters long";
		}

		if (!formData.description.trim()) {
			newErrors.description = "Description is required";
		} else if (formData.description.length < 10) {
			newErrors.description =
				"Description must be at least 10 characters long";
		}

		if (!formData.status) {
			newErrors.status = "Status is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault();
		if (validateForm()) {
			onSubmit(formData);
		}
	};

	// Handle form input changes
	const handleInputChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));

		// Clear the error for the field once the user starts typing
		if (errors[field]) {
			setErrors((prev) => ({
				...prev,
				[field]: "",
			}));
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<VStack spacing='lg'>
				<FormField label='Title' required error={errors.title}>
					<Input
						value={formData.title}
						onChange={(e) =>
							handleInputChange("title", e.target.value)
						}
						placeholder='Enter course type title'
						error={!!errors.title}
						disabled={isLoading}
					/>
				</FormField>

				<FormField
					label='Description'
					required
					error={errors.description}
				>
					<TextArea
						value={formData.description}
						onChange={(e) =>
							handleInputChange("description", e.target.value)
						}
						placeholder='Enter course type description'
						rows={4}
						error={!!errors.description}
						disabled={isLoading}
					/>
				</FormField>

				<FormField label='Status' required error={errors.status}>
					<Select
						value={formData.status}
						onChange={(e) =>
							handleInputChange("status", e.target.value)
						}
						options={statusOptions}
						error={!!errors.status}
						disabled={isLoading}
					/>
				</FormField>

				<HStack justify='end' spacing='md' className='pt-4'>
					<Button
						type='button'
						variant='cancel'
						onClick={onCancel}
						disabled={isLoading}
					>
						Cancel
					</Button>
					<Button type='submit' variant='create' loading={isLoading}>
						{courseType ? "Save Changes" : "Create Course Type"}
					</Button>
				</HStack>
			</VStack>
		</form>
	);
};
