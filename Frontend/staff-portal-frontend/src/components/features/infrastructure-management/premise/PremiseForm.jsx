import { forwardRef, useEffect, useImperativeHandle } from "react";
import { FormField, Button, Input, Select, TextArea, CustomSelect } from "../../../layout";
import { useFormState } from "../../../../hooks/uiHook/useFormState";
import { Building, Globe, Hash, HouseHeart, Mail, Mailbox, Map, Tag } from "lucide-react";
export const PremiseForm = forwardRef(({ premise, onSubmit, isLoading = false }, ref) => {
	console.log("Premise: ", premise);
	const { values, errors, setField, setAll, submit, reset, isDirty } = useFormState({
		initialValues: {
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
		},
		validate: (vals) => {
			const errs = {};
			if (!vals.title.trim()) errs.title = "Premise title is required";
			if (!vals.address.line1.trim()) errs.addressLine1 = "Address Line 1 is required";
			if (!vals.address.city.trim()) errs.addressCity = "City is required";
			if (!vals.address.state.trim()) errs.addressState = "State is required";
			if (!vals.address.country.trim()) errs.addressCountry = "Country is required";
			if (!vals.address.postalCode.trim()) errs.addressPostalCode = "Postal code is required";
			return errs;
		},
		onSubmit: (vals) => {
			onSubmit({
				payload: vals,
				id: premise?.id,
			});
		},
	});

	const formatAddress = (addressString) => {
		// 1. Split by comma and clean up whitespace
		// Example: 'Ring road, Near Mall, Mumbai, Maharashtra, India, 497001'
		const parts = addressString
			.split(",")
			.map((part) => part.trim())
			.filter((p) => p !== "");

		// 2. Identify fixed components from the end
		const postalCode = parts.pop() || "";
		const country = parts.pop() || "";
		const state = parts.pop() || "";
		const city = parts.pop() || "";

		// 3. Use remaining parts for Line 1 and Line 2
		// Line 1 takes the first remaining part, Line 2 takes the rest joined together
		const [line1 = "", ...rest] = parts;
		const line2 = rest.join(", ");

		return {
			line1,
			line2,
			city,
			state,
			country,
			postalCode,
		};
	};

	useEffect(() => {
		if (premise) {
			const { line1, line2, city, state, country, postalCode } = formatAddress(premise.address);
			setAll({
				title: premise.title || "",
				address: {
					line1: line1 || "",
					line2: line2 || "",
					city: city || "",
					state: state || "",
					country: country || "",
					postalCode: postalCode || "",
				},
				description: premise.description || "",
				type: premise.type || "Residential",
			});
		}
	}, [premise]);

	useImperativeHandle(ref, () => ({
		submit,
		reset,
		isDirty,
	}));

	const premiseTypeOptions = [
		{ value: "Residential", label: "Residential" },
		{ value: "Commercial", label: "Commercial" },
		{ value: "Educational", label: "Educational" },
		{ value: "Industrial", label: "Industrial" },
		{ value: "Medical Facility", label: "Medical Facility" },
		{ value: "Teaching Institute", label: "Teaching Institute" },
	];

	return (
		<div className='space-y-6'>
			<Input
				type='text'
				label={"Premise Title"}
				icon={Tag}
				required
				value={values.title}
				onChange={(e) => setField("title", e.target.value)}
				placeholder='e.g., Nexus Corporation HQ'
				error={!!errors.title}
				disabled={isLoading}
			/>

			<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
				<Input
					type='text'
					icon={HouseHeart}
					label={"Address Line 1"}
					value={values.address.line1}
					onChange={(e) => setField("address.line1", e.target.value)}
					placeholder='e.g., 123 Capital Way'
					error={!!errors.addressLine1}
					disabled={isLoading}
				/>
				<Input
					type='text'
					icon={Hash}
					label={"Address Line 2"}
					value={values.address.line2}
					onChange={(e) => setField("address.line2", e.target.value)}
					placeholder='e.g., Suite 200'
					disabled={isLoading}
				/>
			</div>
			<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
				<Input
					type='text'
					icon={Building}
					label={"City"}
					value={values.address.city}
					onChange={(e) => setField("address.city", e.target.value)}
					placeholder='e.g., Downtown'
					error={!!errors.addressCity}
					disabled={isLoading}
				/>
				<Input
					type='text'
					label={"State"}
					icon={Map}
					value={values.address.state}
					onChange={(e) => setField("address.state", e.target.value)}
					placeholder='e.g., CA'
					error={!!errors.addressState}
					disabled={isLoading}
				/>
			</div>
			<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
				<Input
					type='text'
					label={"Country"}
					icon={Globe}
					value={values.address.country}
					onChange={(e) => setField("address.country", e.target.value)}
					placeholder='e.g., USA'
					error={!!errors.addressCountry}
					disabled={isLoading}
				/>
				<Input
					type='number'
					label={"Postal Code"}
					icon={Mailbox}
					value={values.address.postalCode}
					onChange={(e) => setField("address.postalCode", e.target.value)}
					placeholder='e.g., 01234'
					error={!!errors.addressPostalCode}
					disabled={isLoading}
				/>
			</div>

			<CustomSelect
				value={values.type}
				label={"Premise Type"}
				onChange={(e) => setField("type", e.target.value)}
				options={premiseTypeOptions}
				error={!!errors.type}
				disabled={isLoading}
			/>
			<TextArea
				value={values.description}
				label={"Description"}
				onChange={(e) => setField("description", e.target.value)}
				placeholder='Enter a brief description of the premise'
				rows={4}
				disabled={isLoading}
			/>
		</div>
	);
});
