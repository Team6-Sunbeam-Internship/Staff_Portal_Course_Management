import React from 'react'

export const Badge = ({ children, className = "", status = ""}) => {
	
	const getStatusClasses = (status) => {
		switch (status) {
			case "active":
				return "bg-green-100 text-green-700 ring-green-600/20 dark:bg-emerald-600/50 dark:text-green-100 dark:ring-green-800/20";
			case "planned":
				return "bg-yellow-100 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-400 dark:text-sky-700 dark:ring-cyan-800/20";
			case "completed":
				return "bg-blue-100 text-blue-700 ring-blue-600/20 dark:bg-sky-900 dark:text-sky-400 dark:ring-sky-800/20";
			case "inactive":
			default:
				return className;
		}
	};
	
  return (
		<span
			className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${getStatusClasses(status)} ${className}`}
		>
			{children}
		</span>
  );
}
