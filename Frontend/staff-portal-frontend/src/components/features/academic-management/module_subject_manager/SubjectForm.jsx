import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Button, FormField, Input } from "../../../layout";
import { useFormState } from "../../../../hooks/uiHook/useFormState";

export const SubjectForm = forwardRef(({ subject, batchCycleId, courseCode, moduleId, onSubmit, isLoading = false, }, ref) => {
	console.log("Editing Subject: ", subject);
	const { values, errors, setField, setAll, submit, reset, isDirty } = useFormState({
		initialValues: {
			subjectCode: "",
			subjectName: "",
			theoryHours: "",
			practicalHours: "",
		},
		validate: (vals) => {
			const errs = {};
			if (!vals.subjectCode.trim()) errs.subjectCode = "Subject code is required";
			if (!vals.subjectName.trim()) errs.subjectName = "Subject name is required";
			if (!vals.theoryHours || isNaN(vals.theoryHours) || parseInt(vals.theoryHours) <= 0)
				errs.theoryHours = "Theory hours must be a valid positive number";
			if (!vals.practicalHours || isNaN(vals.practicalHours) || parseInt(vals.practicalHours) <= 0)
				errs.practicalHours = "Practical hours must be a valid positive number";
			return errs;
		},
		onSubmit: (vals) => {
			onSubmit({
				payload: vals,
				moduleId: moduleId,
				id: subject?.id,
				courseCode: courseCode,
			});
		},
	});
	useEffect(() => {
		if (subject) {
			setAll({
				subjectCode: courseCode + "-" + subject.subjectCode,
				subjectName: subject.title,
				theoryHours: subject.theoryHours,
				practicalHours: subject.practicalHours,
			});
		}
	}, [subject, courseCode]);

	const generateSubjectCode = (courseCode, subjectName) => {
		if (!courseCode || !subjectName) return "";

		// Clean module name: remove special chars, trim, uppercase, replace spaces with nothing
		const shortName = subjectName
			.trim()
			.replace(/[^a-zA-Z0-9 ]/g, "")
			.split(" ")
			.map((word) => word.slice(0, 3).toUpperCase())
			.join("");

		return `${courseCode}-${shortName}`;
	};

	useEffect(() => {
		if (!courseCode) return;
		if (subject?.id) return;
		const subjectCode = generateSubjectCode(courseCode, values.subjectName);
		if (values.subjectCode !== subjectCode) setField("subjectCode", subjectCode);
	}, [courseCode, subject?.id, values.subjectName, values.subjectCode]);

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
				<Input readOnly label='Module' value={moduleId} />
				<Input readOnly label='Subject Code' value={values.subjectCode} />
			</div>
			<Input
				type='text'
				required
				label={"Subject Title"}
				value={values.subjectName}
				onChange={(e) => setField("subjectName", e.target.value)}
				disabled={isLoading}
				error={!!errors.subjectName}
			/>

			<Input
				type='number'
				label={"Theory Hours"}
				required
				value={values.theoryHours}
				onChange={(e) => setField("theoryHours", e.target.value)}
				disabled={isLoading}
				error={!!errors.theoryHours}
			/>

			<Input
				type='number'
				label={"Practical Hours"}
				required
				value={values.practicalHours}
				onChange={(e) => setField("practicalHours", e.target.value)}
				disabled={isLoading}
				error={!!errors.practicalHours}
			/>
		</div>
	);
});

export default SubjectForm;
