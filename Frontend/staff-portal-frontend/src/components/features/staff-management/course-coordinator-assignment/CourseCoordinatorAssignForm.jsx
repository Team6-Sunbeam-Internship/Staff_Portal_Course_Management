import { useState } from "react";
import { Button, CustomSelect } from "../../../layout";

export const CourseCoordinatorAssignForm = ({
	offering,
	coordinators,
	onSubmit,
	onCancel,
	isLoading,
}) => {
	const [selectedCoordinator, setSelectedCoordinator] = useState(
		offering?.assignmentId
			? { value: offering.staffId, label: offering.assignedStaffName } // Pre-select current
			: null
	);

	const coordinatorOptions = coordinators.map((c) => ({
		value: c.staffId,
		label: `${c.firstName} ${c.lastName}`,
	}));

	const handleSubmit = () => {
		if (!selectedCoordinator) return;

		const payload = {
			staffId: selectedCoordinator.value,
			courseCode: offering.courseCode,
			premiseId: offering.premiseId,
			// Include assignmentId for UPDATE requests
			...(offering.assignmentId && {
				assignmentId: offering.assignmentId,
			}),
		};
		onSubmit(payload);
	};

	return (
		<div className='space-y-4'>
			<CustomSelect
				label='Select Course Coordinator'
				value={selectedCoordinator?.value || ""}
				options={coordinatorOptions}
				onChange={(e) => {
					const selected = coordinatorOptions.find(
						(opt) => opt.value === e.target.value
					);
					setSelectedCoordinator(selected);
				}}
			/>
			<div className='flex justify-end space-x-2 pt-4'>
				<Button
					variant='secondary'
					onClick={onCancel}
					disabled={isLoading}
				>
					Cancel
				</Button>
				<Button onClick={handleSubmit} isLoading={isLoading}>
					{offering?.isAssigned ? "Reassign" : "Assign"}
				</Button>
			</div>
		</div>
	);
};
