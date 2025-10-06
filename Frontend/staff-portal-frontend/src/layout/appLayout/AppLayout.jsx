import { useEffect, useState } from "react";
import { Sidebar } from "../../components/layout";
import Header from "../header/Header";
import MainContent from "../mainContent/MainContent";
import { Outlet } from "react-router";
import Footer from "../footer/Footer";

const AppLayout = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [user, setUser] = useState({
		firstName: "Abhinav",
		lastName: "Mishra",
		role: "ADMIN",
	});
	useEffect(() => {
		const handleResize = () => {
			const isMobileScreen = window.innerWidth < 768;
			setIsMobile(isMobileScreen);
			if (isMobileScreen) {
				setIsSidebarOpen(false);
			} else {
				setIsSidebarOpen(true);
			}
		};

		window.addEventListener("resize", handleResize);
		handleResize(); // Set initial state

		return () => window.removeEventListener("resize", handleResize);
	}, []);
	const handleSidebarToggle = () => {
		setIsSidebarOpen(!isSidebarOpen);
		setIsSidebarCollapsed(false); // Reset collapse state on mobile toggle
	};

	const handleSidebarCollapse = () => {
		// On mobile, this button closes the sidebar completely
		if (isMobile) {
			setIsSidebarOpen(false);
		} else {
			// On desktop, this button toggles the collapsed state
			setIsSidebarCollapsed(!isSidebarCollapsed);
		}
	};

	// Dynamically determine the margin for the main content to clear the sidebar
	const getMarginClass = () => {
		if (isMobile) {
			return "";
		}
		if (isSidebarCollapsed) {
			return "md:ml-16";
		}
		return "md:ml-80";
	};

	return (
		<div className='flex md:flex-row h-screen bg-gray-100 dark:bg-neutral-900  text-gray-900 dark:text-neutral-100 overflow-hidden'>
			{/* Mobile backdrop */}
			{isSidebarOpen && isMobile && (
				<div
					className='fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 ease-in-out'
					onClick={handleSidebarToggle}
				></div>
			)}

			{/* Sidebar */}
			<Sidebar
				isCollapsed={isSidebarCollapsed}
				onToggle={handleSidebarToggle}
				onCollapsed={handleSidebarCollapse}
				className={`${
					isMobile && !isSidebarOpen
						? "-translate-x-full"
						: "translate-x-0"
				} z-40`}
			/>

			{/* Main Content Area */}
			<div
				className={`flex-1 flex flex-col transition-all duration-300 z-10 ${getMarginClass()}`}
			>
				{/* Header */}
				<Header
					onSidebarToggle={handleSidebarToggle}
					isMobile={isMobile}
					user={user}
				/>
				{/* Main Content */}
				<MainContent className='scrollbar-none'>
					<Outlet />
				</MainContent>
				{/* Footer */}
				<Footer />
			</div>
		</div>
	);
};

export default AppLayout;
