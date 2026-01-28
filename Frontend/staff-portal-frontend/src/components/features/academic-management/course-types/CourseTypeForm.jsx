import {  useEffect, forwardRef, useImperativeHandle } from "react";
import {
	Input,
	TextArea,
	CustomSelect,
	FormField,
	Button,
	VStack,
	HStack,
} from "../../../layout"
import { useFormState } from "../../../../hooks/uiHook/useFormState";
import { Tag } from "lucide-react";

export const CourseTypeForm = forwardRef(({
	courseType,
	onSubmit,
	isLoading = false,
}, ref) => {
	const { values, errors, setField, setAll, submit, reset, isDirty } = useFormState({
		initialValues: {
		title: "",
		description: "",
		status: "",
		}, 
		validate: (vals) => {
			const errs = {};
			if (!vals.title.trim()) errs.title = "Title is required";
			if (!vals.description.trim()) errs.description = "Description is required";
			if (!vals.status) errs.status = "Status is required";
			return errs;
		},
		onSubmit: (vals) => {
			onSubmit({
				payload: vals,
				id: courseType?.id,
			});
		},
	})
	
	// Update form data when a courseType prop is passed (for editing)
	useEffect(() => {
		if (courseType) {
			setAll({
				title: courseType.title || "",
				description: courseType.description || "",
				status: courseType.status || "",
			});
		}
	}, [courseType]);

	// Options for the status select field
	const statusOptions = [
		{ value: "", label: "Select Status" },
		{ value: "ACTIVE", label: "Active" },
		{ value: "INACTIVE", label: "Inactive" },
	];

	useImperativeHandle(ref, () => ({
		submit,
		reset,
		isDirty,
	}));

	return (
		<div >
			<VStack spacing='lg'>
					<Input
					value={values.title}
						type='text'
						label={"Course Type Title"}
						icon={Tag}
						required
						onChange={(e) =>
							setField("title", e.target.value)
						}
						placeholder=''
						error={!!errors.title}
						disabled={isLoading}
					/>
<CustomSelect
					value={values.status}
						label={"Status"}
						onChange={(e) =>
							setField("status", e.target.value)
						}
						options={statusOptions}
						error={!!errors.status}
						disabled={isLoading}
					/>
					<TextArea
					value={values.description}
					label={"Description"}
						onChange={(e) =>
							setField("description", e.target.value)
						}
						placeholder=''
						rows={4}
						error={!!errors.description}
						disabled={isLoading}
					/>
					
			</VStack>
		</div>
	);
});
