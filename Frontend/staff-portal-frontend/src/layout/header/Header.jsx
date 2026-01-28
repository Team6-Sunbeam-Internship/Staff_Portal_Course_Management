import { useNavigate } from "react-router";
import { Menu, Bell } from "lucide-react";
import { Button } from "../../components/layout";

const Header = ({ onSidebarToggle, isMobile, ...props }) => {
	const navigate = useNavigate();

	return (
		<header className={`flex items-center justify-between bg-white p-4 shadow-sm dark:bg-black`} {...props}>
			{/* Left side - Sidebar toggle and branding */}
			<div className='flex w-full items-center space-x-4'>
				{isMobile && <Button icon={Menu} size='sm' onClick={onSidebarToggle} variant='gradienAmber' aria-label='Toggle sidebar'></Button>}
				<div className={`flex w-full items-center ${isMobile ? "text-center" : "ml-4"} space-x-3`}>
					<div className='flex items-center justify-center rounded-lg bg-gray-100 p-2 dark:bg-neutral-700/50'>
						<span className='text-xl font-bold text-gray-600 dark:text-gray-200'>SP</span>
					</div>
					<div>
						<h1 className='text-xl font-bold text-gray-950 dark:text-neutral-100'>Staff Portal</h1>
					</div>
				</div>
			</div>

			{/* Right side - Actions and user menu */}
			<div className={`flex h-12 items-center justify-between gap-3 rounded-2xl bg-neutral-200 shadow-lg shadow-cyan-800 dark:bg-neutral-700`}>
				<div className='relative'>
					<Button variant='secondary' onClick={() => navigate("/notifications")} aria-label='View notifications'>
						<Bell className='h-5 w-5 fill-current dark:text-blue-600' />
					</Button>
				</div>
			</div>
		</header>
	);
};

export default Header;
