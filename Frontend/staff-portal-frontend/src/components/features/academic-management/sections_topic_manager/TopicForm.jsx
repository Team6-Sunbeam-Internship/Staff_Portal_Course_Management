import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { FormField, Input } from "../../../layout";
import { useFormState } from "../../../../hooks/uiHook/useFormState";
import { useDebounce } from "../../../../hooks";

export const TopicForm = forwardRef(({ topic, batchCycleId, courseCode, module, subject, section, onSubmit, isLoading = false }, ref) => {
	const { values, errors, setField, setAll, submit, reset, isDirty } = useFormState({
		initialValues: {
			topicCode: "",
			topicName: "",
		},
		validate: (vals) => {
			const errs = {};
			if (!vals.topicCode.trim()) errs.topicCode = "Subject code is required";
			if (!vals.topicName.trim()) errs.topicName = "Subject name is required";
			return errs;
		},
		onSubmit: (vals) => {
			onSubmit({
				id: topic?.id,
				payload: vals,
				sectionId: section,
				courseCode: courseCode,
			});
		},
	});

	const originalCodeRef = useRef("");
	const originalNameRef = useRef("");
	
	useEffect(() => {
		if (!topic) return;
		const initialCode = generateTopicCode(courseCode, topic.title);
		setAll({
			topicCode: initialCode,
			topicName: topic.title,
		});
		originalCodeRef.current = initialCode;
		originalNameRef.current = topic.title;
	}, [topic, courseCode]);

	const debouncedTopicName = useDebounce(values.topicName, 400);
	const generateTopicCode = (courseCode, topicName) => {
		if (!courseCode || !topicName) return;
		const shortName = topicName
			.trim()
			.replace(/[^a-zA-Z0-9]/g, "")
			.split("")
			.map((word) => word.slice(0, 4).toUpperCase())
			.join("");

		return `${courseCode}-${shortName}`;
	};
	useEffect(() => {
		if (!courseCode || !debouncedTopicName) return;

		const nameChange = debouncedTopicName !== originalNameRef.current;

		const nextCode = nameChange ? generateTopicCode(courseCode, debouncedTopicName) : originalCodeRef.current;

		if (values.topicCode !== nextCode) {
			setField("topicCode", nextCode);
		}
	}, [courseCode, debouncedTopicName]);

	useImperativeHandle(ref, () => ({
		submit,
		reset,
		isDirty,
	}));

	return (
		<div className='space-y-6'>
			{/**Read only value for batchCycleId, courseCode, moduleCode, subjectCode, sectionCode */}
			<div className='grid grid-cols-3 gap-6'>
				<Input readOnly label='Batch Cycle' value={batchCycleId} />
				<Input readOnly label='Course' value={courseCode} />
				<Input readOnly label='Module' value={module} />
				<Input readOnly label='Subject' value={subject} />
				<Input readOnly label={'Section'} value={section} />
				<Input label={"Topic Code"} readOnly value={values.topicCode} />
			</div>

			<Input
				type='text'
				label={"Topic Title"}
				required
				value={values.topicName}
				onChange={(e) => setField("topicName", e.target.value)}
				disabled={isLoading}
			/>
		</div>
	);
});
