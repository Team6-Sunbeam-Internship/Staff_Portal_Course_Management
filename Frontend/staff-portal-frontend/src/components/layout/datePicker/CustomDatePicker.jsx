import { LucideCalendar, LucideChevronDown, LucideChevronLeft, LucideChevronRight } from "lucide-react";
import { AnimatePresence, motion as Motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useOutsideClick } from "../../../hooks";
import { Label } from "../label";
export const CustomDatePicker = ({ label, variant = "standard", value, onChange, className = "" }) => {
	const isRange = variant === "range";
	const isInline = variant === "inline" || variant === "range";
	const [currentDate, setCurrentDate] = useState(isRange ? value?.start || new Date() : value || new Date());
	const [selectedDate, setSelectedDate] = useState(isRange ? null : value || null);
	const [range, setRange] = useState(isRange ? value || { start: null, end: null } : { start: null, end: null });
	const [showMonthDropdown, setShowMonthDropdown] = useState(false);
	const [showYearDropdown, setShowYearDropdown] = useState(false);

	const yearListRef = useRef(null);
	const monthListRef = useRef(null);
	const monthBtnRef = useRef(null);
	const yearBtnRef = useRef(null);

	useOutsideClick(monthListRef, () => setShowMonthDropdown(false));
	useOutsideClick(yearListRef, () => setShowYearDropdown(false));

	const daysOfWeek = [
		{ key: "sun", label: "Sun" },
		{ key: "mon", label: "Mon" },
		{ key: "tue", label: "Tue" },
		{ key: "wed", label: "Wed" },
		{ key: "thu", label: "Thu" },
		{ key: "fri", label: "Fri" },
		{ key: "sat", label: "Sat" },
	];
	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	const years = Array.from({ length: 103 }, (_, index) => 1947 + index);

	const scrollToActive = (containerRef) => {
		if (containerRef.current) {
			const activeElement = containerRef.current.querySelector('[data-active="true"]');
			if (activeElement) {
				const container = containerRef.current;
				const scrollTarget = activeElement.offsetTop - container.offsetHeight / 2 + activeElement.offsetHeight / 2;
				container.scrollTo({ top: scrollTarget, behavior: "smooth" });
			}
		}
	};

	useEffect(() => {
		if (showYearDropdown) {
			const timer = setTimeout(() => scrollToActive(yearListRef), 50);
			return () => clearTimeout(timer);
		}
	}, [showYearDropdown]);

	useEffect(() => {
		if (showMonthDropdown) {
			const timer = setTimeout(() => scrollToActive(monthListRef), 50);
			return () => clearTimeout(timer);
		}
	}, [showMonthDropdown]);

	useEffect(() => {
		if (isRange) {
			const hasStartChanged = !isSameDay(range.start, value?.start);
			const hasEndChanged = !isSameDay(range.end, value?.end);

			if (hasStartChanged || hasEndChanged) {
				setRange(value || { start: null, end: null });
				if (value?.start) {
					setCurrentDate(value.start);
				}
			}
		}
	}, [value, isRange, range.start, range.end]);

	const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
	const getFirstDayofMonth = (year, month) => new Date(year, month, 1).getDay();

	const handleDateClick = (day) => {
		const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

		if (isRange) {
			if (!range.start || (range.start && range.end)) {
				const newRange = { start: clickedDate, end: null };
				setRange(newRange);
				if (onChange) onChange(newRange);
			} else {
				let newRange;
				if (clickedDate < range.start) {
					newRange = { start: clickedDate, end: range.start };
				} else {
					newRange = { start: range.start, end: clickedDate };
				}
				setRange(newRange);
				if (onChange) onChange(newRange);
			}
		} else {
			setSelectedDate(clickedDate);
			if (onChange) onChange(clickedDate);
		}
	};

	const isToday = (day) => {
		const today = new Date();
		return today.getDate() === day && today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();
	};

	const isSameDay = (date1, date2) => {
		if (!date1 && !date2) return true;
		if (!date1 || !date2) return false;
		return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
	};

	const isDateSelected = (day) => {
		const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
		if (isRange) {
			return isSameDay(range.start, checkDate) || isSameDay(range.end, checkDate);
		}
		return isSameDay(selectedDate, checkDate);
	};

	const normalize = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

	const isInRange = (day) => {
		if (!isRange || !range.start || !range.end) return false;
		const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
		return normalize(checkDate) >= range.start && normalize(checkDate) <= range.end;
	};

	const formattedValue =
		selectedDate ?
			selectedDate.toLocaleDateString("en-IN", {
				month: "short",
				day: "numeric",
				year: "numeric",
			})
		:	"";

	const isFloating = formattedValue.length > 0;

	if (isInline) {
		const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
		const firstDay = getFirstDayofMonth(currentDate.getFullYear(), currentDate.getMonth());
		const blanks = Array(firstDay).fill(null);
		const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);

		return (
			<Motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				className={`relative w-full rounded-[2.5rem] border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 ${className}`}>
				<div className='mb-6 flex items-center justify-between px-2'>
					<div className='flex flex-col gap-1'>
						<Label>{label}</Label>
						<div className='relative flex items-center gap-2'>
							<button
								ref={monthBtnRef}
								onClick={() => {
									setShowMonthDropdown(!showMonthDropdown);
									setShowYearDropdown(false);
								}}
								className='tranistion-all flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-black tracking-tighter text-amber-500 uppercase hover:bg-amber-500/10'>
								{months[currentDate.getMonth()]}
								<LucideChevronDown size={12} className={showMonthDropdown ? "rotate-180 transition-transform duration-300 ease-in-out" : ""} />
							</button>
							<button
								ref={yearBtnRef}
								onClick={() => {
									setShowYearDropdown(!showYearDropdown);
									setShowMonthDropdown(false);
								}}
								className='tranistion-all flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-black tracking-tighter text-amber-500 uppercase hover:bg-amber-500/10'>
								{currentDate.getFullYear()}
								<LucideChevronDown size={12} className={showMonthDropdown ? "rotate-180 transition-transform duration-300 ease-in-out" : ""} />
							</button>

							{/* Month Dropdown List */}
							<AnimatePresence>
								{showMonthDropdown && (
									<Motion.div
										ref={monthListRef}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: 10 }}
										className='absolute top-8 left-0 z-50 scrollbar-none max-h-48 w-32 overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900'>
										{months.map((month, index) => {
											const isActive = currentDate.getMonth() === index;
											return (
												<button
													key={month}
													data-active={isActive}
													onClick={() => {
														setCurrentDate(new Date(currentDate.getFullYear(), index, 1));
														setShowMonthDropdown(false);
													}}
													className={`w-full rounded-xl px-3 py-2 text-left text-[10px] font-bold tracking-widest uppercase transition-colors ${isActive ? "bg-amber-500 text-zinc-950" : "text-zinc-500 hover:bg-amber-500/10 hover:text-amber-500"}`}>
													{month}
												</button>
											);
										})}
									</Motion.div>
								)}
							</AnimatePresence>

							{/* Year Dropdown List */}
							<AnimatePresence>
								{showYearDropdown && (
									<Motion.div
										ref={yearListRef}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: 10 }}
										className='absolute top-8 left-20 z-50 scrollbar-none max-h-48 w-24 overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-2 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900'>
										{years.map((y) => {
											// Highlight logic: Prioritize selected year, otherwise use current running year
											const isActive = currentDate.getFullYear() === y;
											return (
												<button
													key={y}
													data-active={isActive}
													onClick={() => {
														setCurrentDate(new Date(y, currentDate.getMonth(), 1));
														setShowYearDropdown(false);
													}}
													className={`w-full rounded-xl px-3 py-2 text-left text-[10px] font-bold tracking-widest uppercase transition-colors ${isActive ? "bg-amber-500 text-zinc-950" : "text-zinc-500 hover:bg-amber-500/10 hover:text-amber-500"}`}>
													{y}
												</button>
											);
										})}
									</Motion.div>
								)}
							</AnimatePresence>
						</div>
					</div>
					<div className='flex gap-1'>
						<button
							onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
							className='rounded-xl p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800'>
							<LucideChevronLeft size={16} />
						</button>
						<button
							onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
							className='rounded-xl p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800'>
							<LucideChevronRight size={16} />
						</button>
					</div>
				</div>
				{/* Calendar Grid */}
				<div className='grid grid-cols-7 gap-1 text-center'>
					{daysOfWeek.map((d) => (
						<span key={d.key} className='py-2 text-[10px] font-black text-zinc-400'>
							{d.label}
						</span>
					))}
					{blanks.map((_, i) => (
						<div key={`blank-${i}`} />
					))}
					{days.map((day) => {
						const selected = isDateSelected(day);
						const inRange = isInRange(day);
						return (
							<button
								key={`day-${day}`}
								onClick={() => handleDateClick(day)}
								className={`group relative flex aspect-square flex-col items-center justify-center rounded-xl text-xs transition-all ${selected ? "z-10 bg-amber-500 font-black text-zinc-950 shadow-lg shadow-amber-500/20" : "text-zinc-600 hover:bg-amber-500/10 dark:text-zinc-400"} ${inRange ? "rounded-none bg-amber-500/20 text-amber-600 first:rounded-l-xl last:rounded-r-xl dark:text-amber-400" : ""} ${!selected && !inRange ? "hover:bg-amber-500/10" : ""} ${isToday(day) && !selected ? "border border-amber-500/30" : ""} `}>
								{day}
								{isToday(day) && !selected && <div className='absolute bottom-1.5 h-1 w-1 rounded-full bg-amber-500' />}
							</button>
						);
					})}
				</div>
				{/* <AnimatePresence>
					{selectedDate && (
						<Motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							className='mt-6 flex items-center justify-between overflow-hidden border-t border-zinc-100 pt-4 dark:border-zinc-800'>
							<span className='text-[10px] font-black tracking-widest text-zinc-400 uppercase'>Selected</span>
							<span className='text-[11px] font-bold text-amber-500'>{formattedValue}</span>
						</Motion.div>
					)}
				</AnimatePresence> */}
			</Motion.div>
		);
	}

	return (
		<div className='group relative w-full'>
			<div className='pointer-events-none absolute left-4 z-30 transition-all duration-300' style={{ top: isFloating ? "-10px" : "20px" }}>
				<Label isFloating={isFloating}>{label}</Label>
			</div>
			<div className='relative'>
				<LucideCalendar size={18} className='pointer-events-none absolute top-1/2 left-4 z-20 -translate-y-1/2 text-amber-500' />
				<input
					type='text'
					readOnly
					placeholder={!isFloating ? "Select date..." : ""}
					className='relative z-10 w-full rounded-2xl border border-zinc-200 bg-white py-3.5 pt-6 pr-4 pb-2.5 pl-12 text-sm shadow-sm transition-all outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100'
					value={formattedValue}
				/>
			</div>
		</div>
	);
};
