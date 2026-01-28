import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useFormState } from "../../../../hooks/uiHook/useFormState";
import { CustomSelect } from "../../../layout";

export const CourseCoordinatorAssignForm = forwardRef(({ offering, coordinators, onSubmit, isLoading }, ref) => {
	const { values, errors, setField, setAll, submit, reset, isDirty } = useFormState({
		initialValues: {
			staffId: "",
		},
		validate: (vals) => {
			const errs = {};
			if (!vals.staffId) errs.staffId = "Please select a coordinator";
			return errs;
		},
		onSubmit: (vals) => {
			if (offering?.assignmentId) {
				onSubmit({
					id: offering.assignmentId,
					payload: {
						premiseId: offering.premiseId, // Required for manual cache update
						staffId: vals.staffId,
						courseCode: offering.courseCode,
						assignCourseStatus: offering.assignCourseStatus === "ASSIGNED" ? "UNASSIGNED" : "ASSIGNED",
					},
				});
			} else {
				onSubmit({
					payload: {
						premiseId: offering.premiseId, // Required for manual cache update
						staffId: vals.staffId,
						courseCode: offering.courseCode,
						assignCourseStatus: "ASSIGNED",
					},
				});
			}
		},
	});

	useEffect(() => {
		if (offering?.staffId) {
			setAll({
				staffId: offering.staffId,
			});
		}
	}, [offering, setAll]);

	useImperativeHandle(ref, () => ({
		submit,
		reset,
		isDirty,
	}));

	const coordinatorOptions = [
		{ value: "", label: "Select Course Coordinator" },
		...(coordinators?.map((c) => ({
			value: c.staffId,
			label: `${c.firstName} ${c.lastName}`,
		})) || []),
	];

	return (
		<div className='space-y-4'>
			<CustomSelect
				label='Select Course Coordinator'
				value={values.staffId}
				options={coordinatorOptions}
				onChange={(e) => setField("staffId", e.target.value)}
				error={!!errors.staffId}
				disabled={isLoading}
				required
			/>
		</div>
	);
});
