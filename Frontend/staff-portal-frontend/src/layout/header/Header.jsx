import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Menu, Bell,} from "lucide-react";
import { Button } from "../../components/layout";

const Header = ({ onSidebarToggle,isMobile, user, ...props }) => {
	const [userMenuOpen, setUserMenuOpen] = useState(false);
	const navigate = useNavigate();
	const userMenuRef = useRef(null);

	// Close user menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				userMenuRef.current &&
				!userMenuRef.current.contains(event.target)
			) {
				setUserMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const getUserInitials = (name) => {
		if (!name) return "U";
		return name
			.split(" ")
			.map((word) => word.charAt(0))
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<header
			className={`bg-white dark:bg-neutral-800  shadow-sm p-4 flex items-center justify-between`}
			{...props}
		>
			{/* Left side - Sidebar toggle and branding */}
			<div className='flex items-center space-x-4'>
				<Button
					// variant='ghost'
					size='sm'
					onClick={onSidebarToggle}
					className='p-2 md:hidden rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200'
					aria-label='Toggle sidebar'
				>
					<Menu
						className='w-6 h-6'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
					/>
				</Button>

				{/* Logo/Branding - hidden on mobile when search is active */}
				<div className={`flex items-center ${isMobile ? "text-center" : ""} space-x-3 `}>
					<div className='bg-gray-100 dark:bg-neutral-700/50 p-2 rounded-lg flex items-center justify-center'>
						<span className='text-gray-600 dark:text-gray-200 font-bold text-xl'>
							SP
						</span>
					</div>
					<div >
						<h1 className='text-xl font-bold text-gray-950 dark:text-neutral-100'>
							Staff Portal
						</h1>
					</div>
				</div>
			</div>

			{/* Right side - Actions and user menu */}
			<div
				className={`flex items-center justify-between bg-neutral-200 dark:bg-neutral-700 shadow-lg shadow-cyan-800 ${
					isMobile ? "" : "w-58"
				} h-12 px-4 gap-3 rounded-2xl`}
			>
				
				<div className='relative'>
					<Button
						size='md'
						className='relative bg-gray-200 rounded-full p-1 dark:text-neutral-100	'
						onClick={() => navigate("/notifications")}
						aria-label='View notifications'
					>
						<Bell className='w-5 h-5' />
						
					</Button>
				</div>

				{/* User menu */}
				<div className='relative' ref={userMenuRef}>
					<Button
						variant='ghost'
						size='sm'
						onClick={() => setUserMenuOpen(!userMenuOpen)}
						className='flex items-center space-x-2 '
						aria-label='User menu'
					>
						<div className='w-8 h-8 bg-teal-100 text-teal-700 dark:bg-blue-200 dark:text-blue-600 rounded-full flex items-center justify-center text-sm font-medium'>
							{getUserInitials(
								user?.name ||
									user?.firstName + " " + user?.lastName
							)}
						</div>
						<div className={`${isMobile && "hidden"} text-left`}>
							<p className='text-sm font-medium text-neutral-900 dark:text-neutral-100'>
								{user?.name ||
									`${user?.firstName} ${user?.lastName}`}
							</p>
							<p className='text-xs text-neutral-500 dark:text-neutral-400'>
								{user?.role || "ADMIN"}
							</p>
						</div>
					</Button>
				</div>
			</div>
		</header>
	);
};

export default Header;
