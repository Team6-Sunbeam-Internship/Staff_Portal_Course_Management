import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Button, FormField, Input } from "../../../layout";
import { useFormState } from "../../../../hooks/uiHook/useFormState";
import { useDebounce } from "../../../../hooks";
import { useModal } from "../../../../providers";

export const SectionForm = forwardRef(({  batchCycleId, courseCode, module, subject, onSubmit, isLoading = false }, ref) => {
	const { showModal } = useModal();
	const section = showModal?.payload;
	const { values, errors, setField, setAll, submit, reset, isDirty } = useFormState({
		initialValues: {
			sectionCode: "",
			sectionName: "",
		},
		validate: (vals) => {
			const errs = {};
			
			if (!vals.sectionName.trim()) errs.sectionName = "Section name is required";
			return errs;
		},
		onSubmit: (vals) => {
			onSubmit({
				id: section?.id,
				payload: vals,
				subjectId: subject,
				courseCode: courseCode
			});
		},
	});

	const originalCodeRef = useRef("");
	const originalNameRef = useRef("");

	useEffect(() => {
		if (!section) return;
		const initialCode = generateSectionCode(courseCode, section.title);
		setAll({
			sectionCode: initialCode,
			sectionName: section.title,
		});
		originalCodeRef.current = initialCode;
		originalNameRef.current = section.title;
	}, [section, courseCode]);
	const deboundedSectionName = useDebounce(values.sectionName, 400);
	const generateSectionCode = (courseCode, sectionName) => {
		if (!courseCode || !sectionName) return;
		const shortName = sectionName
			.trim()
			.replace(/[^a-zA-Z0-9 ]/g, "")
			.split(" ")
			.map((word) => word.slice(0, 4).toUpperCase())
			.join("");

		return `${courseCode}-${shortName}`;
	};
	useEffect(() => {
		if (!courseCode || !deboundedSectionName) return;

		const nameChange = deboundedSectionName !== originalNameRef.current;

		const nextCode = nameChange ? generateSectionCode(courseCode, deboundedSectionName) : originalCodeRef.current;

		if (values.sectionCode !== nextCode) {
			setField("sectionCode", nextCode);
		}
	}, [courseCode, deboundedSectionName]);

	useImperativeHandle(ref, () => ({
		submit,
		reset,
		isDirty,
	}));

	return (
		<div className='space-y-6'>
			{/**Read only value for batchCycleId, courseCode, moduleCode, and subjectCode */}
			<div className='grid grid-cols-3 gap-6'>
				<Input readOnly label={'Batch Cycle'} value={batchCycleId} />
				<Input readOnly label={'Course'} value={courseCode} />
				<Input readOnly label={'Module'} value={module} />
				<Input readOnly label={'Subject'} value={subject} />
				<Input readOnly label={"Section Code"} value={values.sectionCode} />
			</div>

			<Input
				type='text'
				label={"Section Name"}
				required
				value={values.sectionName}
				onChange={(e) => setField("sectionName", e.target.value)}
				disabled={isLoading}
			/>
		</div>
	);
});
