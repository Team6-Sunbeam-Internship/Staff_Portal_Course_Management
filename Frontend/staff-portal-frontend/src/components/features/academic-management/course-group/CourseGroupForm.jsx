import { Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { forwardRef, useEffect, useImperativeHandle, useMemo } from "react";
import { useFormState } from "../../../../hooks/uiHook/useFormState";
import { Button, CustomSelect, Input, VStack } from "../../../layout";
export const CourseGroupForm = forwardRef(
	({ courseGroup, maxGroupCount, existingGroupCount, batchCycleName, courseTypeName, course, status, onSubmit, isLoading = false }, ref) => {
		const isEditing = !!courseGroup;

		const { values, errors, setField, setAll, submit, reset, isDirty } = useFormState({
			initialValues: {
				groups: [
					{
						title: "",
						description: "",
						capacity: "",
						status: "",
					},
				],
			},
			validate: (vals) => {
				const errs = {};
				vals.groups.forEach((g, i) => {
					const e = {};
					if (!g.title?.trim()) e.title = "Required";
					if (!g.capacity || parseInt(g.capacity, 10) <= 0) e.capacity = "Must be a positive number";
					if (!g.status) e.status = "Required";
					if (Object.keys(e).length) errs[i] = e;
				});
				return Object.keys(errs).length ? errs : {};
			},
			onSubmit: (vals) => {
				if (isEditing) {
					const g = vals.groups[0];
					onSubmit({
						id: courseGroup.id,
						payload: {
							...g,
							capacity: parseInt(g.capacity, 10),
						},
						courseCode: course,
					});
				} else {
					onSubmit({
						payload: vals.groups.map((g) => ({
							...g,
							capacity: parseInt(g.capacity, 10),
						})),
						courseCode: course,
					});
				}
			},
		});

		useEffect(() => {
			if (isEditing && courseGroup) {
				setAll({
					groups: [
						{
							title: courseGroup.title || "",
							description: courseGroup.description || "",
							capacity: courseGroup.capacity?.toString() || "",
							status: courseGroup.status || "",
						},
					],
				});
			}
		}, [isEditing, courseGroup, status]);

		const groupsToCreateCount = values?.groups?.length;

		const groupsRemainingToCreate = useMemo(() => {
			if (maxGroupCount === null || typeof maxGroupCount !== "number" || maxGroupCount < 0) return 0;

			const remaining = maxGroupCount - existingGroupCount;
			return remaining < 0 ? 0 : remaining;
		}, [maxGroupCount, existingGroupCount]);

		const canAddMore = groupsToCreateCount < groupsRemainingToCreate;

		/* ---------------- IMPERATIVE API ---------------- */
		useImperativeHandle(ref, () => ({
			submit,
			reset,
			isDirty,
		}));

		return (
			<div className='space-y-6'>
				<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
					<Input label={"Course Type"} readOnly value={courseTypeName} disabled />
					<Input label={"Batch Cycle"} readOnly value={batchCycleName} disabled />
					<Input readOnly label={"Course"} value={course} disabled />
				</div>
				{/* --- EDIT MODE --- */}
				{/* GROUP ROWS (SAME COMPONENT, SAME STRUCTURE) */}
				<VStack spacing={3}>
					{values?.groups?.map((group, index) => (
						<GroupFormRow
							key={index}
							group={group}
							index={index}
							statusOptions={status}
							errors={errors?.groups?.[index]}
							disabled={isLoading}
							onChange={(i, name, value) => setField(`groups.${i}.${name}`, value)}
							onRemove={(i) =>
								setField(
									"groups",
									values?.groups?.filter((_, idx) => idx !== i)
								)
							}
						/>
					))}
				</VStack>
				{/* Group Rows */}
				{/* --- MULTI-CREATE MODE --- */}
				{/* ADD MORE (CREATE MODE ONLY) */}
				{!isEditing && (
					<Button
						type='button'
						variant='info'
						icon={Plus}
						size='sm'
						onClick={() =>
							canAddMore &&
							setField("groups", [
								...values.groups,
								{
									title: "",
									description: "",
									capacity: "",
									status: status?.[0]?.value,
								},
							])
						}
						disabled={!canAddMore || isLoading}>
						add more ({groupsRemainingToCreate - groupsToCreateCount} remaining)
					</Button>
				)}
			</div>
		);
	}
);

export default CourseGroupForm;

//------------------------------------------------------GroupFormRow------------------------------------------------------

const GroupFormRow = ({ group, index, statusOptions, onChange, onRemove, errors, disabled }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className='flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-zinc-50/30 p-5 dark:border-zinc-800 dark:bg-zinc-900/20'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<span className='flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10 text-[10px] font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'>
						{index + 1}
					</span>
					<h4 className='text-sm font-bold text-zinc-700 dark:text-zinc-300'>Course Group Details</h4>
				</div>
				{index > 0 && (
					<Button variant='danger' size='sm' icon={Trash2} onClick={() => onRemove(index)} disabled={disabled}>
						Remove
					</Button>
				)}
			</div>
			<div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
				<Input
					placeholder='e.g. Section A'
					label={"Title"}
					value={group.title}
					onChange={(e) => onChange(index, "title", e.target.value)}
					disabled={disabled}
					error={errors?.title}
				/>
				<Input label={"Description"} value={group.description} onChange={(e) => onChange(index, "description", e.target.value)} disabled={disabled} />
				<Input
					type='number'
					label={"Capacity"}
					value={group.capacity}
					onChange={(e) => onChange(index, "capacity", e.target.value)}
					disabled={disabled}
					min='1'
					error={errors?.capacity}
				/>
				<CustomSelect
					label='Status'
					value={group.status}
					options={statusOptions}
					onChange={(e) => onChange(index, "status", e.target.value)}
					disabled={disabled}
					error={errors?.status}
				/>
			</div>
		</motion.div>
	);
};
