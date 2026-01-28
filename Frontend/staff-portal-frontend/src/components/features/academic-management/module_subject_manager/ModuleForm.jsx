import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Button, FormField, Input } from "../../../layout";
import { useFormState } from "../../../../hooks/uiHook/useFormState";
import { useDebounce } from "../../../../hooks";

export const ModuleForm = forwardRef(({ module, batchCycleId, courseCode, onSubmit, isLoading = false }, ref) => {
	console.log("Editing Module: ", module);
	const { values, errors, setField, setAll, submit, reset, isDirty } = useFormState({
		initialValues: {
			moduleCode: "",
			moduleName: "",
			theoryHours: "",
			practicalHours: "",
		},
		validate: (vals) => {
			const errs = {};
			if (!vals.moduleName.trim()) errs.moduleName = "Module name is required";
			if (!vals.theoryHours || isNaN(vals.theoryHours) || parseInt(vals.theoryHours) <= 0)
				errs.theoryHours = "Theory hours must be a valid positive number";
			if (!vals.practicalHours || isNaN(vals.practicalHours) || parseInt(vals.practicalHours) <= 0)
				errs.practicalHours = "Practical hours must be a valid positive number";
			return errs;
		},
		onSubmit: (vals) => {
			onSubmit({
				payload: vals,
				courseCode: courseCode,
				id: module?.id,
			});
		},
	});
	const originalCodeRef = useRef("");
	const originalNameRef = useRef("");

	useEffect(() => {
		if (!module) return;

		const initialCode = generateModuleCode(courseCode, module.title);

		setAll({
			moduleCode: initialCode,
			moduleName: module.title,
			theoryHours: module.theoryHours,
			practicalHours: module.practicalHours,
		});

		originalCodeRef.current = initialCode;
		originalNameRef.current = module.title;
	}, [module, courseCode]);

	const debouncedModuleName = useDebounce(values.moduleName, 400);

	const generateModuleCode = (courseCode, moduleName) => {
		if (!courseCode || !moduleName) return "";

		// Clean module name: remove special chars, trim, uppercase, replace spaces with nothing
		const shortName = moduleName
			.trim()
			.replace(/[^a-zA-Z0-9 ]/g, "")
			.split("")
			.map((word) => word.slice(0, 3).toUpperCase())
			.join("");

		return `${courseCode}-${shortName}`;
	};
	useEffect(() => {
		if (!courseCode || !debouncedModuleName) return;

		const nameChanged = debouncedModuleName !== originalNameRef.current;

		const nextCode = nameChanged ? generateModuleCode(courseCode, debouncedModuleName) : originalCodeRef.current;

		if (values.moduleCode !== nextCode) {
			setField("moduleCode", nextCode);
		}
	}, [courseCode, debouncedModuleName]);

	useImperativeHandle(ref, () => ({
		submit,
		reset,
		isDirty,
	}));
	return (
		<div className='space-y-6'>
			{/**Read only value for batchCycleId and courseCode */}
			<div className='grid grid-cols-2 gap-6'>
				<Input readOnly label='Batch Cycle' value={batchCycleId} />
				<Input readOnly label='Course' value={courseCode} />
				<Input readOnly label='Module Code' value={values.moduleCode} />
			</div>

			<Input
				type='text'
				label={"Module Name"}
				required
				value={values.moduleName}
				onChange={(e) => setField("moduleName", e.target.value)}
				placeHolder='Module Name'
				disabled={isLoading}
				error={!!errors.moduleName}
			/>

			<Input
				type='number'
				label={"Theory Hours"}
				required
				value={values.theoryHours}
				onChange={(e) => setField("theoryHours", e.target.value)}
				placeHolder='Theory Hours'
				disabled={isLoading}
				error={!!errors.theoryHours}
			/>

			<Input
				type='number'
				label={"Practical Hours"}
				required
				value={values.practicalHours}
				onChange={(e) => setField("practicalHours", e.target.value)}
				placeHolder='Practical Hours'
				disabled={isLoading}
				error={!!errors.practicalHours}
			/>
		</div>
	);
});

export default ModuleForm;
