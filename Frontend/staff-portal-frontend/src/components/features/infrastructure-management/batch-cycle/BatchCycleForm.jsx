// import { useEffect, useRef, useState } from "react";
// import { FormField, Button, Input, Select, TextArea, CustomSelect, CustomDatePicker } from "../../../layout";
// import { LucideAArrowDown, LucideArrowDown, LucideChevronDown, Type } from "lucide-react";
// import { motion, AnimatePresence } from "motion/react";
// import { useOutsideClick } from "../../../../hooks";
// export const BatchCycleForm = ({ batchCycle, onSubmit, onCancel, isLoading = false }) => {
// 	const [formData, setFormData] = useState({
// 		title: "",
// 		description: "",
// 		startDate: "",
// 		endDate: "",
// 		status: "PLANNED",
// 	});
// 	const [errors, setErrors] = useState({});
// 	const [isPickerOpen, setIsPickerOpen] = useState(false);
// 	const datePickerWrapperRef = useRef(null);
// 	useOutsideClick(datePickerWrapperRef, () => setIsPickerOpen(false));

// 	useEffect(() => {
// 		if (batchCycle) {
// 			setFormData({
// 				title: batchCycle.title || "",
// 				description: batchCycle.description || "",
// 				startDate: batchCycle.startDate?.split("T")[0] || "",
// 				endDate: batchCycle.endDate?.split("T")[0] || "",
// 				status: batchCycle.status || "PLANNED",
// 			});
// 		}
// 	}, [batchCycle]);
// 	const formatDateLocal = (date) => {
// 		if (!date) return "";
// 		const year = date.getFullYear();
// 		const month = String(date.getMonth() + 1).padStart(2, "0");
// 		const day = String(date.getDate()).padStart(2, "0");
// 		return `${year}-${month}-${day}`;
// 	};

// 	const formatDisplayDate = (dateStr) => {
// 		if (!dateStr) return "--/--/--";
// 		return new Date(dateStr).toLocaleDateString("en-IN", {
// 			year: "numeric",
// 			month: "short",
// 			day: "numeric",
// 		});
// 	};
// 	const handleDateRangeChange = (range) => {
// 		const startStr = range.start ? formatDateLocal(range.start) : "";
// 		const endStr = range.end ? formatDateLocal(range.end) : "";

// 		setFormData((prev) => ({
// 			...prev,
// 			startDate: startStr,
// 			endDate: endStr,
// 		}));

// 		if (errors.startDate || errors.endDate) {
// 			setErrors((prev) => ({
// 				...prev,
// 				startDate: "",
// 				endDate: "",
// 			}));
// 		}
// 	};

// 	const statusOptions = [
// 		{ value: "PLANNED", label: "Planned" },
// 		{ value: "ACTIVE", label: "Active" },
// 		{ value: "COMPLETED", label: "Completed" },
// 		{ value: "INACTIVE", label: "Inactive" },
// 	];

// 	const validateForm = () => {
// 		const newErrors = {};

// 		if (!formData.title.trim()) {
// 			newErrors.title = "Batch cycle title is required";
// 		}

// 		if (!formData.startDate) {
// 			newErrors.startDate = "Start date is required";
// 		}

// 		if (!formData.endDate) {
// 			newErrors.endDate = "End date is required";
// 		} else if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
// 			newErrors.endDate = "End date cannot be before start date";
// 		}

// 		setErrors(newErrors);
// 		return Object.keys(newErrors).length === 0;
// 	};

// 	const handleSubmit = (e) => {
// 		e.preventDefault();
// 		if (validateForm()) {
// 			onSubmit({
// 				...formData,
// 				id: batchCycle?.id,
// 			});
// 		}
// 	};

// 	const handleInputChange = (field, value) => {
// 		setFormData((prev) => ({ ...prev, [field]: value }));
// 		if (errors[field]) {
// 			setErrors((prev) => ({ ...prev, [field]: "" }));
// 		}
// 	};

// 	return (
// 		<div onSubmit={handleSubmit} className='space-y-6'>
// 			<div className='grid grid-cols-1 gap-4'>
// 				<Input
// 					type='text'
// 					label={"Title"}
// 					required
// 					icon={Type}
// 					value={formData.title}
// 					onChange={(e) => handleInputChange("title", e.target.value)}
// 					placeholder='e.g., Batch Cycle 2024-01'
// 					error={!!errors.title}
// 					disabled={isLoading}
// 				/>
// 			</div>
// 			<div className='grid grid-cols-2 items-center gap-4'>
// 				<div className='relative w-full' ref={datePickerWrapperRef}>
// 					<button
// 						type='button'
// 						onClick={() => setIsPickerOpen(!isPickerOpen)}
// 						disabled={isLoading}
// 						className={`flex w-full items-center justify-between gap-2 rounded-2xl px-4 py-3.5 text-left text-[10px] font-black tracking-widest uppercase transition-all ${isPickerOpen ? "bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20" : "border border-zinc-200 bg-white text-amber-400 hover:border-amber-500/50 dark:border-zinc-800 dark:bg-zinc-950"}`}>
// 						{formData.startDate ? `${formatDisplayDate(formData.startDate)} - ${formatDisplayDate(formData.endDate)}` : "Select Start-End Date"}
// 						<LucideChevronDown size={14} className={`transition-transform duration-300 ${isPickerOpen ? "rotate-180" : "opacity-30"}`} />
// 					</button>
// 					<div className='absolute top-full left-0 z-[100] mt-2 w-full'>
// 						<AnimatePresence mode='wait'>
// 							{isPickerOpen && (
// 								<motion.div
// 									layout
// 									initial={{ opacity: 0, height: 0, scale: 0.98, y: -10 }}
// 									animate={{ opacity: 1, height: "auto", scale: 1, y: 0 }}
// 									exit={{ opacity: 0, height: 0, scale: 0.98, y: -10 }}
// 									transition={{ type: "spring", stiffness: 400, damping: 35, opacity: { duration: 0.3 } }}
// 									className='w-full origin-top overflow-hidden'>
// 									<CustomDatePicker
// 										variant='range'
// 										value={{
// 											start: formData.startDate ? new Date(formData.startDate) : null,
// 											end: formData.endDate ? new Date(formData.endDate) : null,
// 										}}
// 										onChange={handleDateRangeChange}
// 										disabled={isLoading}
// 									/>
// 								</motion.div>
// 							)}
// 						</AnimatePresence>
// 					</div>
// 				</div>
// 				<CustomSelect
// 					value={formData.status}
// 					onChange={(e) => handleInputChange("status", e.target.value)}
// 					options={statusOptions}
// 					error={!!errors.status}
// 					disabled={isLoading}
// 					className='dark:text-amber-400'
// 				/>
// 			</div>
// 			<TextArea
// 				value={formData.description}
// 				label={"Description"}
// 				onChange={(e) => handleInputChange("description", e.target.value)}
// 				placeholder='Enter batch cycle description (optional)'
// 				rows={4}
// 				error={!!errors.description}
// 				disabled={isLoading}
// 			/>
// 		</div>
// 	);
// };

import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { Input, TextArea, CustomSelect, CustomDatePicker } from "../../../layout";
import { LucideChevronDown, Type } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useOutsideClick } from "../../../../hooks";
import { forwardRef } from "react";
import { useFormState } from "../../../../hooks/uiHook/useFormState";
export const BatchCycleForm = forwardRef(({ batchCycle, onSubmit, isLoading = false }, ref) => {
	const { values, errors, setField, setAll, submit, reset, isDirty } = useFormState({
		initialValues: {
			title: "",
			description: "",
			startDate: "",
			endDate: "",
			status: "PLANNED",
		},
		validate: (vals) => {
			const errs = {};

			if (!vals.title.trim()) errs.title = "Title is required";
			if (!vals.startDate) errs.startDate = "Start date is required";
			if (!vals.endDate) errs.endDate = "End date is required";
			if (vals.startDate && vals.endDate && new Date(vals.endDate) < new Date(vals.startDate)) {
				errs.endDate = "End date cannot be before start date";
			}
			return errs;
		},
		onSubmit: (vals) =>
			onSubmit({
				...vals,
				id: batchCycle?.id,
			}),
	});

	// Sync edit mode
	useEffect(() => {
		if (batchCycle) {
			setAll({
				title: batchCycle.title || "",
				description: batchCycle.description || "",
				startDate: batchCycle.startDate?.split("T")[0] || "",
				endDate: batchCycle.endDate?.split("T")[0] || "",
				status: batchCycle.status || "PLANNED",
			});
		}
	}, [batchCycle]);

	useImperativeHandle(ref, () => ({
		submit,
		reset,
		isDirty,
	}));

	const [isPickerOpen, setIsPickerOpen] = useState(false);
	const datePickerWrapperRef = useRef(null);
	useOutsideClick(datePickerWrapperRef, () => setIsPickerOpen(false));

	const formatDateLocal = (date) => {
		if (!date) return "";
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	const formatDisplayDate = (dateStr) => {
		if (!dateStr) return "--/--/--";
		return new Date(dateStr).toLocaleDateString("en-IN", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};
	const handleDateRangeChange = (range) => {
		const startStr = range.start ? formatDateLocal(range.start) : "";
		const endStr = range.end ? formatDateLocal(range.end) : "";

		setField("startDate", startStr);
		setField("endDate", endStr);
	};

	const statusOptions = [
		{ value: "PLANNED", label: "Planned" },
		{ value: "ACTIVE", label: "Active" },
		{ value: "COMPLETED", label: "Completed" },
		{ value: "INACTIVE", label: "Inactive" },
	];

	return (
		<div className='space-y-6'>
			<div className='grid grid-cols-1 gap-4'>
				<Input
					type='text'
					label={"Title"}
					required
					icon={Type}
					value={values.title}
					onChange={(e) => setField("title", e.target.value)}
					placeholder='e.g., Batch Cycle 2024-01'
					error={!!errors.title}
					disabled={isLoading}
				/>
			</div>
			<div className='grid grid-cols-2 items-center gap-4'>
				<div className='relative w-full' ref={datePickerWrapperRef}>
					<button
						type='button'
						onClick={() => setIsPickerOpen(!isPickerOpen)}
						disabled={isLoading}
						className={`flex w-full items-center justify-between gap-2 rounded-2xl px-4 py-3.5 text-left text-[10px] font-black tracking-widest uppercase transition-all ${isPickerOpen ? "bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20" : "border border-zinc-200 bg-white text-amber-400 hover:border-amber-500/50 dark:border-zinc-800 dark:bg-zinc-950"}`}>
						{values.startDate ? `${formatDisplayDate(values.startDate)} - ${formatDisplayDate(values.endDate)}` : "Select Start-End Date"}
						<LucideChevronDown size={14} className={`transition-transform duration-300 ${isPickerOpen ? "rotate-180" : "opacity-30"}`} />
					</button>
					<div className='absolute top-full left-0 z-[100] mt-2 w-full'>
						<AnimatePresence mode='wait'>
							{isPickerOpen && (
								<motion.div
									layout
									initial={{ opacity: 0, height: 0, scale: 0.98, y: -10 }}
									animate={{ opacity: 1, height: "auto", scale: 1, y: 0 }}
									exit={{ opacity: 0, height: 0, scale: 0.98, y: -10 }}
									transition={{ type: "spring", stiffness: 400, damping: 35, opacity: { duration: 0.3 } }}
									className='w-full origin-top overflow-hidden'>
									<CustomDatePicker
										variant='range'
										value={{
											start: values.startDate ? new Date(values.startDate) : null,
											end: values.endDate ? new Date(values.endDate) : null,
										}}
										onChange={handleDateRangeChange}
										disabled={isLoading}
									/>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
				<CustomSelect
					value={values.status}
					onChange={(e) => setField("status", e.target.value)}
					options={statusOptions}
					error={!!errors.status}
					disabled={isLoading}
					className='dark:text-amber-400'
				/>
			</div>
			<TextArea
				value={values.description}
				label={"Description"}
				onChange={(e) => setField("description", e.target.value)}
				placeholder='Enter batch cycle description (optional)'
				rows={4}
				// error={!!errors.description}
				disabled={isLoading}
			/>
		</div>
	);
});
