import { forwardRef, useEffect, useImperativeHandle, } from "react";
import { FormField, Button, Input, TextArea, CustomSelect } from "../../../layout";
import { useGetPremisesQuery } from "../../../../store";
import { useFormState } from "../../../../hooks/uiHook/useFormState";
import { Binary, Tag } from "lucide-react";

export const InfrastructureForm = forwardRef(({ infrastructure, onSubmit, isLoading = false }, ref) => {
	console.log("Infrastructure: ", infrastructure);
	const { values, errors, setField, setAll, submit, reset, isDirty } = useFormState({
		initialValues: {
			title: "",
			type: "",
			description: "",
			premiseId: "",
			capacity: "",
		},
		validate: (vals) => {
			const errs = {};
			if (!vals.title.trim()) errs.title = "Infrastructure title is required";
			if (!vals.type) errs.type = "Type is required";
			if (!vals.premiseId) errs.premiseId = "Location is required";
			if (!vals.capacity || isNaN(vals.capacity) || parseInt(vals.capacity) <= 0) {
				errs.capacity = "Capacity must be a valid positive number";
			}
			return errs;
		}, 
		onSubmit: (vals) => {
			onSubmit({
				payload: vals,
				id: infrastructure?.id,
			});
		},
	});



	useEffect(() => {
		if (!infrastructure || premises.length === 0) return;
		if (infrastructure) {
			setAll({
				title: infrastructure.title || "",
				type: infrastructure.type || "",
				description: infrastructure.description || "",
				premiseId: infrastructure.premisesId || "",
				capacity: infrastructure.capacity || "",
			});
		}
	}, [infrastructure]);

	const infrastructureTypeOptions = [
		{value: "", label: "Select Infrastructure Type"},
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
		console.log(
  "premiseId:", values.premiseId,
  "options:", premiseLocationOptions
);
	useImperativeHandle(ref, () => ({
		submit,
		reset,
		isDirty,
	}));


	return (
		<div className='space-y-6'>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4 justify-center items-center'>
					<Input
					type='text'
					label={"Infrastructure Title"}
					value={values.title}
					icon={Tag}
					required
						onChange={(e) => setField("title", e.target.value)}
						placeholder='e.g., Server Room Alpha'
						error={!!errors.title}
						disabled={isLoading}
					/>
					<CustomSelect
					value={values.type}
						label={"Infrastructure Type"}
						onChange={(e) => setField("type", e.target.value)}
						options={infrastructureTypeOptions}
					error={!!errors.type}
					className="mt-3"
						disabled={isLoading}
					/>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-4 justify-center items-center'>
					<CustomSelect
					value={values.premiseId}
					label="Location"
					onChange={(e) => setField("premiseId",e.target.value)}
					options={premiseLocationOptions}
					error={!!errors.premiseId}
					className="mt-3"
					disabled={isLoading}
			/>
					<Input
						type='number'
					value={values.capacity}
					icon={Binary}
						label={"Capacity"}
						onChange={(e) => setField("capacity", e.target.value)}
						placeholder='e.g., 50'
						error={!!errors.capacity}
						disabled={isLoading}
					/>
			</div>
				<TextArea
				value={values.description}
					label={"Description"}
					onChange={(e) => setField("description", e.target.value)}
					placeholder='Enter a brief description of the infrastructure'
					rows={4}
					error={!!errors.description}
					disabled={isLoading}
				/>
		</div>
	);
});
