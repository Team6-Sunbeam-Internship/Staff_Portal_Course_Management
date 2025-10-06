import { Plus } from "lucide-react";
import { Button } from "../../../../../../staff-portal-course-mgmt-frontend/src/components/layout";
import { useSelector } from "react-redux";
import { selectHeaderInfo } from "../../../../../../staff-portal-course-mgmt-frontend/src/store/selectors";
import { useModal } from "../../../../../../staff-portal-course-mgmt-frontend/src/providers/providerHook/useModal";

export const MainContentHeader = () => {
	const { title, subtitle, action } = useSelector(selectHeaderInfo);
	const { setShowModal } = useModal();
	const actionsToRender = action || [];

	return (
		<div
			className='flex items-center justify-between p-2 px-4
		 bg-white dark:bg-neutral-800 rounded-lg shadow-sm'>
			<div className='flex flex-col'>
				<h1 className='text-xl font-bold text-gray-800 dark:text-gray-100'>{title}</h1>
				{subtitle && <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>{subtitle}</p>}
			</div>
			{actionsToRender.length > 0 && (
				<div className='flex items-center space-x-4 cursor-pointer'>
					{actionsToRender.map((item, index) => {
						return (
							<Button key={index} onClick={() => setShowModal(true)}>
								<Plus size={24} />
								{item.label}
							</Button>
						);
					})}
				</div>
			)}
		</div>
	);
};
