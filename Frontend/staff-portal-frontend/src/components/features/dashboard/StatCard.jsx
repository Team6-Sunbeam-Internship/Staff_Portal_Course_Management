import { ArrowDown, ArrowUp } from "lucide-react";

export const StatCard = ({ title, value, icon: Icon, change, changeType }) => (
	<div className='bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-md'>
		<div className='flex items-center justify-between'>
			<div className='flex-1'>
				<h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
					{title}
				</h3>
				<p className='text-2xl font-semibold text-gray-900 dark:text-gray-100'>
					{value}
				</p>
			</div>
			<div
				className={`flex items-center justify-center w-12 h-12 rounded-full ${getStatusColor(
					changeType
				)} bg-opacity-10`}
			>
				<Icon className='w-6 h-6' />
			</div>
		</div>
		<div
			className={`mt-4 flex items-center text-sm ${getStatusColor(
				changeType
			)}`}
		>
			{getStatusIcon(changeType)}
			<span>{change}% from last month</span>
		</div>
	</div>
);

const getStatusColor = (type) => {
	switch (type) {
		case "increase":
			return "text-green-500";
		case "decrease":
			return "text-red-500";
		default:
			return "text-gray-500";
	}
};

const getStatusIcon = (type) => {
	switch (type) {
		case "increase":
			return <ArrowUp className='w-4 h-4' />;
		case "decrease":
			return <ArrowDown className='w-4 h-4' />;
		default:
			return null;
	}
};
