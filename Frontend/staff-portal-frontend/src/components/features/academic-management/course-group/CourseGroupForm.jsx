import { useEffect, useMemo, useState } from "react";
import { Button, CustomSelect, FormField, HStack, Input, VStack } from "../../../layout";
import { Plus } from "lucide-react";

const CourseGroupForm = ({
	courseGroup,
	maxGroupCount,
	existingGroupCount,
	batchCycle,
	batchCycleName,
	courseType,
	courseTypeName,
	course,
	status,
	onSubmit,
	onCancel,
	isLoading = false,
}) => {
	const isEditing = !!courseGroup;

	const [newGroups, setNewGroups] = useState([
		{
			title: "",
			description: "",
			capacity: "",
			status: status?.[0]?.value,
		},
	]);

	const [editFormData, setEditFormData] = useState(null);
	const [allErrors, setAllErrors] = useState({});

	useEffect(() => {
		if (isEditing && courseGroup) {
			setEditFormData({
				title: courseGroup.title || "",
				description: courseGroup.description || "",
				capacity: courseGroup.capacity?.toString() || "",
				status: courseGroup.status || status?.[0]?.value || "ACTIVE",
				batchCycleId: courseGroup.batchCycleId || "",
				courseTypeId: courseGroup.courseTypeId || "",
				courseCode: courseGroup.courseId || "",
			});
		}
	}, [isEditing, courseGroup, status]);

	const groupsToCreateCount = newGroups.length;

	const groupsRemainingToCreate = useMemo(() => {
		if (maxGroupCount === null || typeof maxGroupCount !== "number" || maxGroupCount < 0) return 0;

		const remaining = maxGroupCount - existingGroupCount;
		return remaining < 0 ? 0 : remaining;
	}, [maxGroupCount, existingGroupCount]);

	const canAddMore = groupsToCreateCount < groupsRemainingToCreate;
	const isMaxReached = groupsRemainingToCreate <= 0;

	const handleNewGroupChange = (index, name, value) => {
		const updatedGroups = newGroups.map((group, i) => {
			if (i === index) {
				return {
					...group,
					[name]: value,
				};
			}
			return group;
		});
		setNewGroups(updatedGroups);
		// Clear error for the specific field if present
		if (allErrors[index] && allErrors[index][name]) {
			setAllErrors((prev) => {
				const newIndexErrors = { ...prev[index] };
				delete newIndexErrors[name];
				const newErrors = { ...prev };
				if (Object.keys(newIndexErrors).length === 0) {
					delete newErrors[index];
				} else {
					newErrors[index] = newIndexErrors;
				}
				return newErrors;
			});
		}
	};

	const handleAddMore = () => {
		if (canAddMore) {
			setAllErrors((prev) => [
				...prev,
				{
					title: "",
					description: "",
					capacity: "",
					status: status?.[0]?.value || "ACTIVE",
				},
			]);
		}
	};

	const handleRemoveGroup = (index) => {
		setNewGroups((prev) => prev.filter((_, i) => i !== index));
		setAllErrors((prev) => {
			// Shift errors if an item is removed
			const newErrors = {};
			Object.keys(prev).forEach((key) => {
				const i = parseInt(key);
				if (i < index) {
					newErrors[i] = prev[i];
				} else if (i > index) {
					newErrors[i - 1] = prev[i];
				}
			});
			return newErrors;
		});
	};

	const handleEditChange = (name, value) => {
		setEditFormData((prev) => ({ ...prev, [name]: value }));
		if (allErrors[name]) {
			setAllErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[name];
				return newErrors;
			});
		}
	};

	const validateForm = () => {
		const newErrors = {};
		let isValid = true;

		if (isEditing) {
			// Single group validation for edit mode
			if (!editFormData.title.trim()) newErrors.title = "Required";
			if (!editFormData.capacity || parseInt(editFormData.capacity, 10) <= 0) newErrors.capacity = "Must be a positive number";
			if (!editFormData.status) newErrors.status = "Required";

			setAllErrors(newErrors);
			isValid = Object.keys(newErrors).length === 0;
		} else {
			// Multi group validation for create mode
			newGroups.forEach((group, index) => {
				const groupErrors = {};
				if (!group.title.trim()) groupErrors.title = "Required";

				const capacityValue = parseInt(group.capacity, 10);
				if (!group.capacity || isNaN(capacityValue) || capacityValue <= 0) {
					groupErrors.capacity = "Must be a positive number";
				}

				if (!group.status) groupErrors.status = "Required";

				if (Object.keys(groupErrors).length > 0) {
					newErrors[index] = groupErrors;
					isValid = false;
				}
			});
			setAllErrors(newErrors);
		}

		return isValid;
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (validateForm()) {
			if (isEditing) {
				// Submit single group payload for update
				const payload = {
					...editFormData,
					capacity: parseInt(editFormData.capacity, 10),
				};
				onSubmit(payload);
			} else {
				// Submit array of group payloads for creation
				const payloadArray = newGroups.map((group) => ({
					title: group.title,
					description: group.description,
					capacity: parseInt(group.capacity, 10),
					status: group.status,
					// Inject the read-only IDs into every payload object
					batchCycleId: batchCycle,
					courseTypeId: courseType,
					courseCode: course,
				}));
				onSubmit(payloadArray);
			}
		}
	};
	return (
		<form onSubmit={handleSubmit} className='space-y-6'>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<FormField label='Batch Cycle'>
					<Input value={batchCycleName} disabled />
				</FormField>
				{/* Course Type */}
				<FormField label='Course Type'>
					<Input value={courseTypeName} disabled />
				</FormField>
				{/* Course Code */}
				<FormField label='Course Code'>
					<Input value={course} disabled />
				</FormField>
			</div>
			{/* --- EDIT MODE --- */}
			{isEditing && editFormData && (
				<GroupFormRow
					group={editFormData}
					index={0}
					statusOptions={status}
					onChange={(i, name, value) => handleEditChange(name, value)}
					errors={allErrors}
					disabled={isLoading}
					onRemove={() => {}} // Remove is not allowed in edit mode
				/>
			)}

			{/* Group Rows */}
			{/* --- MULTI-CREATE MODE --- */}
			{!isEditing && (
				<>
					<VStack spacing={3}>
						{newGroups.map((group, index) => (
							<GroupFormRow
								key={index}
								group={group}
								index={index}
								statusOptions={status}
								onChange={handleNewGroupChange}
								onRemove={handleRemoveGroup}
								errors={allErrors[index]}
								disabled={isLoading}
							/>
						))}
					</VStack>
					{/* [+ add more] button */}
					<div className='flex justify-start'>
						<Button
							type='button'
							variant='secondary'
							size='sm'
							onClick={handleAddMore}
							disabled={!canAddMore || isLoading}
							className='transition duration-150 ease-in-out hover:shadow-md'>
							<Plus size={16} className='mr-2' />
							[+ add more] ({groupsRemainingToCreate - groupsToCreateCount} remaining)
						</Button>
					</div>
				</>
			)}
			<div className='flex items-center  justify-end space-x-3 pt-4 border-t border-gray-300 dark:border-neutral-200'>
				<Button type='button' variant='danger' onClick={onCancel} disabled={isLoading}>
					Cancel
				</Button>
				<Button variant='secondary' type='submit' isLoading={isLoading} disabled={!isEditing && (isMaxReached || groupsToCreateCount === 0)}>
					{isEditing ? "Update Group" : `Create ${groupsToCreateCount} Group${groupsToCreateCount > 1 ? "s" : ""}`}s
				</Button>
			</div>
		</form>
	);
};

export default CourseGroupForm;

//------------------------------------------------------GroupFormRow------------------------------------------------------

const GroupFormRow = ({ group, index, statusOptions, onChange, onRemove, errors, disabled }) => {
	return (
		<div className='flex flex-col gap-4 p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-800'>
			{/* Row Header with Group Number and Remove Button */}
			<HStack className='justify-between items-center pb-2 border-b border-secondary-100 dark:border-secondary-700'>
				<h4 className='text-sm font-medium text-primary-600 dark:text-primary-400'>Course Group #{index + 1}</h4>
				{index > 0 && ( // Allow removal only if there is more than one row
					<Button variant='danger' size='sm' onClick={() => onRemove(index)} disabled={disabled}>
						Remove
					</Button>
				)}
			</HStack>

			{/* Title, Description, Capacity - IN ONE LINE (responsive grid) */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
				<FormField label='Title' required error={errors?.title} className='md:col-span-1'>
					<Input
						value={group.title}
						onChange={(e) => onChange(index, "title", e.target.value)}
						placeholder='Section 1'
						error={!!errors?.title}
						disabled={disabled}
					/>
				</FormField>

				<FormField label='Description' error={errors?.description} className='md:col-span-2'>
					<Input // Using Input for single-line look, as requested
						value={group.description}
						onChange={(e) => onChange(index, "description", e.target.value)}
						placeholder='Optional description'
						error={!!errors?.description}
						disabled={disabled}
					/>
				</FormField>

				<FormField label='Capacity' required error={errors?.capacity} className='md:col-span-1'>
					<Input
						type='number'
						value={group.capacity}
						onChange={(e) => onChange(index, "capacity", e.target.value)}
						placeholder='40'
						error={!!errors?.capacity}
						disabled={disabled}
						min='1'
					/>
				</FormField>
			</div>
			{/* Status is placed below the single line fields */}
			<div className='grid grid-cols-1 md:grid-cols-4'>
				<FormField label='Status' required error={errors?.status} className='md:col-span-1'>
					<CustomSelect
						value={group.status}
						onChange={(e) => onChange(index, "status", e.target.value)}
						options={statusOptions}
						error={!!errors?.status}
						disabled={disabled}
					/>
				</FormField>
			</div>
		</div>
	);
};
