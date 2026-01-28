// import { useRef, useState } from "react";
// import { useOutsideClick } from "../../../hooks";
// import { Check, ChevronDown } from "lucide-react";
// import { motion } from "motion/react";

// export const CustomSelect = ({ label, value, options, onChange, error = false, disabled = false }) => {
// 	const [isOpen, setIsOpen] = useState(false);
// 	const wrapperRef = useRef(null);
// 	// Use the mock click outside hook
// 	useOutsideClick(wrapperRef, () => setIsOpen(false));

// 	// Find the currently selected option object or default to the first option if the value is empty
// 	const selectedOption = options?.find((opt) => String(opt.value) === String(value)) ||
// 		options[0] || {
// 			label: "Select an option",
// 			value: "",
// 		};

// 	const handleSelect = (optionValue) => {
// 		// Mimic the native event structure expected by CourseList's handleFilterChange
// 		onChange({ target: { value: optionValue } });
// 		setIsOpen(false);
// 	};
// 	const borderClass =
// 		error ?
// 			"border-red-500 ring-red-500 focus:ring-red-500" // Error style
// 		:	"border-gray-300 dark:border-neutral-700 focus:border-blue-500 focus:ring-blue-500";

// 	const containerVariants = {
// 		open: {
// 			height: "auto",
// 			opacity: 1,
// 			transition: {
// 				height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
// 				staggerChildren: 1,
// 				delayChildren: 0.02,
// 			},
// 		},
// 		closed: {
// 			height: 0,
// 			opacity: 0,
// 			transition: {
// 				height: { duration: 0.3, ease: [0.4, 0, 1, 1] },
// 				staggerChildren: 0.1,
// 				staggerDirection: -1,
// 			},
// 		},
// 	};
// 	return (
// 		<motion.div variants={containerVariants} initial='closed' animate='open' exit='closed' ref={wrapperRef} className='relative mt-3  w-full'>
// 			{label && <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>{label}</label>}
// 			{/* Custom Styled Button (The main filter box) */}
// 			<button
// 				type='button'
// 				className={`focu:border-amber-500 relative flex w-full cursor-pointer items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 pt-5 pb-2 text-left shadow-sm transition-all outline-none focus:ring-4 focus:ring-amber-500/10 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-100 ${borderClass} ${
// 					disabled ? "cursor-not-allowed opacity-60" : "hover:border-gray-400 dark:hover:border-neutral-600"
// 				}`}
// 				onClick={() => setIsOpen(!isOpen)}
// 				aria-haspopup='listbox'
// 				aria-expanded={isOpen}>
// 				<span className='truncate text-gray-900 dark:text-gray-100'>{selectedOption?.label || "Select an option"}</span>
// 				<ChevronDown size={16} className={`ml-2 transform transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`} />
// 			</button>

// 			{/* Dropdown List - Now always mounted, height/opacity controlled by state */}
// 			<div
// 				className={`absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-xl transition-all duration-300 ease-out dark:border-neutral-700 dark:bg-neutral-800 ${
// 					isOpen ? "visible max-h-60 opacity-100" : "invisible max-h-0 opacity-0"
// 				} scrollbar-none overflow-y-auto`}>
// 				<ul role='listbox' className='py-1'>
// 					{options.map((option) => (
// 						<li
// 							key={option.value}
// 							role='option'
// 							aria-selected={String(option.value) === String(value)}
// 							className={`flex cursor-pointer items-center justify-between px-4 py-2 text-sm transition-colors ${
// 								String(option.value) === String(value) ?
// 									"bg-blue-50 font-medium text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
// 								:	"text-gray-700 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-neutral-700"
// 							}`}
// 							onClick={() => handleSelect(option.value)}>
// 							<span>{option.label}</span>
// 							{String(option.value) === String(value) && <Check size={16} />}
// 						</li>
// 					))}
// 				</ul>
// 			</div>
// 		</motion.div>
// 	);
// };

import { LucideCheck, LucideChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Label } from "../label";

export const CustomSelect = ({ label, options, value, onChange, error = false, disabled = false, className = "", multiple = false }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [focusedIndex, setFocusedIndex] = useState(-1);
	const [menuStyle, setMenuStyle] = useState({});
	const listRef = useRef(null);
	const buttonRef = useRef(null);
	const dropdownRef = useRef(null);

	const getSelectedOptions = () => {
		if (multiple) {
			const values = Array.isArray(value) ? value : [];
			return options?.filter((opt) => values.includes(opt.value)) || [];
		}
		return [options?.find((opt) => String(opt.value) === String(value)) || options?.[0]].filter(Boolean);
	};

	const selectedOptions = getSelectedOptions();
	const selectedOption = selectedOptions[0] || { label: "Select an option", value: "" };

	const isSelected = (optionValue) => {
		if (multiple) {
			return Array.isArray(value) && value.includes(optionValue);
		}
		return String(value) === String(optionValue);
	};

	useEffect(() => {
		if (isOpen && Array.isArray(options)) {
			let selectedIndex = -1;
			if (multiple) {
				const values = Array.isArray(value) ? value : [];
				selectedIndex = options.findIndex((opt) => values.includes(opt.value));
			} else {
				selectedIndex = options.findIndex((opt) => String(opt.value) === String(value));
			}
			setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
		}
	}, [isOpen, options, value, multiple]);

	// Custom outside click handler for Portal support
	useEffect(() => {
		if (!isOpen) return;

		const handleClickOutside = (event) => {
			const isClickInsideButton = buttonRef.current && buttonRef.current.contains(event.target);
			const isClickInsideDropdown = dropdownRef.current && dropdownRef.current.contains(event.target);

			if (!isClickInsideButton && !isClickInsideDropdown) {
				setIsOpen(false);
			}
		};

		// Close on scroll or resize to prevent detached/misaligned dropdowns
		const handleScrollOrResize = (event) => {
			if (!isOpen) return;
			// If resize, always close
			if (event.type === "resize") {
				setIsOpen(false);
				return;
			}
			// If scroll, only close if the scroll is NOT inside the dropdown
			if (event.type === "scroll") {
				const isScrollInsideDropdown = dropdownRef.current && dropdownRef.current.contains(event.target);
				if (!isScrollInsideDropdown) {
					setIsOpen(false);
				}
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("touchstart", handleClickOutside);
		// window.addEventListener("scroll", handleScrollOrResize, true); // Capture phase to detect any scroll
		window.addEventListener("resize", handleScrollOrResize);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchstart", handleClickOutside);
			// window.removeEventListener("scroll", handleScrollOrResize, true);
			window.removeEventListener("resize", handleScrollOrResize);
		};
	}, [isOpen]);

	useLayoutEffect(() => {
		if (!isOpen || !buttonRef.current) return;

		const rect = buttonRef.current.getBoundingClientRect();

		setMenuStyle({
			position: "fixed",
			top: rect.bottom + 8,
			left: rect.left,
			width: rect.width,
			zIndex: 9999,
		});
	}, [isOpen]);

	const toggleOpen = () => {
		setIsOpen((prev) => !prev);
	};

	const handleSelect = (optionValue) => {
		let nextValue;
		if (multiple) {
			const currentValues = Array.isArray(value) ? value : [];
			if (currentValues.includes(optionValue)) {
				nextValue = currentValues.filter((v) => v !== optionValue);
			} else {
				nextValue = [...currentValues, optionValue];
			}
		} else {
			nextValue = optionValue;
			setIsOpen(false);
		}
		onChange({ target: { value: nextValue } });
	};

	const handleKeyDown = (e) => {
		if (disabled) return;
		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				setIsOpen(true);
				setFocusedIndex((prevIndex) => (prevIndex < options?.length - 1 ? prevIndex + 1 : 0));
				break;
			case "ArrowUp":
				e.preventDefault();
				setIsOpen(true);
				setFocusedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : options?.length - 1));
				break;
			case "Enter":
				e.preventDefault();
				if (isOpen && focusedIndex >= 0) {
					handleSelect(options[focusedIndex].value);
				} else {
					setIsOpen(true);
				}
				break;
			case "Escape":
				setIsOpen(false);
				buttonRef.current?.focus();
				break;
			default:
				break;
		}
	};

	useEffect(() => {
		if (!listRef.current || focusedIndex < 0) return;
		const item = listRef.current.children[focusedIndex];
		item?.scrollIntoView({ block: "nearest" });
	}, [focusedIndex]);

	const containerVariants = {
		open: {
			height: "auto",
			opacity: 1,
			transition: {
				height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
				staggerChildren: 0.05,
			},
		},
		closed: {
			height: 0,
			opacity: 0,
			transition: {
				height: { duration: 0.3, ease: [0.4, 0, 1, 1] },
			},
		},
	};

	return (
		<div className={`relative w-full ${className}`}>
			<div className='absolute -top-2 left-4 z-30'>
				<Label variant={error ? "error" : "default"} isFloating={true}>
					{label}
				</Label>
			</div>

			<button
				ref={buttonRef}
				type='button'
				onKeyDown={handleKeyDown}
				disabled={disabled}
				onClick={toggleOpen}
				className={`flex w-full items-center justify-between rounded-2xl border bg-white px-4 pt-3 pb-3 text-left shadow-sm transition-all outline-none dark:bg-zinc-950/50 ${
					error ?
						"border-rose-500 focus:ring-4 focus:ring-rose-500/10"
					:	"border-zinc-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-zinc-800"
				} ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} dark:text-amber-400`}>
				<span className='truncate text-sm font-semibold'>
					{multiple ?
						selectedOptions.length > 0 ?
							selectedOptions.map((opt) => opt.label).join(", ")
						:	"Select options"
					:	selectedOption?.label || "Select an option"}
				</span>
				<motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
					<LucideChevronDown size={18} className={error ? "text-rose-500" : "text-amber-500"} />
				</motion.div>
			</button>

			{createPortal(
				<AnimatePresence>
					{isOpen && (
						<motion.div
							ref={dropdownRef}
							style={menuStyle}
							variants={containerVariants}
							initial='closed'
							animate='open'
							exit='closed'
							className='overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900'>
							<ul ref={listRef} className='scrollbar-none max-h-60 overflow-y-auto py-2'>
								{options?.map((option, index) => (
									<motion.li
										key={option.value}
										onMouseEnter={() => setFocusedIndex(index)}
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										onClick={() => handleSelect(option.value)}
										className={`flex cursor-pointer items-center justify-between px-4 py-3 transition-colors ${
											index === focusedIndex ?
												"bg-amber-50 font-black text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
											:	"text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
										}`}>
										<span className='text-sm'>{option.label}</span>
										{isSelected(option.value) && <LucideCheck size={16} strokeWidth={3} />}
									</motion.li>
								))}
							</ul>
						</motion.div>
					)}
				</AnimatePresence>,
				document.body
			)}
		</div>
	);
};
