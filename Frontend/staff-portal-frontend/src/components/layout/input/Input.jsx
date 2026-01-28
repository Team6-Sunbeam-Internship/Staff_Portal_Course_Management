import { useCallback, useEffect, useRef, useState } from "react";
import { Label } from "../label";
import { motion, AnimatePresence } from "motion/react";
import { Minus, Plus } from "lucide-react";
export const Input = ({ label, icon: Icon, error, value, onChange, required = false,className="", type="text", ...props }) => {
	const [isFocused, setIsFocused] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const timerRef = useRef(null);
	const hasValue =
	value !== undefined &&
	value !== null &&
	String(value).length > 0;
	const isFloating = isFocused || hasValue;

	const isNumber = type === "number";
	const isPassword = type === "password";
	const inputType = isPassword ? (showPassword ? "text" : "password"): type;
	const triggerChange = useCallback((newValue) => {
		if(onChange) onChange({target: {...props, value: newValue, name: props.name}})
	},[onChange, props]);
	const handleStep = useCallback((direction) => {
		const current = parseFloat(value) || 0;
		const step = parseFloat(props.step) || 1;
		const min = props.min !== undefined ? parseFloat(props.min) : -Infinity;
		const max = props.max !== undefined ? parseFloat(props.max) : Infinity;
		
		let nextValue = current + direction * step;
		if (nextValue < min) nextValue = min;
		if (nextValue > max) nextValue = max;
		
		const stepString = step.toString();
		const precision = stepString.includes(".") ? stepString.split(".")[1].length : 0;
		const formattedValue = precision > 0 ? nextValue.toFixed(precision) : nextValue;
		
		triggerChange(formattedValue);
	}, [value, props, triggerChange]);
	
	const startStepping = (direction) => {
    handleStep(direction);
    timerRef.current = setInterval(() => handleStep(direction), 120);
  };

  const stopStepping = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

	useEffect(() => { return () => { stopStepping() } }, []);	
	return (
		<div className='relative w-full group/input'>
			<style>{`
			input[type='number']::-webkit-outer-spin-button,
        input[type='number']::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type='number'] { -moz-appearance: textfield; }
			`}</style>
			<div className='relative'>
				{label && (
					<div
						className={`pointer-events-none absolute left-4 z-30 flex items-center transition-all duration-300 ${isFloating ? "-top-2.5 origin-left scale-98" : "top-1/2 -translate-y-1/2 scale-100"} ${Icon && !isFloating ? "pl-8" : "pl-0"}`}>
						<Label variant={error ? "error" : "default"} isFloating={isFloating}>
							{label}
							{required && <span className='text-red-500'> *</span>}
						</Label>
					</div>
				)}
				{Icon && (
					<div
						className={`pointer-events-none absolute top-1/2 left-4 z-20 -translate-y-1/2 transition-colors ${error ? "text-rose-500" : "text-zinc-400 group-focus-within:text-amber-500"} ${isFloating && !isFocused ? "opacity-40" : "opacity-100"}`}>
						<Icon size={18} />
					</div>
				)}

				<input
					{...props}
					type={inputType}
					value={value}
					onChange={onChange}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					autoComplete='off'
					placeholder=''
					className={`relative z-10 w-full rounded-2xl border bg-white pt-3 pb-2 shadow-sm transition-all outline-none dark:bg-zinc-950/50 ${className} ${
						error ?
							"border-rose-500/50 text-rose-600 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 dark:text-rose-400"
						:	"border-zinc-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 dark:border-zinc-800 dark:text-amber-400"
					} ${Icon ? "pr-4 pl-12" : "px-4"} ${isNumber || isPassword ? "pr-12" : "pr-4"}`}
				/>
				<div className="absolute right-3 top-1/2 z-20 -translate-y-1/2 flex items-center">
        {isPassword && (
            <motion.button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-amber-500 transition-colors"
            >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </motion.button>
        )}

          {isNumber && (
            <div className="flex gap-0.5 ml-1 border-l border-zinc-200 dark:border-zinc-800 pl-2">
              <motion.button
                type="button"
                onPointerDown={() => startStepping(1)}
                onPointerUp={stopStepping}
                onPointerLeave={stopStepping}
                whileTap={{ scale: 0.8 }}
                className="p-1 rounded hover:bg-amber-100 dark:hover:bg-amber-900/40 text-zinc-400 hover:text-amber-600 transition-colors cursor-cell"
              >
                <Plus size={14} strokeWidth={3} />
              </motion.button>
              <motion.button
                type="button"
                onPointerDown={() => startStepping(-1)}
                onPointerUp={stopStepping}
                onPointerLeave={stopStepping}
                whileTap={{ scale: 0.8 }}
                className="p-1 rounded hover:bg-amber-100 dark:hover:bg-amber-900/40 text-zinc-400 hover:text-amber-600 transition-colors cursor-context-menu"
            >
                <Minus size={14} strokeWidth={3} />
            </motion.button>
            </div>
        )}
        </div>
    </div>

    <AnimatePresence>
        {error && (
        <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1 ml-1 text-[10px] font-bold uppercase tracking-tight text-rose-500"
        >
            {error}
        </motion.p>
        )}
	</AnimatePresence>
</div>
	);
};
