import { useRef, useState } from "react";
import { useOutsideClick } from "../../../hooks";
import { Check, ChevronDown } from "lucide-react";

export const CustomSelect = ({
	label,
	value,
	options,
	onChange,
	error = false,
	disabled = false,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const wrapperRef = useRef(null);
	// Use the mock click outside hook
	useOutsideClick(wrapperRef, () => setIsOpen(false));

	// Find the currently selected option object or default to the first option if the value is empty
	const selectedOption = options.find(
		(opt) => String(opt.value) === String(value)
	) ||
		options[0] || {
			label: "Select an option",
			value: "",
		};

	const handleSelect = (optionValue) => {
		// Mimic the native event structure expected by CourseList's handleFilterChange
		onChange({ target: { value: optionValue } });
		setIsOpen(false);
	};
	const borderClass = error
		? "border-red-500 ring-red-500 focus:ring-red-500" // Error style
		: "border-gray-300 dark:border-neutral-700 focus:border-blue-500 focus:ring-blue-500";
	return (
		<div ref={wrapperRef} className='relative w-full'>
			{label && (
				<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
					{label}
				</label>
			)}
			{/* Custom Styled Button (The main filter box) */}
			<button
				type='button'
				className={`w-full flex justify-between items-center px-4 py-2 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded-lg shadow-sm text-left cursor-pointer focus:outline-none  transition-colors h-[42px] text-sm
                    ${borderClass} 
                    ${
						disabled
							? "opacity-60 cursor-not-allowed"
							: "hover:border-gray-400 dark:hover:border-neutral-600"
					}`}
				onClick={() => setIsOpen(!isOpen)}
				aria-haspopup='listbox'
				aria-expanded={isOpen}
			>
				<span className='truncate text-gray-900 dark:text-gray-100'>
					{selectedOption?.label || "Select an option"}
				</span>
				<ChevronDown
					size={16}
					className={`ml-2 transform transition-transform ${
						isOpen ? "rotate-180" : "rotate-0"
					}`}
				/>
			</button>

			{/* Dropdown List - Now always mounted, height/opacity controlled by state */}
			<div
				className={`
                    absolute mt-1 w-full rounded-lg shadow-xl bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 z-50
                    transition-all duration-300 ease-out
                    ${
						isOpen
							? "max-h-60 opacity-100 visible"
							: "max-h-0 opacity-0 invisible"
					} 
                    overflow-y-auto scrollbar-none
                `}
			>
				<ul role='listbox' className='py-1'>
					{options.map((option) => (
						<li
							key={option.value}
							role='option'
							aria-selected={
								String(option.value) === String(value)
							}
							className={`flex items-center justify-between px-4 py-2 cursor-pointer text-sm transition-colors 
                                ${
									String(option.value) === String(value)
										? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-medium"
										: "text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-neutral-700"
								}`}
							onClick={() => handleSelect(option.value)}
						>
							<span>{option.label}</span>
							{String(option.value) === String(value) && (
								<Check size={16} />
							)}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};
