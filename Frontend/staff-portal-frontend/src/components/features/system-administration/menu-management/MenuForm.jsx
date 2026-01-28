import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useFormState } from "../../../../hooks/uiHook/useFormState";
import { CustomSelect, Input, TextArea } from "../../../layout";

export const MenuForm = forwardRef(({ menuItem, availableParentKeys, onSubmit, isLoading }, ref) => {
	const { values, errors, setField, setAll, submit, reset, isDirty } = useFormState({
		initialValues: {
			title: "",
			description: "",
			path: "",
			parentKey: "",
			fullPathKey: "",
		},
		validate: (vals) => {
			const errs = {};
			if (!vals.title.trim()) errs.title = "Menu Title is required";
			if (!vals.fullPathKey.trim()) errs.fullPathKey = "Full Path (Unique Identifier) Key is required";
			if (vals.path.trim() && !vals.path.startsWith("/")) errs.path = "Route Path must start with '/'";
			return errs;
		},
		onSubmit: (vals) => {
			onSubmit({
				id: menuItem?.id,
				payload: vals,
			});
		},
	});

	useEffect(() => {
		if (menuItem) {
			setAll({
				title: menuItem.title || "",
				description: menuItem.description || "",
				path: menuItem.path || "",
				parentKey: menuItem.parentKey || "",
				fullPathKey: menuItem.fullPathKey || "",
			});
		}
	}, [menuItem, setAll]);

	useImperativeHandle(ref, () => ({
		submit,
		reset,
		isDirty,
	}));

	const isContainer = !values.path || values.path.trim() === "";

	return (
		<div className='space-y-6'>
			<Input
				type='text'
				label='Title (Label)'
				value={values.title}
				onChange={(e) => setField("title", e.target.value)}
				placeholder='e.g., Dashboard'
				error={!!errors.title}
				required
				disabled={isLoading}
			/>

			<CustomSelect
				label='Parent Menu'
				value={values.parentKey}
				onChange={(e) => setField("parentKey", e.target.value)}
				options={availableParentKeys}
				error={!!errors.parentKey}
				disabled={isLoading}
			/>

			<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
				<Input
					type='text'
					label='Full Path Key (Unique ID)'
					value={values.fullPathKey}
					onChange={(e) => setField("fullPathKey", e.target.value)}
					placeholder='e.g., staff-management/course-assign'
					error={!!errors.fullPathKey}
					required
					disabled={isLoading}
				/>
				<Input
					type='text'
					label='Route Path'
					value={values.path}
					onChange={(e) => setField("path", e.target.value)}
					placeholder='e.g., /staff-management/course-assign'
					error={!!errors.path}
					required={!isContainer}
					disabled={isLoading}
				/>
			</div>

			<TextArea
				label='Description'
				value={values.description}
				onChange={(e) => setField("description", e.target.value)}
				placeholder='A brief explanation of the menu item purpose.'
				rows={3}
				error={!!errors.description}
				disabled={isLoading}
			/>
		</div>
	);
});
